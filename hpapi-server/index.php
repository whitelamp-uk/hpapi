<?php

/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

// FILE SYSTEM LOCATION
define ('HPAPI_DIR_HPAPI', '../..' );
define ('HPAPI_DIR_CONFIG', '../../.hpapi-config' );
define ('HPAPI_DIR_LOG', '../../.hpapi-log' );


// INVOKE HPAPI
if (php_sapi_name()=='cli') {
    die ("011 CLI is not allowed\n");
}
if (version_compare(PHP_VERSION,'7.0.0','<')) {
    die ('012 Application error: PHP minimum requirement is 7.0.0');
}
try {
    error_reporting (-1);
    require_once HPAPI_DIR_HPAPI.'/whitelamp-uk/hpapi-hpapi/hpapi-hpapi.dfn.php';
    new \Hpapi\Hpapi ();
}
catch (\Exception $e) {
    die ("013 Application failure\n");
}

