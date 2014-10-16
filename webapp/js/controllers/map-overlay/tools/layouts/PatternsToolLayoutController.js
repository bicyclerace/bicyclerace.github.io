/**
 * @class PatternsToolLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function PatternsToolLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _imageVC;

    // PUBLIC METHODS
    /**
     * @override
     */
    var _superUpdateView = this.updateView;
    this.updateView = function() {
        // Put your code here..
        draw();

        // Call super
        _superUpdateView.call(self);
    };

    // PRIVATE METHODS
    var draw = function() {
        _imageVC.getView().setFrame(100,100, 400, 400);
        _imageVC.getView().setViewBox(0,0,400,400);
        _imageVC.setImagePath("img/weather-icons/cloud.svg");
    };
    var init = function() {
        self.getView().addClass("patterns-tool-layout-controller");
        _imageVC = new UIImageViewController(self);
        self.add(_imageVC);
    } ();
}

Utils.extend(PatternsToolLayoutController, ViewController);