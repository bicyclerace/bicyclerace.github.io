/**
 * @class: ViewController
 * @description template class
 *
 * @param parentController
 */
function ViewController(/**ViewController=*/parentController) {
    // PRIVATE ATTRIBUTES
    var self = this;

    // Controller view
    var _view;

    var _parentController = parentController || null;

    var _children = [];


    // PUBLIC METHODS
    /**
     *
     * @param subviewController
     */
    this.add = function(subviewController) {
        _children.push(subviewController);
        subviewController.setParentController(self);
        self.getView().add(subviewController.getView());
        subviewController.updateView();
    };

    /**
     *
     * @param parentViewController
     */
    this.addTo = function(parentViewController) {
        parentViewController.add(self);
    };

    /**
     * Subclasses should override this method
     */
    this.updateView = function() {
        _children.forEach(function(child) {
            child.updateView();
        });
    };

    /**
     * Sets ViewController's parent controller
     * @param viewController
     */
    this.setParentController = function(viewController) {
        _parentController = viewController;
    };

    /**
     * Return ViewController's parent controller
     * @returns {*}
     */
    this.getParentController = function() {
        return _parentController;
    };

    /**
     * Returns ViewController's notification center
     * @returns {*|NotificationCenter}
     */
    this.getNotificationCenter = function() {
        return self.getModel().getNotificationCenter();
    };

    /**
     * Returns ViewController's model
     * @returns {*|Model}
     */
    this.getModel = function() {
        return _parentController.getModel();
    };

    /**
     * Returns ViewController's view
     * @returns {UIView}
     */
    this.getView = function() {
        return _view;
    };



    // PRIVATE METHODS
    var init = function() {
        _view = new UIView();
        _view.addClass("view-controller");
    } ();
}
