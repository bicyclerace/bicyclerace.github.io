/**
 * @class CompareToolsLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function CompareToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController || undefined);
    ////////////////////////////// PRIVATE ATTRIBUTES //////////////////////////////
    var self = this;

    // UI
    var _stationSelectionToolController;
    var _legendaViewController;

    ////////////////////////////// PUBLIC METHODS //////////////////////////////
    /**
     * Subclasses should override this method
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {

        // Update selection tool
        var stationSize = {width: 400, height: 100, marginLeft: 10};

        _stationSelectionToolController.getView()
            .setFrame(stationSize.marginLeft, self.getView().getViewBoxHeight() - stationSize.height, stationSize.width, stationSize.height);

        //legenda tool
        var legendaSize = {width: 200, height: 130, marginRight: 10};
        _legendaViewController.getView().setFrame( self.getView().getViewBoxWidth() - legendaSize.width - legendaSize.marginRight,
                self.getView().getViewBoxHeight() - legendaSize.height,
            legendaSize.width,
            legendaSize.height);



        // Call super method (updates children)
        superUpdateView.call(self);
    };


    ////////////////////////////// PRIVATE METHODS //////////////////////////////
    var draw = function() {


    };

    var init = function() {
        self.getView().addClass("compare-tools-layout-view-controller");


        // Stations selection tool
        _stationSelectionToolController = new UIStationsSelectionViewController(self);
        self.add(_stationSelectionToolController);

        _legendaViewController = new UILegendaViewController(self);
        self.add(_legendaViewController);
        draw();

    } ();
}

Utils.extend(CompareToolsLayoutController, ViewController);