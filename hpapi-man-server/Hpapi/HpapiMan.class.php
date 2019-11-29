<?php

/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

namespace Hpapi;

class HpapiMan {

    public $hpapi;

    public function __construct (\Hpapi\Hpapi $hpapi) {
        $this->hpapi = $hpapi;
    }

    public function __destruct ( ) {
    }

    public function class ($manualId,$version,$vendor,$package,$class) {
        try {
            $classes = $this->classes ($manualId,$version,$vendor,$package,$class);
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        if (!count($classes)) {
            return false;
        }
        return $classes[0];
    }

    public function classes ($manualId,$version,$vendor,$package,$class=null) {
        try {
            $classes = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManBrowse',$manualId,$version,$vendor,$package,$class,'')
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        $this->nameSpace ($classes);
        return $classes;
    }

    public function manual ($manualId) {
        try {
            $methods = $this->manuals ($manualId);
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        if (!count($manuals)) {
            return false;
        }
        return $manuals[0];
    }

    public function manuals ($manualId=null) {
            $manuals = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManManuals',$manualId)
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $manuals;
    }

    public function method ($manualId,$version,$vendor,$package,$class,$method) {
        try {
            $methods = $this->methods ($manualId,$version,$vendor,$package,$class,$method);
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        if (!count($methods)) {
            return false;
        }
        return $methods[0];
    }

    public function methods ($manualId,$version,$vendor,$package,$class,$method=null) {
        try {
            $methods = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManBrowse',$manualId,$version,$vendor,$package,$class,$method)
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        $this->nameSpace ($methods);
        return $methods;
    }

    public function namespace (&$pages) {
        foreach (array_keys($pages) as $k) {
            $ns                     = explode ("\\",$pages[$k]->class);
            array_pop ($ns);
            $ns                     = implode ("\\",$ns);
            $pages[$k]->namespace   = trim ($ns,"\\");
        }
    }

    public function package ($manualId,$version,$vendor,$package) {
        try {
            $packages = $this->packages ($manualId,$version,$vendor,$package);
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        if (!count($packages)) {
            return false;
        }
        return $packages[0];
    }

    public function packages ($manualId,$version,$vendor,$package=null) {
        try {
            $packages = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManBrowse',$manualId,$version,$vendor,$package,'','')
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $packages;
    }

    public function page ($ref,$vn) {
        try {
            $pages = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManPage',$ref,$vn)
            );
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw $e;
            return false;
        }
        if (!count($pages)) {
            throw new \Exception (HPAPIMAN_STR_PAGE_REF);
            return false;
        }
        return $pages[0];
    }

    protected function pageInsertIgnore ($mid,$v,$p,$c,$m) {
        try {
            $this->hpapi->dbCall ('hpapiManPageInsertIgnore',$mid,$v,$p,$c,$m);
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw $e;
            return false;
        }
    }

    public function reflectSystemAsManual ($manualId) {
        $this->pageInsertIgnore ($manualId,'','','','','');
        $dir = new \RecursiveDirectoryIterator (HPAPI_DIR_HPAPI);
        $itr = new \RecursiveIteratorIterator ($dir);
        $fls = new \RegexIterator ($itr,'/\.class\.php$/',RecursiveRegexIterator::GET_MATCH);
        foreach ($fls as $f) {
            try {
                require_once $f;
            }
            catch (\Exception $e) {
                throw new \Exception (HPAPIMAN_STR_REQUIRE.': '.$f);
                return false;
            }
        }
        foreach ($fls as $f) {
            $parts  = substr ($f,strlen(HPAPI_DIR_HPAPI));
            $parts  = trim ($parts,'/');
            $parts  = explode ('/',$parts);
            if (count($parts)<3) {
                continue;
            }
            $v      = array_shift ($parts);
            $priv   = $v.'::';
            $this->pageInsertIgnore ($manualId,$v,'','','','');
            $p      = array_shift ($parts);
            $priv  .= $p.'::';
            $this->pageInsertIgnore ($manualId,$v,$p,'','','');
            $c      = "\\".implode("\\",$parts);
            $priv  .= $c.'::';
            $this->pageInsertIgnore ($manualId,$v,$p,$c,'','');
            $ms     = array ();
            $r      = new ReflectionClass ($c);
            foreach ($r->getMethods() as $m) {
                if ($m->class==$c) {
                    array_push ($ms,$m->name);
                }
            }
            foreach ($ms as $m) {
                $g = implode (',',$this->hpapi->privilege[$priv.$m]->usergroups);
                $this->pageInsertIgnore ($manualId,$v,$p,$c,$m,$g);
            }
        }
        try {
            $this->hpapi->dbCall ('hpapiManPagesUpdate');
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
    }

    public function vendor ($manualId,$version,$vendor) {
        try {
            $vendors = $this->vendors ($vendor);
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        if (!count($vendors)) {
            return false;
        }
        return $vendors[0];
    }

    public function vendors ($manualId,$version,$vendor=null) {
        try {
            $vendors = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManBrowse',$manualId,$version,$vendor,'','','')
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $vendors;
    }

    public function version ($ref) {
        try {
            $versions = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManVersion',$ref)
            );
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw $e;
            return false;
        }
        if (!count($pages)) {
            throw new \Exception (HPAPIMAN_STR_VERSION_REF);
            return false;
        }
        return $versions[0];
    }

    public function versionAdd ($pageRef) {
        try {
            $page = $this->page ($pageRef,null);
            $insert = $this->hpapi->parse2D (
                $this->hpapi->dbCall (
                    'hpapiManVersionInsert'
                   ,$page->manualId
                   ,$page->vendor
                   ,$page->package
                   ,$page->class
                   ,$page->method
                   ,$page->markdown
                   ,null
                )
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $insert[0]['reference'];
    }

    public function versionCommit ($ref,$comments,$label=null) {
        try {
            $version = $this->version ($ref);
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        if ($version->headId) {
            throw new \Exception (HPAPIMAN_STR_COMMIT);
            return false;
        }
        try {
            $head = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManVersionCommit',$ref,$label,$comments)
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $head[0]['headId'];
    }

}

