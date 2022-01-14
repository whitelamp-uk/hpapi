
/* Copyright 2018 Whitelamp http://www.whitelamp.co.uk/ */

import {Generic} from './generic.js';

export class Global extends Generic {

    async authenticate (eml,pwd) {
        console.log ('super.authenticate()');
        this.loginTried = 1;
        try {
        var request = {
                "email" : eml
               ,"method" : {
                    "vendor" : "whitelamp-uk"
                   ,"package" : "hpapi-man-server"
                   ,"class" : "\\Hpapi\\HpapiMan"
                   ,"method" : "authenticate"
                   ,"arguments" : [
                    ]
                }
            }
            if (pwd) {
                request.password = pwd;
            }
            if ('key' in this) {
                request.key = this.key;
            }
        }
        catch (e) {
            console.log (e.message);
        }
        try {
        var response = await this.request (request);
        }
        catch (e) {
            if ('currentUser' in this) {
                console.log ('super.authenticate(): clearing current user details');
                this.currentUser = {};
                this.data.currentUser = {};
            }
            throw new Error (e.message);
        }
        return response;
    }

    async configRequest ( ) {
    var request = {
            "email" : this.access.email.value
           ,"method" : {
                "vendor" : "whitelamp-uk"
               ,"package" : "hpapi-man-server"
               ,"class" : "\\Hpapi\\HpapiMan"
               ,"method" : "config"
               ,"arguments" : [
                ]
            }
        }
        try {
        var response                = await this.request (request);
            this.data.config        = response.returnValue;
            return true;
        }
        catch (e) {
            console.log ('configRequest(): could not get config: '+e.message);
            return false;
        }
    }

    constructor (cfg) {
        super (cfg);
        console.log ('App config: ');
        console.table (this.cfg);
    }

    async globalInit ( ) {
        var keys, i, unlock, userScope;
        this.log ('API='+this.cfg.url);
        this.reset                  = null;
        this.templates              = {};
        if (this.cfg.diagnostic.data) {
            this.templateFetch ('data');
        }
        this.templateFetch ('lock');
        this.templateFetch ('splash');
        this.templateFetch ('place');
        await this.templateFetch ('login');
        this.currentScreen          = null;
        this.currentTemplates       = {};
        this.currentInserts         = [];
        this.parametersClear ();
        this.dataRefresh ();
        this.globalLoad ();
        this.access.innerHTML       = this.templates.login ();
        unlock                      = this.qs (document.body,'#gui-unlock');
        unlock.addEventListener ('click',this.authenticate.bind(this));
        // Define user scope
        userScope                   = this.userScope ();
        this.authAutoPermit         =  0;
        if (this.urlUser.length>0) {
            // Passed in URL so allow instant login
            this.authAutoPermit     =  1;
            userScope.value         = this.urlUser;
        }
        this.saveScopeSet (userScope.value);
        userScope.addEventListener ('keyup',this.saveScopeListen.bind(this));
        userScope.addEventListener ('change',this.saveScopeListen.bind(this));
        if ((typeof this.authAuto)=='function') {
            // Multiple window mode is defined by existence of this.authAuto()
            this.screenLocker       = window.setInterval (this.screenLockRefresh.bind(this),2000);
            this.windowLogger       = window.setInterval (this.windowLog.bind(this),900);
            this.windowLog ();
        }
        keys                        = Object.keys (this.urlParameters);
        for (i=0;i<keys.length;i++) {
            this.parameterWrite (keys[i],this.urlParameters[keys[i]]);
        }
    }

    handlebarsHelpers ( ) {
        super.handlebarsHelpers ();
    }





}

