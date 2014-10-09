/**
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
            case VisualizationType.PLAY_A_DAY:
                _layoutClass = PlayADayToolsLayoutController;
        }

        return _layoutClass;
    };

    // PRIVATE METHODS
    var init = function() {

    } ();
}