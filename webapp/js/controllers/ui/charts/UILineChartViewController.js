/**
 * @class UILineChartViewController
 * @description Implements a line chart view controller given a set of data
 *
 * @param parentController
 * @constructor
 */
function UILineChartViewController(parentController) {
    ViewController.call(this, parentController);
    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _xValues;
    var _xAxisLabel;
    var _yValues;
    var _yAxisLabel;
    var _lineColor;

    // Holds data in d3 format
    var _data;


    // Scales
    var _xScale = d3.scale.linear();
    var _yScale = d3.scale.linear();

    // Tick format
    var _xTickFormat = null;
    var _yTickFormat = null;

    // Tick alignment
    var _xTickAlignment = TickAlignment.MIDDLE;

    // UI
    var _chartMargin = {top: 40, right: 100, bottom: 40, left: 100};
    var _defaultViewBox = {x: 0, y: 0, width: 600, height: 300};

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
     * This method sets the parameters of the chart and draw it. Notice that the implementation assumes that xValues
     * are already passed in ascending order
     * @param xValues = domain values (sorted from the minimum to the maximum)
     * @param yValues = range values corresponding index by index to domain values
     * @param xAxisLabel = label for the x axis
     * @param yAxisLabel = label for the y axis
     * @param color = color of the line
     */
    this.setData = function(xValues, yValues, xAxisLabel, yAxisLabel, color) {
        _xValues = xValues;
        _yValues = yValues;
        _xAxisLabel = xAxisLabel;
        _yAxisLabel = yAxisLabel;
        _lineColor = color;

        _data = [];
        _xValues.forEach(function(xValue, index) {
            _data.push({
                label: _xValues[index],
                value: _yValues[index]
            });
        });
        updateChart();
    };

    /**
     * Set the x axis scale of the line chart using d3 scales
     * @param d3Scale
     */
    this.setXScale = function(d3Scale) {
        _xScale = d3Scale;
    };

    /**
     * Set the y axis scale of the line chart using d3 scales
     * @param d3Scale
     */
    this.setYScale = function(d3Scale) {
        _yScale = d3Scale;
    };

    /**
     * Sets a d3 formatter for y tick values
     * @param d3Format
     */
    this.setXTickFormat = function(d3Format) {
        _xTickFormat = d3Format;
    };

    /**
     * Sets a d3 formatter for y tick values
     * @param d3Format
     */
    this.setYTickFormat = function(d3Format) {
        _yTickFormat = d3Format;
    };

    /**
     * Set x tick text alignment
     * @param tickAlignment = @see TickAlignment enum type
     */
    this.setXTickAlignment = function(tickAlignment) {
        _xTickAlignment = tickAlignment;
    };







    /////////////////////// PRIVATE METHODS ///////////////////////
    var updateChart = function() {

        var width = self.getView().getViewBoxWidth() - _chartMargin.left - _chartMargin.right;
        var height = self.getView().getViewBoxHeight() - _chartMargin.top - _chartMargin.bottom;

        // Setup x scale
        _xScale
            .domain([_xValues[0], _xValues[_xValues.length -1]])
            .range([0, width]);

        // Setup y scale
        _yScale
            .domain([0, d3.max(_data, function(d) { return parseFloat(d.value); })])
            .range([height, 0]);

        // Setup x axis
        var xAxis = d3.svg.axis()
            .scale(_xScale)
            .orient("bottom")
            .outerTickSize(1);

        if(_xTickFormat != null) {
            xAxis.tickFormat(_xTickFormat);
        }

        // Setup y axis
        var yAxis = d3.svg.axis()
            .scale(_yScale)
            .orient("left")
            .ticks(6)
            .outerTickSize(1);

        if(_yTickFormat != null) {
            yAxis.tickFormat(_yTickFormat);
        }

        // Setup line function
        var line = d3.svg.line()
            .x(function(d) { return _xScale(d.label); })
            .y(function(d) { return _yScale(d.value); });

        // Chart container
        var chart = self.getView().getSvg().select(".g-chart-container");
        if(chart.node() == null) {
            chart = self.getView().getSvg().append("g").classed("g-chart-container", true);
        }

        chart.attr("transform", "translate(" + _chartMargin.left + "," + _chartMargin.top + ")");

        // x axis
        var gxAxis = chart.select(".x.axis");
        if(gxAxis.node() == null) {
            gxAxis = chart.append("g").attr("class", "x axis");
        }
        var axis = gxAxis
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        if(_xTickAlignment == TickAlignment.MIDDLE) {
            axis
                .selectAll("text")
                .attr("y", 10)
                .attr("x", 0)
                .style("text-anchor", "middle");
        } else if(_xTickAlignment == TickAlignment.LEFT) {
            axis
                .selectAll("text")
                .attr("y", 6)
                .attr("x", 6)
                .style("text-anchor", "start");
        } else if(_xTickAlignment == TickAlignment.RIGHT) {
            axis
                .selectAll("text")
                .attr("y", 6)
                .attr("x", -6)
                .style("text-anchor", "end");
        }


        var xLabel = gxAxis.select(".x-label");
        if(xLabel.node() == null) {
            xLabel = gxAxis
                .append("text")
                .classed("x-label", true)
                .attr("transform", "translate(" + (width +10) + ",0)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "start");
        }
        xLabel
            .text(function() {
                return _xAxisLabel;
            });

        // y axis
        var gyAxis = chart.select(".y.axis");
        if(gyAxis.node() == null) {
            gyAxis = chart.append("g").attr("class", "y axis");
        }
        gyAxis
            .attr("transform", "translate(0, "+ 0 +" )")
            .call(yAxis);

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

        yLabel
            .text(function() {
                return _yAxisLabel;
            });


        // Line container
        var gLine = chart.select(".line-container");
        if(gLine.node() == null) {
            gLine = chart.append("g").classed("line-container", true);
        }

        // Draw lines
        var linePath = gLine.select(".line");
        if (linePath.node() == null) {
            linePath = gLine.append("path").classed("line", true);
        }


        linePath
            .datum(_data)
            .attr("d", line)
            .style("stroke", _lineColor);
    };

    // Init
    var init = function() {
        self.getView().addClass("ui-line-chart-view-controller");
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
    } ();
}

var TickAlignment = {
    LEFT: "left",
    MIDDLE: "middle",
    RIGHT: "right"
};

Utils.extend(UILineChartViewController, ViewController);