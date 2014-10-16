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





    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        _layerGroup = L.layerGroup();
    } ();
}

Utils.extend(MapLayerController, ViewController);