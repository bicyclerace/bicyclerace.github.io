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
    var _legendaViewController;

    // PUBLIC METHODS
    /**
     * @override
     */
    var _superUpdateView = this.updateView;
    this.updateView = function() {
        // Put your code here..

        // Call super
        _superUpdateView.call(self);

        //legenda tool
        var legendaSize = {width: 200, height: 200, marginRight: 10};
        _legendaViewController.getView().setFrame( self.getView().getViewBoxWidth() - legendaSize.width - legendaSize.marginRight,
                                         self.getView().getViewBoxHeight() - legendaSize.height,
                                         legendaSize.width,
                                         legendaSize.height);

    };

    // PRIVATE METHODS
    var draw = function() {
    };

    var init = function() {
        self.getView().addClass("flow-balance-tool-layout-controller");
        _legendaViewController = new UILegendaViewController(self);
        self.add(_legendaViewController);


        draw();
    } ();
}

Utils.extend(FlowBalanceToolsLayoutController, ViewController);