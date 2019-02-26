<?php

/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

namespace Hpapi;

class Db {

    protected   $lastAutoColumn;  // Auto-increment column found on last use of primaryKeys()
    protected   $dfn;
    protected   $filter;
    protected   $hpapi;
    public      $inputs;
    public      $model;
    protected   $PDO;
    protected   $sprCmd; // eg. CALL (), SELECT () OR EXEC () keyword

    public function __construct (\Hpapi\Hpapi $hpapi,$model) {
        $this->hpapi        = $hpapi;
        $this->model        = $model;
        try {
            $this->driver   = $this->hpapi->pdoDriver ($this->model->dsn);
            $dfns           = $hpapi->jsonDecode (
                file_get_contents (HPAPI_MODELS_PDO_DFN)
               ,false
               ,HPAPI_JSON_DEPTH
            );
            if (!property_exists($dfns,$this->driver)) {
                throw new \Exception (HPAPI_STR_DB_DFN_DRV);
                return false;
            }
            $this->dfn      = $dfns->{$this->driver};
        }
        catch (\Exception $e) {
            throw new \Exception (HPAPI_STR_DB_DFN.': '.$e->getMessage());
            return false;
        }
        try {
            $this->connect ();
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        return true;
    }

    public function __destruct ( ) {
        $this->close ();
    }

    public function call ( ) {
        // Process inputs
        $args               = func_get_args ();
        try {
            $spr            = (string) array_shift ($args);
            if(!strlen($spr)) {
                throw new \Exception (HPAPI_STR_DB_EMPTY);
                return false;
            }
        }
        catch (\Exception $e) {
            throw new \Exception (HPAPI_STR_DB_EMPTY);
            return false;
        }
        try {
            // Query for a stored procedure
            $q              = $this->dfn->sql->spr;
            $q              = str_replace ('<spr/>',$spr,$q);
            // Binding placeholders
            $b              = array ();
            foreach ($args as $i=>$arg) {
                array_push ($b,'?');
            }
            $b              = implode (',',$b);
            $q              = str_replace ('<csv-bindings/>',$b,$q);
        }
        catch (\Exception $e) {
            throw new \Exception (HPAPI_STR_DB_PREP.' [1] - '.$spr.' ('.$e.')');
            return false;
        }
        try {
            // SQL statement
            $stmt           = $this->PDO->prepare ($q);
        }
        catch (\PDOException $e) {
            throw new \Exception (HPAPI_STR_DB_PREP.' [2] - '.$spr.' ('.$e.')');
            return false;
        }
        foreach ($args as $i=>$arg) {
            // Bind value to placeholder
            try {
                (array)$arg = $this->pdoCast ($arg);
                $stmt->bindValue (($i+1),$arg[0],$arg[1]);
            }
            catch (\PDOException $e) {
                throw new \Exception (HPAPI_STR_DB_BIND.' - '.$spr.' ('.$e.')');
                return false;
            }
        }
        try {
            // Execute SQL statement
            $stmt->execute ();
        }
        catch (\PDOException $e) {
            // Execution failed
            $this->hpapi->diagnostic (HPAPI_STR_DB_EXEC.' - '.$spr.' ('.$e->getMessage().')');
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            // Execution OK, fetch data (if any was returned)
            $data           =  $stmt->fetchAll (\PDO::FETCH_ASSOC);
            $stmt->closeCursor ();
        }
        catch (\PDOException $e) {
            // Execution OK, no data fetched
            return true;
        }
        // Execution OK, data fetched
        return $data;
    }

    public function close ( ) {
        if ($this->driver=='pgsql') {
            try {
                $this->PDO->query ('SELECT pg_terminate_backend(pg_backend_pid());');
            }
            catch (\PDOException $e) {
                // At least we tried...
            }
        }
        $this->PDO          = null;
    }

    private function connect ( ) {
        if (is_object($this->PDO)) {
            return true;
        }
        try {
            $this->PDO      = new \PDO (
                $this->model->dsn
               ,$this->model->usr
               ,$this->model->pwd
               ,array (\PDO::ATTR_ERRMODE=>\PDO::ERRMODE_EXCEPTION)
            );
        }
        catch (\PDOException $e) {
            throw new \Exception (HPAPI_STR_DB_CONN);
            return false;
        }
        return true;
    }

    public function insert ($table,$columns,$defns) {
        // Check inputs
        try {
            $this->insertCheck ($table,$columns,$defns);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        // Set strict mode
        try {
            $this->strictMode ();
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic ($e->getMessage());
            throw new \Exception (HPAPI_STR_DB_INSERT_ERROR);
            return false;
        }
        // Build query
        try {
            $q              = $this->dfn->sql->insert;
            $q              = str_replace ('<table/>',$table,$q);
            $c              = array ();
            $b              = array ();
            foreach ($columns as $col=>$val) {
                array_push ($c,$this->dfn->sql->delimiter.$col.$this->dfn->sql->delimiter);
                array_push ($b,'?');
            }
            $c              = implode (',',$c);
            $b              = implode (',',$b);
            $q              = str_replace ('<csv-columns/>',$c,$q);
            $q              = str_replace ('<csv-bindings/>',$b,$q);
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic (HPAPI_STR_DB_PREP.' [1] - '.$table.' ('.$e->getMessage().')');
            throw new \Exception (HPAPI_STR_DB_INSERT_ERROR);
            return false;
        }
        // Prepare and execute statement
        try {
            $stmt           = $this->PDO->prepare ($q);
        }
        catch (\PDOException $e) {
            $this->hpapi->diagnostic (HPAPI_STR_DB_PREP.' [2] - '.$table.' ('.$e->getMessage().')');
            throw new \Exception (HPAPI_STR_DB_INSERT_ERROR);
            return false;
        }
        $i                  = 0;
        foreach ($columns as $v) {
            try {
                $i++;
                (array)$arg = $this->pdoCast ($v);
                $stmt->bindValue ($i,$arg[0],$arg[1]);
            }
            catch (\PDOException $e) {
                $this->hpapi->diagnostic (HPAPI_STR_DB_BIND.' - '.$table.'.'.$column.' ('.$e->getMessage().')');
                throw new \Exception (HPAPI_STR_DB_INSERT_ERROR);
                return false;
            }
        }
        try {
            $stmt->execute ();
        }
        catch (\PDOException $e) {
            // Execution failed
            $this->hpapi->diagnostic (HPAPI_STR_DB_EXEC.' - '.$table.' ('.$e->getMessage().')');
            throw new \Exception (HPAPI_STR_DB_INSERT_ERROR);
            return false;
        }
        if ($this->lastAutoColumn) {
            $rtn = $this->PDO->lastInsertId ();
        }
        else {
            $rtn = true;
        }
        $stmt->closeCursor ();
        return $rtn;
    }

    public function insertCheck ($table,$columns,$defns) {
        // Check primary keys
        try {
            $tableKeys          = $this->primaryKeys ($table);
        }       
        catch (\Exception $e) {
            throw new \Exception (HPAPI_STR_DB_INSERT_PRI_CHECK);
            return false;
        }
        foreach ($tableKeys AS $pk) {
            if (!property_exists($columns,$pk['column']) && !$pk['isAutoIncrement']) {
                throw new \Exception (HPAPI_STR_DB_INSERT_PRI);
                return false;
            }
            if (property_exists($columns,$pk['column']) && $pk['isAutoIncrement']) {
                throw new \Exception (HPAPI_STR_DB_INSERT_AUTOINC);
                return false;
            }
        }
        // Validate columns
        foreach ($columns as $c=>$v) {
            try {
                $this->hpapi->validation ($table.'.'.$c,null,$v,$defns->{$c});
            }
            catch (\Exception $e) {
                throw new \Exception (HPAPI_STR_DB_INSERT_COL_VAL.': '.$e->getMessage());
                return false;
            }
        }
        return true;
    }

    public function pdoCast ($value) {
            // Force change of data type
            if (is_bool($value)) {
                if ($value) {
                    $value  = 1;
                }
                else {
                    $value  = 0;
                }
            }
            elseif (is_double($value)) {
                $value     .= '';
            }
            // Select correct parameter type
            if (is_null($value)) {
                $type       = \PDO::PARAM_NULL;
            }
            elseif (is_integer($value)) {
                $type       = \PDO::PARAM_INT;
            }
            elseif (is_string($value)) {
                $type       = \PDO::PARAM_STR;
            }
            else {
                throw new \Exception (HPAPI_STR_DB_SPR_ARG_TYPE);
                return false;
            }
            return array ($value,$type);
    }

    public function primaryKeys ($table) {
        try {
            $stmt           = $this->PDO->prepare ($this->dfn->sql->primaryKeys);
        }
        catch (\PDOException $e) {
            throw new \Exception (HPAPI_STR_DB_PREP.' ('.$e.')');
            return false;
        }
        try {
            (array)$arg     = $this->pdoCast ($table);
            $stmt->bindValue (1,$arg[0],$arg[1]);
        }
        catch (\PDOException $e) {
            throw new \Exception (HPAPI_STR_DB_BIND.' ('.$e.')');
            return false;
        }
        try {
            $stmt->execute ();
        }
        catch (\PDOException $e) {
            // Execution failed
            $this->hpapi->diagnostic (HPAPI_STR_DB_EXEC.' ('.$e->getMessage().')');
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            $keys           =  $stmt->fetchAll (\PDO::FETCH_ASSOC);
            $stmt->closeCursor ();
        }
        catch (\PDOException $e) {
            throw new \Exception (HPAPI_STR_DB_PRI_KEY);
            return false;
        }
        $this->lastAutoColumn = null;
        foreach ($keys as $key) {
            if ($key['isAutoIncrement']) {
                $this->lastAutoColumn = $key['column'];
                break;
            }
        }
        return $keys;
    }

    public function strictMode ( ) {
        try {
            $stmt           = $this->PDO->prepare ($this->dfn->sql->strictMode);
            $stmt->execute ();
        }
        catch (\PDOException $e) {
            throw new \Exception (HPAPI_STR_DB_STRICT.': '.$e->getMessage());
            return false;
        }
        return true;
    }

    public function update ($table,$column,$value,$primaryKeys) {
        try {
            $this->updateCheck ($table,$column,$value,$primaryKeys);
        }
        catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
        try {
            // Query for an update
            $q              = $this->dfn->sql->update;
            $q              = str_replace ('<table/>',$table,$q);
            $q              = str_replace ('<column/>',$column,$q);
            // Binding placeholders
            $q              = str_replace ('<value/>','?',$q);
            $c              = array ();
            foreach ($primaryKeys as $k=>$v) {
                $p          = $this->dfn->sql->delimiter.$k.$this->dfn->sql->delimiter.'=?';
                array_push ($c,$p);
            }
            $c              = implode ($this->dfn->sql->constraintsSep,$c);
            $q              = str_replace ('<constraints/>',$c,$q);
        }
        catch (\Exception $e) {
            $this->hpapi->diagnostic (HPAPI_STR_DB_PREP.' [1] - '.$table.'.'.$column.' ('.$e->getMessage().')');
            throw new \Exception (HPAPI_STR_DB_UPDATE_ERROR);
            return false;
        }
        try {
            // SQL statement
            $stmt           = $this->PDO->prepare ($q);
        }
        catch (\PDOException $e) {
            $this->hpapi->diagnostic (HPAPI_STR_DB_PREP.' [2] - '.$table.'.'.$column.' ('.$e->getMessage().')');
            throw new \Exception (HPAPI_STR_DB_UPDATE_ERROR);
            return false;
        }
        // Bind values to placeholders
        $i                  = 1;
        try {
            (array)$arg = $this->pdoCast ($value);
            $stmt->bindValue (1,$arg[0],$arg[1]);
        }
        catch (\PDOException $e) {
            $this->hpapi->diagnostic (HPAPI_STR_DB_BIND.' [1] - '.$table.'.'.$column.' ('.$e->getMessage().')');
            throw new \Exception (HPAPI_STR_DB_UPDATE_ERROR);
            return false;
        }
        foreach ($primaryKeys as $k=>$v) {
            try {
                $i++;
                (array)$arg = $this->pdoCast ($v);
                $stmt->bindValue ($i,$arg[0],$arg[1]);
            }
            catch (\PDOException $e) {
                $this->hpapi->diagnostic (HPAPI_STR_DB_BIND.' [2] - '.$table.'.'.$column.' ('.$e->getMessage().')');
                throw new \Exception (HPAPI_STR_DB_UPDATE_ERROR);
                return false;
            }
        }
        try {
            // Execute SQL statement
            $stmt->execute ();
        }
        catch (\PDOException $e) {
            // Execution failed
            $this->hpapi->diagnostic (HPAPI_STR_DB_EXEC.' - '.$spr.' ('.$e->getMessage().')');
            throw new \Exception (HPAPI_STR_DB_UPDATE_ERROR);
            return false;
        }
        $stmt->closeCursor ();
        return true;
    }

    public function updateCheck ($table,$column,$value,$primaryKeys) {
        // Validate column
        try {
            $this->hpapi->validation ($table.'.'.$column->column,null,$value,$column);
        }
        catch (\Exception $e) {
            throw new \Exception (HPAPI_STR_DB_UPDATE_COL_VAL.': '.$e->getMessage());
            return false;
        }
        foreach ($primaryKeys as $col=>$val) {
            // Get primary column details
            if (!($c=$this->hpapi->permissionForColumn($table,$col))) {
                throw new \Exception (HPAPI_STR_DB_UPDATE_PRI_PERM);
                return false;
            }
            // Validate primary column
            try {
                $this->hpapi->validation ($table.'.'.$col,null,$val,$c);
            }
            catch (\Exception $e) {
                throw new \Exception (HPAPI_STR_DB_UPDATE_PRI_VAL.': '.$e->getMessage());
                return false;
            }
        }
        // Check primary key has the right columns
        try {
            $tableKeys      = $this->primaryKeys ($table);
        }       
        catch (\Exception $e) {
            throw new \Exception (HPAPI_STR_DB_UPDATE_PRI_CHECK);
            return false;
        }
        foreach ($tableKeys as $k) {
            if (!property_exists($primaryKeys,$k['column'])) {
                throw new \Exception (HPAPI_STR_DB_UPDATE_PRI);
                return false;
            }
        }
    }

}

