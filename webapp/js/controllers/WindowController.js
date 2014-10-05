/**
 * @class: WindowController
 * @description Handles the main window layout
 * @param htmlContainer usually is the body of the html document on which elements have to be rendered.
 * It is passed as a d3 selection.
 */
function WindowController(htmlContainer) {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _htmlContainer = htmlContainer;

    var _mapsControllers = [];
    var _overviewMap;


    // PUBLIC METHODS

    this.addOverviewMap = function() {
        var overviewMapContainer = _htmlContainer.append("div").classed("overview-map-controller-container", true);
        _overviewMap = new OverviewMapController(overviewMapContainer);
    };

    this.addMap = function() {
        var mapContainer = _htmlContainer.append("div").classed("map-controller-container", true);
        var mapController = new MapContainerController(mapContainer);
        _mapsControllers.push(mapController);

        //dispatch an event that something has changed in the map configuration
        sharedNotificationCenter.dispatch(Notifications.mapContainerController.MAP_CONFIGURATION_CHANGED);
    };

    this.getMapsControllers = function() {
        return _mapsControllers.slice(0);
    };



    // PRIVATE METHODS
    var init = function() {
    } ();
}
