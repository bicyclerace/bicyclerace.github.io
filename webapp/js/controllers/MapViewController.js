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


    // PRIVATE METHODS
    var draw = function() {
        /* Max initial demo
        _htmlContainer
            .append("button")
            .text("I am a station")
            .on('click', function() {
                // This dispatch has to be in the model
                self.getNotificationCenter().dispatch(Notifications.mapController.STATION_HAS_BEEN_SELECTED);
            });*/
    };

    var init = function() {
        draw();
    } ();
}

// Inheritance
Utils.extend(MapViewController, ViewController);