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
    MAP_POSITION_OR_ZOOM_CHANGED : "com.divvy.mapContainerController.mapPositionOrZoomChanged",
    ZOOM_CHANGED : "com.divvy.mapContainerController.mapZoomChanged",

    COMMUNITY_GRID_STATUS_CHANGED : "com.divvy.mapContainerController.communityGridStatusChanged"
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

Notifications.selections = {
    /** EVERY TIME STATIONS SELECTION CHANGED */
    STATIONS_SELECTED_CHANGED : "com.divvy.selections.stationsSelectedChanged",
    /** IN ADDITION THOSE ARE FIRED*/
    NONE_STATION_SELECTED : "com.divvy.selections.noneStationSelectedChanged",
    ONE_STATION_SELECTED : "com.divvy.selections.oneStationSelectedChanged",
    TWO_STATIONS_SELECTED : "com.divvy.selections.twoStationsSelectedChanged",
    MANY_STATIONS_SELECTED : "com.divvy.selections.manyStationsSelectedChanged",

    DOUBLE_CLICK_ON_STATION: "com.divvy.selections.doubleClickOnStation"
};

Notifications.legenda = {
    LEGENDA_CHANGED : "com.divvy.selections.legendaChanged",
    SELECTED_ENTRIES_CHANGED : "com.divvy.selections.selectedEntriesChanged"
};

Notifications.playADay = {
    TRIPS_DATA_CHANGED : "com.divvy.selections.tripsDataChanged"
};

Notifications.filter = {
    ON_FILTER_CHANGED : "com.divvy.filter.onFilterChanged"
};