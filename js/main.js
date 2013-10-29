// This require.config block is optimized by r.js, no logic or external variables can go in here

require.config({
    // enforceDefine: true, // using this to debug IE8
    urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        /*
        underscore: {
          exports: '_'
        },
        backbone: {
          deps: ["underscore", "jquery"],
          exports: "Backbone"
        },
        bootstrap: {
          deps: ["jquery"],
        }
        */
    },
    baseUrl: 'js/',
    paths: {
        //'backbone': 'backbone-1.0.0',
        'jquery': 'jquery-1.9.1',
        //'knockout': 'knockout-2.2.0.debug',
        //'knockback': 'knockback-0.17.2',
        //'underscore': 'underscore-1.5.1'
    },
    config: {}
})


require(['jquery', 'app'], 
  function ($, app) {
    'use strict'

    $(function () {
      app.run();
    });
    
  }
);
