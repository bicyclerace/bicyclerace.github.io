
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
    var _mapBoundRects = [];

    var _mapViewController;
    var _projection;

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

        updateMapBoundRect();

    };


    var drawMap = function() {
         var json = databaseModel.getChicagoJson();
        var features = topojson.feature(json, json.objects.chicago_health2).features;

        // Create a unit projection.
        _projection = d3.geo.mercator()
            .scale(1)
            .translate([0, 0]);

        // Create a path generator.

        var path = d3.geo.path()
            .projection(_projection);

        //TODO
        var width = _viewBoxWidth - _padding.left;
        var height = _viewBoxHeight - _padding.top;

        // Compute the bounds of a feature of interest, then derive scale & translate.
        var b = path.bounds( topojson.feature(json, json.objects.chicago_health2)),
            s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        // Update the projection to use computed scale & translate.
        _projection
            .scale(s)
            .translate(t);

        //INACTIVE
        self.getView().getSvg().append("g").selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "overview-map-controller-community")
        ;
    };


    // PRIVATE METHODS
    var draw = function() {
        //add svg main container
        self.getView().appendTo(_htmlContainer);

        self.getView().getSvg()
            .classed("overview-map-controller-svg", true)
            .attr("viewBox","0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio","xMinYMin meet")
            .attr("width","100%")
            .attr("height","100%");

        //add background rect
        self.getView().getSvg().append("rect")
            .classed("overview-map-controller-background", true)
            .attr("width", "100%")
            .attr("height", "100%");

        //add logo
        self.getView().getSvg().append("image")
            .classed("popup-controller-close-button", true)
            .attr("xlink:href", "img/overview-map-controller-divvy-logo.png")
            .attr("x", _viewBoxWidth - _padding.right - _logoWith)
            .attr("y", _padding.top)
            .attr("width", _logoWith)
            .attr("height", _logoHeight)
            .on("click", function(){parentController.closePopup(self)});

        //draw map
        drawMap();


    };


    var updateMapBoundRect = function() {
        //access all the maps open
        divvyApp.getMainWindowController().getVisualizationModulesControllers().forEach(
            function(map){
                var mapModel = map.getModel();
                var boundRect = new BoundRectViewController(self, mapModel, _projection );
                self.add(boundRect);
            });


    };


    var init = function() {
        //subscriptions
        sharedNotificationCenter.subscribe(self, self.mapsConfigurationChanged,
            Notifications.mapContainerController.MAP_CONFIGURATION_CHANGED);


        draw();
    } ();
}


Utils.extend(OverviewMapController, ViewController);


























