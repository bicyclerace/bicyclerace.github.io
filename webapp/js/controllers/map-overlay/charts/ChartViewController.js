function ChartViewController(parentController) {
    // Call super constructor
    ViewController.call(this, parentController);
    /////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////
    var self = this;
    var _size = "single";

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

    } ();
}

Utils.extend(ChartViewController, ViewController);