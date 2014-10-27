/**
 * @class UIPlayADayChartViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UIPlayADayChartViewController(parentController) {
    ViewController.call(this, parentController);
    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;
    
    var d3 = window.d3;
    
    var _xScale,
        _yScale,
        _xAxis,
        _yAxis,
        _height,
        _width;

    var _xValues;
    var _xAxisLabel;
    var _yValues;
    var _yAxisLabel;
    var _columnColors;

    var _title;

    // Holds data in d3 format
    var _data = [];
    
    // UI
    var _chartMargin = {top: 60, right: 100, bottom: 40, left: 100};
    var _defaultViewBox = {x: 0, y: 0, width: 1200, height: 300};

    /////////////////////// PUBLIC ATTRIBUTES ///////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {

        // Super call
        super_updateView.call(self);
    };

    /**
     *
     * @param xValues
     * @param yValues
     * @param xAxisLabel
     * @param yAxisLabel
     * @param colors
     */
    this.setData = function(xValues, yValues, xAxisLabel, yAxisLabel, colors) {
        _xValues = xValues;
        _yValues = yValues;
        _xAxisLabel = xAxisLabel;
        _yAxisLabel = yAxisLabel;
        _columnColors = colors;

        _data = [];
        _xValues.forEach(function(xValue, index) {
            _data.push({
                label: _xValues[index],
                value: _yValues[index]
            });
        });
        updateChart();
    };
    
    this.resetData = function() {
        _data = [];
    }
    
    this.addData = function(d) {
        _data.push(d);
        _data = _.unique( _data, false, function(d) { return d.date } );
        
        filterData(_data);

        updateChart();
    };
    
    function filterData(d) {
        var tripFilter = self.getModel().getPlayADayModel().tripFilter;
        d.forEach(function(tripsAtTime) {
            tripsAtTime.filtered = tripsAtTime.active.filter(tripFilter);
        })
    }

    /**
     * Set the chart's title
     * @param title
     */
    this.setTitle = function(title) {
        _title = title;
    };
    
    this.setXAxisLabel = function(value) { _xAxisLabel = value; }
    this.setYAxisLabel = function(value) { _yAxisLabel = value; }

    /////////////////////// PRIVATE METHODS ///////////////////////
    var updateChart = function() {
        
        _width = self.getView().getViewBoxWidth() - _chartMargin.left - _chartMargin.right;
        _height = self.getView().getViewBoxHeight() - _chartMargin.top - _chartMargin.bottom;
        
        _xScale.range([0, _width]);
        _yScale.range([_height, 0]);
        
        var domain = _xScale.domain();
        
        var extent = d3.extent(_data, function(d) { return d.date });
        var day = d3.time.day;
        
        if (domain[0].getYear() === 69) _xScale.domain([day.floor(extent[0]), day.ceil(extent[0])]);
        if (extent[1] > domain[1]) _xScale.domain([extent[0], extent[1]]);
        
        var maxActive = d3.max(_data, function(d) { return parseFloat(d.active.length); });
        var yMax = (maxActive === 0) ? 10 : maxActive;
        
        _yScale.domain([0, yMax]);
        
        var colorScale = d3.scale.category10();

        // Chart container
        var chart = self.getView().getSvg().select(".g-chart-container");
        if(chart.empty()) {
            chart = self.getView().getSvg().append("g").classed("g-chart-container", true);
        }

        chart.attr("transform", "translate(" + _chartMargin.left + "," + _chartMargin.top + ")");

        // // x axis
        var gxAxis = chart.select(".x.axis");
        if(gxAxis.empty()) {
            gxAxis = chart.append("g").attr("class", "x axis");
        }
        gxAxis
            .attr("transform", "translate(0," + _height + ")")
            .call(_xAxis);

        var gyAxis = chart.select(".y.axis");
        if(gyAxis.empty()) {
            gyAxis = chart.append("g").attr("class", "y axis");
        }
        gyAxis
            .attr("transform", "translate(0, "+ 0 +" )")
            .call(_yAxis);

        var yLabel = gyAxis.select(".y-label");
        if(yLabel.node() == null) {
            yLabel = gyAxis
                .append("text")
                .classed("y-label",true)
                .attr("transform", "translate(0, "+ -30 +" )")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");
        }

        yLabel.text(_yAxisLabel);
        
        var gLines = chart.select(".lines");
        if (gLines.empty()) {
            gLines = chart.append("g").attr("class", "lines");
        }

        var line = d3.svg.line()
            .x(function(d) { return _xScale(d.date) })
            .y(function(d) { return _yScale(d.active.length) });
            
        var filterLine = d3.svg.line()
            .x(function(d) { return _xScale(d.date ) })
            .y(function(d) { return _yScale(d.filtered.length)})
            
        var path = gLines.selectAll("path.active").data([_data]);
        
        path.enter().append("path").attr("class", "active");
        
        path
            .style({
                fill: "none", stroke: ColorsModel.colors.otherBikes, "stroke-width": "3px"
            })
            .transition()
            .attr("d", function(d) { return line(d) });


        var filtered = gLines.selectAll("path.filtered").data([_data]);
        
        filtered.enter().append("path").attr("class", "filtered");
        
        filtered
            .style({
                fill: "none", stroke: ColorsModel.colors.filteredBikes, "stroke-width": "3px"
            })
            .transition()
            .attr("d", function(d) { return filterLine(d) });

    };

    // Init
    var init = function() {
        
        _width = self.getView().getViewBoxWidth() - _chartMargin.left - _chartMargin.right;
        _height = self.getView().getViewBoxHeight() - _chartMargin.top - _chartMargin.bottom;
        
        _xScale = d3.time.scale();
        _yScale = d3.scale.linear();
            
        // Setup x axis
        _xAxis = d3.svg.axis()
            .scale(_xScale)
            .orient("bottom")
            .outerTickSize(1)
            .ticks(4);

        // Setup y axis
        _yAxis = d3.svg.axis()
            .scale(_yScale)
            .orient("left")
            .ticks(6)
            //.tickFormat(formatNumber)
            .outerTickSize(1);
        
        self.getView().addClass("ui-column-chart-view-controller");
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
    } ();
}

Utils.extend(UIPlayADayChartViewController, ViewController);