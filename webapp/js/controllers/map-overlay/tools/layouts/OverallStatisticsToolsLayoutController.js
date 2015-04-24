/**
 * @class OverallStatisticsToolsLayoutController
 * @description implements
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function OverallStatisticsToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 3200, height: 1000};

    var _gridShowButton;

    //////////////////////////// PUBLIC METHODS ////////////////////////////


    /**
     *
     */
    var super_updateView = this.updateView;
    this.updateView = function() {
        _gridShowButton.getView().setFrame(0, 150, 100, 100);
        _gridShowButton.getView().setViewBox(0, 0, 100, 100);

        // Call super
        super_updateView.call(self);
    };

    // PRIVATE METHODS
    var addBehaviors = function() {
        _gridShowButton.onClick(function() {
            var status = self.getModel().getMapModel().getGridStatus();
            self.getModel().getMapModel().setGridStatus(!status);
        });
    };

    var init = function() {
        self.getView().addClass("overall-statistics-tool-layout-controller");

        _gridShowButton = new UIButtonViewController(self);
        _gridShowButton.getView().addClass("community-grid-button");
        _gridShowButton.setImage("img/community-grid-icon.svg");
        self.add(_gridShowButton);

        addBehaviors();
    } ();
}

Utils.extend(OverallStatisticsToolsLayoutController, ViewController);