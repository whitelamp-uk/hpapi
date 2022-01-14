
/* Copyright 2018 Whitelamp http://www.whitelamp.co.uk/ */

import {HpapiManGui} from './hpapi-man-gui.js';

export class HpapiManEnforcer extends HpapiManGui {

    actors (templateName) {
        var defns;
        this.editModeReset ();
        switch (templateName) {
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
            case 'test':
                this.doSomethingAfterScreenRender ();
                return true;
            default:
                return null;
        }
    }

    navigators ( ) {
        return {
            blocks : {
             },
            crumbs : {
            }
        }
    }

    navigatorsSelector ( ) {
        return 'a.navigator,button.navigator,.nugget.navigator';
    }

    preloaders (templateName) {
        switch (templateName) {
            case 'test':
                return [this.doSomethingBeforeScreenRender];
            default:
                return [];
        }
    }

    unstickers ( ) {
        return {
        }
    }

}

