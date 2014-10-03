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



    // PUBLIC METHODS
    this.addMap = function() {
        var mapContainer = _htmlContainer.append("div").classed("map-controller-container", true);
        var mapController = new MapContainerController(mapContainer);
        _mapsControllers.push(mapController);
    };



    // PRIVATE METHODS
    var init = function() {
    } ();
}
