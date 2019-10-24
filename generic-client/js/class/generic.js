
/* Copyright 2019 Whitelamp  http://www.whitelamp.co.uk/ */

import {Hpapi} from './hpapi.js';

export class Generic extends Hpapi {

    aa (elmt) {
        // All attributes by id or element
        elmt                    = this.ge (elmt);
    var rtn = {};
        for (var name of elmt.getAttributeNames()) {
           rtn[name]            = elmt.getAttribute (name);
        }
        return rtn;
    }

    ac (parent,tag,attributes) {
        // For a parent or a parent id, create, append and return a child element
    var parent                  = this.ge (parent);objectToCsv
    var child                   = document.createElement (tag);
        for (var attr in attributes) {
            child.setAttribute (attr,attributes[attr]);
        }
        parent.appendChild (child);
        return child;
    }

    actors (templateName) {
        // Use override method to add event listeners for templateName
        // Navigation buttons should use navigators() instead
    }

    actorsListen (defns) {
        console.log ('actorsListen(): '+defns.length+' actors');
        for (var i=0;i<defns.length;i++) {
            if (!defns[i].event) {
                console.log ('actorsListen(): ['+(i+1)+'] missing event property');
                continue;
            }
            if (!defns[i].function) {
                console.log ('actorsListen(): ['+(i+1)+'] missing function property');
                continue;
            }
            if ((typeof defns[i].function)!='function') {
                console.log ('actorsListen(): ['+(i+1)+'] function property is not a function');
                continue;
            }
            try {
                if ('id' in defns[i]) {
                var elmt        = this.qs (this.restricted,'#'+defns[i].id);
                    console.log ('actorsListen(): ['+(i+1)+'] id='+defns[i].id+' - '+defns[i].event);
                    elmt.addEventListener (
                        defns[i].event,
                        defns[i].function.bind (this)
                    );
                    continue;
                }
                if ('class' in defns[i]) {
                var elmts       = this.qsa (this.restricted,'.'+defns[i].class);
                    for (var elmt of elmts) {
                        console.log ('actorsListen(): ['+(i+1)+'] class='+defns[i].class+' - '+defns[i].event);
                        elmt.addEventListener (
                            defns[i].event,
                            defns[i].function.bind (this)
                        );
                    }
                    continue;
                }
                if ('name' in defns[i]) {
                var elmts       = this.qsa (this.restricted,'[name='+defns[i].name+']');
                    for (var elmt of elmts) {
                        console.log ('actorsListen(): ['+(i+1)+'] name='+defns[i].name+' - '+defns[i].event);
                        elmt.addEventListener (
                            defns[i].event,
                            defns[i].function.bind (this)
                        );
                    }
                    continue;
                }
                console.log ('actorsListen(): the only supported attributes are id, class and name');
            }
            catch (e) {
                console.log ('actorsListen(): '+e.message);
                continue;
            }
        }
        return true;
    }

    authCheck (response) {
        try {
        var status              = response.authStatus.split (' ');
            if (status[0]=='068') {
                console.log ('authCheck(): setting this.currentUser');
                this.currentUser = response.returnValue;
                this.dataRefresh ();
                this.authOk ();
                this.screenUnlock ();
            }
            else {
                this.log ('authCheck(): hpapi status = '+status[0]);
                this.screenLock ();
                this.authFail (status[0]);
            }
        }
        catch (e) {
            this.log ('authCheck(): '+e.message);
            this.screenLock ();
            this.authFail ();
        }
    }

    authFail (authStatus) {
        console.log ('authFail()');
        if (authStatus=='065') {
            this.splash (1,'You need to set a new password','Password has expired','OK');
        }
        this.log ('Global failed to authenticate');
    }

    async authForget ( ) {
        this.qs(document,'#gui-unlock').innerHTML = 'Log in';
        this.loggedOut      = 1;
        this.cookieWrite ('lo',1);
        this.tokenPurge ();
        this.init ();
    }

    authOk ( ) {
        this.loggedOut      = 0;
        this.cookieWrite ('lo',0);
        this.access.email.value
        for (var i=0;this.currentUser.templates[i];i++) {
            if (this.currentUser.templates[i] in this.currentTemplates) {
                continue;
            }
            this.currentTemplates[this.currentUser.templates[i]] = { visited: false };
        }
    }

    autoscopeClick (evt) {
    var scoped = this.qs (document,'.scoped');
        if (scoped) {
            scoped.classList.remove ('scoped');
        }
        evt.currentTarget.classList.add ('scoped');
        if ('parameter' in evt.target.dataset && 'value' in evt.target.dataset) {
            this.parameterWrite (evt.target.dataset.parameter,evt.target.dataset.value);
            return;
        }
        if ('parameter' in evt.currentTarget.dataset && 'value' in evt.currentTarget.dataset) {
            this.parameterWrite (evt.currentTarget.dataset.parameter,evt.currentTarget.dataset.value);
        }
    }

    autoscopeListen (targetElmt) {
    var elmts = this.qsa (targetElmt,'[data-autoscope]');
        for (var elmt of elmts) {
            elmt.addEventListener ('click',this.autoscopeClick.bind(this));
        }
    }

    clicks (targetElmt) {
    var elmts = this.qsa (targetElmt,'.auto-click');
        for (var elmt of elmts) {
            elmt.click ();
        }
    }

    clone (obj) {
        return JSON.parse (JSON.stringify(obj));
    }

    compress (arrayOfObjects) {
        // Filter array to remove elements that are now falsey
        return arrayOfObjects.filter (
            function (elmt) {
                if (elmt) {
                    return true;
                }
                return false;
            }
        );
    }

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

    contextHandle (evt) {
        if (evt.target.id=='gui-new-window') {
        var url = this.contextUrl (this.userScope().value);
            if (url) {
                window.open (url);
                return true;
            }
            return false;
        }
        if (evt.target.id=='gui-copy-url') {
        var url = this.contextUrl ();
            if (url) {
            var i               = document.createElement ('input');
                i.value         = url;
                i.classList.add ('clipboard');
                document.body.appendChild (i);
                i.focus ();
                i.select ();
                i.addEventListener ('blur',function(ev){ev.target.parentElement.removeChild(ev.target);});
                return true;
            }
            return false;
        }
        this.log ('contextHandle(): context id "'+evt.target.id+'" not recognised');
        return false;
    }

    contextTargetHandle (evt) {
        this.contextTarget      = evt.currentTarget;
    }

    contextUrl (user,screen) {
            if (!user) {
                user            = '';
            }
            if (!screen) {
                this.parameterParse (this.contextTarget);
                screen          = this.contextTarget.dataset.screen;
            }
        var url                 = window.location.protocol + '//';
            url                += window.location.host + window.location.pathname ;
            url                += '?' + encodeURI(user);
            url                += '?' + encodeURI(screen);
            if ((typeof this.templates[screen])!='function') {
                this.log ('contextUrl(): "'+screen+'.hbs" not available');
                return false;
            }
        var obj                = {};
            try {
            var prms           = document.createElement ('div');
                prms.innerHTML = this.templates[screen] (this.data);
                prms           = this.qsa (prms,'form[data-history] input');
            }
            catch (e) {
                this.log ('contextUrl(): Handlebars says: '+e.message);
                return false;
            }
            try {
                for (var prm of prms) {
                    obj[prm.name] = this.parameters[prm.name];
                }
            }
            catch (e) {
                this.log ('contextUrl(): '+e.message);
                return false;
            }
            if (Object.keys(obj).length>0) {
                url            += '?' + this.objectToQuery(obj);
            }
            if (window.location.search.substr(-1)=='?') {
                url            += '?';
            }
        return url;
    }

    cookiesBeginning (prefix) {
    var matches             = {};
        if (prefix.length==0) {
            console.log ('cookiesBeginning(): no prefix given');
            return matches;
        }
    var c                   = document.cookie.split (';');
    var p                   = this.saveKey (prefix);
        if (p.length==0) {
            console.log ('cookiesBeginning(): no save key available');
            return matches;
        }
        for (var i=0;i<c.length;i++) {
        var v                   = c[i].split ('=');
        var key                 = decodeURIComponent (v[0].trim());
            if (key.indexOf(p)===0) {
                key             = key.substr (p.length);
                matches[key]    = decodeURIComponent (v[1].trim());
            }
        }
        return matches;
    }

    cookieExpire (key,val,exp) {
// Not working
return false;
    var date = new Date ();
        if (key.length==0) {
            console.log ('cookieExpire(): no key given');
            return false;
        }
    var k                   = this.saveKey (key);
        if (k.length==0) {
            return false;
        }
console.log ('cookieExpire(): '+k+'='+val+'; expires='+exp);
        document.cookie     = k+'='+val+'; expires='+exp;
        return true;
    }

    cookieRead (key) {
        if (key.length==0) {
            console.log ('cookieRead(): no key given');
            return '';
        }
    var c                   = document.cookie.split (';');
    var k                   = this.saveKey (key);
        if (k.length==0) {
            return '';
        }
        for (var i=0;i<c.length;i++) {
        var p               = c[i].split ('=');
            if (decodeURIComponent(p[0].trim())==k) {
                return decodeURIComponent(p[1].trim());
            }
        }
        return '';
    }

    cookieWrite (key,val) {
        if (key.length==0) {
            console.log ('cookieWrite(): no key given');
            return false;
        }
    var k                   = this.saveKey (key);
        if (k.length==0) {
            return false;
        }
        document.cookie     = encodeURIComponent(k) + '=' + encodeURIComponent(val);
        return true;
    }

    dataRefresh ( ) {
        this.data.currentScreen     = this.currentScreen;
        this.data.currentTemplates  = this.currentTemplates;
        this.data.currentInserts    = this.currentInserts;
        this.data.parameters        = this.parameters;
        this.data.currentUser       = this.currentUser;
        this.data.currentScreen     = this.currentScreen;
        this.data.currentUrl        = window.location.href;
    }

    datetimeNumeric (datetime) {
        return 1 * (datetime.replace(/T/g,'').replace(/-/g,'').replace(/ /g,'').replace(/:/g,''));
    }

    downloadHtml (html,templateName) {
    var url         = window.location.protocol;
        url        += window.location.hostname;
        url        += window.location.pathname.substring (0,window.location.pathname.lastIndexOf('/'));
    var datetime    = new Date ();
        datetime    = datetime.toISOString().split ('T');
        datetime[1] = datetime[1].substring (0,datetime[1].lastIndexOf('.'));
    var html        = this.templates[templateName] (
            {
                date : datetime[0],
                time : datetime[1],
                url : url,
                html : html
            }
        );
    var link        = this.downloadLink (
            'Here is your download'
           ,templateName+'-'+datetime[0]+'.html'
           ,'text/html'
           ,html
        );
        return link;
    }

    downloadLink (linkText,fileName,fileType,fileContents,immediate=false) {
    var link                        = document.createElement ('a');
        link.innerHTML              = this.escapeForHtml (linkText);
        link.setAttribute ('download',fileName);
        link.setAttribute ('type',fileType);
        link.setAttribute ('href',URL.createObjectURL(new Blob([fileContents])));
        if (immediate) {
            document.body.appendChild (link);
            link.click ();
            document.body.removeChild (link);
            return;
        }
        link.addEventListener ('click',this.downloadLinkRemove.bind(this));
        return link;
    }

    downloadLinkRemove (evt) {
        if (!evt.currentTarget.parentElement) {
            return;
        }
        evt.currentTarget.parentElement.removeChild (evt.currentTarget);
    }

    editModeHelp ( ) {
        this.statusShow ('Not in edit mode; use the pen icon');
    }

    editModeReset ( ) {
    var toggle                      = this.qs (this.restricted,'#edit-mode');
        if (!toggle) {
            return;
        }
        if (!this.editModeHelper) {
            this.editModeHelper     = this.editModeHelp.bind (this);
        }
        if (!this.editModeToggler) {
            this.editModeToggler    = this.editModeToggle.bind (this);
        }
        toggle.removeEventListener ('click',this.editModeToggler);
        toggle.addEventListener ('click',this.editModeToggler);
    var forms                       = this.qsa (this.restricted,'form[data-editmode]');
        if (!forms.length) {
            return;
        }
        for (var form of forms) {
            if (form.classList.contains('masked') && form.nextElementSibling) {
                if (form.nextElementSibling.classList.contains('mask')) {
                    form.nextElementSibling.addEventListener ('click',this.editModeHelper);
                    form.nextElementSibling.classList.add ('active');
                }
            }
            for (var elmt of form.elements) {
                if (this.inhibitByDisable(elmt)) {
                    elmt.setAttribute ('disabled','disabled');
                    continue;
                }
                elmt.setAttribute ('readonly','readonly');
            }
        }
        if (this.editModeScreen!=this.currentScreen) {
            this.editMode           = false;
        }
        this.editModeScreen         = this.currentScreen;
        if (!this.editMode) {
            return;
        }
        this.editMode               = false;
        toggle.click ();
    }

    editModeToggle (evt) {
    var forms               = this.qsa (this.restricted,'form[data-editmode]');
        if (this.editMode) {
            for (var form of forms) {
                if (form.classList.contains('masked') && form.nextElementSibling) {
                    if (form.nextElementSibling.classList.contains('mask')) {
                        form.nextElementSibling.addEventListener ('click',this.editModeHelper);
                        form.nextElementSibling.classList.add ('active');
                    }
                }
                form.classList.remove ('edit-mode');
                for (var elmt of form.elements) {
                    if (this.inhibitByDisable(elmt)) {
                        elmt.setAttribute ('disabled','disabled');
                        continue;
                    }
                    elmt.setAttribute ('readonly','readonly');
                }
            }
            evt.currentTarget.classList.remove ('on');
            this.editMode   = false;
        }
        else {
            for (var form of forms) {
                if (form.classList.contains('masked') && form.nextElementSibling) {
                    if (form.nextElementSibling.classList.contains('mask')) {
                        form.nextElementSibling.removeEventListener ('click',this.editModeHelper);
                        form.nextElementSibling.classList.remove ('active');
                    }
                }
                form.classList.add ('edit-mode');
                for (var elmt of form.elements) {
                    if ('prohibit' in elmt.dataset) {
                        continue;
                    }
                    if (this.inhibitByDisable(elmt)) {
                        elmt.removeAttribute ('disabled');
                        continue;
                    }
                    elmt.removeAttribute ('readonly');
                }
            }
            evt.currentTarget.classList.add ('on');
            this.editMode   = true;
        }
    }

    elementInView (elmt) {
    var rect = elmt.getBoundingClientRect ();
        if (rect.left<0) {
            return false;
        }
        if (rect.top<0) {
            return false;
        }
        if (rect.right>window.innerWidth) {
            return false;
        }
        if (rect.bottom>window.innerHeight) {
            return false;
        }
        return true;
    }

    async entryAdd (form) {
    var item            = {};
    var columns         = {};
    var parameters      = [];
    var count           = 0;
        for (var elmt of form.elements) {
            if (!elmt.dataset.column) {
                console.log ('entryAdd(): ignoring form element '+elmt.name+' which has no data-column');
                continue;
            }
            count++;
            if (elmt.type=='checkbox') {
                if (inputElmt.checked) {
                    columns[elmt.dataset.column]    = 1;
                    item[elmt.name]                 = 1;
                }
                else {
                    columns[elmt.dataset.column]    = 0;
                    item[elmt.name]                 = 0;
                }
            }
            else {
                columns[elmt.dataset.column]        = elmt.value;
                item[elmt.name]                     = elmt.value;
            }
            if (elmt.dataset.parameter) {
                parameters.push ([[elmt.dataset.parameter],item[elmt.name]]);
            }
        }
        if (!count) {
            throw new Error ('Form has no data columns');
            return false;
        }
        try {
            console.log ('entryAdd(): getting data for entry');
        var data        = this.entryData (form);
        }
        catch (e) {
            throw new Error (`Could not identify local data: ${e.message}`);
            return false;
        }
        try {
        var autoValue   = await this.insert (form.dataset.table,columns);
            this.statusShow ('Data added successfully');
        }
        catch (e) {
            if (this.errorSplit(e.message).hpapiCode==219) {
                this.splash (2,'Record already exists - is this a deleted item?','Error','OK');
                throw new Error (e.message);
                return false;
            }
            if (('splash' in e) && e.splash.length>0) {
                for (var i=0;i<e.splash.length;i++) {
                    this.splash (2,e.splash[i],'Server message','OK');
                }
            }
            else {
                this.splash (2,e.message,'Server error','OK');
            }
            throw new Error (e.message);
            return false;
        }
    var primaries       = this.qs (form,'[data-primaries]');
        primaries       = primaries.content.cloneNode (true);
        primaries       = this.qsa (primaries,'input');
        console.log ('Found '+primaries.length+' primary keys');
        for (var primary of primaries) {
            if (!primary.name) {
                console.log ('Primary key has no name');
                continue;
            }
            if (primary.hasAttribute('data-autoinc') && autoValue) {
                console.log ('Writing auto-increment primary parameter '+primary.name+'='+autoValue);
                this.parameterWrite (primary.name,autoValue);
                continue;
            }
            console.log ('Writing primary parameter '+primary.name+'='+item[primary.name]);
            this.parameterWrite (primary.name,item[primary.name]);
        }
        for (var i=0;parameters[i];i++) {
            console.log ('Writing input parameter '+parameters[i][0]+'='+parameters[i][1]);
            this.parameterWrite (parameters[i][0],parameters[i][1]);
        }
        if (data && (typeof data.unshift)==='function') {
            data.unshift (item);
        }
        else {
            console.log ('entryAdd(): subset of this.data was not identified from data-keys');
        }
        return true;
    }

    entryAddReset (form) {
        form.classList.remove ('visible');
        form.reset ();
    }

    entryAddToggle (evt) {
    var form = this.qs (evt.currentTarget.parentElement,'form[data-add]');
        if (!form) {
            return;
        }
        if (form.classList.contains('visible')) {
            this.entryAddReset (form);
            return;
        }
        form.classList.add ('visible');
    }

    async entryBlur (evt) {
        this.entrySave (evt.currentTarget);
    }

    entryChange (inputElmt) {
        try {
        console.log ('entryChange(): getting data for entry');
        var data                    = this.entryData (inputElmt);
        }
        catch (e) {
            console.log ('entryChange(): '+e.message);
        }
        try {
            if (this.equals(data[inputElmt.name],inputElmt.value)) {
                inputElmt.classList.remove ('no-sync');
                return false;
            }
            inputElmt.classList.add ('no-sync');
            return true;
        }
        catch (e) {
            console.log ('entryChange(): '+e.message);
        }
    }

    entryData (formOrInputElmt) {
    var form                        = formOrInputElmt;
    var inputElmt                   = null;
    if (form.tagName.toLowerCase()!='form') {
        inputElmt                   = formOrInputElmt;
        form                        = inputElmt.form;
    }
    var data                        = this.data;
    var keys                        = this.qs (form,'[data-keys]');
        if (!keys) {
            console.log ('entryData(): ignoring form containing no data-keys');
            return false;
        }
        keys                        = keys.content.cloneNode (true);
        keys                        = this.qsa (keys,'[data-key]');
        console.log ('Found '+keys.length+' data keys');
        for (var key of keys) {
            if (!key.dataset.key || !(key.dataset.key in data)) {
                throw new Error ('Key "'+key.dataset.key+'" not found in data');
                return false;
            }
            data                    = data[key.dataset.key];
        }
        if (!inputElmt) {
            return data;
        }
        if (!inputElmt.name) {
            throw new Error ('Input has no name attribute');
            return false;
        }
        if (!(inputElmt.name in data)) {
            throw new Error ('Property "'+inputElmt.name+'" not found in data');
            return false;
        }
        return data;
    }

    async entryKeyup (evt) {
        if (evt.currentTarget.form.hasAttribute('data-add')) {
            if (evt.key=='Escape') {
                this.entryAddReset (evt.currentTarget.form);
                return;
            }
            return;
        }
        if (evt.key=='Escape') {
            this.entryRevert (evt.currentTarget);
            return;
        }
        if (evt.key=='Enter' && evt.currentTarget.tagName.toLowerCase()!='textarea') {
            evt.currentTarget.blur ();
            return;
        }
        this.entryChange (evt.currentTarget);
    }

    entryListen (targetElmt) {
        // Data insertion expander button
    var buttons              = this.qsa (targetElmt,'button.new');
        for (var button of buttons) {
            button.addEventListener ('click',this.entryAddToggle.bind(this));
            // Insert forms
        var form             = this.qs (button.parentElement,'form[data-add]');
            if (!form) {
                continue;
            }
            if (!form.dataset.table) {
                console.log ('entryListen(): insert form attribute data-table has no value');
                continue;
            }
            console.log ('entryListen(): found insert form for table "'+form.dataset.table+'"');
        }
        // Update forms
    var forms                = this.qsa (targetElmt,'form[data-update]');
        for (var form of forms) {
            if (!form.dataset.table) {
                console.log ('entryListen(): update form attribute data-table has no value');
                continue;
            }
            console.log ('entryListen(): found update form for table "'+form.dataset.table+'"');
        var fields           = this.qsa (form,'[data-column]');
            for (var field of fields) {
                console.log ('entryListen(): found <'+field.tagName+'>');
                if (field.type=='checkbox' || field.type=='checkbox') {
                    field.addEventListener ('click',this.entrySelect.bind(this));
                    continue;
                }
                if (field.tagName.toLowerCase()=='select') {
                    field.addEventListener ('change',this.entrySelect.bind(this));
                    continue;
                }
                field.addEventListener ('keyup',this.entryKeyup.bind(this));
                field.addEventListener ('blur',this.entryBlur.bind(this));
            }
        }
    }

    entryNew ( ) {
        try {
            this.qs (this.restricted,'button.new').click ();
            this.entryNext ();
        }
        catch (e) {
            console.log ('entryNew(): no new form button');
        }
    }

    entryNext ( ) {
    var elmt = document.activeElement;
        if ('form' in elmt && elmt.form) {
        var next = this.formElementNext (elmt);
            if (next) {
                next.scrollIntoView (
                    {
                        behavior : 'smooth',
                        block    : 'center'
                    }
                );
                next.focus ();
                next.select ();
                return;
            }
        }
    var form = this.formNext (elmt);
        if (!form) {
            return;
        }
        for (var i=0;form.elements[i];i++) {
            if (form.elements[i].type=='hidden') {
                continue;
            }
            break;
        }
        form.elements[i].scrollIntoView (
            {
                behavior : 'smooth',
                block    : 'center'
            }
        );
        form.elements[i].focus ();
        if (form.elements[i].select) {
            form.elements[i].select ();
        }
    }

    entryPrevious ( ) {
    var elmt = document.activeElement;
        if ('form' in elmt && elmt.form) {
        var prev = this.formElementPrevious (elmt);
            if (prev) {
                prev.scrollIntoView (
                    {
                        behavior : 'smooth',
                        block    : 'center'
                    }
                );
                prev.focus ();
                if (prev.select) {
                    prev.select ();
                }
                return;
            }
        }
    var form = this.formPrevious (elmt);
        if (!form) {
            return;
        }
        for (var i=form.elements.length-1;form.elements[i];i--) {
            if (form.elements[i].type=='hidden') {
                continue;
            }
            break;
        }
        form.elements[i].scrollIntoView (
            {
                behavior : 'smooth',
                block    : 'center'
            }
        );
        form.elements[i].focus ();
        if (form.elements[i].select) {
            form.elements[i].select ();
        }
    }

    entryPrimaries (inputElmt) {
    var primaries                   = {};
    var elmts                       = this.qsa (inputElmt.form,'[data-primary]');
        console.log ('Found '+elmts.length+' primary keys');
        for (var elmt of elmts) {
            if (!elmt.dataset.column) {
                throw new Error ('<input data-primary data-column="column_name"> not found');
                return false;
            }
        var val                     = elmt.value;
            if (!val) {
                throw new Error ('<input data-primary data-column="column_name" value="tuple_value"> not found');
                return false;
            }
            primaries[elmt.dataset.column]     = val;
        }
        return primaries;
    }

    entryRevert (inputElmt) {
        try {
        console.log ('entryRevert(): getting data for entry');
        var data                    = this.entryData (inputElmt);
        }
        catch (e) {
            console.log ('entryRevert(): '+e.message);
        }
        if (inputElmt.tagName.toLowerCase()=='select') {
            inputElmt.selectedIndex = this.selectedIndex (inputElmt,data[inputElmt.name]);
            return true;
        }
        inputElmt.value             = data[inputElmt.name];
        inputElmt.classList.remove ('no-sync');
        return true;
    }

    async entrySave (inputElmt,suppressInteraction=false) {
        console.log ('entrySave(): getting data for entry');
        try {
        var data                    = this.entryData (inputElmt);
        }
        catch (e) {
            console.log ('entrySave(): '+e.message);
            return;
        }
        if (inputElmt.type=='checkbox') {
            if (inputElmt.checked) {
                if (data[inputElmt.name]) {
                    return;
                }
            var val                 = 1;
            }
            else {
                if (!data[inputElmt.name]) {
                    return;
                }
            var val                 = 0;
            }
        }
        else {
            if (this.equals(inputElmt.value,data[inputElmt.name])) {
                return;
            }
            var val                 = inputElmt.value;
            if (('nullable' in inputElmt.dataset) && val==='') {
                val                 = null;
            }
        }
        try {
        var primaries               = this.entryPrimaries (inputElmt);
        }
        catch (e) {
            console.log ('entrySave(): '+e.message);
            return;
        }
        if (!inputElmt.form.dataset.table) {
            console.log ('entrySave(): <form data-table="table_name"> not found');
            return;
        }
        if (!inputElmt.dataset.column) {
            console.log ('entrySave(): <input data-column="column_name"> not found');
            return;
        }
        try {
            await this.update (
                inputElmt.form.dataset.table
               ,inputElmt.dataset.column
               ,val
               ,primaries
            );
            if (suppressInteraction) {
                this.log ('Updated successfully');
            }
            else {
//                this.splash (0,'Updated successfully','Success','Continue');
                this.statusShow ('Field updated successfully');
            }
            data[inputElmt.name]    = val;
            if (inputElmt.type=='checkbox') {
                if (inputElmt.name=='deleted') {
                    if (inputElmt.checked) {
                        inputElmt.parentElement.classList.add ('deleted');
                        inputElmt.form.parentElement.classList.add ('deleted');
                    }
                    else {
                        inputElmt.parentElement.classList.remove ('deleted');
                        inputElmt.form.parentElement.classList.remove ('deleted');
                    }
                }
                else if (inputElmt.name=='active') {
                    if (inputElmt.checked) {
                        inputElmt.parentElement.classList.remove ('deleted');
                        inputElmt.form.parentElement.classList.remove ('deleted');
                    }
                    else {
                        inputElmt.parentElement.classList.add ('deleted');
                        inputElmt.form.parentElement.classList.add ('deleted');
                    }
                }
            }
            else {
                inputElmt.classList.remove ('no-sync');
            }
        }
        catch (e) {
            this.log ('Update error: '+e.message);
            if (!suppressInteraction) {
                if ('splash' in e) {
                    for (var i=0;i<e.splash.length;i++) {
                        this.splash (2,e.splash[i],'Server message','OK');
                    }
                }
                else {
                    this.splash (2,e.message,'Server error','OK');
                }
            }
            if (inputElmt.type=='checkbox') {
                if (val) {
                    inputElmt.checked = false;
                }
                else {
                    inputElmt.checked = true;
                }
                return;
            }
            this.entryRevert (inputElmt);
            return;
        }
        if (inputElmt.form.dataset.parameter) {
            this.parameterParse (inputElmt.form);
        }
/*
This looks unused
        if (inputElmt.form.dataset.insert) {
            console.log ('entrySave(): rendering insert "'+inputElmt.form.dataset.insert+'"');
            this.insertRender (inputElmt.form.dataset.insert,inputElmt.form.dataset.target);
            return;
        }
*/
        if (inputElmt.form.dataset.screen) {
            console.log ('entrySave(): rendering screen "'+inputElmt.form.dataset.screen+'"');
            this.screenRender (inputElmt.form.dataset.screen);
            return;
        }
    }

    async entrySelect (evt) {
        this.entrySave (evt.currentTarget);
    }

    equals (a,b) {
        // For loose comparison of JSON values with HTML form values
        // These are equal: "0"==0, "0.1"==0.10, ""==null
        // These are not: "0"!="" 0!=""
        if (a===null) {
            a = '';
        }
        if (b===null) {
            b = '';
        }
        a = String (a);
        b = String (b);
        if (a===b) {
            return true;
        }
        if (!a.length || !b.length) {
            return false;
        }
        a = Number (a);
        if (a=='NaN') {
            return false;
        }
        b = Number (b);
        if (b=='NaN') {
            return false;
        }
        if (a===b) {
            return true;
        }
        return false;
    }

    escapeForHtml (str) {
    var ele                     = document.createElement ('p');
    var txt                     = document.createTextNode (str);
        ele.appendChild (txt);
        return ele.innerHTML;
    }

    fileRead (file,type) {
        return new Promise (
            function (succeeded,failed) {
                if (file.type!=type) {
                    failed (new Error ('File name '+file.name+' is inconsistent with MIME type '+type));
                    return;
                }
            var reader                  = new FileReader ();
                reader.onerror          = function ( ) {
                    failed (new Error('Could not read file '+file.name));
                }
                reader.onload           = function ( ) {
                    succeeded (reader.result);
                };
                reader.readAsText (file);
            }
        );
    }

    filter (evtOrForm) {
    var form;
        if (evtOrForm instanceof HTMLFormElement) {
            form    = evtOrForm;
        }
        else {
            if (('key' in evtOrForm.currentTarget) && evtOrForm.currentTarget.key.length!=1) {
                return;
            }
            form    = evtOrForm.currentTarget.form;
        }
    var items       = this.qsa (document,form.dataset.selector);
    var mesh        = form.elements;
    var count       = 0;
        for (var n=0;items[n];n++) {
        var show    = true;
            meshes:
            for (var i=0;mesh[i];i++) {
                if ('deleted' in mesh[i].dataset) {
                    if (mesh[i].value=='N' && items[n].classList.contains('deleted')) {
                        show = false;
                        break meshes;
                    }
                    if (mesh[i].value=='Y' && !items[n].classList.contains('deleted')) {
                        show = false;
                        break meshes;
                    }
                }
                else if ('warning' in mesh[i].dataset) {
                    if (mesh[i].checked) {
                    var warnings = this.qsa (items[n],'.warning');
                        if (warnings.length==0) {
                            show = false;
                            break meshes;
                        }
                    }
                }
                else if ('is' in mesh[i].dataset) {
                    if (!mesh[i].checked) {
                    var is = this.qs (items[n],'[data-is='+mesh[i].dataset.is+']');
                        if (is) {
                            show = false;
                            break meshes;
                        }
                    }
                }
                else if ('freetext' in mesh[i].dataset) {
                    if (mesh[i].value.trim().length>0) {
                    var terms = mesh[i].value.trim().toLowerCase().split (' ');
                        for (var j=0;terms[j];j++) {
                            if (terms[j].length && items[n].textContent.toLowerCase().indexOf(terms[j])<0) {
                                show = false;
                                break meshes;
                            }
                        }
                    }
                }
                else if (mesh[i].value.trim().length) {
                    if (!('match' in mesh[i].dataset) || mesh[i].dataset.match.length==0) {
                        console.log ('filter(): filter input '+(i+1)+' has no usable filter settings');
                        continue;
                    }
                    show = false;
                var matches = this.qsa (items[n],'[data-match='+mesh[i].dataset.match+']');
                    for (var j=0;matches[j];j++) {
                        if (matches[j].textContent.toLowerCase().indexOf(mesh[i].value.trim().toLowerCase())>=0) {
                            show = true;
                            break;
                        }
                    }
                    if (!show) {
                        break;
                    }
                    continue;
                }
            }
            if (show) {
                items[n].classList.remove ('filtered-out');
                count++;
            }
            else {
                items[n].classList.add ('filtered-out');
            }
        }
    var status      = this.qs (form,'.status');
        if (status) {
            status.innerHTML = count+' results';
        }
        window.scrollTo (0,0);
    }

    filterHotkeyToggle ( ) {
    var filters     = this.qsa (this.restricted,'span.filter');
        // Target last filter found
    var filter      = null;
        for (var f of filters) {
            filter  = f;
        }
        if (!filter) {
            return;
        }
    var toggler     = this.qs (filter.parentElement,'a.filter');
        if (!toggler) {
            return;
        }
        toggler.click ();
    }

    filterReset (evt) {
        evt.currentTarget.parentElement.parentElement.reset ();
        this.filter (evt.currentTarget.parentElement.parentElement);
        if (!this.filterScroll) {
            return;
        }
        document.documentElement.scrollLeft     = this.filterScroll.x;
        document.documentElement.scrollTop      = this.filterScroll.y;
    }

    filterToggle (evt) {
    var filter                                  = evt.currentTarget.parentElement;
    var form                                    =  this.qs (filter,'form');
        if (filter.classList.contains('expanded')) {
            filter.classList.remove ('expanded');
            form.reset ();
            this.filter (form);
            document.documentElement.scrollLeft = this.filterScroll.x;
            document.documentElement.scrollTop  = this.filterScroll.y;
            return;
        }
        this.filterScroll = {
            x : document.documentElement.scrollLeft,
            y : document.documentElement.scrollTop
        };
        filter.classList.add ('expanded');
    var search                                  = this.qs (form,'[data-freetext]');
        if (search) {
            search.select ();
        }
    }

    filtersListen (targetElmt) {
    var filters                     = this.qsa (targetElmt,'span.filter');
        for (var filter of filters) {
        var expander                = this.qs (filter,'a.filter');
            if (expander) {
                expander.addEventListener ('click',this.filterToggle.bind(this));
            }
        var resetter                = this.qs (filter,'a.reset');
            if (resetter) {
                resetter.addEventListener ('click',this.filterReset.bind(this));
            }
        var form                    = this.qs (filter,'form');
            this.filter (form);
            for (var i=0;form.elements[i];i++) {
                form.elements[i].addEventListener ('keyup',this.filter.bind(this));
                form.elements[i].addEventListener ('change',this.filter.bind(this));
            }
        }
    }

    find (arrayOfObjects,key,val,strict=true) {
        for (var i=0;i<arrayOfObjects.length;i++) {
            if (strict && arrayOfObjects[i][key]===val) {
                return arrayOfObjects[i];
            }
            if (!strict && arrayOfObjects[i][key]==val) {
                return arrayOfObjects[i];
            }
        }
        return false;
    }

    formElementNext (elmt) {
        // Next form element
    var elmts       = elmt.form.elements;
    var found       = false;
        for (var e of elmts) {
            if (e.type=='hidden') {
                continue;
            }
            if (found) {
                return e;
            }
            if (e==elmt) {
                found = true;
            }
        }
        return false;
    }

    formElementPrevious (elmt) {
        // Previous form element
    var elmts       = elmt.form.elements;
    var previous    = false;
        for (var e of elmts) {
            if (e.type=='hidden') {
                continue;
            }
            if (e==elmt) {
                return previous;
            }
            previous = e;
        }
        return false;
    }

    formNext (node) {
        // Next non-empty form after this element
        if (node==document.body) {
            node = this.restricted;
        }
        while (node!=this.restricted) {
        var nodes           = node.parentNode.childNodes;
        var found           = false;
            for (var n=0;nodes[n];n++) {
                if (nodes[n]==node) {
                    found   = true;
                    continue;
                }
                if (nodes[n].nodeType!=Node.ELEMENT_NODE) {
                    continue;
                }
                if (!found) {
                    continue;
                }
            var forms       = this.qsa (nodes[n],'form');
                for (var f=0;forms[f];f++) {
                    if (forms[f].elements.length) {
                        return forms[f];
                    }
                }
            }
            node            = node.parentNode;
        }
        // No form after element so first form
    var forms               = this.qsa (this.restricted,'form');
        for (var f of forms) {
            if (f.elements.length) {
                return f;
            }
        }
        return false;
    }

    formPrevious (node) {
        // Previous non-empty form before this element
        if (node==document.body) {
            node = this.restricted;
        }
        while (node!=this.restricted) {
        var nodes           = node.parentNode.childNodes;
            for (var n=0;nodes[n];n++) {
                if (nodes[n]==node) {
                    break;
                }
                if (nodes[n].nodeType!=Node.ELEMENT_NODE) {
                    continue;
                }
            var forms       = this.qsa (nodes[n],'form');
                for (var f=0;forms[f];f++) {
                    if (forms[f].elements.length) {
                        return forms[f];
                    }
                }
            }
            node            = node.parentNode;
        }
        // No form before element so last form
    var forms               = this.qsa (this.restricted,'form');
    var form                = false;
        for (var f of forms) {
            if (f.elements.length) {
                form        = f;
            }
        }
        return form;
    }

    async formSubmit (evt) {
        evt.preventDefault ();
    var target = evt.currentTarget;
        if (!target.dataset.table) {
            console.log ('formSubmit(): no action - form has no data-table');
            return;
        }
        if (!target.hasAttribute('data-add')) {
            console.log ('formSubmit(): no action - form has no data-add');
            return;
        }
        console.log ('formSubmit(): adding data');
/*
        if (!confirm('Are you sure?')) {
            return;
        }
*/
        try {
            await this.entryAdd (target);
        }
        catch (e) {
            return false;
        }
        this.entryAddReset (target);
        if (target.dataset.next) {
            await this.screenRender (target.dataset.next,null,true,target.dataset.bounce);
        }
    }

    ga (elmt,name) {
    // Get attribute by id or element
        try {
            return this.ge(elmt).getAttribute (name);
        }
        catch (e) {
            throw new Error (e.message);
            return null;
        }
    }

    ge (id) {
    // Get element by id or element
        if (id instanceof HTMLElement) {
            return id;
        }
        try {
            this.qs (document,'#'+id);
        }
        catch (e) {
            throw new Error (e.message);
            return null;
        }
    }

    getPosition (options) {
        return new Promise (
            function (succeeded,failed) {
                navigator.geolocation.getCurrentPosition (succeeded,failed,options);
            }
        );
    }

    globalLoad ( ) {
        if ('globalLoaded' in this) {
            return true;
        }
        // Warn before leaving the app
        window.addEventListener ('beforeunload',this.unloadHandle.bind(this));
        // Handle browser back/formward buttons
        window.addEventListener ('popstate',this.historyHandle.bind(this));
        window.name                     = 'w-' + Date.now();
        this.loginTried                 = 0;
        this.loggedOut                  = 1;
        this.handlebarsHelpers ();
        this.access                     = this.qs (document,'#gui-access');
        this.restricted                 = this.qs (document,'#gui-restricted');
        this.restricted.style.display   = 'none';
        this.status                     = this.qs (document,'#gui-status');
        if (this.cfg.inBodyLoggerId) {
            this.logger                 = this.loggerCreate (this.cfg.inBodyLoggerId);
        }
        else {
            if (window.location.search.substr(-1)=='?') {
                console                 = {};
                console.log             = function () {};
                console.table           = function () {};
            }
        }
        this.saveScope                  = '';
    var q                               = window.location.search.substr(1).split('?');
        this.urlUser                    = decodeURI (q[0]);
        this.urlScreen                  = null;
        this.urlParameters              = {};
        if (q.length>1) {
            this.urlScreen              = decodeURI (q[1]);
            if (q.length>2) {
                this.urlParameters      = this.objectFromQuery (q[2]);
            }
        }
        try {
            window.localStorage.setItem ('test','Test');
            window.localStorage.removeItem ('test');
            this.storage                = window.localStorage;
            this.log ('Using local storage');
        }
        catch (e) {
            if (this.cfg.enforceLocalStorage) {
                throw new Error ('window.localStorage is not available');
                return false;
            }
            else {
                try {
                    window.sessionStorage.setItem ('test','Test');
                    window.sessionStorage.removeItem ('test');
                    this.storage        = window.sessionStorage;
                    this.log ('Falling back on session storage');
                }
                catch (e) {
                    throw new Error ('window.sessionStorage is not available');
                    return false;
                }
            }
        }
        this.hotkeyListen ();
        this.queueInit ();
        this.contexts                   = {};
    var cm                              = this.qs (document,'#gui-context');
        if (cm) {
            cm.addEventListener ('click',this.contextHandle.bind(this));
        }
        this.globalLoaded               = true;
    }

    handlebarsHelpers ( ) {
    var equalsFn = this.equals;
        Handlebars.registerHelper (
            'centsToUnits',
            function (cents,prefix) {
            var centsInt = parseInt (cents);
                if (centsInt!=cents) {
                    return cents;
                }
                return prefix + (centsInt/100).toFixed(2);
            }
        );
        Handlebars.registerHelper (
            'concat',
            function (a,b) {
                return '' + a + b;
            }
        );
        Handlebars.registerHelper (
            'csvIncludes',
            function (csv,match,opts) {
                csv = csv.split (',');
                for (var i=0;csv[i]!==undefined;i++) {
                    if (csv[i]===(''+match)) {
                        return opts.fn (this);
                    }
                }
                return opts.inverse (this);
            }
        );
        Handlebars.registerHelper (
            'dateReadable',
            function (dt) {
            var dt = new Date (dt);
                return dt.toDateString ();
            }
        );
        Handlebars.registerHelper (
            'eachReverse',
            function (context) {
            var options     = arguments[arguments.length - 1];
            var rtn         = '';
                if (!context || context.length==0) {
                    return options.inverse (this);
                }
                for (var i=context.length-1;i>=0;i--) {
                    rtn    += options.fn (context[i]);
                }
                return rtn;
            }
        );
        Handlebars.registerHelper (
            'equals',
            function (a,b,opts) {
                if (equalsFn(a,b)) {
                    return opts.fn (this);
                }
                return opts.inverse (this);
            }
        );
        Handlebars.registerHelper (
            'found',
            function (arr,k,v,opts) {
                if (!arr) {
                    return opts.inverse (this);
                }
                for (var i=0;arr[i];i++) {
                    if (k==='' && arr[i]===v) {
                        return opts.fn (this);
                    }
                    if (k!=='' && arr[i][k]===v) {
                        return opts.fn (this);
                    }
                }
                return opts.inverse (this);
            }
        );
        Handlebars.registerHelper (
            'foundAvailable',
            function (arr,k,v,opts) {
                if (!arr) {
                    return opts.inverse (this);
                }
                for (var i=0;arr[i];i++) {
                    if (k==='' && arr[i]===v && !arr[i].deleted) {
                        return opts.fn (this);
                    }
                    if (k!=='' && arr[i][k]===v && !arr[i].deleted) {
                        return opts.fn (this);
                    }
                }
                return opts.inverse (this);
            }
        );
        Handlebars.registerHelper (
            'greater',
            function (a,b,opts) {
                if (a>b) {
                    return opts.fn (this);
                }
                return opts.inverse (this);
            }
        );
        Handlebars.registerHelper (
            'greaterOrEqual',
            function (a,b,opts) {
                if (a>=b) {
                    return opts.fn (this);
                }
                return opts.inverse (this);
            }
        );
        Handlebars.registerHelper (
            'hasProperties',
            function (o,opts) {
                if (o===null) {
                    return opts.inverse (this);
                }
                if (typeof o=='object') {
                    return opts.fn (this);
                }
                return opts.inverse (this);
            }
        );
        Handlebars.registerHelper (
            'hmsToHm',
            function (hms) {
                hms = hms.split (':');
                hms.pop ();
                return hms.join (':');
            }
        );
        Handlebars.registerHelper (
            'toLowerCase',
            function (str) {
                if (!str) {
                    return '';
                }
                return str.toLowerCase ();
            }
        );
        Handlebars.registerHelper (
            'toUpperCase',
            function (str) {
                if (!str) {
                    return '';
                }
                return str.toUpperCase ();
            }
        );
        Handlebars.registerHelper (
            'unixToUtc',
            function (ts) {
            var dt = new Date (ts*1000);
                return dt.toUTCString ();
            }
        );
    }

    historyHandle (evt) {
        if (!window.history.state) {
console.log ('NO STATE');
            return;
        }
        console.log ('SETTING STATE '+JSON.stringify(window.history.state),null,'    ');
    var params = Object.keys (window.history.state.parameters);
        for (var i=0;i<params.length;i++) {
            this.parameterWrite (params[i],window.history.state.parameters[params[i]]);
        }
        this.screenRender (window.history.state.screen,null,false);
    }

    hotkeyEvent (evt) {
        if (evt.key=='Control') {
            return;
        }
        if (!evt.ctrlKey) {
            return;
        }
    var func = this.hotkeyFunction(evt.key).bind (this);
        func (evt);
    }

    hotkeyFunction (key) {
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) {
            return this.hotkeyNavigate;
        }
    var keys = this.hotkeys ();
        if (!(key in keys)) {
            return function(){};
        }
        if ((typeof keys[key][0])!='function') {
            return function(){};
        }
        return keys[key][0];
    }

    hotkeyListen ( ) {
        document.body.addEventListener ('keydown',this.hotkeyEvent.bind(this));
    }

    hotkeyNavigate (evt) {
        evt.preventDefault ();
    var elmt        = document.activeElement;
        if (!elmt) {
            elmt    = this.qs (this.restricted,'nav.navigator');
        }
    var selectRow   = 'nav, .nugget:has(a.navigator, button.navigator)';
    var selectNav   = 'a.navigator, button.navigator';
    var navs        = [];
    var forward     = false;
        if (['ArrowDown','ArrowRight'].includes(evt.key)) {
            forward = true;
        }
    var row         = elmt.closest (selectRow);
        if (!row) {
            row         = this.hotkeyNavigateClosest (elmt,forward,selectRow);
            if (!row) {
                console.log ('hotkeyNavigate(): row not found');
                return;
            }
        }
        row.classList.add ('hotkey-focus');
    var navs        = this.qsa (row,selectNav);

        if (!navs.length || ['ArrowUp','ArrowDown'].includes(evt.key)) {
            row     = this.hotkeyNavigateRow (elmt,forward);
        }
        if (!row) {
            return;
        }
        
        if (!['ArrowLeft','ArrowRight'].includes(evt.key)) {
            return;
        }
        if (evt.key=='ArrowRight') {
        }
    var row         = this.elementNearest (elmt,'nav.navigator,div.nugget',evt.key);
    }

    hotkeys ( ) {
        // Override this in an extension class
        return {
            "#" : [ this.hotkeysShow, "(~) show hot keys" ]
        }
    }

    hotkeysShow ( ) {
    var keys        = this.hotkeys ();
    var str         = '';
        for (var key in keys) {
             str   += "Ctrl " + key.padEnd(12) + " --> " + keys[key][1] + "\n";
        }
        str        += "Ctrl Up/down      --> select item row\n";
        str        += "Ctrl Left/Right   --> select navigation item\n";
        alert (str);
    }

    inhibitByDisable (elmt) {
        if (['select','button'].includes(elmt.tagName.toLowerCase())) {
            return true;
        }
        if (['checkbox','radio','submit'].includes(elmt.getAttribute('type'))) {
            return true;
        }
        return false;
    }

    async insert (tableName,columns) {
    var request     = {
            "email" : this.access.email.value
           ,"method": {
                "vendor": "whitelamp-uk"
               ,"package": "hpapi-utility"
               ,"class": "\\Hpapi\\Utility"
               ,"method": "insert"
               ,"arguments": [
                    tableName
                   ,columns
                ]
            }
        }
        try {
        var response = await this.request (request);
            return response.returnValue;
        }
        catch (e) {
        var err      = new Error (e.message);
            if ('splash' in e) {
                err.splash = e.splash;
            }
            console.log ('insert(): '+e.message);
            throw err;
            return false;
        }
    }

    insertControl (targetElement) {
    var closers = this.qsa (targetElement,'[data-close]');
        for (var i=closers.length;i>0;i--) {
            closers[i-1].addEventListener ('click',function(){ targetElement.innerHTML=''; });
            closers[i-1].focus ();
        }
    var maximisers = this.qsa (targetElement,'[data-maximise]');
        for (var m of maximisers) {
            m.addEventListener (
                'click',
                function ( ) {
                    if (targetElement.classList.contains('minimised')) {
                        targetElement.classList.remove ('minimised');
                        this.scrollToScoped (targetElmt);
                        return;
                    }
                    if (targetElement.classList.contains('maximised')) {
                        targetElement.classList.remove ('maximised');
                        return;
                    }
                    targetElement.classList.add ('maximised');
                }
            );
        }
    var minimisers = this.qsa (targetElement,'[data-minimise]');
        for (var m of minimisers) {
            m.addEventListener (
                'click',
                function ( ) {
                    if (targetElement.classList.contains('minimised')) {
                        targetElement.classList.remove ('minimised');
                        this.scrollToScoped (targetElmt);
                        return;
                    }
                    targetElement.classList.add ('minimised');
                }
            );
        }
    }

    async insertHandle (evt) {
        // Generic insert handle/render
    var event   = evt;
    var target  = evt.currentTarget;
        if ('place' in target.dataset) {
            await this.placeSelect (target.parentElement,target.dataset.place);
        }
        if (('editmode' in target.dataset) && !this.editMode) {
            console.log ('Edit mode required but not active');
            return;
        }
        if (!target.dataset.insert) {
            console.log ('insertHandle(): #'+target.id+' data-insert has no value');
            return;
        }
        if (!target.dataset.target) {
            console.log ('insertHandle(): #'+target.id+' data-target has no value');
            return;
        }
        this.parameterParse (target);
        if (target.dataset.reload) {
            console.log ('insertHandle(): deleting template "'+target.dataset.insert+'.hbs"');
            delete this.templates[target.dataset.insert];
            console.log ('Deleted insert template "'+target.dataset.insert+'.hbs"');
            console.log ('Awaiting reload');
            await this.templateFetch (target.dataset.insert);
            this.log ('Template reloaded');
        }
        console.log ('insertHandle(): rendering "'+target.dataset.insert+'.hbs" into "#'+target.dataset.target+'"');
        evt.currentTargetWas = target;
        this.insertRender (target.dataset.insert,this.qs(document,'#'+target.dataset.target),event);
    }

    async insertRender (insert,containerElmt,evt=null) {
        if (!(insert in this.templates)) {
            this.log ('Insert "'+insert+'.hbs" is missing');
            return false;
        }
        console.log ('insertRender(): "'+insert+'"');
        document.body.classList.add ('wait');
    var target          = null;
        if (evt && evt.currentTargetWas) {
            target      = evt.currentTargetWas;
        }
    var preload     = await this.preload (target,'*');
        if (!preload) {
            console.log ('insertRender(): wildcard preloaders failed');
            document.body.classList.remove ('wait');
            return false;
        }
    var preload     = await this.preload (target,insert);
        if (!preload) {
            console.log ('insertRender(): preloaders for template='+insert+' failed');
            document.body.classList.remove ('wait');
            return false;
        }
        console.log ('insertRender(): rendering template "'+insert+'.hbs"');
        try {
            containerElmt.innerHTML = this.templates[insert] (this.data);
        }
        catch (e) {
            this.log ('Handlebars says: '+e.message);
            delete this.templates[insert];
            this.log ('Failed insert  template '+insert+'.hbs deleted');
            document.body.classList.remove ('wait');
            return false;
        }
        // Diagnostic
        if (!['tech','data','splash'].includes(insert)) {
            this.currentInserts.push (insert);
            if (!(insert in this.currentTemplates)) {
                this.currentTemplates[insert]     = {};
            }
            this.currentTemplates[insert].visited = true;
        }
        // Listen for block control elements
        this.insertControl (containerElmt);
        // Override loaders() to run methods after template is loaded
        this.loaders (evt,insert);
        // Set current date
        this.loadDateNow (containerElmt);
        // Listen for events on HTML status messages
        this.statusListen (containerElmt);
        // Listen for data entry field(s)
        this.entryListen (containerElmt);
        // Listen for splash messages
        this.splashListen (containerElmt);
        // Override actors() to add associated function event handlers for the template to your extension class
        this.actors (insert);
        // Pre-fetch templates
        this.prefetchers (containerElmt);
        // Listen for navigators
        this.navigatorsListen (containerElmt);
        // Listen for filter inputs
        this.filtersListen (containerElmt);
        // Form submit hook
    var forms = this.qsa (containerElmt,'form');
        for (var f=0;f<forms.length;f++) {
            forms[f].addEventListener ('submit',this.formSubmit.bind(this));
        }
        // Buffer up linked screens
    var screens = this.qsa (containerElmt,'[data-screen]');
        for (var s=0;s<screens.length;s++) {
            this.templateFetch (screens[s].dataset.screen);
        }
        // Buffer up linked inserts
    var inserts = this.qsa (containerElmt,'[data-insert]');
        for (var i=0;i<inserts.length;i++) {
            this.templateFetch (inserts[i].dataset.insert);
        }
        // Click auto-click elements
        this.clicks (containerElmt);
        // Scroll first scoped element into view and focus
    var scopedElmt =  this.scrollToScoped (containerElmt);
        if (scopedElmt) {
            scopedElmt.focus ();
        }
        // Done
        console.log ('insertRender(): finished template "'+insert+'"');
        document.body.classList.remove ('wait');
        return true;
    }

    loadCss (href,integrity) {
    var linkTag                     = document.createElement ('script');
        linkTag.setAttribute ('rel','stylesheet');
        linkTag.setAttribute ('href',href);
        linkTag.setAttribute ('integrity',integrity);
        document.head.appendChild (linkTag);
    }

    loadDateNow (targetElmt) {
    var today                       = this.today ();
    var elmts                       = this.qsa (targetElmt,'.date-now');
        for (var elmt of elmts) {
            elmt.value              = today;
        }
        return true;
    }

    loadJsIife (src,integrity) {
    var scriptTag                   = document.createElement ('script');
        scriptTag.setAttribute ('src',src);
        scriptTag.setAttribute ('integrity',integrity);
        document.head.appendChild (scriptTag);
    }

    loaders (evt,templateName) {
        // Use override method to run methods after template is rendered
        return true;
    }

    lock ( ) {
    var splash              = this.qs (document,'#gui-splash');
        splash.innerHTML    = this.templates['lock'] ();
        this.splashCount    = 0;
        splash.classList.add ('visible');
        this.qs(splash,'#lock-lock').addEventListener ('click',this.lockLock.bind(this));
        this.qs(splash,'#lock-log-out').addEventListener ('click',this.lockLogOut.bind(this));
    var cancel              = this.qs (splash,'button');
        cancel.addEventListener ('click',this.lockClose.bind(this));
        cancel.focus ();
    }

    lockClose (evt) {
    var splash              = evt.currentTarget.parentElement.parentElement;
        splash.innerHTML    = '';
        splash.classList.remove ('visible');
    }

    lockLock (evt) {
        this.lockClose (evt);
        this.screenLock ();
    }

    lockLogOut (evt) {
        this.authForget ();
        this.lockClose (evt);
        this.screenLock ();
    }

    logClear ( ) {
        if (!this.logger) {
            return;
        }
        this.logger.value = '';
    }

    log (str,label='') {
        if (!this.logger) {
            console.log (str);
            return;
        }
        if ((typeof str)=='function') {
            str = '[function]';
        }
        if ((typeof str)=='object') {
            str = JSON.stringify (this.logPrepare(str),null,'    ');
        }
        this.logger.value += label + ' ' + str + '\n';
    }

    loggerCreate (id) {
        this.restricted.classList.add ('with-logger');
        this.status.classList.add ('with-logger');
    var form = document.createElement ('form');
    var logr = document.createElement ('textarea');
        logr.setAttribute ('id',id);
        form.appendChild (logr);
        document.body.appendChild (form);
        return logr;
    }

    logReset ( ) {
        if (!this.logger) {
            console.clear ();
            return;
        }
        this.logger.value = '';
    }

    logPrepare (obj) {
        for (var prop in obj) {
            if ((typeof obj[prop])=='object') {
                obj[prop] = this.logPrepare (obj[prop]);
                continue;
            }
            if ((typeof obj[prop])=='function') {
                obj[prop] = '[function]';
                continue;
            }
        }
        return obj;
    }

    logSummary ( ) {
        if (!this.logger) {
            return;
        }
        this.log ('Screen, storage, data:');
    var str     = '  ';
        str    += this.currentScreen + '.hbs, ';
        str    += this.storageSpaceUsed() + ' B, ';
        str    += JSON.stringify(this.data).length + ' B';
        this.log (str);
    }

    logTable (vr) {
        if (!this.logger) {
            console.table (vr);
            return;
        }
        for (k in vr) {
            this.logger.value += k + ' = ' + vr[k] + '\n';
        }
    }

    navigators ( ) {
        // Override this method in extension class
        return {
            blocks : {
                "home" : {
                    scope : null,
                    templates : [
                    ]
                }
            },
            crumbs : {
                "home" : {
                    back : [
                    ],
                    forward : [
                    ]
                }
            }
        }
    }

    navigatorsElement (templateName) {
    var nav                         = document.createElement ('nav');
        nav.classList.add ('navigator');
        for (var i=0;this.cfg.navigatorOptions[i];i++) {
        var item                    = document.createElement ('a');
            item.classList.add (this.cfg.navigatorOptions[i]);
            item.addEventListener ('click',this[this.cfg.navigatorOptions[i]].bind(this));
            nav.appendChild (item);
        }
    var block                       = null;
    var navs                        = this.navigators ();
        for (blk in navs.blocks) {
            if (templateName in navs.blocks[blk].templates) {
                block = blk;
                break;
            }
        }
        if (!block) {
            return nav;
        }
    var crumbs                      = {};
        if (block in navs.crumbs) {
            for (var i=0;navs.crumbs[block].back[i];i++) {
            var blk                     = navs.crumbs[block].back[i];
                if (!(blk in navs.blocks)) {
                    console.log ('Block "'+blk+'" not in blocks [1]');
                    continue;
                }
                for (var template in navs.blocks[blk].templates) {
                    crumbs[template]    = {
                        type: 'back',
                        scope: navs.blocks[blk].scope,
                        name: navs.blocks[blk].templates[template],
                        selected: false
                    };
                }
            }
        }
        else {
            console.log ('Block "'+block+'" not in crumbs');
            return nav;
        }
        if (block in navs.blocks) {
            for (var template in navs.blocks[block].templates) {
                crumbs[template]        = {
                    type: 'this',
                    scope: navs.blocks[block].scope,
                    name: navs.blocks[block].templates[template],
                    selected: false
                };
                if (template==templateName) {
                    crumbs[template].selected = true;
                }
            }
        }
        else {
            console.log ('Block "'+block+'" not in blocks [2]');
            return nav;
        }
        for (var i=0;navs.crumbs[block].forward[i];i++) {
        var blk                     = navs.crumbs[block].forward[i];
            if (!(blk in navs.blocks)) {
                console.log ('Block "'+blk+'" not in blocks [3]');
                continue;
            }
            for (var template in navs.blocks[blk].templates) {
                crumbs[template]    = {
                    type: 'forward',
                    scope: navs.blocks[blk].scope,
                    name: navs.blocks[blk].templates[template],
                    selected: false
                };
            }
        }
        for (var template in crumbs) {
            if (crumbs[template].scope && !this.parameters[crumbs[template].scope]) {
                continue;
            }
        var button                  = document.createElement ('button');
            button.textContent      = this.escapeForHtml (crumbs[template].name);
            if (crumbs[template].selected) {
                button.setAttribute ('class','current-screen');
                if (this.cfg.forceTemplateLoad) {
                    button.setAttribute ('class','navigator current-screen');
                    button.dataset.screen = template;
                    button.dataset.reload = 1;
                }
                else {
                    button.setAttribute ('disabled','disabled');
                }
            }
            else {
                if (crumbs[template].type=='back') {
                    button.setAttribute ('class','navigator backtrail');
                }
                else {
                    button.setAttribute ('class','navigator forwardtrail');
                }
                button.dataset.screen = template;
            }
            nav.appendChild (button);
        }
        return nav;
    }

    navigatorsHandle (evt) {
        // Generic handle/render
        if (evt.currentTarget.dataset.insert) {
            console.log ('navigatorsHandle(): navigating to insert');
            this.insertHandle (evt);
            return;
        }
        if (evt.currentTarget.dataset.screen) {
            console.log ('navigatorsHandle(): navigating to screen');
            this.screenHandle (evt);
            return;
        }
        console.log ('navigatorsHandle(): #'+evt.currentTarget.id+' neither attribute data-insert nor data-screen');
    }

    navigatorsListen (targetElmt) {
    var navs                        = this.qsa (targetElmt,this.navigatorsSelector());
        for (var nav of navs) {
            nav.setAttribute ('contextmenu','gui-context');
            if (!nav.dataset.event) {
                nav.dataset.event   = 'click';
            }
            nav.addEventListener (nav.dataset.event,this.navigatorsHandle.bind(this));
            nav.addEventListener ('contextmenu',this.contextTargetHandle.bind(this));
        }
    }

    now ( ) {
    var d   = new Date ();
    var n   = d.getFullYear ();
        n  += '-' + (''+(d.getMonth()+1)).padStart(2,'0');
        n  += '-' + (''+d.getDate()).padStart(2,'0');
        n  += ' ' + (''+d.getHours()).padStart(2,'0');
        n  += ':' + (''+d.getMinutes()).padStart(2,'0');
        n  += ':' + (''+d.getSeconds()).padStart(2,'0');
        return n;
    }

    objectFromCsv (csv) {
        try {
        var ppp = Papa.parse (csv,this.cfg.papaparse.import);
            if (ppp.errors.length) {
                throw new Error ('Papa.parse(): {'+ppp.errors.join('}{')+'}');
                return false;
            }
            return ppp.data;
        }
        catch (e) {
            console.log ('objectFromCsv(): '+e.message);
            throw new Error ('File content could not be parsed as CSV');
            return false;
        }
    }

    objectFromMsExcel2003Xml (xml) {
    var parser              = new DOMParser ();
    var dom                 = parser.parseFromString (xml,"text/xml");
    var rows                = dom.getElementsByTagName ('Row');
        if (!rows.length) {
            throw new Error ('XML is either invalid or has no data');
            return false;
        }
    var data                = new Array ();
    var headings            = false;
        for (var row of rows) {
            if (!headings) {
            var headings    = this.objectFromMsExcel2003XmlHeadings (row);
                continue;
            }
        var obj             = this.objectFromMsExcel2003XmlRow (row,headings);
            if (!obj) {
                continue;
            }
            data.push (obj);
        }
        return data;
    }

    objectFromMsExcel2003XmlHeadings (row) {
    var headings                    = {};
    var cells                       = row.getElementsByTagName ('Cell');
    var count                       = -1;
        for (var cell of cells) {
            count++;
            try {
            var data                = cell.getElementsByTagName('Data')[0].childNodes[0].nodeValue.trim ();
                if (data.length>0) {
                    headings[data]  = count;
                }
            }
            catch (e) {
                console.log ('objectFromMsExcel2003XmlHeadings(): '+e.message);
                continue;
            }
        }
        for (var property in headings) {
            if (headings.hasOwnProperty(property)) {
                return headings;
            }
        }
        return false;
    }

    objectFromQuery (qString) {
        qString                             = decodeURI (qString);
    var obj                                 = {};
    var params                              = qString.split ('&');
        for (var i=0;i<params.length;i++) {
            if (params[i].indexOf('=')===0) {
                continue;
            }
            params[i]                       = params[i].split ('=');
            obj[decodeURI(params[i][0])]    = decodeURI (params[i][1]);
        }
        return obj;
    }

    objectFromMsExcel2003XmlRow (row,headings) {
    var obj                         = {};
    var cells                       = row.getElementsByTagName ('Cell');
    var count                       = -1;
    var empty                       = true;
        for (var cell of cells) {
            count++;
            try {
            var data                = cell.getElementsByTagName('Data')[0].childNodes[0].nodeValue.trim ();
                for (var property in headings) {
                    if (!headings.hasOwnProperty(property)) {
                        continue;
                    }
                    if (headings[property]!=count) {
                        continue;
                    }
                    obj[property]   = data;
                    if (data.length) {
                        empty       = false;
                    }
                    break;
                }
            }
            catch (e) {
                console.log ('objectFromMsExcel2003XmlRow(): '+e.message);
                continue;
            }
        }
        if (empty) {
            return false;
        }
        return obj;
    }

    objectToCsv (obj) {
        try {
            return Papa.unparse (obj,this.cfg.papaparse.export);
        }
        catch (e) {
            throw new Error ('objectToCsv(): '+e.message);
            return false;
        }
    }

    objectToQuery (obj) {
        return Object.keys(obj).map (key => encodeURI(key) + '=' + encodeURI(obj[key])).join('&');
    }

    objectToMsExcel2003Xml (data,title='Untitled') {
    var xml         = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:c="urn:schemas-microsoft-com:office:component:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x2="http://schemas.microsoft.com/office/excel/2003/xml" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><ss:Worksheet><Table></Table></ss:Worksheet></Workbook>';
    var parser      = new DOMParser ();
    var dom         = parser.parseFromString (xml,"text/xml");
    var sheet       = dom.getElementsByTagName('ss:Worksheet')[0];
        sheet.setAttribute ('ss:Name',title);
    var table       = sheet.getElementsByTagName('Table')[0];
    var columns     = new Array ();
        if (data.length>0) {
        var head    = dom.createElement ('Row');
            head.setAttribute ('xmlns','urn:schemas-microsoft-com:office:spreadsheet');
            for (var k in data[0]) {
                columns.push (k);
            var cel = dom.createElement ('Cell');
            var dat = dom.createElement ('Data');
                dat.innerHTML = this.escapeForHtml (k);
                cel.appendChild (dat);
                head.appendChild (cel);
            }
            table.appendChild (head);
        }
        for (var i=0;i<data.length;i++) {
        var row     = dom.createElement ('Row');
            row.setAttribute ('xmlns','urn:schemas-microsoft-com:office:spreadsheet');
            for (var j=0;j<columns.length;j++) {
            var cel = dom.createElement ('Cell');
            var dat = dom.createElement ('Data');
                dat.innerHTML = this.escapeForHtml (data[i][columns[j]]);
                cel.appendChild (dat);
                row.appendChild (cel);
            }
            table.appendChild (row);
        }
        console.log(dom);
        return new XMLSerializer().serializeToString(dom).replace (/<Row xmlns="">/g,'<Row>');
    }

    option (defn) {
    var option              = document.createElement ('option');
        option.value        = defn[0];
        option.text         = defn[1];
        if (defn[2]) {
            option.selected = true;
        }
        return option;
    }

    optionsRemove (selectElmt) {
        selectElmt.selectedIndex    = 0;
    var options                     = this.qsa (selectElmt,'option');
    var first                       = false;
        for (var option of options) {
            if (!first) {
                first               = true;
                if (option.getAttribute('value')=='') {
                    continue;
                }
            }
            selectElmt.removeChild (option);
        }
    }

    parameterHave (key) {
        if (this.parameters[key]===undefined) {
            return false;
        }
        if (this.parameters[key]===null) {
            return false;
        }
        if (this.parameters[key]==='') {
            return false;
        }
        return true;
    }

    parameterParse (elmt) {
        try {
            if (elmt.hasAttribute('data-parameter')) {
            var old         = null;
                if (elmt.dataset.parameter in this.parameters) {
                    old     = this.parameters[elmt.dataset.parameter];
                }
            var now = null;
                if (elmt.hasAttribute('data-value')) {
                    now     = elmt.dataset.value;
                }
                if (this.equals(now,old)) {
                    return;
                }
                this.parameterWrite (elmt.dataset.parameter,now);
            }
        var uns         = this.unstickers ();
            if (!(elmt.dataset.parameter in uns)) {
                return;
            }
            for (var i in uns[elmt.dataset.parameter]) {
                this.parameterWrite (uns[elmt.dataset.parameter][i],null);
            }
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
    }

    parametersClear ( ) {
        this.parameters = {};
        this.sessionWrite ('parameters',this.parameters);
    }

    parametersRead ( ) {
        this.parameters = this.sessionRead ('parameters');
        if (!this.parameters) {
            this.parameters = {};
        }
    }

    parameterWrite (key,val) { 
        this.parameters[key] = val;
        this.sessionWrite ('parameters',this.parameters);
    }

    async placeChange (evtOrTarget) {
        if (!this.editMode) {
            console.log ('Edit mode not active');
            return;
        }
    var evt         = evtOrTarget;
    var target      = evtOrTarget;
        if ('currentTarget' in evt) {
            if (evt.currentTarget.tagName.toLowerCase()=='button') {
                return;
            }
            if (!evt.currentTarget.value) {
                return;
            }
            if (evt.type=='focus') {
                evt.currentTarget.classList.add ('no-sync');
                return;
            }
            target = evt.currentTarget;
        }
    var form                    = target.parentElement.parentElement;
        if (!target.value) {
            return;
        }
        if (this.equals(this.data[target.form.dataKey.value][target.name],target.value)) {
            target.classList.remove ('no-sync');
            return;
        }
        target.classList.add ('no-sync');
    }

    placeClose ( ) {
        this.screenRender (this.currentScreen,null,false);
    }

    placeListen ( ) {
        try {
        var forms = this.qsa (this.restricted,'form[data-place]');
            for (var form of forms) {
                for (var i=0;form.elements[i];i++) {
                    form.elements[i].addEventListener ('focus',this.placeChange.bind(this));
                    form.elements[i].addEventListener ('keyup',this.placeChange.bind(this));
                    form.elements[i].addEventListener ('blur',this.placeChange.bind(this));
                }
            }
            return true;
        }
        catch (e) {
            console.log ('placeListen(): '+e.message);
            return false;
        }
    }

    async placeSelect (form,dataKey) {
    var data                        = this.data;
    var keys                        = this.qs (form,'[data-keys]');
        keys                        = keys.content.cloneNode (true);
        keys                        = this.qsa (keys,'[data-key]');
        console.log ('placeSelect(): found '+keys.length+' data keys');
        for (var key of keys) {
            if (!key.dataset.key || !(key.dataset.key in data)) {
                console.log ('placeSelect(): key "'+key.dataset.key+'" not found in data');
                return false;
            }
            data                    = data[key.dataset.key];
        }
        if (!('placeId' in data)) {
            console.log ('placeSelect(): data is missing placeId');
            return false;
        }
    var placeId                     = data.placeId;
        console.log ('placeSelect(): place ID = '+placeId);
        if (!placeId) {
            try {
                console.log ('placeSelect(): adding a new place');
                placeId             = await this.placeAddRequest ();
                console.log ('Added new record for contact details');
                form.placeId.value  = placeId;
                console.log ('Updating reference to contact details');
                this.entrySave (form.placeId,true);
                data.placeId        = placeId;
            }
            catch (e) {
                console.log ('placeSelect(): '+e.message);
                return false;
            }
        }
        try {
            this.data[dataKey] = await this.placeRequest (placeId);
            this.data[dataKey].dataKey = dataKey;
        }
        catch (e) {
            console.log ('placeSelect(): failed - '+e.message);
            return false;
        }
        return true;
    }

    async placeUpdate (evt) {
        if (!this.editMode) {
            console.log ('Edit mode required but not active');
            return;
        }
    var form                    = evt.currentTarget.parentElement.parentElement;
    var place                   = {};
    var id                      = form.placeId.value;
    var section;
        for (var i=0;evt.currentTarget.classList.item(i);i++) {
            if (evt.currentTarget.classList.item(i).indexOf('place-')===0) {
                section         = evt.currentTarget.classList.item(i);
                break;
            }
        }
        switch (section) {
            case 'place-address':
                place           = this.placeUpdateAddress (form);
                break;
            case 'place-comms':
                place           = this.placeUpdateComms (form);
                break;
            case 'place-contact':
                place           = this.placeUpdateContact (form);
                break;
            case 'place-location':
                place           = this.placeUpdateLocation (form);
                break;
            case 'place-what3words':
                place           = this.placeUpdateWhat3Words (form);
                break;
            default:
                return;
        }
        try {
            await this.placeUpdateRequest (id,place);
            this.statusShow ('Place updated successfully');
            for (var prop in place) {
                this.data[form.dataKey.value][prop] = place[prop];
                this.placeChange (form[prop]);
            }
        }
        catch (e) {
            console.log (e.message);
        }
    }

    placeUpdateAddress (form) {
    var lines   = [];
        for (var i=1;i<5;i++) {
            if (form['line'+i].value.trim().length) {
                lines.push (form['line'+i].value.trim());
            }
        }
        for (var i=0;i<4;i++) {
            if (i in lines) {
                form['line'+(i+1)].value = lines[i];
            }
            else {
                form['line'+(i+1)].value = '';
            }
        }
    var place   = {
            line1 : form.line1.value,
            line2 : form.line2.value,
            line3 : form.line3.value,
            line4 : form.line4.value,
            locality : form.locality.value.trim (),
            town : form.town.value.trim (),
            region : form.region.value.trim (),
            countryCode : form.countryCode.value.trim ()
        };
        if (form.postcode.value.trim()) {
            place.postcode = form.postcode.value.trim ();
        }
        return place;
    }

    placeUpdateComms (form) {
    var web = '';
        if (form.contactWeb) {
            web = form.contactWeb.value.trim ();
        }
    var fax = '';
        if (form.contactFax) {
            fax = form.contactFax.value.trim ();
        }
        return {
            contactEmail : form.contactEmail.value.trim (),
            contactWeb : web,
            contactPhone : form.contactPhone.value.trim (),
            contactFax : fax
        };
    }

    placeUpdateContact (form) {
        return {
            contactName : form.contactName.value.trim ()
        };
    }

    placeUpdateLocation (form) {
        return {
            placeId : form.placeId.value,
            x : form.x.value.trim (),
            y : form.y.value.trim ()
        };
    }

    placeUpdateWhat3Words (form) {
        return {
            placeId : form.placeId.value,
            what3wordsAddress : form.what3wordsAddress.value.trim ()
        };
    }

    prefetchers (targetElmt) {
    var pfs             = this.qsa (targetElmt,'[data-prefetch]');
        for (var pf of pfs) {
            if (!pf.dataset.prefetch) {
                continue;
            }
            this.templateFetch (pf.dataset.prefetch);
        }
    }

    async preload (target,templateName) {
    var preloaders      = this.preloaders (templateName);
        for (var i=0;preloaders[i];i++) {
        var func        = preloaders[i].bind (this);
            if (await func(target)) {
                continue;
            }
            this.log ('Preload['+i+'] failed for "'+templateName+'.hbs"');
            return false;
        }
        return true;
    }

    preloaders (templateName) {
        // Use override method to define methods to run before template is rendered
        // The funtion is passed the current target of the event if you need it
        switch (templateName) {
            case '*':
                return [console.log];
            default:
                return [];
        }
    }

    qs (elmt,selectString) {
        // First element matching a selector
        if (!elmt || !elmt.querySelector) {
            console.log ('qs(): not an element: '+elmt);
            return false;
        }
        return elmt.querySelector (selectString);
    }

    qsa (elmt,selectString) {
        // All elements matching a selector
        if (!elmt || !elmt.querySelectorAll) {
            console.log ('qsa(): not an element: '+elmt);
            return false;
        }
        return elmt.querySelectorAll (selectString);
    }

    async request (request) {
        if (!('password' in request)) {
            if (this.tokenExpired()) {
                this.screenLock ();
                this.authFail ();
                this.queueStop ();
                this.log ('Screen locked, queuer stopped; request has no password, token expired');
                throw new Error ('Password required');
                return false;
            }
            request.token = this.cookieRead ('tk');
            if (!request.token) {
                throw new Error ('Neither password nor token was available');
                return false;
            }
        }
        try {
        var response = await this.hpapi (this.cfg.connectTO,this.cfg.url,request);
            if ('tokenExpires' in response) {
                if ('token' in response) {
                    this.tokenSet (response.token);
                }
                this.tokenSetExpiry (response.tokenExpires);
                this.tokenTOSet();
            }
            if (response.warning) {
                this.splash (1,response.warning,'Warning','OK');
            }
            return response;
        }
        catch (e) {
            if ('authStatus' in e) {
                // Hpapi error object
            var status   = e.authStatus.split (' ');
                if (status[0]!='068') {
                    this.passwordExpired = false;
                    if (status[0]=='065') {
                        this.passwordExpired = true;
                    }
                    this.log ('Authentication failure - authStatus='+e.authStatus);
                    this.screenLock ();
                    throw new Error (e.error);
                    return false;
                }
            }
            // An error string
            throw e;
            return false;
        }
    }

    sa (elmt,name,value) {
    // Set attribute by id or element
        try {
            this.ge(elmt).setAttribute (name,value);
            return true;
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
    }

    saveKey (key) {
        if (!key.length) {
            console.log ('saveKey(): no key given');
            return '';
        }
        if (!this.saveScope) {
            console.log ('saveKey(): no save scope available');
            return '';
        }
        return this.saveScope + '-' + key;
    }

    saveScopeListen (evt) {
        this.authAutoPermit     =  0;
        this.saveScopeSet (evt.target.value.replace(/[^a-zA-Z0-9]/g,'-').replace(/--+/g,' ').trim().replace(' ','-'));
    }

    saveScopeSet (userKey) {
        if (userKey===null || userKey.length==0) {
            this.saveScope      = '';
            return;
        }
        this.saveScope          = window.location.pathname.replace(/[/]/g,' ').trim().replace(' ','-');
        if (this.saveScope!='') {
            this.saveScope     += '-';
        }
        this.saveScope         += userKey;
    }

    async screenHandle (evt) {
        // Generic screen handle/render
    var event   = evt;
    var target  = evt.currentTarget;
        if (('editmode' in target.dataset) && !this.editMode) {
            console.log ('Edit mode required but not active');
            return;
        }
        this.parameterParse (target);
        if (!target.dataset.screen) {
            console.log ('screenHandle(): data-screen has no value');
            return;
        }
        if (target.dataset.reload) {
            console.log ('screenHandle(): deleting template "'+target.dataset.screen+'.hbs"');
            delete this.templates[target.dataset.screen];
            console.log ('Deleted screen template "'+target.dataset.screen+'.hbs"');
            console.log ('Awaiting reload');
            await this.templateFetch (target.dataset.screen);
            this.log ('Template reloaded');
        }
        console.log ('screenHandle(): rendering "'+target.dataset.screen+'"');
        evt.currentTargetWas = target;
        if (target.dataset.nohistory>0) {
            this.screenRender (target.dataset.screen,evt,false);
            return;
        }
        this.screenRender (target.dataset.screen,evt);
    }

    screenLock (label) {
        console.log ('super.screenLock()');
        if (label) {
            label   = this.escapeForHtml (label);
        var btn     = this.qs (document,'#gui-unlock');
            if (btn.innerHTML!=label) {
                btn.innerHTML = label;
            }
        }
        if (!this.screenUnlocked()) {
            console.log ('super.screenLock(): already locked');
        }
        document.removeEventListener ( 'click',      this.screenTOFunction ); 
        document.removeEventListener ( 'load ',      this.screenTOFunction );
        document.removeEventListener ( 'mousemove',  this.screenTOFunction );
        document.removeEventListener ( 'mousedown',  this.screenTOFunction );
        document.removeEventListener ( 'touchstart', this.screenTOFunction );
        document.removeEventListener ( 'scroll',     this.screenTOFunction );
        document.removeEventListener ( 'keypress',   this.screenTOFunction );
        this.restricted.style.display       = 'none';
        this.access.style.display           = 'block';
        if (this.loginTried) {
            this.cookieWrite ('ul',0);
        }
        this.screenTOClear ();
    }

    screenLockRefresh ( ) {
        // Nothing to define user scope
        if (this.saveScope.length==0) {
            return;
        }
        // Single window
        if (this.windows(Date.now()).count<2) {
            return;
        }
        // Awaiting automatic authentication
        if (this.screenLockRefreshInhibit) {
            return;
        }
//this.log ('screenLockRefresh()');
        // Windows are unlocked
        if (this.cookieRead('ul')>0) {
//this.log ('screenLockRefresh(): windows are unlocked');
            if (this.loginTried<1) {
//this.log ('screenLockRefresh(): never authed');
                // This window has not been authenticated since this.globalLoad() ...
                if (this.authAutoPermit<1) {
//this.log ('screenLockRefresh(): not qualified for auto auth');
                    // ... and does not qualify for automatic first authentication
                    this.screenLock ('Unlock');
                    return;
                }
            }
            if (this.screenUnlocked()) {
//this.log ('screenLockRefresh(): already unlocked');
                // Already unlocked
                return;
            }
            // Label access button ready for local log out
            this.qs(document,'#gui-unlock').innerHTML = 'Unlock';
            // Automatically authenticate with token
//this.log ('screenLockRefresh(): auto auth');
            this.authAuto ();
            return;
        }
        // Windows are logged out
        if (this.cookieRead('lo')>0) {
            if (this.loggedOut<1) {
//this.log ('screenLockRefresh(): windows are logged out');
                this.screenLock ('Log in');
                this.authForget ();
                this.init ();
            }
            return;
        }
        // Windows are locked but not logged out
//this.log ('screenLockRefresh(): windows are locked but not logged out');
        this.screenLock ('Unlock');
    }

    async screenRender (screen,evt=null,storeState=true,bounceScreen=null) {
        if (!(screen in this.templates)) {
            console.log ('Screen "'+screen+'.hbs" is missing');
            return false;
        }
        console.log ('screenRender(): "'+this.currentScreen+'" ---> "'+screen+'"');
        document.body.classList.add ('wait');
    var target      = null;
        if (evt) {
            target  = evt.currentTargetWas;
        }
    var preload     = await this.preload (target,'*');
        if (!preload) {
            console.log ('screenRender(): wildcard preloaders failed');
            document.body.classList.remove ('wait');
            return false;
        }
        var preload     = await this.preload (target,screen);
        if (!preload) {
            document.body.classList.remove ('wait');
            console.log ('screenRender(): preloaders for template='+screen+' failed');
            return false;
        }
        if (bounceScreen) {
           console.log ('screenRender(): bouncing straight on to "'+bounceScreen+'"');
            return this.screenRender (bounceScreen,evt);
        }
        // Record scroll position
        if (this.currentScreen) {
            this.scrolls[this.currentScreen]    = {
                x : document.documentElement.scrollLeft,
                y : document.documentElement.scrollTop
            };
        }
        // Render
        console.log ('screenRender(): rendering "'+screen+'.hbs"');
        if ((typeof this.templates[screen])!='function') {
            this.log ('Template for screen "'+screen+'" is not available');
            return false;
        }
        try {
            this.data.currentScreen             = screen;
            this.restricted.innerHTML           = this.templates[screen] (this.data);
        }
        catch (e) {
            this.data.currentScreen             = this.currentScreen;
            this.log ('Handlebars says: '+e.message);
            delete this.templates[screen];
            this.log ('Failed screen template '+screen+'.hbs deleted');
            document.body.classList.remove ('wait');
            return false;
        }
        this.currentScreen                      = screen;
        if (storeState) {
        var state = {
                id : Date.now (),
                screen : screen,
                parameters : this.parameters
            };
            console.log ('PUSHING STATE '+JSON.stringify(state,null,'    '));
            window.history.pushState (
                state,
                "Screen = "+screen,
                this.contextUrl (this.userScope().value,this.currentScreen)
            );
        }
        if (!(screen in this.currentTemplates)) {
            this.currentTemplates[screen]       = {};
        }
        this.currentTemplates[screen].visited = true;
    var tech                                    = document.createElement ('a');
        this.restricted.appendChild (tech);
        tech.classList.add ('navigator');
        tech.dataset.insert                     = 'tech';
        tech.dataset.target                     = 'gui-tech';
        if (this.cfg.diagnostic.data) {
            this.restricted.innerHTML          += this.templates['data'] (this.data);
        }
        this.data.currentScreen                 = this.currentScreen;
// this.logSummary ();
        // Add automatic navigation defined by navigators()
        this.restricted.insertBefore (this.navigatorsElement(this.currentScreen),this.restricted.childNodes[0]);
        // Override loaders() to run methods after template is loaded
        this.loaders (evt,screen);
        // Set current date
        this.loadDateNow (this.restricted);
        // Listen for data-autoscope elements
        this.autoscopeListen (this.restricted);
        // Listen for events on HTML status messages
        this.statusListen (this.restricted);
        // Listen for data entry field(s)
        this.entryListen (this.restricted);
        // Listen for splash messages
        this.splashListen (this.restricted);
        // Override actors() to add associated function event handlers for the template to your extension class
        this.actors (screen);
        // Scroll to previous position
        if (!(screen in this.scrolls)) {
            this.scrolls[screen]                = {x:0,y:0};
        }
        document.documentElement.scrollLeft     = this.scrolls[screen].x;
        document.documentElement.scrollTop      = this.scrolls[screen].y;
        // Pre-fetch templates
        this.prefetchers (this.restricted);
        // Listen for navigators
        this.navigatorsListen (this.restricted);
        // Listen for filter inputs
        this.filtersListen (this.restricted);
        // Form submit hook
    var forms = this.qsa (this.restricted,'form');
        for (var f=0;f<forms.length;f++) {
            forms[f].addEventListener ('submit',this.formSubmit.bind(this));
        }
        // Buffer up linked screens
    var screens = this.qsa (this.restricted,'[data-screen]');
        for (var s=0;s<screens.length;s++) {
            this.templateFetch (screens[s].dataset.screen);
        }
        // Buffer up linked inserts
    var inserts = this.qsa (this.restricted,'[data-insert]');
        for (var i=0;i<inserts.length;i++) {
            this.templateFetch (inserts[i].dataset.insert);
        }
        // Click auto-click elements
        this.clicks (this.restricted);
        // Scroll first scoped element into view
    var scopedElmt =  this.scrollToScoped (this.restricted);
        if (scopedElmt) {
            scopedElmt.focus ();
        }
    var scoped = this.qs (this.restricted,'.scoped');
        if (scoped && !this.elementInView(scoped)) {
            // Bit of a delay seems necessary...
            window.setTimeout (
                function ( ) {
                    scoped.scrollIntoView (
                        {
                            behavior : 'smooth',
                            block    : 'center'
                        }
                    );
                },
                500
            );
        }
        // Done
        document.body.classList.remove ('wait');
        console.log ('screenRender(): finished template "'+screen+'"');
        return true;
    }

    screenTOClear ( ) {
        if ('screenTO' in this) {
            clearTimeout (this.screenTO);
            delete this.screenTO;
        }
    }

    screenTOSet ( ) {
        this.screenTOTime   = Date.now() + 60*this.cfg.screenTO*1000;
        this.screenTOClear ();
        this.screenTO       = setTimeout (this.screenLock.bind(this),60*this.cfg.screenTO*1000);
    }

    screenUnlock ( ) {
        this.log ('super.screenUnlock()');
        if (this.screenUnlocked()) {
            console.log ('super.screenUnlock(): already unlocked');
        }
        this.screenTOFunction = this.screenTOSet.bind (this);
        this.screenTOSet ();
        document.addEventListener ( 'click',      this.screenTOFunction ); 
        document.addEventListener ( 'load ',      this.screenTOFunction );
        document.addEventListener ( 'mousemove',  this.screenTOFunction );
        document.addEventListener ( 'mousedown',  this.screenTOFunction );
        document.addEventListener ( 'touchstart', this.screenTOFunction );
        document.addEventListener ( 'scroll',     this.screenTOFunction );
        document.addEventListener ( 'keypress',   this.screenTOFunction );
        this.access.style.display           = 'none';
        this.restricted.style.display       = 'block';
        this.cookieWrite ('ul',1);
    }

    screenUnlocked () {
        if (this.restricted.style.display=='block') {
            return true;
        }
        return false;
    }

    scrollToScoped (container) {
    var scoped = this.qs (container,'.scoped');
        if (!scoped) {
            return null;
        }
        if (!this.elementInView(scoped)) {
            scoped.scrollIntoView (
                {
                    behavior : 'smooth',
                    block    : 'center'
                }
            );
        }
        window.scrollBy (0,25-Math.floor(window.innerHeight/3));
        return scoped;
    }

    selectedIndex (selectElmt,match) {
        for (var i=0;selectElmt.options[i];i++) {
            if (selectElmt.options[i].value==match) {
                return i;
            }
        }
        return 0;
    }

    sessionDelete (key) {
        try {
            window.sessionStorage.removeItem (this.saveKey('ephemeral-'+key));
            return true;
        }
        catch (e) {
            return false;
        }
    }

    sessionRead (key) {
        return JSON.parse (window.sessionStorage.getItem(this.saveKey('ephemeral-'+key)));
    }

    sessionWrite (key,val) {
        try {
            if (val===undefined) {
                val = null;
            }
            window.sessionStorage.setItem (this.saveKey('ephemeral-'+key),JSON.stringify(val));
            return true;
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
    }

    splash (status,msg,title='Message',label='OK',target=null) {
        if (target) {
            target.setAttribute ('data-splasher',1);
        }
    var cssClass            = ['ok','warning','error'];
        if (!(status in cssClass)) {
            status          = 2;
        }
    var splash              = this.qs (document,'#gui-splash');
        this.splashMessage (
            splash,
            {
                class : cssClass[status],
                title : title,
                message : msg,
                button : label
            }
        );
        this.splashCount++;
        splash.classList.add ('visible');
    var buttons             = this.qsa (splash,'button');
        for (var i=0;i<buttons.length;i++) {
            buttons[i].addEventListener ('click',this.splashClose.bind(this));
            buttons[i].focus ();
        }
    }

    splashClose (evt) {
    var splash              = evt.currentTarget.parentElement.parentElement;
        splash.removeChild (evt.currentTarget.parentElement);
        this.splashCount--;
        if (this.splashCount>0) {
            return;
        }
        splash.classList.remove ('visible');
    var targets              = this.qsa (this.restricted,'[data-splasher]');
    var target;
        for (var i=0;targets[i];i++) {
            targets[i].removeAttribute ('data-splasher');
            target           = targets[i];
        }
        if (target) {
            target.focus ();
        }
    }

    splashHandle (evt) {
    var status               = 0;
        if (evt.currentTarget.classList.contains('error')) {
            if (!evt.currentTarget.dataset.title) {
                evt.currentTarget.dataset.title = 'Error';
            }
            status           = 2;
        }
        else if (evt.currentTarget.classList.contains('warning')) {
            if (!evt.currentTarget.dataset.title) {
                evt.currentTarget.dataset.title = 'Warning';
            }
            status           = 1;
        }
        else if (!evt.currentTarget.dataset.title) {
            evt.currentTarget.dataset.title = 'Notice';
        }
        this.splash (status,evt.currentTarget.dataset.message,evt.currentTarget.dataset.title);
    }

    splashListen (targetElmt) {
    var splashes             = this.qsa (targetElmt,'[data-splash]');
        for (var i=0;splashes[i];i++) {
            splashes[i].addEventListener ('click',this.splashHandle.bind(this));
        }
    }

    splashMessage (box,data) {
        box.innerHTML   += this.templates['splash'] (data);
    }

    statusClick (evt) {
        evt.preventDefault ();
        this.statusShow (evt.currentTarget.dataset.status);
    }

    statusHide ( ) {
        delete this.statusTimeoutHide;
        this.status.textContent     = '';
        this.status.classList.remove ('visible');
    }

    statusListen (targetElmt) {
    var elmts = this.qsa (targetElmt,'[data-status]');
        for (var elmt of elmts) {
            elmt.addEventListener ('click',this.statusClick.bind(this));
        }
    }

    statusReset ( ) {
        delete this.statusTimeoutReset;
        this.status.classList.remove ('transition');
    }

    statusShow (msg,clear=false) {
    var keep                        = false;
        if (this.statusTimeoutHide) {
            window.clearTimeout (this.statusTimeoutHide);
            delete this.statusTimeoutHide;
            keep                    = true;
        }
        if (this.statusTimeoutReset) {
            window.clearTimeout (this.statusTimeoutReset);
            delete this.statusTimeoutReset;
            keep                    = true;
        }
        if (keep && !clear) {
            msg                     = this.status.textContent + ' ' + msg;
        }
        this.status.textContent     = msg;
        this.status.classList.add ('transition');
        this.status.classList.add ('visible');
        this.statusTimeoutHide      = setTimeout (this.statusHide.bind(this),2000);
        this.statusTimeoutReset     = setTimeout (this.statusReset.bind(this),2400);
    }

    storageDelete (key) {
        try {
            this.storage.removeItem (this.saveKey('persistent-'+key));
            return true;
        }
        catch (e) {
            return false;
        }
    }

    storageRead (key) {
        return JSON.parse (this.storage.getItem(this.saveKey('persistent-'+key)));
    }

    storageSpaceUsed ( ) {
        return Object.keys(window.localStorage).map (
            function (key) {
                return window.localStorage[key].length;
            }
        ).reduce (
            function (a,b) {
                return a + b;
            }
        );
    }

    storageWrite (key,val) {
        try {
            if (val===undefined) {
                val = null;
            }
            this.storage.setItem (this.saveKey('persistent-'+key),JSON.stringify(val));
            return true;
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
    }

    sv (elmt,value) {
    // Set value attribute by id or element
        try {
            this.ge(elmt).setAttribute ('value',value);
            return true;
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
    }

    async templateFetch (handle) {
        if (handle in this.templates) {
            // console.log ('templateFetch(): already got or getting template "'+handle+'.hbs"');
            return true;
        }
        try {
            this.templates[handle] = false;
            this.templates[handle] = await this.templateGet (handle);
            return true;
        }
        catch (e) {
            this.log ('Could not fetch "'+handle+'.hbs": '+e.message);
            delete this.templates[handle];
            return false;
        }
    }

    templateGet (handle) {
        try {
            // console.log ('templateGet(): getting template "'+handle+'.hbs"');
        var timeout                         = 1000 * this.cfg.templateTO;
        var url                             = './template/' + handle + '.hbs';
            if (this.cfg.forceTemplateLoad) {
                url                         =  url + '?forcereload=' + Math.floor((Math.random() * 9999) + 1);
            }
            return new Promise (
                function (succeeded,failed) {
                var xhr                     = new XMLHttpRequest ();
                    xhr.timeout             = timeout;
                    xhr.onerror             = function ( ) {
                        failed (new Error(handle+'.hbs: Could not connect or unknown error'));
                    };
                    xhr.onload              = function ( ) {
                        if (xhr.status==200) {
                            // Compile handlebars.js function and return it
                            succeeded (Handlebars.compile(xhr.responseText));
                        }
                        else {
                            failed (new Error(handle+'.hbs: '+xhr.statusText));
                        }
                    };
                    xhr.ontimeout   = function ( ) {
                        failed (new Error(handle+'.hbs: Request timed out'));
                    };
                    xhr.open ('GET',url,true);
                    xhr.send ();
                }
            );
        }
        catch (e) {
            throw new Error ('templateGet(): '+e.message);
            return false;
        }
    }

    timezone ( ) {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    today ( ) {
    var input    = document.createElement ('input');
        input.setAttribute ('type','date');
        input.valueAsDate = new Date ();
        return input.value;
    }

    tokenExpired ( ) {
       return 1000*this.tokenExpiry() < Date.now();
    }

    tokenExpiry ( ) {
    var expires = this.cookieRead ('ex');
        if (!expires) {
            return 0;
        }
        return (1*expires);
    }

    token ( ) {
        return this.cookieRead ('tk');
    }

    tokenPurge (token,timestamp) {
        console.log ('Hpapi purging token');
        this.cookieWrite ('tk','');
        this.cookieWrite ('ex',0);
    }

    tokenSet (token) {
        console.log ('tokenSet(): '+token);
        this.cookieWrite ('tk',token);
    }

    tokenSetExpiry (expires) {
        console.log ('tokenSetExpiry(): '+expires);
        this.cookieWrite ('ex',expires);
    }

    tokenTOSet ( ) {
        this.tokenTOClear ();
    var now                 = Date.now ();
    var then                = 1000 * this.cookieRead('ex');
    var ms                  = then - now;
        console.log ('tokenTOSet(): '+ms+'ms');
        this.tokenTO = setTimeout (this.tokenPurge.bind(this),ms);
    }

    tokenTOClear ( ) {
        if ('tokenTO' in this) {
            console.log ('tokenTOClear(): clearing token timeout');
            clearTimeout (this.tokenTO);
            delete this.tokenTO;
        }
    }

    unloadHandle (evt) {
        // Cancel the event
        evt.preventDefault ();
        // Chrome requires returnValue to be set
        evt.returnValue = '';
    }

    unstickers ( ) {
        // Override this in an extension class
        return {
        }
    }

    async update (tableName,columnName,columnValue,rowPrimaries) {
    var request     = {
            "email" : this.access.email.value
           ,"method": {
                "vendor": "whitelamp-uk"
               ,"package": "hpapi-utility"
               ,"class": "\\Hpapi\\Utility"
               ,"method": "update"
               ,"arguments": [
                    tableName
                   ,columnName
                   ,columnValue
                   ,rowPrimaries
                ]
            }
        }
        try {
        var response = await this.request (request);
            return true;
        }
        catch (e) {
        var err      = new Error (e.message);
            if ('splash' in e) {
                err.splash = e.splash;
            }
            console.log ('update(): '+e.message);
            throw err;
            return false;
        }
    }

    userScope ( ) {
        return this.qs(document,'#gui-email');
    }

    windowLog ( ) {
    var dnow = Date.now ();
        this.cookieWrite (window.name,dnow);
    var scto = 1 * this.cookieRead('sc');
        if (scto==this.screenTOTime) {
            return;
        }
        if (scto>this.screenTOTime) {
            // Extend timeout in this window
            this.screenTOTime   = scto;
            this.screenTOClear ();
            this.screenTO       = setTimeout (scto-dnow);
            return;
        }
        // Extend timeout in other windows
        this.cookieWrite ('sc',this.screenTOTime);
    }

    windows (dnow) {
    var ws  = {
            count : 0,
            wins : {}
        };
    var expires                 = new Date().toUTCString ();
    var wins                    = this.cookiesBeginning ('w-');
    var keys                    = Object.keys (wins);
        for (var i=0;i<keys.length;i++) {
            if (((1*wins[keys[i]])+1999)<dnow) {
                this.cookieExpire (keys[i],0,expires);
                continue;
            }
            ws.count++;
            ws.wins[keys[i]]     = wins[keys[i]];
        }
//this.log ('NOW = '+dnow);
//this.log ('IN = '+JSON.stringify(wins,null,'    '));
//this.log ('OUT = '+JSON.stringify(ws,null,'    '));
//this.log ('WINS = '+ws.count);
        return ws;
    }

}

