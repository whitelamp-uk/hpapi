<?php

/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

namespace Hpapi;

class Utility {

    public $hpapi;

    public function __construct (\Hpapi\Hpapi $hpapi) {
        $this->hpapi = $hpapi;
    }

    public function __destruct ( ) {
    }

    public function describeMethod ($vendor,$package,$class,$method) {
        $privilege                              = false;
        if (HPAPI_PRIVILEGES_DYNAMIC) {
            try {
                $privilege                      = $this->hpapi->callPrivileges ();
            }
            catch (\Exception $e) {
                throw new \Exception ($e->getMessage());
                return false;
            }
        }
        elseif (is_readable(HPAPI_PRIVILEGES_FILE)) {
             $privilege                         = require HPAPI_PRIVILEGES_FILE;
        }
        if (!is_array($privilege)) {
            throw new \Exception (HPAPI_STR_PRIV_READ);
            return false;
        }
        $m                                      = $vendor;
        $m                                     .= '::';
        $m                                     .= $package;
        $m                                     .= '::';
        $m                                     .= $class;
        $m                                     .= '::';
        $m                                     .= $method;
        if (!array_key_exists($m,$privilege)) {
            throw new \Exception (HPAPI_STR_DB_MTD_ACCESS);
            return false;
        }
        $privilege                              = $privilege[$m];
        if (in_array('sysadmin',$this->usergroups) || in_array('admin',$this->usergroups)) {
            return $privilege;
        }
        unset ($privilege['sprs']);
        unset ($privilege['usergroups']);
        $access                                     = false;
        foreach ($privileges[$m]['usergroups'] as $privg) {
            foreach ($this->usergroups as $authg) {
                if ($authg['usergroup']==$privg) {
                    return $privilege;
                }
            }
        }
        throw new \Exception (HPAPI_STR_DB_MTD_ACCESS);
        return false;
    }

    public function myMethods ( ) {
        $authenticated                          = intval (strlen($this->hpapi->object->email)>0);
        try {
            $methods                            = $this->hpapi->dbCall (
                'hpapiMyMethods'
               ,$this->hpapi->userId
               ,$authenticated
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $this->hpapi->parse2D ($methods);
    }

    public function myUsergroups ( ) {
        $authenticated                          = intval (strlen($this->hpapi->object->email)>0);
        try {
            $usergroups                         = $this->hpapi->dbCall (
                'hpapiMyUsergroups'
               ,$this->hpapi->userId
               ,$authenticated
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $this->hpapi->parse2D ($usergroups);
    }

    public function usergroups ( ) {
        return $this->hpapi->groupsAllowed;
    }

    public function uuid ( ) {
        try {
            $uuid                               = $this->hpapi->dbCall (
                'hpapiUUID'
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $uuid[0]['uuid'];
    }

}

