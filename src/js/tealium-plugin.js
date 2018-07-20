(function($) {

// whether or not connection to window.utag succesful
var tealiumTagFound = false;

// get current host
const HOST = window.location.host;

// production urls
const PRODUCTION_URLS = [
    'fashion.bloomingdales.com',
    'www.bloomingdales.com',
    'm.bloomingdales.com'
];

// valid event types
const VALID_EVENT_TYPES = [
    'view',
    'link',
  ];

$.extend($, {
    // create instance
    tealiumTag: function(options) {
        var defaults = {
            // default page id's for onLoad tags
            page_paths: {}
        }

        // handle defaults and user settings
        options = $.extend(defaults, options);

        // init called when plugin instance is created 
        function init() {
            // check to see if library connected
            tealiumTagFound = checkForLibrary();

            if(tealiumTagFound) {
                log("Tealium Tag Initiated");
            }
            else {
                // could not connect to coremetrics
                log("ERROR: Could not find library (from init method)");
            }
        }

        // test window.utag
        function checkForLibrary() {
            try {
                if(window.utag) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                log("ERROR: Could not find window.utag library (from checkForLibrary method): " + e);
                return false;
            }
        }

        // logger
        function log(msg) {
            if (window.console && PRODUCTION_URLS.indexOf(path) === -1) {
                console.log(msg);
            }
        }

        // method to fire tags (cat is optional)
        function fireTag(params) {
            if(tealiumTagFound) {
                if(params) {
                    var cat = params.cat || options.category_id;
                    var id = params.id;
                    if(id) {
                        switch(params.type) {
                            case "element":
                                cmCreatePageElementTag(id, cat);
                            break;
                            default:
                                cmCreatePageviewTag(id, cat);
                        }
                    }
                    else {
                        log("ERROR: No id specified (from fireTag Method)");
                    }
                }
                else {
                    log("ERROR: Parameters not set (from fireTag Method)");
                }
            }
            else {
                log("ERROR: Coremetrics not found (from fireTag Method)");
            }
        }

        // call page view tag 
        function cmCreatePageviewTag(id, cat) {
            try {
                window.BLOOMIES.coremetrics.cmCreatePageviewTag(id, cat, '', '');
                log("Coremetrics Page: Category: " + cat + " ID: " + id);
            } catch (e) {
                log("cmCreatePageviewTag Error: " + e);
            }
        }

        // call element tag
        function cmCreatePageElementTag(id, cat) {
            try {
                window.BLOOMIES.coremetrics.cmCreatePageElementTag(id, cat);
                log("Coremetrics Element: Category: " + cat + " ID: " + id);
            } catch (e) {
                log("cmCreatePageElementTag Error: " + e);
            }
        }

        // return current directory
        function path() {
            var urlArr = window.location.pathname.split("/");
            if( urlArr[urlArr.length - 1] === "" ) {
                return urlArr[urlArr.length - 2];
            }
            else {
                return urlArr[urlArr.length - 1];
            }
            return window.location.pathname;
        }

        // init
        init();

        // public methods
        return {
            init: function() {
                init();
            },
            fire: function(params) {
                fireTag(params);
            },
            path: function() {
                return path();
            },
            category_id: function(val) {
                if(val) {
                    options.category_id = val;
                }
                else {
                    return options.category_id;
                }
            },
            checkForCormetrics: function () {
                return coremetrics();
            }
        };
    }
});
})(jQuery);