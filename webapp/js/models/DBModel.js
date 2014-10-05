/**
 * @class: DBModel
 * @description: it groups all the interfaces to the database
 */

function DBModel() {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _dbServer = "http://fpadua2.people.uic.edu/divvy_api/";
    var _stations = null;



    // PUBLIC METHODS
    /**
     * Loads all the data needed at the startup, such as the station list
     * @param callback
     */
    self.loadBasicResources = function(callback) {
        queue()
            //LOAD stations
            .defer(loadStations)
            .await(callback);
    };

    self.getTripById = function(trip_id, callback) {
        logUrl(url);
        $.getJSON( _dbServer + "get_trip_by_id?trip_id=" + trip_id )
            .done(callback)
            .fail(_failCallback());
    };

    /**
     *
     * @param startDate
     * @param endDate
     * @param parametersFilter  a possible null string with the parameter to be requested for each trip
     *                          if null all the parameters are returned
     */
    self.getTripsStartedInTimeRange = function(startDate, endDate, parametersFilter, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_trips_started_in_date_range?start_date=" + start + "&end_date=" + end;

        if(parametersFilter) {
            url += "&select=" + parametersFilter;
        }
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };

    self.getStationsInflow = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_stations_inflow?start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };

    self.getStationsOutflow = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_stations_outflow?start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };

    /**
     * @returns List of all the stations
     */
    self.getStations = function() {
        return _stations;
    };


    // PRIVATE FUNCTIONS

    var loadStations = function(callback){

        var url = _dbServer + "get_all_stations";
        logUrl(url);
        $.getJSON( url )
            .done(function( json ) {
                _stations = json;
                callback(null, null);
            })
            .fail(_failCallback);
    };

    var logUrl = function(url) {
        console.log("REQUEST: " + url);
    };

    var _failCallback = function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
    };


    /**
     * Initialization stuffs
     */
    var init = function() {

    } ();
}
