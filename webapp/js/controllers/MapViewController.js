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
    var _defaultZoom = 10;
    
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
            var layerGroup = L.layerGroup();
            _mapContainer.addLayer(layerGroup);
            _layersControllers.push(new Controller(self, layerGroup));
        });
    };
    
    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var cleanMap = function() {
        _layersControllers.forEach(function(controller) {
           _mapContainer.removeLayer(controller.getLayerGroup());
        });

        _layersControllers = [];
    };

    var draw = function() {
        // Draw the map container box
        _mapContainer = L.map(_htmlContainer.node());
        _mapContainer.setView(self.getModel().getMapModel().getFocusPoint(), _defaultZoom);

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

        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
    } ();
}

// Inheritance
Utils.extend(MapViewController, ViewController);