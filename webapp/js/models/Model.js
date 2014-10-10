/**
 * @class: Model
 * @description: ...
 */

// Data structure which holds shared data between different model instances
var sharedModel = sharedModel || {};

// Shared DBModel
var databaseModel = databaseModel || new DBModel();

var modelsIdCounter = 0;

function Model() {
    // PRIVATE ATTRIBUTES
    var self = this;
    var _id = modelsIdCounter++;
    var _notificationCenter;
    var _colorsModel;
    var _timeModel;

    // Hold the status of the current visualization context
    var _visualizationTypeModel;

    // PUBLIC METHODS
    /**
     * get notification center associated to this model
     * @returns {NotificationCenter}
     */
    this.getNotificationCenter = function() {
        return _notificationCenter;
    };

    /**
     * @returns the color model
     */
    this.getColorModel = function() {
        return _colorsModel;
    };

    /**
     * @returns The DBModel object, which contains all the interfaces to the database{dbModel|*|DBModel}
     */
    this.getDBModel = function() {
        return databaseModel;
    };

    /**
     * @returns the time model
     */
    this.getTimeModel = function() {
        return _timeModel;
    };

    /**
     *
     * @returns {*}
     */
    this.getVisualizationTypeModel = function() {
        return _visualizationTypeModel;
    };

    /**
     * @returns an id identifying this model (and then the map container) inside the App
     */
    this.getId = function() {
        return _id;
    };

    /* EXAMPLE
    this.setStation = function(id) {
        _id = id;
        self.getNotificationCenter().dispatch()
    }*/


    /**
     * Initialization stuffs
     */
    var init = function() {
        _notificationCenter = new NotificationCenter();
        _colorsModel = new ColorsModel(_id);
        _visualizationTypeModel = new VisualizationTypeModel(self);
        _timeModel = new TimeModel(self);
    } ();
}
