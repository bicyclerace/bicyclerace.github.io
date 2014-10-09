
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
    var _svgContainer;

    var _mapViewController;

    //sizes
    var _viewBoxWidth = 702;
    var _viewBoxHeight = 1000;
    var _logoWith   = 120,
        _logoHeight = 50;

    var _padding = {left: 20, top: 30, right: 20, bottom: 20};

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
        //add svg main container
        _svgContainer = _htmlContainer.append("svg")
            .classed("overview-map-controller-svg", true)
            .attr("viewBox","0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio","xMinYMin meet");

        //add background rect
        _svgContainer.append("rect")
            .classed("overview-map-controller-background", true)
            .attr("width", "100%")
            .attr("height", "100%");

        //add logo
        _svgContainer.append("image")
            .classed("popup-controller-close-button", true)
            .attr("xlink:href", "img/overview-map-controller-divvy-logo.png")
            .attr("x", _viewBoxWidth - _padding.right - _logoWith)
            .attr("y", _padding.top)
            .attr("width", _logoWith)
            .attr("height", _logoHeight)
            .on("click", function(){parentController.closePopup(self)});
    };

    var init = function() {
        //subscriptions
        sharedNotificationCenter.subscribe(self, self.mapsConfigurationChanged,
            Notifications.mapContainerController.MAP_CONFIGURATION_CHANGED);

        draw();
    } ();
}


Utils.extend(OverviewMapController, ViewController);


























