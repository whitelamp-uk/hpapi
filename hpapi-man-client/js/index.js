
/* Copyright 2019 Whitelamp  http://www.whitelamp.com/ */

// Import
import {HpapiManCfg} from './class/hpapi-man-cfg.js';
import {HpapiManEnforcer} from './class/hpapi-man-enforcer.js';

// Executive
function execute ( ) {
    try {
        new HpapiManEnforcer (new HpapiManCfg()) .init ();
    }
    catch (e) {
        document.getElementById('gui-access').innerHTML = 'Failed to initialise application: '+e.message;
    }
}
if (window.document.readyState=='interactive' || window.document.readyState=='complete') {
    execute ();
}
else {
    window.document.addEventListener ('DOMContentLoaded',execute);
}
