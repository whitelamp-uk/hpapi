
/* Copyright 2018 Burden and Burden  http://www.burdenandburden.co.uk/ */

import {AdminGui} from './admin-gui.js';

export class AdminEnforcer extends AdminGui {

    actors (templateName) {
        var defns;
        this.editModeReset ();
        switch (templateName) {
            case 'agents':
                defns = [
                    { id: 'agent-new-user', event: 'change', function: this.deriveAgent }
                ];
                break;
            case 'districts':
                defns = [
                    { class: 'zone-toggle', event: 'click', function: this.zoneToggle }
                ];
                break;
            case 'fundraisers':
                defns = [
                    { id: 'fundraiser-new-user', event: 'change', function: this.deriveFundraiser }
                ];
                break;
            case 'nextofkin_place':
                defns = [
                    { class: 'place-comms', event: 'click', function: this.placeUpdate },
                    { class: 'place-address', event: 'click', function: this.placeUpdate }
                ];
                break;
            case 'place':
                defns = [
                    { class: 'place-contact', event: 'click', function: this.placeUpdate },
                    { class: 'place-comms', event: 'click', function: this.placeUpdate },
                    { class: 'place-address', event: 'click', function: this.placeUpdate },
                    { class: 'place-what3words', event: 'click', function: this.placeUpdate },
                    { class: 'place-location', event: 'click', function: this.placeUpdate }
                ];
                break;
            case 'products':
                defns = [
                    { id: 'products-type', event: 'change', function: this.processorList }
                ];
                break;
            case 'report':
                defns = [
                    { id: 'report-csv', event: 'click', function: this.report },
                    { id: 'report-xml', event: 'click', function: this.report }
                ];
                break;
            case 'test':
                defns = [
                    { id: 'test-csv-download', event: 'click', function: this.testCsvDownload },
                    { id: 'test-csv-upload', event: 'change', function: this.testCsvUpload },
                    { id: 'test-map-load', event: 'click', function: this.testMapLoad },
                    { id: 'test-map-route-load', event: 'click', function: this.mapPings },
                    { id: 'test-validate-number', event: 'click', function: this.testValidateNumber },
                    { id: 'test-xml-download', event: 'click', function: this.testXmlDownload },
                    { id: 'test-xml-upload', event: 'change', function: this.testXmlUpload }
                ];
                break;
            case 'tree':
                defns = [
                    { id: 'hierarchy-render', event: 'click', function: this.hierarchyRender },
                    { id: 'hierarchy-download', event: 'click', function: this.hierarchyDownload }
                ];
                break;
            case 'user':
                defns = [
                    { id: 'user-key', event: 'click', function: this.keyRelease },
                    { class: 'user-pwd-sm-set', event: 'click', function: this.passwordSelfManage },
                    { id: 'user-pwd-clear', event: 'click', function: this.passwordClear },
                    { id: 'user-pwd-set', event: 'click', function: this.passwordSetTemporary }
                ];
                break;
            default:
                return;
        }
        this.actorsListen (defns);
    }

    hotkeys ( ) {
        return {
            "#" : [ this.hotkeysShow, "(~) show hot keys" ],
            "," : [ this.entryPrevious, "(<) select previous form input" ],
            "." : [ this.entryNext, "(>) select next form input" ],
            "'" : [ this.entryNew, "(@) new item toggle" ],
            "/" : [ this.filterHotkeyToggle, "(?) filter toggle" ],
            "]" : [ this.burger, "(}) burger menu toggle" ]
        }
    }

    async loaders (evt,templateName) {
        switch (templateName) {
            case 'agent':
            case 'allows':
                this.agentallowsListen ();
                return true;
            case 'contractors':
            case 'fundraiser':
                this.contractsListen ();
                return true;
            case 'manager':
                this.managerChangeListen ();
                return true;
            case 'menu':
                this.menuListen ();
                return true;
            case 'new':
                evt.currentTarget.focus ();
                return true;
            case 'nextofkin_place':
            case 'place':
                this.placeListen ();
                return true;
            case 'user':
                this.membershipListen ();
                return true;
            default:
                return null;
        }
    }

    navigators ( ) {
        return {
            blocks : {
                "home"          : { scope: null, templates: {"home":"Home"} },
                "users"         : { scope: null, templates: {"users":"API users","agents":"Agents"} },
                "tree"          : { scope: null, templates: {"tree":"Staff"} },
                "accounts"      : { scope: null, templates: {"accounts":"Accounts"} },
                "reports"       : { scope: null, templates: {"reports":"Reports"} },
                "test"          : { scope: null, templates: {"test":"Test"} },
                "user"          : { scope: "userId", templates: {"user":"API user"} },
                "agent"         : { scope: "agentId", templates: {"agent":"Agent"} },
                "staff"         : { scope: null, templates: {"fundraisers":"Fundraisers","managers":"Managers","teams":"Teams"} },
                "fundraiser"    : { scope: "fundraiserId", templates: {"fundraiser":"Fundraiser"} },
                "manager"       : { scope: "managerId", templates: {"manager":"Manager"} },
                "team"          : { scope: "teamId", templates: {"team":"Team"} },
                "account"       : { scope: "accountId", templates : {"account":"Account","allows":"Agents","areas":"Zones","contractors":"Contracts","products":"Products"} },
                "product"       : { scope: "producttypeCode", templates : {"product":"Product"} },
                "flags"         : { scope: null, templates: {"flags":"Flags"} },
                "flag"          : { scope: "signupId", templates: {"flag":"Flag"} },
                "forms"         : { scope: null, templates: {"forms":"Forms"} },
                "formfields"    : { scope: "formId", templates : {"formfields":"Fields"} }
            },
            crumbs : {
                "home"          : { back: [], forward: ["users","tree","accounts","reports","test"] },
                "users"         : { back: ["home"], forward: ["user","agent"] },
                "tree"          : { back: ["home"], forward: ["staff"] },
                "accounts"      : { back: ["home"], forward: ["account"] },
                "reports"       : { back: ["home"], forward: ["flags","forms"] },
                "test"          : { back: ["home"], forward: [] },
                "user"          : { back: ["home","users"], forward: [] },
                "agent"         : { back: ["home","users"], forward: [] },
                "staff"         : { back: ["home","tree"], forward: ["fundraiser","manager","team"] },
                "fundraiser"    : { back: ["home","tree","staff"], forward: ["manager","team"] },
                "manager"       : { back: ["home","tree","staff","fundraiser"], forward: ["team"] },
                "team"          : { back: ["home","tree","staff","fundraiser","manager"], forward: [] },
                "account"       : { back: ["home","accounts"], forward: ["product"] },
                "product"       : { back: ["home","accounts","account"], forward: [] },
                "flags"         : { back: ["home","reports"], forward: ["flag"] },
                "forms"         : { back: ["home","reports"], forward: ["formfields"] },
                "formfields"    : { back: ["home","reports","forms"], forward: [] }
            }
        }
    }

    navigatorsSelector ( ) {
        return 'a.navigator,button.navigator,.nugget.navigator';
    }

    preloaders (templateName) {
        switch (templateName) {
            case 'managers':
            case 'team':
            case 'teams':
                return [this.staffRequest];
            case 'accounts':
                return [this.accountsRequest];
            case 'account':
                return [this.accountsRequest,this.staffRequest];
            case 'agent':
                return [this.usergroupsRequest,this.usersRequest,this.accountsRequest,this.agentsRequest,this.agentallowsRequest];
            case 'agents':
                return [this.usergroupsRequest,this.usersRequest,this.agentsRequest];
            case 'allows':
                return [this.accountsRequest,this.agentsRequest,this.accountallowsRequest];
            case 'areas':
                return [this.accountsRequest,this.areasRequest];
            case 'contract':
            case 'contractors':
            case 'tree':
                return [this.accountsRequest,this.staffRequest];
            case 'districts':
                return [this.districtsRequest];
            case 'formfields':
                return [this.formfieldsRequest];
            case 'fundraiser':
                return [this.usergroupsRequest,this.usersRequest,this.staffRequest,this.bankDetailsHash,this.accountsRequest,this.staffRequest];
            case 'fundraisers':
                return [this.usergroupsRequest,this.usersRequest,this.staffRequest];
            case 'hierarchy':
            case 'users':
            case 'user':
                return [this.staffRequest,this.usergroupsRequest,this.usersRequest];
            case 'nextofkin':
                return [this.nextofkinRequest];
            case 'products':
            case 'product':
                return [this.accountsRequest,this.productsRequest];
            case 'reports':
                return [this.reportsRequest];
            case 'test':
                return [this.testPings];
            default:
                return [];
        }
    }

    unstickers ( ) {
        return {
            accountId : [
                "producttypeCode",
                "area"
            ],
            agentId : [
                "userId"
            ],
            fundraiserId : [
                "userId"
            ],
            userId : [
                "agentId",
                "fundraiserId"
            ]
        }
    }

}

