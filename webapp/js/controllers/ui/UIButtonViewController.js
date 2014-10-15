/**
 * @class UIButtonViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UIButtonViewController(parentController) {
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    var _title;
    var _status;

    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     *
     * @param title
     */
    this.setTitle = function(title) {
        var d3Svg = self.getView().getSvg();

        // Update
        _title = d3Svg.selectAll(".title").data([title]);
        _title.text(title);

        // Enter
        _title.enter()
            .append("text")
            .classed("title", true)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("dy", "0.5em")
            .attr("text-anchor", "middle")
            .text(title);
    };

    /**
     * // TODO not working
     * @param className [css icon class name]
     */
    this.setIcon = function(className) {
        _title.classed(className, true);
    };

    /**
     *
     * @param callBack
     */
    this.onClick = function(callBack) {
        self.getView().on("click", callBack);
    };

    /**
     *
     */
    this.select = function() {
        self.getView().addClass(UIButtonStatus.SELECTED);
    };

    /**
     *
     */
    this.deselect = function() {
        self.getView().removeClass(UIButtonStatus.SELECTED);
    };

    /**
     *
     */
    this.isSelected = function() {
        self.getView().hasClass(UIButtonStatus.SELECTED);
    };


    //////////////////// PRIVATE METHODS ///////////////////////
    var init = function() {
        // Add button css class
        self.getView().addClass("ui-button-view-controller");
        self.setTitle("");
    } ();
}

Utils.extend(UIButtonViewController, ViewController);

var UIButtonStatus = {
    NORMAL: "normal",
    SELECTED: "selected"
};