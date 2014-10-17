/**
 *
 * @param parentController
 * @constructor
 */
function BikesOutChartViewController(parentController) {
    // Call super constructor
    ChartViewController.call(this, parentController);
    /////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////
    var self = this;

    var _button;

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {
        _button.setTitle("BAU");
        // Call super
        super_updateView.call(self);
    };

    /////////////////////////// PRIVATE METHODS ///////////////////////////
    var init = function() {
        self.getView().addClass("bikes-out-chart-view-controller");
        _button = new UIButtonViewController(self);
        self.add(_button);
    } ();
}

Utils.extend(BikesOutChartViewController, ChartViewController);