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

    // Community grid
    var _gridShowButton;


    ////////////////////////////// PUBLIC METHODS //////////////////////////////
    /**
     * Subclasses should override this method
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {

        _gridShowButton.getView().setFrame(0, 150, 100, 100);
        _gridShowButton.getView().setViewBox(0, 0, 100, 100);


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

    // PRIVATE METHODS
    var addBehaviors = function() {
        _gridShowButton.onClick(function() {
            var status = self.getModel().getMapModel().getGridStatus();
            self.getModel().getMapModel().setGridStatus(!status);
        });
    };

    var init = function() {
        self.getView().addClass("compare-tools-layout-view-controller");

        _gridShowButton = new UIButtonViewController(self);
        _gridShowButton.getView().addClass("community-grid-button");
        _gridShowButton.setImage("img/community-grid-icon.svg");
        self.add(_gridShowButton);

        addBehaviors();

        // Stations selection tool
        _stationSelectionToolController = new UIStationsSelectionViewController(self);
        self.add(_stationSelectionToolController);

        _legendaViewController = new UILegendaViewController(self);
        self.add(_legendaViewController);
        draw();

    } ();
}

Utils.extend(CompareToolsLayoutController, ViewController);