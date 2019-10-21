
/* Copyright 2018 Burden and Burden  http://www.burdenandburden.co.uk/ */

// Import
import {GenericCfg} from './class/generic-cfg.js';
import {GenericEnforcer} from './class/generic-enforcer.js';

// Executive
function execute ( ) {
    try {
        new GenericEnforcer (new GenericCfg()) .init ();
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

