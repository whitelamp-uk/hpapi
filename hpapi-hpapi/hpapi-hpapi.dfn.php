<?php

/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

// The hpapi model
define ( 'HPAPI_MODEL_NAME',                'HpapiModel'                                                                            );

// Anonymous user group
define ( 'HPAPI_USERGROUP_ANON',            'anon'                                                                                  );

// File suffix for PHP classes
define ( 'HPAPI_CLASS_SUFFIX',              '.class.php'                                                                            );

// Content header values
define ( 'HPAPI_CONTENT_TYPE_HTML',         'text/html'                                                                             );
define ( 'HPAPI_CONTENT_TYPE_JSON',         'application/json; charset=utf-8'                                                       );
define ( 'HPAPI_CONTENT_TYPE_TEXT',         'text/plain; charset=utf-8'                                                             );
define ( 'HPAPI_CONTENT_TYPE_UNKNOWN',      'unknown/unknown'                                                                       );

// SQL states
define ( 'HPAPI_SQL_STATE_DUPLICATE',       'duplicatePrimary'                                                                      );

// Definitions for `hpapi_pattern`.`constraints` for hpapi (and supporting class) methods and stored procedures
define ( 'HPAPI_PATTERN_DESC_ALPHA_LC',     'must have only small letters (up to 64 characters)'                                    );
define ( 'HPAPI_PATTERN_DESC_CLASS',        'must be a valid PHP class name'                                                        );
define ( 'HPAPI_PATTERN_DESC_CS_INTS_250',  'must be a comma-separated list of integers'                                            );

define ( 'HPAPI_PATTERN_DESC_CURRENCY_POS', 'must be a valid money amount (and not negative'                                        );
define ( 'HPAPI_PATTERN_DESC_DATETIME',     'must be standard datetime format yyyy-mm-dd hh:mm:ss'                                  );
define ( 'HPAPI_PATTERN_DESC_DB_BOOL',      'must be 0 or 1'                                                                        );
define ( 'HPAPI_PATTERN_DESC_DB_ENTITY',    'must start with letter, only lower-case letter, nrs. or _, maximum 64 characters'      );
define ( 'HPAPI_PATTERN_DESC_EMAIL',        'must be a valid email address'                                                         );
define ( 'HPAPI_PATTERN_GEO_COORD',         'must be a valid decimal geo-coordinate value'                                          );
define ( 'HPAPI_PATTERN_DESC_HHMMSS',       'must be 6 digits representing a time - HHMMSS'                                         );
define ( 'HPAPI_PATTERN_DESC_INT_1_POS',    'must be a positive single integer'                                                     );
define ( 'HPAPI_PATTERN_DESC_INT_11_POS',   'must be a positive integer of no more than 11 digits'                                  );
define ( 'HPAPI_PATTERN_DESC_INT_11_POS_NEG','must be an integer of no more than 11 digits'                                         );
define ( 'HPAPI_PATTERN_DESC_INT_2_POS',    'must be a positive integer of no more than 2 digits'                                   );
define ( 'HPAPI_PATTERN_DESC_INT_4_POS',    'must be a positive integer of no more than 4 digits'                                   );
define ( 'HPAPI_PATTERN_DESC_IPV4',         'must be valid IPv4 address'                                                            );
define ( 'HPAPI_PATTERN_DESC_OBJECT',       'must be a JSON object (or array)'                                                      );
define ( 'HPAPI_PATTERN_DESC_METHOD',       'must be valid format for a method name'                                                );
define ( 'HPAPI_PATTERN_DESC_PACKAGE',      'must be valid format for a package name'                                               );
define ( 'HPAPI_PATTERN_DESC_PASSWORD_1',   'must have at least 8 characters with at least one: big letter, small letter, number'   );
define ( 'HPAPI_PATTERN_DESC_URI_PATH',     'must be a Linux-friendly request URI path'                                             );
define ( 'HPAPI_PATTERN_DESC_UUIDV4',       'must be UUID v4 format'                                                                );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_140',  'must have no more than 140 characters'                                                 );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_16',   'must have no more than 16 characters'                                                  );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_2',    'must have no more than 2 characters'                                                   );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_255',  'must have no more than 255 characters'                                                 );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_32',   'must have no more than 32 characters'                                                  );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_4',    'must have no more than 4 characters'                                                   );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_4096', 'must have no more than 4096 characters'                                                );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_6',    'must have no more than 6 characters'                                                   );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_64',   'must have no more than 64 characters'                                                  );
define ( 'HPAPI_PATTERN_DESC_VARCHAR_8192', 'must have no more than 8192 characters'                                                );
define ( 'HPAPI_PATTERN_DESC_VENDOR',       'must be valid format for a vendor name'                                                );
define ( 'HPAPI_PATTERN_DESC_YYYY_MM_DD',   'must be a date in standard format'                                                     );
define ( 'HPAPI_PATTERN_DESC_YYYYMMDD',     'must be 8 digits representing a date - YYYYMMDD'                                       );

// Initiating response
define ( 'HPAPI_STR_INIT',                  '021 500 \Hpapi\Hpapi could not be initialised'                                         );
define ( 'HPAPI_STR_SSL',                   '022 400 SSL required but not used'                                                     );
define ( 'HPAPI_STR_CONTENT_TYPE',          '023 400 Client header indicates wrong content type'                                    );
define ( 'HPAPI_STR_JSON_DECODE',           '024 400 Cannot decode request'                                                         );
define ( 'HPAPI_STR_SYS_CFG',               '025 500 Could not load system configuration'                                           );
define ( 'HPAPI_STR_UNAVAILABLE',           '026 503 Service Unavailable'                                                           );

// Validating posted object properties
define ( 'HPAPI_STR_DATETIME',              '031 400 Property "datetime" does not exist'                                            );
define ( 'HPAPI_STR_EMAIL',                 '032 400 Property "email" does not exist'                                               );
define ( 'HPAPI_STR_PWD_OR_TKN',            '033 400 Neither property "password" nor property "token" exists'                       );
define ( 'HPAPI_STR_METHOD',                '034 400 Property "method" does not exist'                                              );
define ( 'HPAPI_STR_METHOD_OBJ',            '035 400 Property "method" is not an object'                                            );
define ( 'HPAPI_STR_METHOD_VENDOR',         '036 400 Method property "vendor" was not given'                                        );
define ( 'HPAPI_STR_METHOD_PACKAGE',        '037 400 Method property "package" was not given'                                       );
define ( 'HPAPI_STR_METHOD_CLASS',          '038 400 Method property "class" was not given'                                         );
define ( 'HPAPI_STR_METHOD_METHOD',         '039 400 Method property "method" was not given'                                        );

// Configuration errors
define ( 'HPAPI_STR_DB_CFG',                '041 500 DB configuration error - could not load database configuration'                );
define ( 'HPAPI_STR_DB_DFN',                '042 500 DB configuration error - could not load PDO definition'                        );
define ( 'HPAPI_STR_DB_DFN_DRV',            '043 500 DB configuration error - missing PDO driver definition'                        );
define ( 'HPAPI_STR_DB_OBJ',                '044 500 Could not construct database object'                                           );
define ( 'HPAPI_STR_DB_CONN',               '045 500 Could not connect to database'                                                 );
define ( 'HPAPI_STR_PERM_WRITE',            '046 500 Could not write permissions'                                                    );
define ( 'HPAPI_STR_PRIV_WRITE',            '047 500 Could not write privileges'                                                    );
define ( 'HPAPI_STR_PRIV_READ',             '048 500 Could not read privileges'                                                     );
define ( 'HPAPI_STR_TOKEN_DURATION',        '049 500 No matching user group has a token duration'                                   );

// Authentication error
define ( 'HPAPI_STR_AUTH_DENIED',           '050 403 Access denied'                                                                 );

// Authentication status
define ( 'HPAPI_STR_AUTH_DEFAULT',          '061 Bad request'                                                                       );
define ( 'HPAPI_STR_AUTH_REM_ADDR_PKG',     '062 Package not allowed from remote address'                                           );
define ( 'HPAPI_STR_AUTH_KEY',              '063 Package requires valid key'                                                        );
define ( 'HPAPI_STR_AUTH_BLACKLIST',        '064 Not authorised'                                                                    );
define ( 'HPAPI_STR_AUTH_EMAIL',            '064 Not authorised'                                                                    );
define ( 'HPAPI_STR_AUTH_KEY_STATUS',       '064 Not authorised'                                                                    );
define ( 'HPAPI_STR_AUTH_PASSWORD',         '064 Not authorised'                                                                    );
define ( 'HPAPI_STR_AUTH_REM_ADDR',         '065 Not allowed from remote address'                                                   );
define ( 'HPAPI_STR_AUTH_ACTIVE',           '066 Not activated by administrator'                                                    );
define ( 'HPAPI_STR_AUTH_PWD_EXPIRED',      '067 Password expired'                                                                  );
define ( 'HPAPI_STR_AUTH_OK',               '068 Fully authenticated'                                                               );
define ( 'HPAPI_STR_AUTH_TOKEN',            '069 Invalid token'                                                                     );
define ( 'HPAPI_STR_AUTH_VERIFY',           '070 Authenticated but unverified'                                                      );
define ( 'HPAPI_STR_AUTH_ANONYMOUS',        '071 Anonymous'                                                                         );

// Validating posted object->method
define ( 'HPAPI_STR_METHOD_VDR',            '081 400 Method property "vendor" does not exist'                                       );
define ( 'HPAPI_STR_METHOD_VDR_STR',        '082 400 Method property "vendor" is not a string'                                      );
define ( 'HPAPI_STR_METHOD_VDR_PTH',        '083 400 Method vendor directory not found'                                             );
define ( 'HPAPI_STR_METHOD_PKG',            '084 400 Method property "package" does not exist'                                      );
define ( 'HPAPI_STR_METHOD_PKG_STR',        '085 400 Method property "package" is not a string'                                     );
define ( 'HPAPI_STR_METHOD_PKG_PTH',        '086 400 Method package directory not found'                                            );
define ( 'HPAPI_STR_METHOD_CLS',            '087 400 Method property "class" does not exist'                                        );
define ( 'HPAPI_STR_METHOD_CLS_STR',        '088 400 Method property "class" is not a string'                                       );
define ( 'HPAPI_STR_METHOD_CLS_PTH',        '089 400 Method package does not contain class file'                                    );
define ( 'HPAPI_STR_METHOD_MTD',            '090 400 Method property "method" does not exist'                                       );
define ( 'HPAPI_STR_METHOD_MTD_STR',        '091 400 Method property "method" is not a string'                                      );
define ( 'HPAPI_STR_METHOD_ARGS',           '092 400 Method property "arguments" does not exist'                                    );
define ( 'HPAPI_STR_METHOD_ARGS_ARR',       '093 400 Method property "arguments" is not an array'                                   );
define ( 'HPAPI_STR_METHOD_DFN_INC',        '094 500 Could not include definition file'                                             );
define ( 'HPAPI_STR_METHOD_CLS_INC',        '095 500 Could not include class file'                                                  );
define ( 'HPAPI_STR_METHOD_CLS_GOT',        '096 500 Class file included but class does not exist'                                  );
define ( 'HPAPI_STR_METHOD_CLS_NEW',        '097 500 Class exists but could not be instantiated'                                    );
define ( 'HPAPI_STR_METHOD_MTD_GOT',        '098 500 Method not in instantiated class'                                              );
define ( 'HPAPI_STR_METHOD_PRIV',           '099 403 Method not allowed'                                                            );

// Running method
define ( 'HPAPI_STR_DB_MTD_ARGS',           '102 400 Incorrect argument count for method'                                           );
define ( 'HPAPI_STR_DB_MTD_ARG_VAL',        '103 400 Invalid method argument'                                                       );
define ( 'HPAPI_STR_DB_SPR_MODEL',          '104 500 No database for data model'                                                    );
define ( 'HPAPI_STR_DB_Z',                  '105 500 Empty arguments to database function'                                          );
define ( 'HPAPI_STR_DB_MTD_ACCESS',         '106 403 Method is not available'                                                       );
define ( 'HPAPI_STR_DB_MTD_REMOTE_ADDR',    '107 403 Remote address not allowed for user group(s)'                                  );

// Calling stored procedures
define ( 'HPAPI_STR_DB_SPR_NO_SPR',         '201 500 Method did not give stored procedure'                                          );
define ( 'HPAPI_STR_DB_SPR_AVAIL',          '202 403 Stored procedure not available'                                                );
define ( 'HPAPI_STR_DB_SPR_ARGS',           '203 500 Incorrect argument count for stored procedure'                                 );
define ( 'HPAPI_STR_DB_SPR_ARG_VAL',        '204 500 Invalid stored procedure argument'                                             );
define ( 'HPAPI_STR_DB_SPR_ARG_TYPE',       '205 500 Illegal data type for stored procedure argument'                               );
define ( 'HPAPI_STR_DB_SPR_ERROR',          '206 500 Stored procedure execution error'                                              );
define ( 'HPAPI_STR_DB_SPR_DANGER_MODEL',   '207 400 Danger mode requires request property "sprModel"'                              );
define ( 'HPAPI_STR_DB_CALL',               '208 500 Stored procedure failed'                                                       );

// Inserting data
define ( 'HPAPI_STR_DB_INSERT_COLS',        '211 400 No columns were given'                                                         );
define ( 'HPAPI_STR_DB_INSERT_PERMISSION',  '212 403 Column insert not allowed'                                                     );
define ( 'HPAPI_STR_DB_INSERT_MODELS',      '213 400 Columns are from different models'                                             );
define ( 'HPAPI_STR_DB_INSERT_ERROR',       '214 500 Database error (for insert)'                                                   );
define ( 'HPAPI_STR_DB_INSERT_PRI_CHECK',   '215 500 Unable to check primary key'                                                   );
define ( 'HPAPI_STR_DB_INSERT_PRI',         '216 400 Non-auto-incrementing primary key was not given'                               );
define ( 'HPAPI_STR_DB_INSERT_AUTOINC',     '217 400 Auto-incrementing primary key was given'                                       );
define ( 'HPAPI_STR_DB_INSERT_COL_VAL',     '218 400 Invalid column value'                                                          );
define ( 'HPAPI_STR_DB_INSERT_DUPLICATE',   '219 400 Record already exists'                                                         );

// Updating data
define ( 'HPAPI_STR_DB_UPDATE_PERMISSION',  '231 403 Column update not allowed'                                                     );
define ( 'HPAPI_STR_DB_UPDATE_ERROR',       '232 500 Database error (for update)'                                                   );
define ( 'HPAPI_STR_DB_UPDATE_COL_VAL',     '233 400 Invalid column value'                                                          );
define ( 'HPAPI_STR_DB_UPDATE_PRI_PERM',    '234 400 Primary key is not recognised'                                                 );
define ( 'HPAPI_STR_DB_UPDATE_PRI_VAL',     '235 400 Invalid primary key value'                                                     );
define ( 'HPAPI_STR_DB_UPDATE_PRI_CHECK',   '236 500 Unable to check primary key'                                                   );
define ( 'HPAPI_STR_DB_UPDATE_PRI',         '237 400 The primary key given is incomplete'                                           );
define ( 'HPAPI_STR_PASSWORD_TEST',         '238 500 Unable to test password'                                                       );

// Returning the response payload
define ( 'HPAPI_STR_RETURN_BYTES_MAX',      '239 550 The response payload is too large; limited to '                                );


// SSL notice
define ( 'HPAPI_STR_PLAIN',                 'WARNING - UNENCRYPTED CONNECTION'                                                      );

// Method notices
define ( 'HPAPI_STR_DECODE_NOTHING',        '\Hpapi\Hpapi::decodePost(): nothing was posted'                                        );
define ( 'HPAPI_STR_DECODE_LENGTH',         '\Hpapi\Hpapi::decodePost(): posted data is too long'                                   );
define ( 'HPAPI_STR_DB_EMPTY',              '\Hpapi\Db::call(): empty argument(s)'                                                  );
define ( 'HPAPI_STR_2D_ARRAY',              '\Hpapi\Hpapi::parse2D(): a 2-D array was not given'                                    );
define ( 'HPAPI_STR_EXPORT_ARRAY_FILE',     '\Hpapi\Hpapi::exportArray(): file is not writable'                                     );
define ( 'HPAPI_STR_EXPORT_ARRAY_ARR',      '\Hpapi\Hpapi::exportArray(): variable is not an array'                                 );
define ( 'HPAPI_STR_RESET_PRIVS_FILE',      '\Hpapi\Hpapi::resetPrivileges(): privileges file is not writable'                      );
define ( 'HPAPI_STR_VALID_DEFN_PARAM',      '\Hpapi\Hpapi::validation(): definition is missing property'                            );
define ( 'HPAPI_STR_PASSWORD_DICTIONARY',   'Contains common words, names or patterns'                                              );
define ( 'HPAPI_STR_PASSWORD_CHARACTERS',   'Not enough different characters'                                                       );
define ( 'HPAPI_STR_PASSWORD_OTHER',        'Too easy to crack'                                                                     );
define ( 'HPAPI_STR_PASSWORD_SCORE',        'Security score is too low'                                                             );

// Database notices
define ( 'HPAPI_STR_DB_PREP',               'Query preparation failed'                                                              );
define ( 'HPAPI_STR_DB_BIND',               'Query binding failed'                                                                  );
define ( 'HPAPI_STR_DB_EXEC',               'Query execution failed'                                                                );
define ( 'HPAPI_STR_DB_PRI_KEY',            'Table does not seem to have a primary key'                                             );
define ( 'HPAPI_STR_DB_STRICT',             'Failed to set SQL strict mode'                                                         );
define ( 'HPAPI_STR_DB_TZ',                 'Failed to set SQL time zone'                                                           );


// Validation strings
define ( 'HPAPI_STR_VALID_PATTERN',         'must match pattern'                                                                    );
define ( 'HPAPI_STR_VALID_OBJECT',          'must not be an object or array'                                                        );
define ( 'HPAPI_STR_VALID_EXPRESSION',      'must match regular expression'                                                         );
define ( 'HPAPI_STR_VALID_PHP_FILTER',      'must pass validation filter'                                                           );
define ( 'HPAPI_STR_VALID_LMIN',            'must have character length at least'                                                   );
define ( 'HPAPI_STR_VALID_LMAX',            'must have character length no more than'                                               );
define ( 'HPAPI_STR_VALID_VMIN',            'must have value at least'                                                              );
define ( 'HPAPI_STR_VALID_VMAX',            'must have value no more than'                                                          );

// Diagnostic messages
define ( 'HPAPI_DG_ENABLED',                'Diagnostic enabled'                                                                    );
define ( 'HPAPI_DG_BLACKLIST_ARRAY',        'No blacklist array'                                                                    );
define ( 'HPAPI_DG_PRIV_REM_ADDR',          'Privilege remote address mismatch'                                                     );
define ( 'HPAPI_DG_PRIV_KEY',               'Privilege requires key which was not given'                                            );
define ( 'HPAPI_DG_AUTH_RESULTS',           'No auth result [see hpapi.hpapiAuthDetails([email address])]'                                                             );
define ( 'HPAPI_DG_BLACKLIST',              'Request blacklisted'                                                                   );
define ( 'HPAPI_DG_USER_REM_ADDR',          'User remote address mismatch'                                                          );
define ( 'HPAPI_DG_USER_ACTIVE',            'User inactive'                                                                         );
define ( 'HPAPI_DG_KEY',                    'Key mismatch'                                                                          );
define ( 'HPAPI_DG_PASSWORD',               'Password mismatch'                                                                     );
define ( 'HPAPI_DG_TOKEN_MATCH',            'Token mismatch'                                                                        );
define ( 'HPAPI_DG_TOKEN_EXPIRY',           'Token expired'                                                                         );
define ( 'HPAPI_DG_REM_ADDR',               'Remote address mismatch'                                                               );
define ( 'HPAPI_DG_TOKEN_EXTEND',           'Token extend error'                                                                    );
define ( 'HPAPI_DG_TOKEN',                  'Token error'                                                                           );
define ( 'HPAPI_DG_ACCESS_GRP',             'Privilege user group mismatch'                                                         );
define ( 'HPAPI_DG_ACCESS_GRP_REM_ADDR',    'User group remote address mismatch'                                                    );
define ( 'HPAPI_DG_RESET',                  'User cannot self-manage password'                                                      );



// Userland configuration - definitions and classes
require_once HPAPI_DIR_CONFIG.'/whitelamp-uk/hpapi-hpapi.cfg.php';

