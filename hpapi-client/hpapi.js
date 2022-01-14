
/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

export class Hpapi {

    constructor ( ) {
    }

    errorSplit (errStr) {
    var parts                           = errStr.split (' ');
    var err                             = {};
        err.hpapiCode                   = parts[0];
        parts.shift ();
        err.httpCode                    = parts[0];
        parts.shift ();
        err.message                     = parts.join (' ');
        return err;
    }

    filterRequest (reqObj) {
        if (Object(reqObj)!=reqObj) {
            throw new Error ('Hpapi.filterRequest(): request is not an object');
            return false;
        }
        if (reqObj.key!=undefined && (typeof(reqObj.key)!='string' || reqObj.key.length==0)) {
            throw new Error ('Hpapi.filterRequest(): request key is empty or not a string');
            return false;
        }
        if (reqObj.email==undefined || typeof(reqObj.email)!='string' || reqObj.email.length==0) {
            throw new Error ('Hpapi.filterRequest(): request has no email or it is not a string');
            return false;
        }
        if (reqObj.method==undefined || Object(reqObj.method)!=reqObj.method) {
            throw new Error ('Hpapi.filterRequest(): request method is not an object');
            return false;
        }
        if (reqObj.method.vendor==undefined || typeof(reqObj.method.vendor)!='string' || reqObj.method.vendor.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no vendor or it is not a string');
            return false;
        }
        if (reqObj.method.package==undefined || typeof(reqObj.method.package)!='string' || reqObj.method.package.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no package or it is not a string');
            return false;
        }
        if (reqObj.method.class==undefined || typeof(reqObj.method.class)!='string' || reqObj.method.class.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no class or it is not a string');
            return false;
        }
        if (reqObj.method.method==undefined || typeof(reqObj.method.method)!='string' || reqObj.method.method.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no method or it is not a string');
            return false;
        }
        if (reqObj.method.arguments==undefined || Object.prototype.toString.call(reqObj.method.arguments)!='[object Array]') {
            throw new Error ('Hpapi.filterRequest(): request method has no arguments or they are not an array');
            return false;
        }
    var obj = {
            "email"     : reqObj.email
           ,"method"    : {
                "vendor"    : reqObj.method.vendor
               ,"package"   : reqObj.method.package
               ,"class"     : reqObj.method.class
               ,"method"    : reqObj.method.method
               ,"arguments" : reqObj.method.arguments
            }
        }
        if ('key' in reqObj) {
            obj.key = reqObj.key;
        }
        return obj;
    }

    filterTimeout (timeoutSeconds) {
        timeoutSeconds = parseInt (timeoutSeconds);
        if (isNaN(timeoutSeconds) || timeoutSeconds<1 || timeoutSeconds>60) {
            throw new Error ('Hpapi.filterTimeout(): connection timeout seconds is not a sane integer (between 1 and 60)');
            return false;
        }
        return timeoutSeconds;
    }

    filterUrl (url) {
        if (typeof(url)!='string' || url.length==0) {
            throw new Error ('Hpapi.filterURL(): URL is not a string or it has no length');
            return false;
        }
        return url;
    }

    hpapi (timeoutSecs,url,reqObj,anon=false) {
        var errorSplit, hpapi, json, request;
        errorSplit                          = this.errorSplit;
        try {
            timeoutSecs                     = this.filterTimeout (timeoutSecs);
            url                             = this.filterUrl (url);
            request                         = this.filterRequest (reqObj);
            request.datetime                = new Date().toUTCString ();
            if ('password' in reqObj) {
                request.password            = reqObj.password;
            }
            else if ('token' in reqObj) {
                request.token               = reqObj.token;
            }
            else if (anon) {
                request.password            = '';
            }
            else {
                throw new Error ('999 400 Missing both password and token');
                return false;
            }
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
        console.log ('hpapi(): request object = '+JSON.stringify(request,null,'    '));
        try {
            json                            = JSON.stringify (request);
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
        try {
            hpapi                           = this;
            return new Promise (
                function (succeeded,failed) {
                    var xhr;
                    xhr                     = new XMLHttpRequest ();
                    xhr.timeout             = 1000 * timeoutSecs;
                    xhr.onerror             = function ( ) {
                        failed (new Error('997 502 Could not connect or unknown error'));
                    };
                    xhr.onload              = function ( ) {
                        var err, errObj, fail, returned;
                        fail                = false;
                        if (xhr.status==200) {
                            try {
                                returned    = JSON.parse (xhr.responseText);
                                console.log ('hpapi(): returned object = '+JSON.stringify(returned,null,'    '));
                            }
                            catch (e) {
                                console.log ('hpapi(): response text = '+xhr.responseText);
                                fail        = true;
                            }
                            if (fail) {
                                failed (new Error('995 502 Server is borked: '+xhr.responseText));
                            }
                            else {
                                err                         = returned.response.error;
                                if (err) {
                                    errObj                  = new Error (err);
                                    errObj.authStatus       = returned.response.authStatus;
                                    errObj.splash           = returned.response.splash;
                                    failed (errObj);
                                }
                                else {
                                    succeeded (returned.response);
                                }
                            }
                        }
                        else {
                            failed (new Error('996 '+xhr.status+' '+xhr.statusText));
                        }
                    };
                    xhr.ontimeout   = function ( ) {
                        failed (new Error('998 404 Request timed out'));
                    };
                    xhr.open ('POST',url,true);
                    xhr.setRequestHeader ('Content-Type','application/json');
                    xhr.send (json);
                }
            );
        }
        catch (e) {
            console.log (e.message);
            return false;
        }
    }

    log (message) {
        console.log (message);
    }

}


