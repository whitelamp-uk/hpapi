
/* Copyright 2018 Burden and Burden  http://www.burdenandburden.co.uk/ */

import {Admin} from './admin.js';

export class AdminGui extends Admin {

    agentallowsListen ( ) {
        var e, element, elements;
        elements            = this.qsa (this.restricted,'form#agentallows [data-agentallow]');
        for (e of elements) {
            e.addEventListener ('change',this.agentallowToggle.bind(this));
        }
        elements            = this.qsa (this.restricted,'form#agentallows [data-agentfunction]');
        for (element of elements) {
            if ('prohibit' in element.dataset) {
                continue;
            }
            element.addEventListener ('change',this.agentpermitToggle.bind(this));
        }
    }

    async agentallowToggle (evt) {
        var newState, target;
        target              = evt.currentTarget;
/*
        if (!confirm('Are you sure?')) {
            if (target.checked) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            return;
        }
*/
        newState        = 0;
        if (target.checked) {
            newState    = 1;
        }
        try {
            await this.agentallowToggleRequest (
                target.dataset.account
               ,target.dataset.agent
               ,newState
            );
//            this.splash (0,'Agent access changed','Success','Continue',target);
            this.statusShow ('Agent access changed');
            this.screenRender (this.currentScreen,null,false);
        }
        catch (e) {
            if (newState) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            this.splash (2,'Could not change agent access','Error','OK',target);
        }
    }

    async agentpermitToggle (evt) {
        var newState, target;
/*
        if (!confirm('Are you sure?')) {
            return;
        }
*/
        target          = evt.currentTarget;
        newState        = 0;
        if (target.checked) {
            newState    = 1;
        }
        try {
            await this.agentpermitToggleRequest (
                target.dataset.account
               ,target.dataset.agent
               ,target.dataset.code
               ,newState
            );
//            this.splash (0,'Agent permission changed','Success','Continue');
            this.statusShow ('Agent permission changed');
            this.screenRender (this.currentScreen,null,false);
        }
        catch (e) {
            if (newState) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            this.splash (2,'Could not change agent permission','Error','OK');
        }
    }

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
            email       = null;
            if (evt.currentTarget.form.email.value.length && evt.currentTarget.form.email.value.indexOf('@')<0) {
                evt.currentTarget.form.email.value += '@burdenandburden.co.uk';
                evt.currentTarget.click ();
                return;
            }
            email       = evt.currentTarget.form.email.value;
            response    = await super.authenticate (
                evt.currentTarget.form.email.value
               ,pwd
               ,'admin-server'
               ,'\\Bab\\Admin'
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

    async bankDetailsHash (target) {
        var form, scan, tgt;
        if (!target || !('bankdetailshash' in target.dataset)) {
            return true;
        }
        form    = target.parentElement.parentElement.parentElement;
        scan    = form.sortCode.value.trim().replace('-','') + form.accountNumber.value.trim();
        tgt     = form.bankDetailsHash;
        try {
            await this.bankDetailsHashRequest (this.parameters.fundraiserId,scan);
            return true;
        }
        catch (e) {
            console.log ('bankDetailsHash(): '+e.message);
            return false;
        }
    }

    constructor (config) {
        super (config);
    }

    contractsListen ( ) {
        var e, elements;
        elements            = this.qsa (this.restricted,'form#contracts [data-contract]');
        for (e of elements) {
            e.addEventListener ('change',this.contractToggle.bind(this));
        }
    }

    async contractToggle (evt) {
        var newState, target;
        target              = evt.currentTarget;
/*
        if (!confirm('Are you sure?')) {
            if (target.checked) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            return;
        }
*/
        newState        = 0;
        if (target.checked) {
            newState    = 1;
        }
        try {
            await this.contractToggleRequest (
                target.dataset.fundraiser
               ,target.dataset.account
               ,newState
            );
//            this.splash (0,'Contract changed','Success','Continue',target);
            this.statusShow ('Contract changed');
            this.screenRender (this.currentScreen,null,false);
        }
        catch (e) {
            if (newState) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            this.splash (2,'Could not change contract','Error','OK',target);
        }
    }

    deriveAgent (evt) {
        var user;
        user = this.find (
            this.data.users
           ,'userId'
           ,evt.currentTarget.value
           ,false
        );
        evt.currentTarget.form.agentName.value      = user.userName;
    }

    deriveFundraiser (evt) {
        var badgeNr, user;
        user = this.find (
            this.data.users
           ,'userId'
           ,evt.currentTarget.value
           ,false
        );
        evt.currentTarget.form.knownAs.value        = user.userName;
        badgeNr                                     = user.email.split ('@');
        evt.currentTarget.form.badgeNumber.value    = badgeNr[0];
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
        this.data.test = {
            name        : "Susan"
           ,colHeads    : [
                "Col1"
               ,"Col2"
            ]
           ,cols        : [
                "c1"
               ,"c2"
            ]
           ,rows       : [
                {
                    c1 : "r1c1"
                   ,c2 : "r1c2"
                }
               ,{
                    c1 : "r2c1"
                   ,c2 : "r2c2"
                }
            ]
        }
        this.log ('admin-gui initialised');
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

    managerChange (evt) {
        var link, select;
        select              = evt.currentTarget;
        link                = this.qs (select.parentElement,'a[data-screen=manager]');
        link.dataset.value  = select.value;
        link.textContent    = select.options[select.selectedIndex].textContent;
    }
 
    managerChangeListen ( ) {
        var select;
        select              = this.qs (this.restricted,'#manager-change [data-column=has_manager_id]');
        select.addEventListener ('change',this.managerChange.bind(this));
    }
 
    membershipListen ( ) {
        var elmt, form;
        form                = this.qs (this.restricted,'form#membership');
        if (!form) {
            return;
        }
        for (elmt of form.elements) {
            elmt.addEventListener ('change',this.membershipToggle.bind(this));
        }
    }

    async membershipToggle (evt) {
        var newState, target;
        target              = evt.currentTarget;
        if (!confirm('Are you sure?')) {
            if (target.checked) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            return;
        }
        newState            = 0;
        if (target.checked) {
            newState        = 1;
        }
        try {
            await this.membershipToggleRequest (
                this.parameters.userId
               ,target.name
               ,newState
            );
//            this.splash (0,'Membership changed','Success','Continue',target);
            this.statusShow ('Membership changed');
        }
        catch (e) {
            if (newState) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            this.splash (2,'Could not change membership status','Error','OK',target);
        }
    }

    async passwordClear ( ) {
        if (!confirm('Are you sure you want to wipe this password?')) {
            return true;
        }
        try {
            await this.passwordClearRequest (this.parameters.userId);
        }
        catch (e) {
            this.splash (2,'Failed to clear password','Error','OK');
            return false;
        }
        this.splash (0,'Password cleared');
        this.find(this.data.users,'userId',this.parameters.userId,false).passwordIsSame = false;
        this.qs(this.restricted,'#user-pwd-warning').classList.add ('hidden');
        return true;
    }

    async passwordSelfManage (evt) {
        var hours;
        if (!confirm('Are you sure you want to allow password change?')) {
            return true;
        }
        hours = evt.currentTarget.dataset.hours;
        try {
            await this.passwordSelfManageRequest (this.parameters.userId,hours);
        }
        catch (e) {
            this.splash (2,'Failed to allow password change','Error','OK');
            return false;
        }
        this.statusShow ('Password may be changed by user within the next '+hours+' hours');
        this.qs(this.restricted,'#user-pwd-sm').innerHTML = 'Password change allowed for '+hours+' hours';
        return true;
    }

    async passwordSetTemporary ( ) {
        var p1, p2;
        p1 = this.qs (this.restricted,'#user-pwd');
        if (!p1.value) {
            this.splash (2,'No password was entered','Error','OK');
            return false;
        }
        p2 = this.qs (this.restricted,'#user-pwd-confirm');
        if (p2.value!=p1.value) {
            this.splash (2,'Password confirmation does not match','Error','OK');
            return false;
        }
        try {
            await this.passwordSetTemporaryRequest (this.parameters.userId,p1.value);
        }
        catch (e) {
            this.splash (2,'Failed to set password','Error','OK');
            return false;
        }
        this.splash (0,'Password set','Success','Continue');
        if (p1.value==this.password) {
            this.find(this.data.users,'userId',this.parameters.userId,false).passwordIsSame = true;
            this.qs(this.restricted,'#user-pwd-warning').classList.remove ('hidden');
        }
        else {
            this.find(this.data.users,'userId',this.parameters.userId,false).passwordIsSame = false;
            this.qs(this.restricted,'#user-pwd-warning').classList.add ('hidden');
        }
        p1. value           = '';
        p2.value            = ''
        return true;
    }

    processorList (evt) {
        var i, proc, procs, props, select, selected;
        select              = this.qs (evt.currentTarget.form,'#products-processor');
        if (!select) {
            return;
        }
        proc                = select.value;
        select.innerHTML    = '';
        select.appendChild (this.option(['','Select:']));
        props               = { LT:'isLottery', RG:'isRegularGiving' };
        procs               = this.data.config.processors;
        for (i=0;procs[i];i++) {
            selected        = false;
            if (!evt.currentTarget.value || procs[i][props[evt.currentTarget.value]]) {
                if (procs[i].code==select.value) {
                    selected = true;
                }
                select.appendChild (this.option([procs[i].code,procs[i].name,selected]));
            }
        }
    }

    async report (evt) {
        var args, err, form, file, i, link, report, target, title, type;
        form        = this.qs (this.restricted,'form[data-report]');
        target      = this.qs (this.restricted,'#'+evt.currentTarget.dataset.target);
        title       = evt.currentTarget.dataset.title;
        file        = title.replace(/[^a-zA-Z ]/g,'').replace(/ /g,'-');
        args        = [];
        type        = 'xml';
        if (evt.currentTarget.dataset.download=='csv') {
            type    = 'csv';
        }
        for (i=0;form.elements[i];i++) {
            args.push (form.elements[i].value);
        }
        try {
            report  = await this.reportRequest (args);
        }
        catch (e) {
            err     = this.errorSplit (e.message);
            if (err.hpapiCode=='400') {
                this.splash (2,'Invalid input(s)','Error','OK');
            }
            else {
                this.splash (2,e.message,'Error','OK');
            }
            return false;
        }
        if (type=='csv') {
            link = this.downloadLink (
                'Here is your download'
               ,file+'.csv'
               ,'text/csv'
               ,this.objectToCsv (report)
            );
            target.appendChild (link);
            return true;
        }
        link = this.downloadLink (
            'Here is your download'
           ,file+'.xml'
           ,'text/xml'
           ,this.objectToMsExcel2003Xml (report,title)
        );
        target.appendChild (link);
        return true;
    }

    screenHandle (evt) {
        var t;
        t = evt.currentTarget.dataset;
        if (t.screen=='user') {
            if (t.custom=='agent') {
                t.parameter     = 'userId';
                t.value         = this.historyRead(t.state).ps.agentId;
            }
            else if (t.custom=='fundraiser') {
                t.parameter     = 'userId';
                t.value         = this.historyRead(t.state).ps.fundraiserId;
            }
        }
        super.screenHandle (evt);
    }

    testHandler (evt) {
        // Bespoke handler
        alert ('So you want to do stuff, eh?');
    }

    testCsvDownload (evt) {
        var data, link, target;
        target          = evt.currentTarget;
        data = [
            {
                "Fruit": "Apple, \"Discovery\"",
                "Colour": "Green"
            },
            {
                "Fruit": "Banana or Quince",
                "Colour": "Yellow"
            },
            {
                "Fruit": "Tomato, Gardener's Delight",
                "Colour": "Red"
            }
        ];
        this.log ('Data to download = '+JSON.stringify(data,null,'   '));
        link = this.downloadLink (
            'Here is your download'
           ,'test-csv.csv'
           ,'text/csv'
           ,this.objectToCsv (data)
           ,'immediate' in target.dataset
        );
        if ('immediate' in target.dataset) {
            return;
        }
        if (target.nextElementSibling) {
            target.parentElement.insertBefore (
                link
               ,target.nextElementSibling
            );
            return;
        }
        target.parentElement.appendChild (link);
    }

    async testPings ( ) {
        // Load an example of this.data.pings for testing mapPings()
        try {
            this.data.pings = await this.pingsRequest (3,"2019-03-05","2019-03-06");
        }
        catch (e) {
            console.log ('testPings(): '+e.message);
        }
        return true;
    }

    async testMapLoad (evt) {
        var bounds, marker, path, pinglist, start, route, routemap;

        // TODO: add callback to google maps loaded in index.html; or load on demand

        this.qs(document,'#test-map-div').classList.add ('test-map-dims');
        pinglist = await this.pingsRequest (3,"2019-03-05","2019-03-06");
        if (pinglist===false) {
            alert ("failed to fetch pings");
            return;
        }
        if (google === undefined) {
            alert ("Google Maps API not loaded");
            return;
        }
        start = {lat:pinglist[0].y, lng:pinglist[0].x};
        routemap = new google.maps.Map (
            document.getElementById('test-map-div'), {zoom: 8, center: start}
        );
        /*
          The docs imply you can create the polyline here and then extend it by adding to the
          path, but it didn't seem to work for me.  But this seems fine.
        */
        path = [];
        bounds = new google.maps.LatLngBounds ();
        pinglist.forEach (
            pingobj => {
                path.push({lat:pingobj.y, lng:pingobj.x});
                bounds.extend({lat:pingobj.y, lng:pingobj.x});
                marker = new google.maps.Marker (
                    {
                        position: {lat:pingobj.y, lng:pingobj.x},
                        title: pingobj.t,
                        map: routemap
                    }
                );
            }
        );
        route = new google.maps.Polyline({
            path: path,
            map: routemap,
            strokeColor: '#aa0000',
            strokeOpacity: 0.5,
            strokeWeight: 1
        });
        routemap.fitBounds(bounds);
    }

    async testMapLoadOSM (evt) {
        var bounds, mymap, pinglist, route;
        this.qs(document,'#test-map-div').classList.add ('test-map-dims');

        pinglist = await this.pingsRequest (3,"2019-03-05","2019-03-06");
        if (pinglist === false) {
            alert ("failed to fetch pings");
            return;
        }
        mymap = L.map('test-map-div').setView (
            [2.201,0.132],
            13
        );
        L.tileLayer (
            'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
            {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox.streets'
            }
        ).addTo (mymap);
/*
        // Plots default markers
        bounds = L.latLngBounds();
        pinglist.forEach(pingobj => {
            bounds.extend([pingobj.y, pingobj.x]);
            L.marker([pingobj.y, pingobj.x]).addTo(mymap);
        });
        mymap.fitBounds(bounds);
*/
        route = L.polyline (
            [],
            {color: 'red', smoothFactor: 0}
        );
        pinglist.forEach (
            pingobj => {
                route.addLatLng([pingobj.y, pingobj.x]);
                L.marker([pingobj.y, pingobj.x], {title: pingobj.t}).addTo(mymap);
                //route.addTo(mymap);
            }
        );
        mymap.fitBounds (route.getBounds());
        route.addTo (mymap);
    }

    async testValidateNumber ( ) {
        var data, num, validateResponse;
        num = this.qs(document,'#test-validate-input').value;
        data = {
            "type": "mobile",
            "number": num,
            "fullresult": "true"
        };
        try {
            validateResponse = await this.validateRequest(data);
            console.log (validateResponse);
            this.qs(document,'#test-validate-div').innerText = JSON.stringify(validateResponse.Result);
        }
        catch (e) {
            this.qs(document,'#test-validate-div').innerText = e.message;
        }
    }

    testXmlDownload (evt) {
        var data, link, target, title;
        target          = evt.currentTarget;
        title           = "My test data";
        data            = [
            {
                "Fruit": "Cherry",
                "Colour": "Red"
            },
            {
                "Fruit": "Banana",
                "Colour": "Yellow"
            },
            {
                "Fruit": "Apple",
                "Colour": "Green"
            }
        ];
        this.log ('Data to download = '+JSON.stringify(data,null,'   '));
        link = this.downloadLink (
            'Here is your download'
           ,'test-xml.xml'
           ,'text/xml'
           ,this.objectToMsExcel2003Xml (data,title)
           ,'immediate' in target.dataset
        );
        if ('immediate' in target.dataset) {
            return;
        }
        if (target.nextElementSibling) {
            target.parentElement.insertBefore (
                link
               ,target.nextElementSibling
            );
            return;
        }
        target.parentElement.appendChild (link);
    }

    async zoneToggle (evt) {
        var newState, target;
        target      = evt.currentTarget;
        newState    = 1 - parseInt(target.getAttribute('data-value'));
        try {
            await this.zoneToggleRequest (
                this.parameters.area
               ,target.value
               ,newState
            );
        }
        catch (e) {
            this.splash (2,'Could not change zoning','Error','OK');
            return;
        }
        this.statusShow ('Zones updated');
        if (newState) {
            target.setAttribute ('data-value',1);
            target.classList.add ('emphasised');
            return;
        }
        target.setAttribute ('data-value',0);
        target.classList.remove ('emphasised');
    }

}

