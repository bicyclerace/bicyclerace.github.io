/**
 *
 * @param parentModel
 * @constructor
 */
function MapModel(parentModel) {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _parentModel = parentModel;
    var _map;

    // This is the default latitude and longitude of the Map center.

//    latitude:41.869912359714654, longitude:-87.64772415161133
    var  _focusPoint = { latitude:41.876320, longitude:-87.572841 };
    var _topLeftCoord = new L.latLng(/*41.978353*/42.1, /*-87.707857*/-88.0);
    var _bottomRightCoord = new L.latLng(/*41.788746*/41.1, /*-87.580715*/-87.0);
    var _defaultZoomForProjecting = 10;

    var _gridEnabled = false;


    ////////////////////////// PUBLIC METHODS //////////////////////////


    /**
     *
     * @returns {Array} [latitude, longitude]
     */
    this.getMapBounds = function() {
        return _map.getBounds();
    };


    /**
     *
     */
    this.getTopLeftCoordOfInterest = function() {
        return _topLeftCoord;
    } ;

    /**
     *
     */
    this.getBottomRightCoordOfInterest = function() {
        return _bottomRightCoord;
    };


    /**
     *
     */
    this.projectAtDefaultZoom = function(lat,long) {
        return _map.project(new L.LatLng(lat,long), _defaultZoomForProjecting);
    };


    /**
     *
     */
    this.getZoomLevel = function() {
        return _map.getZoomLevel();
    };

    /**
     *
     * @returns {*[]}
     */
    this.getDefaultFocusPoint = function() {
        return [
            _focusPoint.latitude,
            _focusPoint.longitude
        ];
    };

    /**
     * Set the current leaflet map object to be used with this model
     * @param map
     */
    this.setMap = function(map) {
        _map = map;
        _map.on("move", function(){
            _parentModel.getNotificationCenter().dispatch(Notifications.mapController.MAP_POSITION_OR_ZOOM_CHANGED)
        });

        _map.on("zoomend", function(){
            _parentModel.getNotificationCenter().dispatch(Notifications.mapController.ZOOM_CHANGED);
        });
    };


    /**
     *
     * @param lat
     * @param long
     * @returns {*}
     */
    this.fromLatLngToLayerPoint = function(lat,long){
        return _map.latLngToLayerPoint(new L.LatLng(lat, long));
    } ;

    /**
     *
     * @param x
     * @param y
     * @returns {*}
     */
    this.layerPointToLatLng = function(x,y){
        return _map.layerPointToLatLng(new L.Point(x, y));
    } ;

    /**
     * Change the visualization of the grid layer
     * @param status = true if community grid is enabled
     */
    this.setGridStatus = function(status) {
        _gridEnabled = status;
        _parentModel.getNotificationCenter().dispatch(Notifications.mapController.COMMUNITY_GRID_STATUS_CHANGED);
    };

    /**
     * Returns community grid visibility status
     * @returns {boolean}
     */
    this.getGridStatus = function() {
        return _gridEnabled;
    };





    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function() {
    } ();


}