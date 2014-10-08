
/**
 * @class: OverviewMapController
 * @description controller of the map of chicago which works as an overview of all the opened maps
 *
 * @param htmlContainer = a d3 selection of the html container inside which the OverviewMapController should
 * render its view.
 */
function OverviewMapController(htmlContainer) {
    // Call the base class constructor
    ViewController.call(this, null);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _model;

    var _htmlContainer = htmlContainer;


    var _mapViewController;


    // PUBLIC METHODS

    /**
     * @override
     * @returns {NotificationCenter}
     */
    this.getNotificationCenter = function() {
        return sharedNotificationCenter;
    };

    /**
     * @override
     * @returns {Model}
     */
    this.getModel = function() {
        return sharedModel;
    };


    /**
     * Handler called whenever something has changed on the opened maps
     *
     */
    this.mapsConfigurationChanged = function() {

        _htmlContainer.append("p").text("Map configuration changed");

        //access all the maps open
        divvyApp.getMainWindowController().getVisualizationModulesControllers().forEach(
            function(map){
                var mapModel = map.getModel();
                // mapModel.getId() returns an handy and nice id to identify a map
                _htmlContainer.append("p").text("Map with id " + mapModel.getId() + " is open");
            });

    };

    // PRIVATE METHODS
    var draw = function() {
        _htmlContainer.append("p").text("Overview Map");
    };

    var init = function() {
        //subscriptions
        sharedNotificationCenter.subscribe(self, self.mapsConfigurationChanged,
            Notifications.mapContainerController.MAP_CONFIGURATION_CHANGED);

        draw();
    } ();
}


Utils.extend(OverviewMapController, ViewController);


























