/**
 * @class: MapViewController
 * @description template class
 *
 * @param parentController
 */
function MapViewController(parentController, htmlContainer) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _htmlContainer = htmlContainer;

    // PUBLIC METHODS

    var mapID = 'krbalmryde.jk1dm68f'
    var mapURL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
    var mapAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'

    // Get ALL the Stations!!
    var url = "https://fpadua2.people.uic.edu/divvy_api/get_all_stations"
    // Our focus point
    var latLon = [41.869912359714654, -87.64772415161133]; //    var myLatLon = [41.952040, -87.651710]

    // Make out Map-layer object, this is what contains the actual map itself
    var mapLayer = L.tileLayer(mapURL, {
        id: mapID, 
        maxZoom: 18,
        attribution: mapAttribution
    })
    
    // Adds a GeoJson Layer to the map
    var chicagoLayer = L.geoJson(chiGeo, {
      style: function(feature){
        return {
          color: color10(feature.properties.district.name),
          dashArray: '',
          fillOpacity: 0.25
        }
      }
    })

    // Create our Map-container object, this is what will go into the div of the
    // same id. 
    var map = L.map(_htmlContainer, {
        center: latLon,  // Pretty sure these two calls are 
        zoom: 11,        // the same as .setView(latlon 13)
        layers: [mapLayer, chicagoLayer]
    });  

    var evl = L.marker(latLon, {icon: evlMarker, zIndexOffset: 10000}).bindPopup('Electronic Visualization Laboratry!')

    // PRIVATE METHODS
    var draw = function() {
        //Max initial demo


        _htmlContainer
            .append("button")
            .text("I am a station")
            .on('click', function() {
                // This dispatch has to be in the model
                self.getNotificationCenter().dispatch(Notifications.mapController.STATION_HAS_BEEN_SELECTED);
            });
    };

    var init = function() {
        draw();
    } ();
}

// Inheritance
Utils.extend(MapViewController, ViewController);