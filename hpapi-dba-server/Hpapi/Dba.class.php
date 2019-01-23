<?php

namespace Hpapi;

class Dba {

    public  $userId;
    public  $model;                                 // Database definition
    public  $modelDb;                               // Model database name
    public  $modelName;                             // Model name
    public  $columns;                               // Model definitions

    public function __construct (\Hpapi\Hpapi $hpapi) {
        $this->hpapi                                = $hpapi;
        $this->userId                               = $this->hpapi->userId;
    }

    public function __destruct ( ) {
    }

// MODEL DEFINITION

    protected function columnsCall () {
        try {
            $cs                                     = $this->hpapi->dbCall (
                'hpapiDbaColumns'
               ,$this->modelName
               ,$this->modelDb
            );
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            $this->hpapi->object->response->error   = HPAPI_STR_ERROR_DB;
            return false;
        }
        $columns                                    = array ();
        foreach ($cs as $c) {
            foreach (array('inserters','selectors','updaters','relations') as $property) {
                if ($c[$property]) {
                    $c[$property]                       = explode ('::',$c[$property]);
                }
                else {
                    $c[$property]                       = array ();
                }
            }
            array_push ($columns,$c);
        }
        return $columns;
    }

    protected function columnsLoad ( ) {
        if (HPAPI_DBA_COLS_DYNAMIC) {
            return $this->columnsCall ();
        }
        else {
            $file                                   = HPAPI_DBA_COLS_DIR.'/'.$model.HPAPI_DBA_COLS_FILE_SUFFIX;
            if (is_readable($file)) {
                $privileges                         = require $file;
            }
            if (!is_array($privileges)) {
                $privileges                         = $this->columnsCall ();
                try {
                    $this->hpapi->exportArray ($file,$privileges);
                }
                catch (\Exception $e) {
                    $this->hpapi->diagnostic ($e->getMessage());
                    $this->hpapi->object->response->error = HPAPI_DBA_STR_PRIV_WRITE;
                    return false;
                }
            }
        }
        return $privileges;
    }

    protected function columnsReset ($model) {
        if (!is_writable(HPAPI_DBA_COLS_DIR)) {
            throw new \Exception (HPAPI_DBA_STR_COLS_DIR);
            return false;
        }
        try {
            $file                               = HPAPI_DBA_COLS_DIR.'/'.$model.HPAPI_DBA_COLS_FILE_SUFFIX;
            $fp                                 = fopen ($file,'w');
            fwrite ($fp,"<?php\nreturn false;\n");
            fclose ($fp);
            chmod ($file,0666);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage);
            return false;
        }
    }

    protected function modelDbName ($dsn) {
        $parts                                      = explode (';',$dsn);
        foreach ($parts as $part) {
            $kv                                     = explode ('=',$part);
            if ($kv[0]=='dbname') {
                return $kv[1];
            }
        }
    }

    protected function modelLoad ($model) {
        if (!property_exists($this->hpapi->models,$model)) {
            throw new \Exception (HPAPI_DBA_STR_MODEL);
            return false;
        }
        $this->model                                = $this->hpapi->models->{$model};
        $this->modelDb                              = $this->modelDbName ($this->model->dsn);
        $this->modelName                            = $model;
        $this->columns                              = $this->columnsLoad ();
        if (!$this->columns) {
            throw new \Exception (HPAPI_DBA_STR_MODEL);
            return false;
        }
        try {
            $this->db                               = new \Hpapi\DbaDb ($this->hpapi,$this->model);
            return true;
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw new \Exception (HPAPI_DBA_STR_MODEL);
            return false;
        }
    }

    protected function modelTable ($tName) {
        $table                                      = null;
        $relations                                  = array ();
        foreach ($this->columns as $column) {
            if ($column['table']!=$tName) {
                continue;
            }
            if (!$table) {
                $table                              = new \stdClass ();
                $table->model                       = $this->modelName;
                $table->table                       = $tName;
                $table->mayInsert                   = $this->usergroupMatch ($column['inserters']);
                $table->primary                     = array ();
                $table->relations                   = new \stdClass ();
                $table->title                       = $column['title'];
                $table->description                 = $column['description'];
                $table->columns                     = new \stdClass ();
            }
            if ($column['isPrimary']) {
                array_push ($table->primary,$column['column']);
            }
            if ($column['relations']) {
                foreach ($column['relations'] as $r) {
                    $ktc                            = explode ('.',$r);
                    if (!property_exists($table->relations,$ktc[0])) {
                        $table->relations->{$ktc[0]} = new \stdClass ();
                        $table->relations->{$ktc[0]}->table = $ktc[1];
                        $table->relations->{$ktc[0]}->columns = new \stdClass ();
                    }
                    $table->relations->{$ktc[0]}->columns->{$column['column']} = $ktc[2];
                }
            }
            $c                                      = new \stdClass ();
            $c->maySelect                           = $this->usergroupMatch ($column['selectors']);
            $c->mayUpdate                           = $this->usergroupMatch ($column['updaters']);
            $cname                                  = $column['column'];
            unset ($column['table']);
            unset ($column['inserters']);
            unset ($column['relations']);
            unset ($column['title']);
            unset ($column['description']);
            unset ($column['column']);
            unset ($column['selectors']);
            unset ($column['updaters']);
            foreach ($column as $k=>$v) {
                if ($k=='table' || $k=='column') {
                    continue;
                }
                $c->{$k}                            = $v;
            }
            $table->columns->{$cname}               = $c;
        }
        return $table;
    }

// UTILITIES

    protected function hasColumns ( ) {
        return $this->db->columnCount ();
    }

    protected function inputValidate ($object) {
        if (!is_object($object)) {
            throw new \Exception (HPAPI_DBA_STR_IN_OBJECT);
            return false;
        }
        if (!property_exists($object,'table')) {
            throw new \Exception (HPAPI_DBA_STR_IN_TABLE);
            return false;
        }
        return true;
    }

    protected function query ( ) {
        try {
            $this->db->queryBuild ();
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            return $this->db->queryExecute ();
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
    }

    protected function loadColumns ($table) {
        foreach ($table->columns as $c=>$column) {
            if ($column->maySelect) {
                $this->db->addColumn ($c,null);
            }
        }
    }

    protected function loadPrimary ($primary,$columns) {
        $count = 0;
        try {
            foreach ($columns as $c=>$column) {
                if ($column->isPrimary && !property_exists($primary,$c)) {
                    throw new \Exception (HPAPI_DBA_STR_IN_PRI_GIVEN.' "'.$c.'"');
                    return false;
                }
            }
            foreach ($primary as $column=>$value) {
                if (!property_exists($columns,$column)) {
                    throw new \Exception (HPAPI_DBA_STR_IN_PRI_EXIST.' "'.$column.'"');
                    return false;
                }
                try {
                    $count++;
                    $this->hpapi->validation ($columns->{$column}->heading,$count,$value,$columns->{$column});
                }
                catch (\Exception $e) {
                    throw new \Exception (HPAPI_DBA_STR_IN_PRI_VALID.': '.$e->getMessage());
                    return false;
                }
                $this->db->addPrimary ($column,$value);
            }
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    protected function loadRestricts ($restricts,$columns) {
        $count = 0;
        try {
            foreach ($restricts as $column=>$restrict) {
                $count++;
                if (!is_object($restricts->{$column})) {
                    throw new \Exception (HPAPI_DBA_STR_IN_RESTRICT.' ('.$count.')');
                    return false;
                }
                if (!property_exists($columns,$column)) {
                    throw new \Exception (HPAPI_DBA_STR_IN_RESTRICT_EXIST.' "'.$column.'"');
                    return false;
                }
                $this->db->addRestrict ($column,$restrict);
            }
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    protected function loadRow ($row,$columns) {
        $count = 0;
        try {
            foreach ($row as $column=>$value) {
                if (!property_exists($columns,$column)) {
                    throw new \Exception (HPAPI_DBA_STR_IN_COL_EXIST.' "'.$column.'"');
                    return false;
                }
                if (!$columns->{$column}->mayUpdate) {
                    throw new \Exception (HPAPI_DBA_STR_IN_COL_PRIV_UPDATE.' "'.$column.'"');
                    return false;
                }
                if ($columns->{$column}->isAutoIncrement) {
                    throw new \Exception (HPAPI_DBA_STR_IN_COL_AUTO_INC.' "'.$column.'"');
                    return false;
                }
                try {
                    $count++;
                    $this->hpapi->validation ($columns->{$column}->heading,$count,$value,$columns->{$column});
                }
                catch (\Exception $e) {
                    throw new \Exception (HPAPI_DBA_STR_IN_COL_VALID.': '.$e->getMessage());
                    return false;
                }
                $this->db->addColumn ($column,$value);
            }
        }
        catch (\Exception $e) {
            throw new \Exception (HPAPI_DBA_STR_IN_LOAD.': '.$e->getMessage());
            return false;
        }
        return true;
    }

    protected function usergroupMatch ($groups) {
        foreach ($groups as $g) {
            if ($this->hpapi->groupAllowed($g['usergroup'])) {
                return true;
            }
        }
        return false;
    }

    // DESCRIPTION

    public function describeTable ($object) {
        if (!$this->inputValidate($object)) {
            return false;
        }
        if (!$this->modelLoad($object->model)) {
            return false;
        }
        $table = $this->modelTable ($object->table);
        foreach ($table->columns as $c=>$column) {
            if (defined($column->constraints)) {
                $table->columns->{$c}->constraints = constant ($column->constraints);
            }
        }
        return $table;
   }

    public function describeRelations ($dbName,$tableName,$weak=false) {
        try {
            if ($weak) {
                $columns            = $this->hpapi->dbCall (
                    'hpapiDbaColumnsWeak'
                   ,$dbName
                   ,$tableName
                );
            }
            else {
                $columns            = $this->hpapi->dbCall (
                    'hpapiDbaColumnsStrong'
                   ,$dbName
                   ,$tableName
                );
            }
            $columns                = $this->hpapi->parse2D ($columns);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        $relations = new \stdClass ();
        foreach ($columns as $c) {
            if (!property_exists($relations,$c->table)) {
                $relations->{$c->table}                 = new \stdClass ();
                $relations->{$c->table}->model          = $c->model;
                $relations->{$c->table}->table          = $c->table;
                $relations->{$c->table}->title          = $c->title;
                $relations->{$c->table}->description    = $c->description;
                $relations->{$c->table}->columns        = array ();
            }
            unset ($c->title);
            unset ($c->description);
            array_push ($relations->{$c->table}->columns,$c);
        }
        return $relations;
    }

// DATA MANIPULATION

    public function rowInsert ($object) {
        if (!$this->inputValidate($object)) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        if (!property_exists($object,'row') || !is_object($object->row)) {
            throw new \Exception (HPAPI_DBA_STR_IN_ROW);
            return false;
        }
        try {
            $this->modelLoad ($object->model);
            $this->db->setQueryType ('insert');
            $this->db->setTable ($object->table);
            $table = $this->modelTable ($object->table);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            $this->loadRow ($object->row,$table->columns);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            return $this->query ();
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
    }

    public function rowsSelect ($object) {
        if (!$this->inputValidate($object)) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        if (!property_exists($object,'restricts') || !is_object($object->restricts)) {
            throw new \Exception (HPAPI_DBA_STR_IN_RESTRICTS);
            return false;
        }
        try {
            $this->modelLoad ($object->model);
            $this->db->setQueryType ('select');
            $this->db->setTable ($object->table);
            $table = $this->modelTable ($object->table);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            $this->loadColumns ($table);
            if (!$this->hasColumns()) {
                throw new \Exception (HPAPI_DBA_STR_COLS_ALLOW);
                return false;
            }
            $this->loadRestricts ($object->restricts,$table->columns);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            return $this->query ();
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
    }

    public function rowUpdate ($object) {
        if (!$this->inputValidate($object)) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        if (!property_exists($object,'row') || !is_object($object->row)) {
            throw new \Exception (HPAPI_DBA_STR_IN_ROW);
            return false;
        }
        if (!property_exists($object,'primary') || !is_object($object->primary)) {
            throw new \Exception (HPAPI_DBA_STR_IN_PRI);
            return false;
        }
        try {
            $this->modelLoad ($object->model);
            $this->db->setQueryType ('update');
            $this->db->setTable ($object->table);
            $table = $this->modelTable ($object->table);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            $this->loadRow ($object->row,$table->columns);
            $this->loadPrimary ($object->primary,$table->columns);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            return $this->query ();
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
    }

// MANIPULATING PERMISSIONS

    public function grantAllowed ($type,$usergroup='') {
        try {
            $this->hpapi->dbCall (
                'hpapiDbaGrantAllowed'
               ,$this->userUUID
               ,$type
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        foreach ($grant as $grt) {
            if (preg_match($gtr['expression'],$match)) {
                return true;
            }
        }
        return false;
    }

    // MANIPULATING USER GROUP MEMBERSHIP

    public function grantUsergroupToUser ($usergroup,$user_uuid) {
        if (!$this->grantAllowed('membership',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaMembershipInsert'
               ,$usergroup
               ,$user_uuid
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function revokeUsergroupFromUser ($usergroup,$user_uuid) {
        if (!$this->grantAllowed('membership',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaMembershipDelete'
               ,$usergroup
               ,$user_uuid
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function showGrantsForUser ($user_uuid) {
        try {
            $usergroups = $this->hpapi->dbCall (
                'hpapiDbaMembershipsForUser'
               ,$user_uuid
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $usergroups;
    }

    public function showGrantedUsers ($usergroup='*') {
        try {
            $users      = $this->hpapi->dbCall (
                'hpapiDbaMembershipsForUsergroup'
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $users;
    }

    // MANIPULATE METHOD ACCESS

    public function grantMethodToUsergroup ($vendor,$package,$class,$method,$usergroup) {
        if (!$this->grantAllowed('run',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaRunInsert'
               ,$vendor
               ,$package
               ,$class
               ,$method
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function revokeMethodFromUsergroup ($vendor,$package,$class,$method,$usergroup) {
        if (!$this->grantAllowed('run',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaRunDelete'
               ,$vendor
               ,$package
               ,$class
               ,$method
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function showGrantsForUsergroup ($usergroup='*') {
        try {
            $methods    = $this->hpapi->dbCall (
                'hpapiDbaRunsForUsergroup'
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $methods;
    }

    public function showGrantedUsergroups ($vendor='*',$package='*',$class='*',$method='*') {
        try {
            $usergroups = $this->hpapi->dbCall (
                'hpapiDbaRunsForMethod'
               ,$vendor
               ,$package
               ,$class
               ,$method
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $usergroups;
    }

    // MANIPULATE STORED PROCEDURE ACCESS

    public function grantSprToMethod ($model,$spr,$vendor,$package,$class,$method) {
        if (!$this->grantAllowed('call')) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaCallInsert'
               ,$model
               ,$spr
               ,$vendor
               ,$package
               ,$class
               ,$method
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function revokeSprFromMethod ($model,$spr,$vendor,$package,$class,$method) {
        if (!$this->grantAllowed('call')) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaCallDelete'
               ,$model
               ,$spr
               ,$vendor
               ,$package
               ,$class
               ,$method
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function showGrantsForSpr ($model,$spr='*') {
        try {
            $methods    = $this->hpapi->dbCall (
                'hpapiDbaCallsForSpr'
               ,$model
               ,$spr
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $methods;
    }

    public function showGrantedSprs ($vendor='*',$package='*',$class='*',$method='*') {
        try {
            $sprs       = $this->hpapi->dbCall (
                'hpapiDbaCallsForMethod'
               ,$vendor
               ,$package
               ,$class
               ,$method
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $sprs;
    }

    // MANIPULATE INSERT PERMISSIONS

    public function grantInsertToUsergroup ($model,$table,$usergroup) {
        if (!$this->grantAllowed('insert',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaInsertInsert'
               ,$model
               ,$table
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function revokeInsertFromUsergroup ($model,$table,$usergroup) {
        if (!$this->grantAllowed('insert',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaInsertDelete'
               ,$model
               ,$table
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function showInsertsForUsergroup ($model,$table='*') {
        try {
            $inserts    = $this->hpapi->dbCall (
                'hpapiDbaInsertsForUsergroup'
               ,$model
               ,$table
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $inserts;
    }


    // MANIPULATE SELECT PERMISSIONS

    public function grantSelectToUsergroup ($model,$table,$column,$usergroup) {
        if (!$this->grantAllowed('select',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaSelectInsert'
               ,$model
               ,$table
               ,$column
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function revokeSelectFromUsergroup ($model,$table,$column,$usergroup) {
        if (!$this->grantAllowed('select',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaSelectDelete'
               ,$model
               ,$table
               ,$column
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function showSelectsForUsergroup ($model,$table='*',$column='*') {
        try {
            $selects    = $this->hpapi->dbCall (
                'hpapiDbaSelectsForUsergroup'
               ,$model
               ,$table
               ,$column
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $selects;
    }

    // MANIPULATE UPDATE PERMISSIONS

    public function grantUpdateToUsergroup ($model,$table,$column,$usergroup) {
        if (!$this->grantAllowed('update',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaUpdateInsert'
               ,$model
               ,$table
               ,$column
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function revokeUpdateFromUsergroup ($model,$table,$column,$usergroup) {
        if (!$this->grantAllowed('update',$usergroup)) {
            throw new \Exception (HPAPI_DBA_STR_GRANT_ALLOW);
            return false;
        }
        try {
            $this->hpapi->dbCall (
                'hpapiDbaUpdateDelete'
               ,$model
               ,$table
               ,$column
               ,$usergroup
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function showUpdatesForUsergroup ($model,$table='*',$column='*') {
        try {
            $updates    = $this->hpapi->dbCall (
                'hpapiDbaUpdatesForUsergroup'
               ,$model
               ,$table
               ,$column
            );
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return $updates;
    }

}

