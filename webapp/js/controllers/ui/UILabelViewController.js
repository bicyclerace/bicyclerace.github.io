/**
 * @class UILabelViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UILabelViewController(parentController) {
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    //////////////////// PUBLIC METHODS ///////////////////////

    /**
     *
     * @param text
     */
    this.setText = function(text) {
        var d3Svg = self.getView().getSvg();

        // Update
        var textEl = d3Svg.selectAll(".text").data([text]);
        textEl.text(text);

        // Enter
        textEl.enter()
            .append("text")
            .classed("text", true)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("dy", "0.4em")
            .attr("text-anchor", "middle")
            .text(text);
    };

    //////////////////// PRIVATE METHODS ///////////////////////
    var init = function() {
        // Add button css class
        self.getView().addClass("ui-label-view-controller");
    } ();
}

Utils.extend(UILabelViewController, ViewController);