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
    var _buttonHeight = _viewBoxHeight;

    // Data structures
    var _buttonsBindings = {};


    // PUBLIC METHODS
    this.visualizationTypeChanged = function() {
        _svgContainer.select(".selected").classed("selected", false);
        var selectedItem = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        _buttonsBindings[selectedItem].classed("selected", true);
    };


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
                    //_svgContainer.select(".selected").classed("selected", false);
                    //d3.select(this).classed("selected", true);
                    self.getModel().getVisualizationTypeModel().setVisualizationType(d.value);
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

        gBarButtons.each(function(d) {
            _buttonsBindings[d.value] = d3.select(this);
        });
    };

    var getVisualizationTypes = function() {
        var data = [];

        for(var key in self.getModel().getVisualizationTypeModel().getAvailableVisualizationTypes()) {
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

        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
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
































