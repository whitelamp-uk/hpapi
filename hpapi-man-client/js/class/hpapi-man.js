
/* Copyright 2018 Whitelamp http://www.whitelamp.co.uk/ */

import {Global} from './global.js';

export class HpapiMan extends Global {

    constructor (config) {
        super (config);
    }

    async passwordResetRequest (answer,code,password) {
        var request, response;
        request     = {
            "email" : this.access.email.value
           ,"method" : {
                "vendor" : "whitelamp-uk"
               ,"package" : "hpapi-man-server"
               ,"class" : "\\Hpapi\\HpapiMan"
               ,"method" : "passwordReset"
               ,"arguments" : [
                    answer,code,password
                ]
            }
        }
        try {
            response = await this.request (request,true);
            return response.returnValue;
        }
        catch (e) {
            throw e;
            return false;
        }
    }

    async passwordSelfManageRequest (userId,hours) {
        var request, response;
        request     = {
            "email" : this.access.email.value
           ,"method" : {
                "vendor" : "whitelamp-uk"
               ,"package" : "hpapi-man-server"
               ,"class" : "\\Hpapi\\HpapiMan"
               ,"method" : "passwordSelfManage"
               ,"arguments" : [
                    userId,hours
                ]
            }
        }
        try {
            response = await this.request (request);
        }
        catch (e) {
            console.log ('passwordSelfManageRequest(): could not allow password change: '+e.message);
            throw e;
        }
    }

    async passwordSetTemporaryRequest (userId,pwd) {
        var request, response;
        request     = {
            "email" : this.access.email.value
           ,"method" : {
                "vendor" : "whitelamp-uk"
               ,"package" : "hpapi-man-server"
               ,"class" : "\\Hpapi\\HpapiMan"
               ,"method" : "passwordSetTemporary"
               ,"arguments" : [
                    userId
                   ,pwd
                ]
            }
        }
        try {
            response = await this.request (request);
        }
        catch (e) {
            console.log ('passwordSetRequest(): could not set password: '+e.message);
            throw e;
        }
    }

    async secretQuestionRequest (phoneEnd) {
    var request = {
            "email" : this.access.email.value
           ,"method" : {
                "vendor" : "whitelamp-uk"
               ,"package" : "hpapi-man-server"
               ,"class" : "\\Hpapi\\HpapiMan"
               ,"method" : "secretQuestion"
               ,"arguments" : [
                  phoneEnd
                ]
            }
        }
        try {
        var response                = await this.request (request,true);
            return response.returnValue;
        }
        catch (e) {
            console.log ('secretQuestionRequest(): failed: '+e.message);
            throw new Error (e.message);
            return false;
        }
    }

    async verifyRequest ( ) {
    var request = {
            "email" : this.access.email.value
           ,"method" : {
                "vendor" : "whitelamp-uk"
               ,"package" : "hpapi-man-server"
               ,"class" : "\\Hpapi\\HpapiMan"
               ,"method" : "verify"
               ,"arguments" : []
            }
        }
        try {
        var response            = await this.request (request,true);
            return true;
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
    }

}

