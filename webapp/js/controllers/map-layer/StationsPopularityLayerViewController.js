/**
 * @class StationsPopularityLayerViewController
 * @description
 *
 * @param parentController
 * @param layer
 * @constructor
 */
function StationsPopularityLayerViewController(parentController, layerGroup) {
    ViewController.call(this, parentController);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // Contains all the layers of the VC
    var _layerGroup = layerGroup;

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
    var draw = function() {
        //var markerLayer = L.marker(self.getModel().getMapModel().getFocusPoint());
        var stations = self.getModel().getDBModel().getStations();
        for(var stationId in stations) {
            var latitude = stations[stationId].station_latitude;
            var longitude = stations[stationId].station_longitude;
            _layerGroup.addLayer(L.marker([latitude, longitude]));
        }
        //_layerGroup.addLayer(markerLayer);

    };

    var init = function() {
        draw();
    } ();
}

Utils.extend(StationsPopularityLayerViewController, ViewController);