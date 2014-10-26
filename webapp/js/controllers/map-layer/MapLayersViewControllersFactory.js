/**
 * @class MapLayerViewControllersFactory
 * @description Factory class that return an array of layerControllers based on current visualization type context
 *
 * @constructor
 */
function MapLayerViewControllersFactory() {
    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * Returns an Array of layersViewController classes for the current visualization type parameter
     * @param visualizationType @see VisualizationTypeModel for available types.
     * @returns {Array} of layers view controllers classes.
     */
    this.getLayersControllers = function(visualizationType) {
        var layersControllers = [];
        switch(visualizationType) {
            case VisualizationType.OVERALL_STATISTICS:
                layersControllers.push(CommunityGridLayerViewController);
                break;
            case VisualizationType.COMPARE:
                layersControllers.push(CompareLayerViewController);
                layersControllers.push(SelectStationLayerViewController);
                layersControllers.push(CompareTwoStationsLayerViewController);
                break;
            case VisualizationType.STATION_POPULARITY:
                layersControllers.push(StationsPopularityLayerViewController);
                layersControllers.push(CommunityGridLayerViewController);
                break;
            case VisualizationType.PLAY_A_DAY:
                layersControllers.push(SelectStationLayerViewController);
                layersControllers.push(PlayADayLayerViewController);
                layersControllers.push(PlayADayPopupsViewController);
                break;
            case VisualizationType.STATION_FLOW_BALANCE:
                layersControllers.push(FlowBalanceLayerViewController);
                break;
            case VisualizationType.DAY_PATTERNS:
                layersControllers.push(SelectStationLayerViewController);
                layersControllers.push(OverallFlorLayerViewController);
                break;
        }

        return layersControllers;
    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var init = function() {
    } ();
}