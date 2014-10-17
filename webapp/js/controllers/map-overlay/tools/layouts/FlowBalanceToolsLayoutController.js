/**
 * @class FlowBalanceToolsLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function FlowBalanceToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;




    // PUBLIC METHODS
    /**
     * @override
     */
    var _superUpdateView = this.updateView;
    this.updateView = function() {
        // Put your code here..

        // Call super
        _superUpdateView.call(self);
    };

    // PRIVATE METHODS
    var draw = function() {
    };

    var init = function() {
        self.getView().addClass("popularity-tool-layout-controller");
        // Old
        /*
        _svgContainer
            .classed("popularity-tool-layout-controller", true)
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");*/
        draw();
    } ();
}

Utils.extend(FlowBalanceToolsLayoutController, ViewController);