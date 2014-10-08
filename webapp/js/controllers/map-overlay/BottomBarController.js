/**
 * @class: BottomBarController
 * @description template class
 *
 * @param parentController
 * @param svgContainer
 */
function BottomBarController(parentController, svgContainer) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _svgContainer = svgContainer;
    var _viewBoxWidth = 3200;
    var _viewBoxHeight = 100;

    // UI dimensions
    var _buttonWidth = 250;
    var _buttonHeight = _viewBoxHeight


    // PUBLIC METHODS


    // PRIVATE METHODS
    var draw = function() {
        dio = _svgContainer;
        var gBarContainer = _svgContainer.append("g").classed("bar-container", true);

        var barBackgroundRect = gBarContainer.append("rect")
            .attr("width", _viewBoxWidth)
            .attr("height", _viewBoxHeight)
            .classed("background", true);

        var gBarButtons = gBarContainer.selectAll(".bar-button-item")
            .data(getVisualizationTypes());

        gBarButtons.enter()
            .append("g")
                .classed("bar-button-item", true)
                .attr("transform", function(d, i) {
                    var x = i * _buttonWidth;
                    var y = 0;
                    return "translate(" + x + "," + y + ")";
                })
                .on("click", function(d) {
                    _svgContainer.select(".selected").classed("selected", false);
                    d3.select(this).classed("selected", true);
                });

        gBarButtons.append("rect")
            .attr("width", _buttonWidth)
            .attr("height", _buttonHeight)
            .classed("background", true);

        gBarButtons.append("text")
            .attr("transform", function() {
                var x = _buttonWidth / 2;
                var y = _buttonHeight / 2;
                return "translate(" + x + "," + y + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.value;
            });
    };

    var getVisualizationTypes = function() {
        var data = [];

        for(var key in VisualizationType) {
            data.push({
                name: key,
                value: VisualizationType[key]
            })
        }

        return data;
    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight);
        draw();
    } ();
}

// Inheritance
Utils.extend(BottomBarController, ViewController);


var VisualizationType = {
    OVERALL_STATISTICS : "Overall",
    STATION_POPULARITY : "Popularity",
    PLAY_A_DAY : "Play a day",
    COMPARE : "Compare",
    DAY_PATTERNS : "Patterns",
    STATION_FLOW_BALANCE : "Flow balance"
};
































