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
            self.add(new Controller);
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

        // Call super
        oldAdd.call(self, childController);
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

    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var cleanMap = function() {
        /*_layersControllers.forEach(function(controller) {
           _mapContainer.removeLayer(controller.getLayerGroup());
        });

        _layersControllers = [];*/
        self.getChildren().forEach(function(layerController) {

        });

        for(var i = 0; i < self.getChildren().length; i++) {
            self.remove(self.getChildren()[i]);
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



        //TODO DEBUG
        /*
        self.getModel().getMapModel().setMap(_mapContainer);
        var svg = d3.select(_mapContainer.getPanes().overlayPane).append("svg").attr("id", "test-lay");*/

        // DEBUG MACS
        // Bind MapViewController view to _mapContainer pane
        d3.select(_mapContainer.getPanes().overlayPane).append(function() {
            return self.getView().getSvg().node();
        });


        // Subscribe to notifications
        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
    } ();
}

// Inheritance
Utils.extend(MapViewController, ViewController);