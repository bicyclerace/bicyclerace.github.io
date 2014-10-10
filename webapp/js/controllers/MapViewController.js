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