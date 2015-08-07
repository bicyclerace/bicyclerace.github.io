/**
 * @class ChartsFactory
 * @description implements a factory that returns charts class based on the current visualization type context
 *
 * @constructor
 */
function ChartsFactory() {
    // PRIVATE ATTRIBUTES
    var self = this;

    // PUBLIC METHODS
    /**
     *
     * @param visualizationType
     */
    this.getChartsControllersClasses = function(visualizationType) {
        var chartsClasses = [];
        switch(visualizationType) {
            case VisualizationType.OVERALL_STATISTICS:
                chartsClasses.push(BikesOutChartViewController);
                chartsClasses.push(RiderDemographicsChartViewController);
                chartsClasses.push(RidesDistributionChartViewController);
                break;
            case VisualizationType.STATION_POPULARITY:

                break;
            case VisualizationType.PLAY_A_DAY:
                chartsClasses.push(BikesOutInPlayADayChartViewController);
                break;
            case VisualizationType.STATION_FLOW_BALANCE:

                break;
            case VisualizationType.COMPARE:
                chartsClasses.push(CompareFlowChartViewController);
                break;
            case VisualizationType.DAY_PATTERNS:

        }

        return chartsClasses;
    };

    // PRIVATE METHODS
    var init = function() {

    } ();
}