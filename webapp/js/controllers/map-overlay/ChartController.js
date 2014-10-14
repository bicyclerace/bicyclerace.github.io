/**
 * @class: ChartController
 * @description
 *
 * @param parentController
 * @param svgContainer
 */
 
/** DEV ONLY */
// var ViewController = window.ViewController,
//     Utils = window.Utils,
//     Notifications = window.Notifications;
    
function ChartController(parentController, svgContainer) {
    // console.log("woop", parentController);
    // Call the base class constructor
    // ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _parentController;
    var _svgContainer = svgContainer;
    var _viewBoxWidth = 3200;
    var _viewBoxHeight = 100;

    // PUBLIC METHODS
    /**
     * Handler for the visualization type changed notification
     */
    this.visualizationTypeChanged = function() {
        var visType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        console.log("ChartController visType %o", visType);
        self.getModel().getDBModel().getStationsPopularity(function(d) {
            console.log(d);
        });
    };
    
    this.svgContainer = function(value) {
        console.log("svg is ", value);
        return (arguments.length) ? (_svgContainer = value, self) : _svgContainer;
    };
    
    this.parentController = function(value) {
        console.log("parent is ", value);
        if (arguments.length) {
            _parentController = arguments[0];
            ViewController.call(self, _parentController);
            return self;
        }
        return _parentController;
    };
    
    // this.init = function() {
    //     self.getNotificationCenter()
    //         .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
    // };

    // PRIVATE METHODS
    var draw = function() {
       
    };

    this.init = function() {
        // console.log("new ChartController", self);
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight);

        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
        // draw();
    };
}

// Inheritance
Utils.extend(ChartController, ViewController);

