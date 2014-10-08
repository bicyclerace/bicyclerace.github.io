
/**
 * @class: VisualizationModuleController
 * @description template class
 *
 * @param htmlContainer = a d3 selection of the html container inside which the MapContainerController should
 * render its view.
 */
function VisualizationModuleController(htmlContainer) {
    // Call the base class constructor
    ViewController.call(this, null);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _model;

    var _htmlContainer = htmlContainer;

    // Children controllers
    var _mapViewController;
    var _mapOverlayController;


    // PUBLIC METHODS

    /**
     * @override
     * @returns {NotificationCenter}
     */
    this.getNotificationCenter = function() {
        return _model.getNotificationCenter();
    };

    /**
     * @override
     * @returns {Model}
     */
    this.getModel = function() {
        return _model;
    };


    /**
     * SHOWCASE
     */
    this.stationSelectedHandler = function() {
        _htmlContainer
            .append("p")
            .text("Station selected");
    };


    // PRIVATE METHODS
    var draw = function() {
        // Draw map view container
        var mapViewDiv = _htmlContainer.append("div").classed("map-view-controller", true);
        _mapViewController = new MapViewController(self, mapViewDiv);

        var svg = _htmlContainer.append("svg")
                                .classed("map-overlay-controller", true);
        _mapOverlayController = new MapOverlayController(self, svg);
    };

    var init = function() {
        _model = new Model();

        // Subscribe to the events I am interested in
        self.getNotificationCenter()
                .subscribe(self, self.stationSelectedHandler, Notifications.mapController.STATION_HAS_BEEN_SELECTED);

        draw();
    } ();
}


Utils.extend(VisualizationModuleController, ViewController);


























