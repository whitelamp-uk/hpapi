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

    public function insert ($table,$columns) {
        if (!count(get_object_vars($columns))) {
            throw new \Exception (HPAPI_STR_DB_INSERT_COLS);
            return false;
        }
        $defns                      = new \stdClass ();
        $model                      = null;
        foreach ($columns as $column=>$value) {
            if (!($c=$this->hpapi->permissionToInsert($table,$column))) {
                throw new \Exception (HPAPI_STR_DB_INSERT_PERMISSION);
                return false;
            }
            if ($model && $c['model']!=$model) {
                throw new \Exception (HPAPI_STR_DB_INSERT_MODELS);
                return false;
            }
            if ($c['emptyIsNull'] && !strlen($value)) {
                $columns[$column]   = null;
            }
            $model                  = $c['model'];
            $defns->{$column}       = $c;
        }
        try {
            $db                     = new \Hpapi\Db ($this->hpapi,$this->hpapi->models->{$model});
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw new \Exception (HPAPI_STR_DB_INSERT_ERROR);
            return false;
        }
        try {
            $insert                 = $db->insert ($table,$columns,$defns);
            $db->close ();
            return $insert;
        }
        catch (\Exception $e) {
            $db->close ();
            if ($db->sqlState==HPAPI_SQL_STATE_DUPLICATE) {
                throw new \Exception (HPAPI_STR_DB_INSERT_DUPLICATE);
                return false;
            }
            $this->hpapi->diagnostic ($e->getMessage());
            throw new \Exception (HPAPI_STR_DB_INSERT_ERROR);
            return false;
        }
    }

    public function keyRelease ($userId) {
        try {
            $uuid                           = $this->hpapi->dbCall (
                'hpapiUUID'
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        $key                                = $uuid[0]['uuid'];
        $expiry                             = $this->hpapi->timestamp + (60*HPAPI_KEY_RELEASE_MINS);
        try {
            $this->hpapi->dbCall (
                'hpapiKeyrelease'
               ,$userId
               ,$key
               ,$expiry
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $expiry;
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

    public function passwordClear ($userId) {
        try {
            $this->hpapi->dbCall (
                'hpapiPasswordEmpty'
               ,$userId
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function update ($table,$column,$value,$primaryKeys) {
        // Get column permission and details
        if (!($c=$this->hpapi->permissionToUpdate($table,$column))) {
            throw new \Exception (HPAPI_STR_DB_UPDATE_PERMISSION);
            return false;
        }
        if ($c['emptyIsNull'] && !strlen($value)) {
            $value          = null;
        }
        try {
            $db             = new \Hpapi\Db ($this->hpapi,$this->hpapi->models->{$c['model']});
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw new \Exception (HPAPI_STR_DB_UPDATE_ERROR);
            return false;
        }
        try {
            $db->update ($table,$c,$value,$primaryKeys);
            $db->close ();
            return true;
        }
        catch (\Exception $e) {
            $db->close ();
            $this->hpapi->diagnostic ($e->getMessage());
            throw new \Exception ($e->getMessage());
            return false;
        }
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

