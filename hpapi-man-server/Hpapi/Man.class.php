<?php

/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

namespace Hpapi;

class Man {

    public $hpapi;

    public function __construct (\Hpapi\Hpapi $hpapi) {
        $this->hpapi = $hpapi;
    }

    public function __destruct ( ) {
    }

    public function classes ($opts,$mid,$v,$p,$c=null) {
        $this->options ($opts);
        try {
            $classes = $this->hpapi->parse2D (
                $this->hpapi->dbCall (
                    'hpapiManBrowse'
                   ,$opts->offset
                   ,$opts->limit
                   ,$opts->apiOnly
                   ,$opts->includeDeleted
                   ,$opts->includeDrafts
                   ,$opts->headId
                   ,$mid,$v,$p,$c,''
                )
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        $this->nameSpace ($classes);
        return $classes;
    }

    public function classTree (&$classes,$class,$baseClass,$level=0) {
        if (!$baseClass) {
            if (!array_key_exists($class,$classes)) {
                $classes[$class] = [];
            }
            return true;
        }
        foreach ($classes as $c=>$cs) {
            if ($c==$class) {
                return true;
            }
            if ($c==$baseClass) {
                $classes[$baseClass][$class] = [];
                return true;
            }
            if (count($classes[$c])) {
                // Recursion
                if ($this->classTree($classes[$c],$class,$baseClass,$level+1)) {
                    return true;
                }
            }
        }
        if ($level) {
            return false;
        }
        if (!array_key_exists($baseClass,$classes)) {
            $classes[$baseClass] = [];
        }
        $classes[$baseClass][$class] = [];
    }

    public function manuals ($mid=null) {
        try {
            $manuals = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManManuals',$mid)
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $manuals;
    }

    public function methods ($opts,$mid,$v,$p,$c,$m=null) {
        $this->options ($opts);
        try {
            $methods = $this->hpapi->parse2D (
                $this->hpapi->dbCall (
                    'hpapiManBrowse'
                   ,$opts->offset
                   ,$opts->limit
                   ,$opts->apiOnly
                   ,$opts->includeDeleted
                   ,$opts->includeDrafts
                   ,$opts->headId
                   ,$mid,$v,$p,$c,$m
                )
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

    public function options (&$opts) {
        $options                    = new \stdClass ();
        $options->offset            = 0;
        $options->limit             = HPAPIMAN_OPT_DEFAULT_LIMIT;
        $options->apiOnly           = 0;
        $options->includeDeleted    = 0;
        $options->includeDrafts     = 0;
        $options->headId            = 0;
        foreach ($opts as $p=>$v) {
            $options->$p            = $v;
        }
        $opts                       = $options;
    }

    public function packages ($opts,$mid,$v,$p=null) {
        $this->options ($opts);
        try {
            $packages = $this->hpapi->parse2D (
                $this->hpapi->dbCall (
                    'hpapiManBrowse'
                   ,$opts->offset
                   ,$opts->limit
                   ,$opts->apiOnly
                   ,$opts->includeDeleted
                   ,$opts->includeDrafts
                   ,$opts->headId
                   ,$mid,$v,$p,'',''
                )
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $packages;
    }

    public function page ($ref,$commitId=null) {
        try {
            $pages = $this->hpapi->parse2D (
                $this->hpapi->dbCall ('hpapiManPage',$ref,$commitId)
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

    protected function pageInsertIgnore ($mid,$v,$p,$c,$m,$o,$ugs) {
        if ($) {
            $o = 1;
        }
        else {
            $o = 0;
        }
        if ($ugs) {
            $ugs = implode (',',$ugs);
        }
        else {
            $ugs = '';
        }
        try {
            $this->hpapi->dbCall ('hpapiManPageInsertIgnore',$mid,$v,$p,$c,$m,$o,$ugs);
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw $e;
            return false;
        }
    }

    protected function reflect ($mid,$classes,$s,$baseClass=null) {
        foreach ($classes as $c=>$cs) {
            $this->pageInsertIgnore ($mid,$s[$c]['vendor'],'','','','');
            $this->pageInsertIgnore ($mid,$s[$c]['vendor'],$s[$c]['package'],'','','');
            $this->pageInsertIgnore ($mid,$s[$c]['vendor'],$s[$c]['package'],$s[$c]['class'],'','');
            if ($baseClass) {
                $rb = new ReflectionClass ($b);
            }
            require_once $s[$c]['file'];
            $rc = new ReflectionClass ($c);
            $ms = [];
            foreach ($rc->getMethods() as $mc) {
                if ($mc->class==$c) {
                    $ms[$mc->name] = false;
                }
                if ($baseClass) {
                    foreach ($rb->getMethods() as $mb) {
                        if ($mb->class==$mc->class) {
                            $ms[$mc->name] = true;
                        }
                    }
                }
            }
            foreach ($ms as $m=>$overrides) {
                $this->pageInsertIgnore (
                    $mid,$s[$c]['vendor'],$s[$c]['package'],$s[$c]['class'],$m,
                    $overrides,$this->hpapi->privilege[$priv.$m]->usergroups
                );
            }
            // Recursion
            $this->reflect ($mid,$cs,$s,$c);
        }
    }

    public function reflectSystemAsManual ($mid) {
        $this->pageInsertIgnore ($mid,'','','','','');
        $dir        = realpath (HPAPI_DIR_HPAPI);
        exec ("find ".escapeshellarg($dir)." -type f -iname '*.class.php'",$files);
        $classes    = [];
        $sources    = [];
        foreach ($files as $f) {
            $c      = substr ($f,strlen($dir));
            $c      = explode ('/',trim($c,'/'));
            $v      = array_shift ($c);
            $p      = array_shift ($c);
            $c      = implode ("\\",$c);
            $c      = substr ($c,0,-10);
            $cn     = explode ("\\",$c);
            $cn     = array_pop ($cn);
            $ext    = [];
            exec ("grep '^\s*class \s*".$cn." \s*extends .*{' ".escapeshellarg($f),$ext);
            $b      = null;
            if (count($ext)) {
                preg_match ('<\sextends\s([^\s]+)>',$ext[0],$matches);
                $b  = $matches[1];
            }
            $this->classTree ($classes,"\\".$c,$b);
            $sources["\\".$c] = array (
                'file' => $f,
                'vendor' => $v.
                'package' => $p,
                'privilege' => $v.'::'.$p.'::'.$c.'::'
            );
        }
        $this->reflect ($mid,$classes,$sources);
    }

    public function vendors ($opts,$mid,$v=null) {
        $this->options ($opts);
        try {
            $vendors = $this->hpapi->parse2D (
                $this->hpapi->dbCall (
                    'hpapiManBrowse'
                   ,$opts->offset
                   ,$opts->limit
                   ,$opts->apiOnly
                   ,$opts->includeDeleted
                   ,$opts->includeDrafts
                   ,$opts->headId
                   ,$mid,$v,'','',''
                )
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
        }
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
                $this->hpapi->dbCall ('hpapiManVersionCommit',$ref,$comments,$label)
            );
        }
        catch (\Exception $e) {
            throw $e;
            return false;
        }
        return $head[0]['headId'];
    }

}

