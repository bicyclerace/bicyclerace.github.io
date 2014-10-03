/**
 * @class: Model
 * @description: ...
 */

// Data structure which holds shared data between different model instances
var sharedDataModel = sharedDataModel || {};

function Model() {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _notificationCenter;

    // PUBLIC METHODS
    /**
     * get notification center associated to this model
     * @returns {NotificationCenter}
     */
    this.getNotificationCenter = function() {
        return _notificationCenter;
    };

    /* EXAMPLE
    this.setStation = function(id) {
        _id = id;
        self.getNotificationCenter().dispatch()
    }*/


    /**
     * Initialization stuffs
     */
    var init = function() {
        _notificationCenter = new NotificationCenter();
    } ();
}
