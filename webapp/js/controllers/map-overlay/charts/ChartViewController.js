/**
 * @class ChartViewController
 * @description base class for chart container
 *
 * @param parentController
 * @constructor
 */
function ChartViewController(parentController) {
    // Call super constructor
    ViewController.call(this, parentController);
    /////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////
    var self = this;
    var _size = PopupController.SIZE.SINGLE;

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * Sets chart controller size
     * @param size
     */
    this.setSize = function(size) {
        _size = size;
    };

    /**
     * Returns chart controller size
     * @returns {string}
     */
    this.getSize = function() {
        return _size
    };

    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var init = function() {
        self.getView().addClass("chart-view-controller");
    } ();
}

Utils.extend(ChartViewController, ViewController);