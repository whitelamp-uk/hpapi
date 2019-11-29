
/* Copyright 2018 Burden and Burden  http://www.burdenandburden.co.uk/ */

import {HpapiMan} from './hpapi-man.js';

export class HpapiManGui extends HpapiMan {

    async authAuto ( ) {
        var response;
        this.log ('Authenticating automatically');
        this.screenLockRefreshInhibit = 1;
        try {
            response = await super.authenticate (
                this.qs(document,'#gui-email').value
               ,null
               ,'admin-server'
               ,'\\Bab\\Admin'
            );
            this.authCheck (response);
        }
        catch (e) {
            console.log (e.message);
        }
        this.screenLockRefreshInhibit = null;
    }

    async authenticate (evt) {
        var email, pwd, response;
        evt.preventDefault ();
        try {
            pwd         = evt.currentTarget.form.password.value;
            if (pwd.length==0) {
                this.log ('No password given');
                return;
            }
            evt.currentTarget.form.password.value  = '';
            email       = evt.currentTarget.form.email.value;
            response    = await super.authenticate (
                evt.currentTarget.form.email.value
               ,pwd
               ,'hpapi-man-server'
               ,'\\Hpapi\\HpapiMan'
            );
            this.authCheck (response);
        }
        catch (e) {
            console.log (e.message);
        }
    }

    async authForget ( ) {
        await this.screenRender ('home');
        super.authForget ();
    }

    async authOk ( ) {
        super.authOk ();
        // Now get business configuration data
        await this.configRequest ();
        // Render a screen by URL (only when page loads)
        if (this.urlScreen) {
            await this.templateFetch (this.urlScreen);
            await this.screenRender (this.urlScreen);
            this.urlScreen = null;
            return;
        }
        // Render a default screen
        if (!this.currentScreen) {
            await this.templateFetch ('home');
            await this.screenRender ('home');
        }
    }

    constructor (config) {
        super (config);
    }

    async init ( ) {
        console.log ('Admin GUI initialising');
        try {
            await this.globalInit ();
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
        this.log ('hpapi-man-gui initialised');
    }

    async keyRelease ( ) {
        var dt, expires;
        if (!confirm('Are you sure?')) {
            return true;
        }
        try {
            expires         = await this.keyReleaseRequest (this.parameters.userId);
        }
        catch (e) {
            this.splash (2,'Failed to release new key','Error','OK');
            return false;
        }
        dt                  = new Date (expires*1000);
        this.splash (0,'New key created and released by successful log-in before '+dt.toUTCString());
        this.find(this.data.users,'userId',this.parameters.userId,false).hasKey = 1;
        this.screenRender ('user',null,false);
        return true;
    }

}

