/**
 * @class: MapViewController
 * @description this view controller takes care of displaying the map and react to visualization context changes
 * by updating map layers
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
    var _defaultZoom = 13;
    
    var _mapID = 'krbalmryde.jk1dm68f';
    var _mapURL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
    var _mapAttribution = 'Map data &copy; ' +
        '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';

    // Make out Map-layer object, this is what contains the actual map itself
    var _mapTilesLayer;


    // Layers factory
    var _layersControllersFactory;

    // Layers
    var _layersControllers = [];

    // svg elements
    var _svgLayerGroup;
    
    
    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * Handler for "VISUALIZATION_TYPE_CHANGED" notification.
     * Namely when the visualization type context changed, update map layers.
     */
    this.visualizationTypeChanged = function() {
        var visualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var layersViewControllers = _layersControllersFactory.getLayersControllers(visualizationType);

        // Remove all previous layers from the map
        cleanMap();

        // For each new layer controller class, instantiate the controller with a new layer group, and add that group
        // to the map
        layersViewControllers.forEach(function(Controller) {
            //var layerGroup = L.layerGroup();
            //_mapContainer.addLayer(layerGroup);
            //_layersControllers.push(new Controller(self, layerGroup));
            self.add(new Controller(self));
        });
    };

    /**
     *
     * @returns {*}
     */
    this.getMapContainer = function() {
        return _mapContainer;
    };


    /**
     * @override
     * @param childController
     */
    var oldAdd = this.add;
    this.add = function(childController) {
        // Add layer group
        _mapContainer.addLayer(childController.getLayerGroup());

        // Call super MODIFIED
        //TODO _children.push(childController);
        childController.setParentController(self);
        _svgLayerGroup.append(function(){return childController.getView().getSvg().node();});
        childController.updateView();
        //oldAdd.call(self, childController);
    };


    /**
     * @override
     * @param childController
     */
    var oldRemove = this.remove;
    this.remove = function(childController) {
        _mapContainer.removeLayer(childController.getLayerGroup());

        // Call super
        oldRemove.call(self, childController);
    };



    this.onMapReset = function() {
        //fixed points
        var topLeft = _mapContainer.latLngToLayerPoint(new L.latLng(41.978353, -87.707857));
        var bottomRight = _mapContainer.latLngToLayerPoint(new L.latLng(41.788746, -87.580715));
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;

        self.getView().setFrame(0,0,width,height);
        self.getView().getSvg().style("top",topLeft.y + "px");
        self.getView().getSvg().style("left",topLeft.x + "px");

        _svgLayerGroup = self.getView().getSvg().append("g");
        _svgLayerGroup.attr("transform","translate(" + [-topLeft.x,-topLeft.y] + ")");


        console.log("MAP RESET");
    };


    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var cleanMap = function() {
        // Remove all children
        /*
        for(var i = self.getChildren().length -1; i >= 0; i--) {
            self.remove(self.getChildren()[i]);
        }*/
        while(self.getChildren().length > 0) {
            self.remove(self.getChildren()[0]);
        }
    };

    var draw = function() {
        // Draw the map container box
        _mapContainer = L.map(_htmlContainer.node());
        _mapContainer.setView(self.getModel().getMapModel().getDefaultFocusPoint(), _defaultZoom);

        // Add the base map layer to the map container box
        _mapContainer.addLayer(_mapTilesLayer);
    };


    var init = function() {
        _layersControllersFactory = new MapLayerViewControllersFactory();

        // Initializing the _mapTilesLayer
        _mapTilesLayer = L.tileLayer(_mapURL, {
            id: _mapID, 
            maxZoom: 20,
            attribution: _mapAttribution
        });

        draw();

        self.getModel().getMapModel().setMap(_mapContainer);


        //TODO DEBUG
        /*

        var svg = d3.select(_mapContainer.getPanes().overlayPane).append("svg").attr("id", "test-lay");*/

        // DEBUG MACS
        // Bind MapViewController view to _mapContainer pane
        d3.select(_mapContainer.getPanes().overlayPane).append(function() {
            return self.getView().getSvg().node();
        });

        self.getView().getSvg().attr("id", "debug");

        // Subscribe to notifications
        _mapContainer.on("viewreset", self.onMapReset);

        // call first map reset
        self.onMapReset();

        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
    } ();
}

// Inheritance
Utils.extend(MapViewController, ViewController);