/**
 * @class: Model
 * @description: ...
 */

// Data structure which holds shared data between different model instances
var sharedDataModel = sharedDataModel || {};

// Shared DBModel
var dbModel = dbModel || new DBModel();

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

    /**
     * @returns The DBModel object, which contains all the interfaces to the database{dbModel|*|DBModel}
     */
    this.getDBModel = function() {
        return dbModel;
    }

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
