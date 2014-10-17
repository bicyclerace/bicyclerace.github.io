/**
 * @class LayoutFactory
 * @description implements a factory that returns tools layout class based on the current visualization type context
 *
 * @constructor
 */
function LayoutFactory() {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _layoutClass;

    // PUBLIC METHODS
    /**
     *
     * @param visualizationType
     */
    this.getLayoutClass = function(visualizationType) {
        switch(visualizationType) {
            case VisualizationType.OVERALL_STATISTICS:
                _layoutClass = OverallStatisticsToolsLayoutController;
                break;
            case VisualizationType.STATION_POPULARITY:
                _layoutClass = PopularityToolsLayoutController;
                break;
            case VisualizationType.PLAY_A_DAY:
                _layoutClass = PlayADayToolsLayoutController;
                break;
            case VisualizationType.STATION_FLOW_BALANCE:
                _layoutClass = FlowBalanceToolsLayoutController;
                break;
            case VisualizationType.DAY_PATTERNS:
                _layoutClass = PatternsToolLayoutController;
        }

        return _layoutClass;
    };

    // PRIVATE METHODS
    var init = function() {

    } ();
}