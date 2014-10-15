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
        
        self.getModel().getDBModel().getStationsPopularity(function(d) {
            console.log(d);
        });
    };
    
    this.svgContainer = function(value) {
        return (arguments.length) ? (_svgContainer = value, self) : _svgContainer;
    };
    
    this.parentController = function(value) {
        if (arguments.length) {
            _parentController = value;
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
       if ( _svgContainer.select(".axis").empty() ) {
            _svgContainer.append("g").attr("class", "x axis")
                .attr("transform", translate(0, _viewBoxHeight));
            _svgContainer.append("g").attr("class", "y axis");
            _svgContainer.append("g").attr("class", "title")
                .append("text");
        }
        
        var a = new Date("8-1-2013 01:00");
        var b = new Date("8-1-2013 22:59");
        
        var xAxis = d3.svg.axis().orient("bottom"),
        yAxis = d3.svg.axis().orient("left");
        
        var x = d3.scale.linear().domain([0, 23]).range([0, _viewBoxWidth]),
            y = d3.scale.linear().range([_viewBoxHeight, 0]);
            
        self.getModel().getDBModel().getTripsStartedInTimeRange(a, b, null, function(d) {
            var nest = d3.nest()
                .key(function(d) { return new Date(d.starttime).getHours(); }) //d3.time.hour(new Date(d.starttime)); })
                .entries(d);
                
            var yMax = d3.max(nest, function(d) { return d.values.length; });
            
            y.domain([0, yMax]);
            
            xAxis.scale(x); yAxis.scale(y);
            
            var bar = _svgContainer.selectAll("g.bar").data(nest);
            var pad = 2;
            
            bar.enter().append("g").attr("class", "bar")
                .append("rect").attr("x", pad);
                
            bar.attr("transform", function(d) { return translate( x(d.key), y(d.values.length) ); })
                .select("rect")
                .attr({
                    width: function(d) { return x(1) - pad; },
                    height: function(d) { return _viewBoxHeight - y(d.values.length); }
                });
                
            _svgContainer.select("g.x.axis").call(xAxis);
            _svgContainer.select("g.y.axis").call(yAxis);
            
            _svgContainer.select("g.title text").text("Title");
                
            console.log(nest);
        });
    };

    this.init = function() {
        var vb = _parentController.svgContainer().node().viewBox.baseVal;
        _viewBoxHeight = vb.height; _viewBoxWidth = vb.width;
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight);

        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
            
        draw();
    };
    
    function translate(x, y) {
        return "translate(" + x + "," + y + ")";
    }
}

// Inheritance
Utils.extend(ChartController, ViewController);

