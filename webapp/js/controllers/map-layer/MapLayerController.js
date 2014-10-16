/**
 * @class MapLayerController
 * @description
 *
 * @param parentController
 * @param layer
 * @constructor
 */
function MapLayerController(parentController) {
    ViewController.call(this, parentController);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // Contains all the layers of the VC
    var _layerGroup;

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * Getter for the layer group attribute
     *
     * Note: MapViewController needs this getter in order to remove layers from the map
     * @returns {*}
     */
    this.getLayerGroup = function() {
        return _layerGroup;
    };

    /**
     * Project the coordinate to a point coherent to the layer
     * @param lat
     * @param lng
     * @returns {*}
     */
    this.project = function(lat, lng) {
        return self.getModel().getMapModel().projectAtDefaultZoom(lat,lng);
    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        _layerGroup = L.layerGroup();

    } ();
}

Utils.extend(MapLayerController, ViewController);