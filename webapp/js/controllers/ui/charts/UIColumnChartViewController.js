function UIColumnChartViewController(parentController) {
    ViewController.call(this, parentController);
    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _xValues;
    var _xAxisLabel;
    var _yValues;
    var _yAxisLabel;
    var _columnColors;

    // Holds data in d3 format
    var _data;
    
    // UI
    var _chartMargin = {top: 50, right: 100, bottom: 40, left: 150};
    var _defaultViewBox = {x: 0, y: 0, width: 600, height: 400};

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

    /////////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var updateChart = function() {
        
        var width = self.getView().getViewBoxWidth() - _chartMargin.left - _chartMargin.right;
        var height = self.getView().getViewBoxHeight() - _chartMargin.top - _chartMargin.bottom;

        // Setup x scale
        var xScale = d3.scale.ordinal()
            .domain(_data.map(function(d) { return d.label; }))
            .rangeRoundBands([0, width], .1);

        // Setup y scale
        var yScale = d3.scale.linear()
            .domain([0, d3.max(_data, function(d) { return d.value; })])
            .range([height, 0]);

        // Setup x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .outerTickSize(1);

        // Setup y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(6)
            //.tickFormat(formatNumber)
            .outerTickSize(1);

        // Setup color scale
        var colorScale = d3.scale.ordinal()
            .range(_columnColors);

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
        gxAxis
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("transform", "translate(" + (width +10) + ",0)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text(function() {
                return _xAxisLabel;
            });

        // y axis
        var gyAxis = chart.select(".y.axis");
        if(gyAxis.node() == null) {
            gyAxis = chart.append("g").attr("class", "y axis");
        }
        gyAxis
            .call(yAxis)
            .append("text")
            .attr("transform", "translate(0, "+ (-30) +" )")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function() {
                return _yAxisLabel;
            });

        // Bars
        var gBars = chart.select(".bars");
        if(gBars.node() == null) {
            gBars = chart.append("g").classed("bars", true);
        }

        // Update
        gBars
            .selectAll(".bar")
            .data(_data);

        // Enter
        gBars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return xScale(d.label);
            })
            .attr("y", function(d) {
                return yScale(d.value);
            })
            .attr("height", function(d) {
                return height - yScale(d.value);
            })
            .attr("width", xScale.rangeBand())
            .style("fill", function(d) {
                return colorScale(d.label);
            });

        // Remove
        gBars
            .exit()
            .remove();
    };

    // Init
    var init = function() {
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
    } ();
}