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
    var _selectionModel;
    var _legendaModel;
    var _playADayModel;
    var _filterModel;



    // Hold the status of the current visualization context
    var _visualizationTypeModel;

    // Holds the status of the current map context
    var _mapModel;

    // Holds historical weather data of Chicago
    var _weatherModel;


    var _flowData;

    this.setFlowData = function(flowData) {
        _flowData = flowData;
    };

    this.getFlowData = function() {
        return _flowData;
    };
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
     * @returns
     */
    this.getFilterModel = function() {
        return _filterModel;
    };

    /**
     * @returns
     */
    this.getLegendaModel = function() {
        return _legendaModel;
    };

    /**
     * @returns
     */
    this.getPlayADayModel = function() {
        return _playADayModel;
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
     * @returns {VisualizationTypeModel}
     */
    this.getVisualizationTypeModel = function() {
        return _visualizationTypeModel;
    };


    /**
     * @returns a mapModel object
     */
    this.getMapModel = function() {
        return _mapModel;
    };


    /**
     * @returns SelectionModel
     */
    this.getSelectionModel = function() {
        return _selectionModel;
    };


    /**
     * Returns the model that holds historical weather data of Chicago
     * @returns {WeatherModel}
     */
    this.getWeatherModel = function() {
        return weatherModel;
    };
    
    
    /**
     * @returns an id identifying this model (and then the map container) inside the App
     */
    this.getId = function() {
        return _id;
    };


    /**
     * Initialization stuffs
     */
    var init = function() {
        _notificationCenter = new NotificationCenter();
        _colorsModel = new ColorsModel(_id);
        _visualizationTypeModel = new VisualizationTypeModel(self);
        _timeModel = new TimeModel(self);
        _mapModel = new MapModel(self);
        _selectionModel = new SelectionModel(self);
        _legendaModel = new LegendaModel(self);
        _playADayModel = new PlayADayModel(self);
        _filterModel = new FilterModel(self);
        //_weatherModel = new WeatherModel(self);
    } ();
}
