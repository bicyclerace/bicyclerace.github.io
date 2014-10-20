/**
 * @class: ViewController
 * @description ViewController class implements an MVC controller. It contains also the UIView that it manages.
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


    /////////////////////////////// PUBLIC METHODS ///////////////////////////////
    /**
     * Add a child controller to the View Controller children list and calls updateView of the child
     * @param childController
     */
    this.add = function(childController) {
        _children.push(childController);
        childController.setParentController(self);
        self.getView().add(childController.getView());
        childController.updateView();
    };

    /**
     * Returns all the children controllers
     * @returns {Array}
     */
    this.getChildren = function() {
        return _children;
    };

    /**
     * Remove the given child from the children
     * @param childController
     */
    this.remove = function(childController) {
        childController.dispose();
        self.getView().remove(childController.getView());
        _children = _.without(_children, childController);
    };

    /**
     * Removes all children in the sub-hierarchy
     */
    this.removeAllChildren = function() {
        for(var i = self.getChildren().length -1; i >= 0; i--) {
            self.remove(self.getChildren()[i]);
        }
    };

    /**
     * Add itself to a parent view controller
     * @param parentViewController
     */
    this.addTo = function(parentViewController) {
        parentViewController.add(self);
    };

    /**
     * This methods handles views updates.
     * It is first called when the ViewController is added to a parent view controller.
     * @override Subclasses should override this method
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

    /**
     * Override if need to clean stuff before the controller gets destroyed
     * @override
     */
    this.dispose = function() {
        _children.forEach(function(child) {
            child.dispose();
        });
    };


    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {
        _view = new UIView();
        _view.addClass("view-controller");
    } ();
}
