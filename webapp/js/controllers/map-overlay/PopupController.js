/**
 * @class: PopupController
 * @description Controller of the chart popup
 *
 * @param parentController
 * @param svgContainer
 * @param size
 */
function PopupController(parentController, popupSize) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _viewBoxWidth;
    var _viewBoxHeight;
    var _popupSize = popupSize;
    var _closeButtonSize = 30;
    
    var _chartController;

    var _padding = {left: 14, top: 14, right: 14, bottom:14};

    // PUBLIC METHODS

    /**
     * @returns
     */
    this.getContainerSvg = function() {
        return self.getView().getSvg();
    };

    this.getPopupSize = function() {
        return _popupSize;
    };

    this.closePopup = function() {

    };
    

    
    this.size = function(value) {
        return (arguments.length) ? (_popupSize = value, self) : _popupSize;
    };
    
    this.chartController = function(value) {
        if (arguments.length) {
            _chartController = value;
            _chartController.parentController(self);
            return self;
        }
        return _chartController;
    };

    // PRIVATE METHODS
    this.draw = function() {
        _viewBoxHeight = self.getView().getSvg().attr("height");
        _viewBoxWidth = self.getView().getSvg().attr("width");

        self.getView().getSvg()
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight);


        //Close button
        self.getView().getSvg().append("image")
            .classed("popup-controller-close-button", true)
            .attr("xlink:href", "img/popup-controller-close-button.png")
            .attr("x", _viewBoxWidth - _padding.right - _closeButtonSize)
            .attr("y", _padding.top)
            .attr("width", _closeButtonSize)
            .attr("height", _closeButtonSize)
            .on("click", function(){parentController.closePopup(self)});

    };

    var init = function() {
        self.getView().addClass("popup-controller");
    } ();
}

// Inheritance
Utils.extend(PopupController, ViewController);

PopupController.SIZE = {
   SINGLE : "single",
   DOUBLE : "double",
   TALL : "tall"
};