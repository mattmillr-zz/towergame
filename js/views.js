define(['jquery', 'config', 'utils', 'views/baddie.view', 'views/tower.view'], function ($, config, utils, baddie_view, tower_view) {
    var views = {};
    
    views.Baddie = baddie_view;
    views.Tower = tower_view;
    
    return views;

});
    