/**
 * @class PopularityToolsLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function PopularityToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;

    // Community grid
    var _gridShowButton;



    // PUBLIC METHODS
    /**
     * @override
     */
    var _superUpdateView = this.updateView;
    this.updateView = function() {
        // Put your code here..

        _gridShowButton.getView().setFrame(0, 150, 100, 100);
        _gridShowButton.getView().setViewBox(0, 0, 100, 100);


        // Call super
        _superUpdateView.call(self);
    };

    // PRIVATE METHODS
    var draw = function() {
    };


    var addBehaviors = function() {
        _gridShowButton.onClick(function() {
            var status = self.getModel().getMapModel().getGridStatus();
            self.getModel().getMapModel().setGridStatus(!status);
        });
    };

    var init = function() {
        self.getView().addClass("popularity-tool-layout-controller");
        // Old
        /*
        _svgContainer
            .classed("popularity-tool-layout-controller", true)
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");*/
        _gridShowButton = new UIButtonViewController(self);
        _gridShowButton.getView().addClass("community-grid-button");
        _gridShowButton.setImage("img/community-grid-icon.svg");
        self.add(_gridShowButton);

        addBehaviors();

        draw();
    } ();
}

Utils.extend(PopularityToolsLayoutController, ViewController);