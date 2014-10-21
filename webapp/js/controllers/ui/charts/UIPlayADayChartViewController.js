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
    
    this.addData = function(d) {
        var exists = _data.every(function(_d) { return ! _.isEqual(_d, d) });
        if (! exists) _data.push(d);
        // _data.push(d);
        // _data = _.unique( _data, false, function(d) { return d.date } );
        updateChart();
    };

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
        
        console.log("updated", _data);
        
        var domain = _xScale.domain();
        
        var extent = d3.extent(_data, function(d) { return d.date });
        var day = d3.time.day;
        
        if (domain[0].getYear() === 69) _xScale.domain([day.floor(extent[0]), day.ceil(extent[0])]);
        if (extent[1] > domain[1]) _xScale.domain([day.floor(extent[0]), extent[1]]);
        
        var maxActive = d3.max(_data, function(d) { return parseFloat(d.active); });
        var yMax = (maxActive === 0) ? 10 : maxActive;
        
        _yScale.domain([0, yMax]);

        // // Setup x scale
        // var xScale = d3.scale.ordinal()
        //     .domain(_data.map(function(d) { return d.label; }))
        //     .rangeRoundBands([0, width], .1);

        // // Setup y scale
        // var yScale = d3.scale.linear()
        //     .domain([0, d3.max(_data, function(d) { return parseFloat(d.value); })])
        //     .range([height, 0]);

        // // Setup x axis
        // var xAxis = d3.svg.axis()
        //     .scale(xScale)
        //     .orient("bottom")
        //     .outerTickSize(1);

        // // Setup y axis
        // var yAxis = d3.svg.axis()
        //     .scale(yScale)
        //     .orient("left")
        //     .ticks(6)
        //     //.tickFormat(formatNumber)
        //     .outerTickSize(1);

        // // Setup color scale
        // var colorScale = d3.scale.ordinal()
        //     .range(_columnColors);
        
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

        // var xLabel = gxAxis.select(".x-label");
        // if(xLabel.empty()) {
        //     xLabel = gxAxis
        //         .append("text")
        //         .classed("x-label", true)
        //         .attr("transform", "translate(" + (_width +10) + ",0)")
        //         .attr("y", 6)
        //         .attr("dy", ".71em")
        //         .style("text-anchor", "start");
        // }
        // xLabel
        //     .text(function() {
        //         return _xAxisLabel;
        //     });

        // y axis
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


        // // Bars
        // var gBars = chart.select(".bars");
        // if(gBars.node() == null) {
        //     gBars = chart.append("g").classed("bars", true);
        // }

        // // Update
        // var bars = gBars
        //     .selectAll(".bar")
        //     .data(_data);

        // bars
        //     .attr("x", function(d) {
        //         return xScale(d.label);
        //     })
        //     .attr("y", function(d) {
        //         return yScale(d.value);
        //     })
        //     .attr("height", function(d) {
        //         return height - yScale(d.value);
        //     })
        //     .attr("width", xScale.rangeBand())
        //     .style("fill", function(d) {
        //         return colorScale(d.label);
        //     });

        // // Enter
        // bars
        //     .enter()
        //     .append("rect")
        //     .attr("class", "bar")
        //     .attr("x", function(d) {
        //         return xScale(d.label);
        //     })
        //     .attr("y", function(d) {
        //         return yScale(d.value);
        //     })
        //     .attr("height", function(d) {
        //         return height - yScale(d.value);
        //     })
        //     .attr("width", xScale.rangeBand())
        //     .style("fill", function(d) {
        //         return colorScale(d.label);
        //     });

        // // Remove
        // bars
        //     .exit()
        //     .remove();

        // // Setup title
        // var titleText = self.getView().getSvg().select(".title");
        // if(titleText.node() == null) {
        //     titleText = self.getView().getSvg().append("text").classed("title", true);
        // }

        // titleText.attr("transform", "translate(" + (_chartMargin.left + (width /2)) + "," + (_chartMargin.top/2) + ")");
        // titleText
        //     .attr("width", width)
        //     .attr("height", _chartMargin.top)
        //     .attr("text-anchor", "middle")
        //     .attr("dy", "0.5em")
        //     .text(_title);
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
            .outerTickSize(1);

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