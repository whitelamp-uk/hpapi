
/* Copyright 2019 Whitelamp  http://www.whitelamp.co.uk/ */

import {Hpapi} from './hpapi.js';

export class Generic extends Hpapi {

    constructor (cfg) {
        super ();
        this.cfg                = cfg;
        if (!this.cfg.screenTO) {
            this.cfg.screenTO   = 3600;
        }
        if ('key' in this.cfg) {
            this.key            = this.cfg.key;
        }
        this.parametersClear ();
        this.data               = {};
        this.splashCount        = 0;
        this.scrolls            = {};
    }

}

