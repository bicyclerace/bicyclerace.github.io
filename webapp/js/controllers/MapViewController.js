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

    // PRIVATE ATTRIBUTES
    var self = this;

    var _htmlContainer = htmlContainer;

    // PUBLIC METHODS

    var mapID = 'krbalmryde.jk1dm68f'
    var mapURL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
    var mapAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'


    // PRIVATE METHODS
    var draw = function() {

    };

    var init = function() {
        draw();
    } ();
}

// Inheritance
Utils.extend(MapViewController, ViewController);