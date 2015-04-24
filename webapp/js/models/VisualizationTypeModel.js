/**
 * @class VisualizationTypeModel
 * @description this model class holds the current visualization type context. Those in the web app are displayed in
 * the bottom bar.
 *
 * @param parentModel
 * @constructor
 */
function VisualizationTypeModel(parentModel) {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _parentModel = parentModel;
    var _visualizationType = VisualizationType.OVERALL_STATISTICS;

    // PUBLIC METHODS
    /**
     * Sets the visualization type context for the visualization module
     * @param type
     */
    this.setVisualizationType = function(type) {
        _visualizationType = type;
        _parentModel.getNotificationCenter().dispatch(Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
    };

    /**
     * Get the current visualization type context of the visualization module
     * @returns {string}
     */
    this.getCurrentVisualizationType = function() {
        return _visualizationType;
    };

    /**
     *
     * @returns {{OVERALL_STATISTICS: string, STATION_POPULARITY: string, PLAY_A_DAY: string, COMPARE: string, DAY_PATTERNS: string, STATION_FLOW_BALANCE: string}}
     */
    this.getAvailableVisualizationTypes = function() {
        return VisualizationType;
    };

    // PRIVATE METHODS
    var init = function () {
    } ();
}

var VisualizationType = {
    OVERALL_STATISTICS : "Overall",
    STATION_POPULARITY : "Popularity",
    PLAY_A_DAY : "Play A Day",
    COMPARE : "Compare",
    DAY_PATTERNS : "Patterns",
    STATION_FLOW_BALANCE : "Flow Balance"
};
