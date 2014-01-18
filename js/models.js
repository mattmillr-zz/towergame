define(['views', 'config', 'utils', 'models/baddie.model', 'models/tower.model'], 
       function (views, config, utils, baddie_model, tower_model) {
    var models = {};

    models.Baddie = baddie_model;
    models.Tower = tower_model;
    
    return models;

});


