/**
 * @class ChartsFactory
 * @description implements a factory that returns charts class based on the current visualization type context
 *
 * @constructor
 */
function ChartsFactory() {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _chartsClasses;

    // PUBLIC METHODS
    /**
     *
     * @param visualizationType
     */
    this.getLayoutClass = function(visualizationType) {
        switch(visualizationType) {
            case VisualizationType.OVERALL_STATISTICS:

                break;
            case VisualizationType.STATION_POPULARITY:

                break;
            case VisualizationType.PLAY_A_DAY:

                break;
            case VisualizationType.STATION_FLOW_BALANCE:

                break;
            case VisualizationType.DAY_PATTERNS:

        }

        return _chartsClasses;
    };

    // PRIVATE METHODS
    var init = function() {

    } ();
}