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
                _layoutClass = OverallStatisticsToolLayoutController;
                break;
        }

        return new _layoutClass;
    };

    // PRIVATE METHODS
    var init = function() {

    } ();
}