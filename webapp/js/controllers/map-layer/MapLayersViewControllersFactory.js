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

                break;
            case VisualizationType.STATION_POPULARITY:
                layersControllers.push(StationsPopularityLayerViewController);
                break;
            case VisualizationType.PLAY_A_DAY:

                break;
            case VisualizationType.DAY_PATTERNS:

        }

        return layersControllers;
    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var init = function() {
    } ();
}