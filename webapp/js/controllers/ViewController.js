/**
 * @class: ViewController
 * @description template class
 *
 * @param parentController
 */
function ViewController(parentController) {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _parentController = parentController;


    // PUBLIC METHODS
    this.setParentController = function(viewController) {
        _parentController = viewController;
    };

    this.getParentController = function() {
        return _parentController;
    };

    this.getNotificationCenter = function() {
        return self.getModel().getNotificationCenter();
    };

    this.getModel = function() {
        return _parentController.getModel();
    };



    // PRIVATE METHODS
    var init = function() {

    } ();
}
