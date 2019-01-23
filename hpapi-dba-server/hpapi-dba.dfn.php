<?php

// Error strings - \Hpapi\Dba
define ( 'HPAPI_DBA_STR_MODEL',                 '301 400 Model not identified'                                                      );
define ( 'HPAPI_DBA_STR_COLS_DIR',              '302 500 Column definitions directory is not writable'                              );
define ( 'HPAPI_DBA_STR_COLS_WRITE',            '303 500 Could not write model column definitions'                                  );
define ( 'HPAPI_DBA_STR_IN_OBJECT',             '304 400 Input argument was not an object'                                          );
define ( 'HPAPI_DBA_STR_IN_MODEL',              '305 400 Input object missing model'                                                );
define ( 'HPAPI_DBA_STR_IN_TABLE',              '306 400 Input object missing table'                                                );
define ( 'HPAPI_DBA_STR_IN_LOAD',               '307 500 Could not load input object'                                               );
define ( 'HPAPI_DBA_STR_IN_ROW',                '308 400 Input object missing row object'                                           );
define ( 'HPAPI_DBA_STR_IN_RESTRICTS',          '309 400 Input object missing restrict object'                                      );
define ( 'HPAPI_DBA_STR_IN_RESTRICT',           '310 400 Input restrict is not an object'                                           );
define ( 'HPAPI_DBA_STR_IN_PRI',                '311 400 Input object missing primary object'                                       );
define ( 'HPAPI_DBA_STR_IN_COL_EXIST',          '312 400 Column does not exist'                                                     );
define ( 'HPAPI_DBA_STR_IN_COL_PRIV_UPDATE',    '313 403 Column update denied'                                                      );
define ( 'HPAPI_DBA_STR_IN_COL_AUTO_INC',       '314 403 Cannot update auto-increment column'                                       );
define ( 'HPAPI_DBA_STR_IN_COL_VALID',          '315 400 Column value is invalid'                                                   );
define ( 'HPAPI_DBA_STR_IN_PRI_GIVEN',          '316 400 Primary column not given'                                                  );
define ( 'HPAPI_DBA_STR_IN_PRI_EXIST',          '317 400 Primary column does not exist'                                             );
define ( 'HPAPI_DBA_STR_IN_PRI_VALID',          '318 400 Primary column value is invalid'                                           );
define ( 'HPAPI_DBA_STR_IN_RESTRICT_EXIST',     '319 400 Restrict column does not exist'                                            );
define ( 'HPAPI_DBA_STR_COLS_ALLOW',            '320 403 No allowed columns'                                                        );


define ( 'HPAPI_DBA_STR_QUERY_BUILD',           '331 500 Could not build dba query'                                                 );
define ( 'HPAPI_DBA_STR_QUERY_PREP',            '332 500 Could not prepare dba query statement'                                     );
define ( 'HPAPI_DBA_STR_QUERY_BIND',            '333 500 Could not bind to dba query statement'                                     );
define ( 'HPAPI_DBA_STR_QUERY_EXEC',            '334 500 Could not execute dba query statement'                                     );
define ( 'HPAPI_DBA_STR_QUERY_PRI',             '335 400 Missing primary key'                                                       );


define ( 'HPAPI_DBA_STR_GRANT_ALLOW',           '341 403 Grant was not allowed'                                                     );



// Diagnostic strings - \Hpapi\DbaDb
define ( 'HPAPI_STR_DB_QUERY_TYPE',             '\Hpapi\DbaDb::setType(): query type not supported'                                 );


// Userland configuration - definitions and classes
require_once HPAPI_DIR_CONFIG.'/whitelamp-uk/hpapi-dba.cfg.php';

