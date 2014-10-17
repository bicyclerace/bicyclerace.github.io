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
    var _image;

    var _defaultViewBox = {x: 0, y: 0, width: 50, height: 50};

    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {
        _image.getView().setFrame(0, 0, self.getView().getViewBoxWidth(), self.getView().getViewBoxHeight());
        _image.getView().setViewBox(0, 0, self.getView().getViewBoxWidth(), self.getView().getViewBoxHeight());

        // Call super
        super_updateView.call(self);
    };

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
     * @param className [css icon class name]
     */
    this.setImage = function(path) {
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

        // Setup default size
        self.getView().setFrame(0, 0, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Setup image controller
        _image = new UIImageViewController(self);
        self.add(_image);
    } ();
}

Utils.extend(UIButtonViewController, ViewController);

var UIButtonStatus = {
    NORMAL: "normal",
    SELECTED: "selected"
};