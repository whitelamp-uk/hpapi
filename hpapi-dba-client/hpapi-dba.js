/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

export class HpapiDba {

    constructor (api,templates) {
        this.api        = api;
        this.vendor     = 'whitelamp-uk';
        this.package    = 'hpapi-dba-server';
        this.templates  = templates;
        this.api.log ('Greetings human; this is HpapiDba speaking');
    }

    async rowsSelect (email,spec) {
    var request = {
            "email" : email,
            "method": {
                "vendor": "whitelamp-uk",
                "package": "hpapi-dba-server",
                "class": "\\Hpapi\\Dba",
                "method": "rowsSelect",
                "arguments": [
                    spec
                ]
            }
        }
        try {
        var response    = await this.api.request (request);
        }
        catch (e) {
            throw new Error (e.message);
        }
        return response;
    }

}

