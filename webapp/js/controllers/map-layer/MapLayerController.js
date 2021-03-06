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
     * @returns {Object} x:.., y:..
     */
    this.project = function(lat, lng) {
        return self.getModel().getMapModel().projectAtDefaultZoom(lat,lng);
    };

    /**
     * Wrapper for the standard d3 projection
     */
    this.d3projection = function(latLng) {
       var point = self.project(latLng[1], latLng[0]);
       return [point.x, point.y];
    } ;


    /**
     * Called when the view is detached
     * Do clean-up stuff
     */
    this.dispose = function() {

    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////
    var init = function() {
        _layerGroup = L.layerGroup();
        var topLeftCoord = self.getModel().getMapModel().getTopLeftCoordOfInterest();
        var bottomRightCoord = self.getModel().getMapModel().getBottomRightCoordOfInterest();
        var topLeft = self.getModel().getMapModel().projectAtDefaultZoom(topLeftCoord.lat,topLeftCoord.lng);
        var bottomRight =  self.getModel().getMapModel().projectAtDefaultZoom(bottomRightCoord.lat,bottomRightCoord.lng);
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;


        self.getView().setFrame(0,0,bottomRight.x,bottomRight.y);

    } ();
}

Utils.extend(MapLayerController, ViewController);