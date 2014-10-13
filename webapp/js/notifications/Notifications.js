/**
 * @namespace Notifications
 * @description Notifications is the namespace for every notification that the application has to deal with.
 * Ideally each components that has to publish notifications should define here its own notifications under
 * its sub-namespace.
 */
var Notifications = Notifications || {};//function() {};


/**
 * VisualizationModuleController notifications sub-namespace
 */
Notifications.mapController = {
    STATION_HAS_BEEN_SELECTED : "com.divvy.mapController.stationSelected",
    //whenever a map change its position / zoom
    MAP_POSITION_OR_ZOOM_CHANGED : "com.divvy.mapContainerController.mapPositionOrZoomChanged"
};

Notifications.mapContainerController = {
    //Whenever a new map is open/closed
    MAP_CONFIGURATION_CHANGED : "com.divvy.mapContainerController.mapConfigurationChanged"

};

Notifications.newGroupOfNotifications = {
    SOMETHINGS_HAS_HAPPENED : "com.divvy.whatever"
};

Notifications.visualizationTypeStatus = {
    VISUALIZATION_TYPE_CHANGED : "com.divvy.visualizationTypeStatus.typeChanged"
};

Notifications.time = {
    DATE_CHANGED : "com.divvy.time.dateChanged",
    PLAY_STATE_CHANGED  : "com.divvy.time.playStateChanged",
    TIME_OF_THE_DAY_CHANGED  : "com.divvy.time.timeOfTheDayChanged"
};