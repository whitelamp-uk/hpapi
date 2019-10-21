
/* Copyright 2019 Whitelamp  http://www.whitelamp.co.uk/ */

import {Generic} from './generic.js';

export class GenericGui extends Generic {

    agentallowsListen ( ) {
    var elements            = this.qsa (this.restricted,'form#agentallows [data-agentallow]');
        for (var e of elements) {
            e.addEventListener ('change',this.agentallowToggle.bind(this));
        }
        elements            = this.qsa (this.restricted,'form#agentallows [data-agentfunction]');
        for (var element of elements) {
            if ('prohibit' in element.dataset) {
                continue;
            }
            element.addEventListener ('change',this.agentpermitToggle.bind(this));
        }
    }

    async agentallowToggle (evt) {
    var target              = evt.currentTarget;
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
    var newState        = 0;
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
            this.screenRender (null,this.currentScreen);
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
/*
        if (!confirm('Are you sure?')) {
            return;
        }
*/
    var target          = evt.currentTarget;
    var newState        = 0;
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
            this.screenRender (null,this.currentScreen);
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
        this.log ('Authenticating automatically');
        this.screenLockRefreshInhibit = 1;
        try {
        var response = await super.authenticate (
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
        evt.preventDefault ();
        try {
        var pwd         = evt.currentTarget.form.password.value;
            if (pwd.length==0) {
                this.log ('No password given');
                return;
            }
            evt.currentTarget.form.password.value  = '';
        var email       = null;
            if (evt.currentTarget.form.email.value.length && evt.currentTarget.form.email.value.indexOf('@')<0) {
                evt.currentTarget.form.email.value += '@burdenandburden.co.uk';
                evt.currentTarget.click ();
                return;
            }
            email       = evt.currentTarget.form.email.value;
        var response    = await super.authenticate (
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
        await this.screenRender (null,'home');
        super.authForget ();
    }

    async authOk ( ) {
        super.authOk ();
        // Now get business configuration data
        await this.configRequest ();
        // Render a screen by URL (only when page loads)
        if (this.urlScreen) {
            await this.templateFetch (this.urlScreen);
            await this.screenRender (null,this.urlScreen);
            this.urlScreen = null;
            return;
        }
        // Render a default screen
        if (!this.currentScreen) {
            await this.templateFetch ('home');
            await this.screenRender (null,'home');
        }
    }

    async bankDetailsHash (target) {
        if (!target || !('bankdetailshash' in target.dataset)) {
            return true;
        }
    var form    = target.parentElement.parentElement.parentElement;
    var scan    = form.sortCode.value.trim().replace('-','') + form.accountNumber.value.trim();
    var tgt     = form.bankDetailsHash;
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
    var elements            = this.qsa (this.restricted,'form#contracts [data-contract]');
        for (var e of elements) {
            e.addEventListener ('change',this.contractToggle.bind(this));
        }
    }

    async contractToggle (evt) {
    var target              = evt.currentTarget;
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
    var target          = evt.currentTarget;
    var newState        = 0;
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
            this.screenRender (null,this.currentScreen);
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
    var user    = this.find (
            this.data.users
           ,'userId'
           ,evt.currentTarget.value
           ,false
        );
        evt.currentTarget.form.agentName.value      = user.userName;
    }

    deriveFundraiser (evt) {
    var user    = this.find (
            this.data.users
           ,'userId'
           ,evt.currentTarget.value
           ,false
        );
        evt.currentTarget.form.knownAs.value        = user.userName;
    var badgeNr                                     = user.email.split ('@');
        evt.currentTarget.form.badgeNumber.value    = badgeNr[0];
    }

    async init ( ) {
        console.log ('Admin GUI initialising');
//        try {
            await this.globalInit ();
//        }
//        catch (e) {
//            throw new Error (e.message);
//            return false;
//        }
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
        if (!confirm('Are you sure?')) {
            return true;
        }
        try {
        var expires         = await this.keyReleaseRequest (this.parameters.userId);
        }
        catch (e) {
            this.splash (2,'Failed to release new key','Error','OK');
            return false;
        }
    var dt                  = new Date (expires*1000);
        this.splash (0,'New key created and released by successful log-in before '+dt.toUTCString());
        this.find(this.data.users,'userId',this.parameters.userId,false).hasKey = 1;
        this.screenRender (null,'user');
        return true;
    }

    managerChange (evt) {
    var select              = evt.currentTarget;
    var link                = this.qs (select.parentElement,'a[data-screen=manager]');
        link.dataset.value  = select.value;
        link.textContent    = select.options[select.selectedIndex].textContent;
    }
 
    managerChangeListen ( ) {
    var select              = this.qs (this.restricted,'#manager-change [data-column=has_manager_id]');
        select.addEventListener ('change',this.managerChange.bind(this));
    }
 
    membershipListen ( ) {
    var form                = this.qs (this.restricted,'form#membership');
        if (!form) {
            return;
        }
        for (var elmt of form.elements) {
            elmt.addEventListener ('change',this.membershipToggle.bind(this));
        }
    }

    async membershipToggle (evt) {
    var target              = evt.currentTarget;
        if (!confirm('Are you sure?')) {
            if (target.checked) {
                target.checked = false;
            }
            else {
                target.checked = true;
            }
            return;
        }
    var newState            = 0;
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

    async passwordSetTemporary ( ) {
    var p1 = this.qs (this.restricted,'#user-pwd');
        if (!p1.value) {
            this.splash (2,'No password was entered','Error','OK');
            return false;
        }
    var p2 = this.qs (this.restricted,'#user-pwd-confirm');
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
    var select              = this.qs (evt.currentTarget.form,'#products-processor');
        if (!select) {
            return;
        }
    var proc                = select.value;
        select.innerHTML    = '';
        select.appendChild (this.option(['','Select:']));
    var props               = { LT:'isLottery', RG:'isRegularGiving' };
    var procs               = this.data.config.processors;
    var selected;
        for (var i=0;procs[i];i++) {
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
    var form        = this.qs (this.restricted,'form[data-report]');
    var target      = this.qs (this.restricted,'#'+evt.currentTarget.dataset.target);
    var title       = evt.currentTarget.dataset.title;
    var file        = title.replace(/[^a-zA-Z ]/g,'').replace(/ /g,'-');
    var args        = [];
    var type        = 'xml';
        if (evt.currentTarget.dataset.download=='csv') {
            type    = 'csv';
        }
        for (var i=0;form.elements[i];i++) {
            args.push (form.elements[i].value);
        }
        try {
        var report  = await this.reportRequest (args);
        }
        catch (e) {
        var err     = this.errorSplit (e.message);
            if (err.hpapiCode=='400') {
                this.splash (2,'Invalid input(s)','Error','OK');
            }
            else {
                this.splash (2,e.message,'Error','OK');
            }
            return false;
        }
        if (type=='csv') {
        var link = this.downloadLink (
                'Here is your download'
               ,file+'.csv'
               ,'text/csv'
               ,this.objectToCsv (report)
            );
            target.appendChild (link);
            return true;
        }
    var link        = this.downloadLink (
            'Here is your download'
           ,file+'.xml'
           ,'text/xml'
           ,this.objectToMsExcel2003Xml (report,title)
        );
        target.appendChild (link);
        return true;
    }

    testHandler (evt) {
        // Bespoke handler
        alert ('So you want to do stuff, eh?');
    }

    testCsvDownload (evt) {
    var target          = evt.currentTarget;
    var data = [
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
    var link            = this.downloadLink (
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
        // TODO: add callback to google maps loaded in index.html; or load on demand
        this.qs(document,'#test-map-div').classList.add ('test-map-dims');

        var pinglist = await this.pingsRequest (3,"2019-03-05","2019-03-06");
console.log (JSON.stringify(pinglist,null,'    '));
        if (pinglist === false) {
            alert ("failed to fetch pings");
            return;
        }
        
        if (google === undefined) {
            alert ("Google Maps API not loaded");
            return;
        }


        var start = {lat:pinglist[0].y, lng:pinglist[0].x};

        var routemap = new google.maps.Map(
            document.getElementById('test-map-div'), {zoom: 8, center: start}
        );


        /* The docs imply you can create the polyline here and then extend it by adding to the
         * path, but it didn't seem to work for me.  But this seems fine.
        */
        var path = [];
        var bounds=new google.maps.LatLngBounds();

        pinglist.forEach(pingobj => {

            path.push({lat:pingobj.y, lng:pingobj.x});

            bounds.extend({lat:pingobj.y, lng:pingobj.x});

            var marker = new google.maps.Marker({
                position: {lat:pingobj.y, lng:pingobj.x},
                title: pingobj.t,
                map: routemap
            });
        });

        var route = new google.maps.Polyline({
            path: path,
            map: routemap,
            strokeColor: '#aa0000',
            strokeOpacity: 0.5,
            strokeWeight: 1
        });

        routemap.fitBounds(bounds);
    }

    async testMapLoadOSM (evt) {
        this.qs(document,'#test-map-div').classList.add ('test-map-dims');

        var pinglist = await this.pingsRequest (3,"2019-03-05","2019-03-06");
        if (pinglist === false) {
            alert ("failed to fetch pings");
            return;
        }

        var mymap = L.map('test-map-div').setView([2.201, 0.132], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo (mymap);

        /* plots default markers
        var bounds = L.latLngBounds();
        pinglist.forEach(pingobj => {
            bounds.extend([pingobj.y, pingobj.x]);
            L.marker([pingobj.y, pingobj.x]).addTo(mymap);
        });
        mymap.fitBounds(bounds);
        */ 

        var route = L.polyline([], {color: 'red', smoothFactor: 0,});
        pinglist.forEach(pingobj => {
            route.addLatLng([pingobj.y, pingobj.x]);
            L.marker([pingobj.y, pingobj.x], {title: pingobj.t}).addTo(mymap);
            //route.addTo(mymap);
        });

        mymap.fitBounds(route.getBounds());
        route.addTo(mymap);
    }

    async testValidateNumber ( ) {
        var num = this.qs(document,'#test-validate-input').value;
        var data = 
            {
            "type": "mobile",
            "number": num,
            "fullresult": "true"
            }
        ;
        try {
            var validateResponse = await this.validateRequest(data);
            console.log(validateResponse);
            this.qs(document,'#test-validate-div').innerText = JSON.stringify(validateResponse.Result);
        }
        catch (e) {
            this.qs(document,'#test-validate-div').innerText = e.message;
        }
    }

    testXmlDownload (evt) {
    var target          = evt.currentTarget;
    var title           = "My test data";
    var data            = [
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
    var link            = this.downloadLink (
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
    var target      = evt.currentTarget;
    var newState    = 1 - parseInt(target.getAttribute('data-value'));
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

