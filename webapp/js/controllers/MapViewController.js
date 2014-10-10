/**
 * @class: MapViewController
 * @description template class
 *
 * @param parentController
 * @param htmlContainer
 */
function MapViewController(parentController, htmlContainer) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    /////////////////////////// PRIVATE ATTRIBUTES /////////////////////////// 
    var self = this;

    var _htmlContainer = htmlContainer;

    var _mapContainer;
    
    var _mapID = 'krbalmryde.jk1dm68f'
    var _mapURL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
    var _mapAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'

    // Make out Map-layer object, this is what contains the actual map itself
    var _mapTilesLayer;
    
    
    
    /////////////////////////// PUBLIC METHODS ///////////////////////////

    
    
    
    
    /////////////////////////// PRIVATE METHODS /////////////////////////// 
    var draw = function() {
        // Create our Map-container object, this is what will go into the div of the same id.   htmlContainer
        _mapContainer = L.map(_htmlContainer.node(), {
            center: ,  // Pretty sure these two calls are 
            zoom: 11,        // the same as .setView(latlon 13)
        });          
        _mapContainer.addTo(_mapTilesLayer);
        // L.control.layers(baseMap, extraLayers).addTo(mapContainer);
    };


    var init = function() {
        // Initializing the _mapTilesLayer
        _mapTilesLayer = L.tileLayer(_mapURL, {
            id: _mapID, 
            maxZoom: 18,
            attribution: _mapAttribution
        });
    
        draw();
    } ();
}

// Inheritance
Utils.extend(MapViewController, ViewController);