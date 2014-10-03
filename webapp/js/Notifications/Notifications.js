/**
 * @namespace Notifications
 * @description Notifications is the namespace for every notification that the application has to deal with.
 * Ideally each components that has to publish notifications should define here its own notifications under
 * its sub-namespace.
 */
var Notifications = Notifications || {};//function() {};


/**
 * MapContainerController notifications sub-namespace
 */
Notifications.mapController = {
    STATION_HAS_BEEN_SELECTED : "com.divvy.mapController.stationSelected"
};

Notifications.newGroupOfNotifications = {
    SOMETHINGS_HAS_HAPPENED : "com.divvy.whatever"
};