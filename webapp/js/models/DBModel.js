/**
 * @class: DBModel
 * @description: it groups all the interfaces to the database
 */

function DBModel() {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _dbServer = "//fpadua2.people.uic.edu/divvy_api/";


    //cached values
    var _stations = null;
    var _chicagoJson = null;
    var _stations_popularity = null;



    // PUBLIC METHODS
    /**
     * Loads all the data needed at the startup, such as the station list
     * @param callback
     */
    self.loadBasicResources = function(callback) {

        queue()
            //LOAD stations
            .defer(loadStations)
            .defer(loadChicagoJson)
            //TODO move to somewhere else
            .defer(weatherModel.loadData)
            .await(callback);
    };

    /**
     *
     * @param trip_id
     * @param callback
     */
    self.getTripById = function(trip_id, callback) {
        logUrl(url);
        $.getJSON( _dbServer + "get_trip_by_id?trip_id=" + trip_id )
            .done(callback)
            .fail(_failCallback);
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


    /**
     *
     * @param startDate
     * @param endDate
     */
    self.getTripsCountByDayOfTheYear = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_trips_count_by_day_of_the_year.php?start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };

    /**
     *
     * @param startDate
     * @param endDate
     */
    self.getTripsCountByDayOfTheWeek = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_trips_count_by_day_of_the_week.php?start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };


    /**
     *
     * @param startDate
     * @param endDate
     */
    self.getTripsCountByHourOfTheDay = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_trips_count_by_hour_of_the_day.php?start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };



    /**
     *
     * @param day
     */
    self.getTripsForPlayADay = function(day, callback) {
        var dayCleaned = new Date(day.valueOf());
        dayCleaned.setHours(0,0);
        var start = (dayCleaned).getTime()/1000;
        var endDate = new Date(dayCleaned.valueOf());
        endDate.setDate(endDate.getDate() + 1);
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_trips_for_play_a_day.php?start_date=" + start + "&end_date=" + end;

        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };

    /**
     *
     * @param startDate
     * @param endDate
     * @param callback
     */
    self.getStationsInflow = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_stations_inflow?start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };

    /**
     *
     * @param startDate
     * @param endDate
     * @param callback
     */
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
     * Already sorted by greatest difference
     * @param startDate
     * @param endDate
     * @param callback
     */
    self.getStationsInflowAndOutflow = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_stations_inflow_and_outflow.php?start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };


    /**
     * Already sorted by greatest difference,
     *START DATE and END DATE are taken in consideration only for the HOUR
     * @param startDate
     * @param endDate
     * @param callback
     */
    self.getStationsInflowAndOutflowFilterByHour = function(startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var apiUrl = "get_stations_inflow_and_outflow_select_by_hour.php?start_date=" + start + "&end_date=" + end;
        var url = _dbServer + apiUrl;

        cache(  apiUrl,
                callback,
                function(){
                    logUrl(url);
                    $.getJSON(url)
                     .done(callback)
                     .fail(_failCallback);
                }
        );

    };

    /**
     * overall flow
     * START DATE and END DATE are taken in consideration only for the HOUR
     * @param startDate
     * @param endDate
     * @param limit
     * @param callback
     */
    self.getStationsFlowFilterByHour = function(startDate, endDate, limit, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var apiUrl = "get_stations_flow_select_by_hour.php?start_date=" + start + "&end_date=" + end + "&limit=" + limit;
        var url = _dbServer + apiUrl;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };

    /**
     *
     * @param callback
     */
    self.getTwoStationsFlowByHour = function(stationA, stationB, callback) {

        var url = _dbServer + "get_two_stations_flow_by_hour.php?station_id1=" + stationA + "&station_id2=" + stationB;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };




    /**
     * @param station_id
     * @param startDate
     * @param endDate
     * @param callback
     */
    self.getSingleStationInflowAndOutflow = function(station_id, startDate, endDate, callback) {
        var start = (startDate).getTime()/1000;
        var end = (endDate).getTime()/1000;
        var url = _dbServer + "get_station_inflow_and_outflow.php?station_id="+station_id+"&start_date=" + start + "&end_date=" + end;
        logUrl(url);
        $.getJSON(url)
            .done(callback)
            .fail(_failCallback);
    };


    /**
     *
     * @param callback
     */
    self.getStationsPopularity = function(callback) {
        if(_stations_popularity)
            callback(_stations_popularity);
        else
        {
            var url = _dbServer + "get_stations_popularity.php";
            logUrl(url);
            $.getJSON(url)
                .done(function(json){_stations_popularity = json; callback(json);})
                .fail(_failCallback);
        }

    };

    /**
     *
     * @param callback
     */
    self.getRidersGender = function(callback) {

            var url = _dbServer + "get_riders_gender.php";
            logUrl(url);
            $.getJSON(url)
                .done(function(j){return callback(j[0]);})
                .fail(_failCallback);


    };

    /**
     *
     * @param callback
     */
    self.getRidersAge = function(callback) {

            var url = _dbServer + "get_riders_age.php";
            logUrl(url);
            $.getJSON(url)
                .done(callback)
        .fail(_failCallback);


    };


    /**
     *
     * @param callback
     */
    self.getRidersUsertype = function(callback) {

            var url = _dbServer + "get_riders_usertype.php";
            logUrl(url);
            $.getJSON(url)
                .done(function(j){return callback(j[0]);})
                .fail(_failCallback);

    };

    /**
     *
     * @param callback
     */
    self.getDistanceDistribution = function(callback) {

            var url = _dbServer + "get_distance_distribution.php";
            logUrl(url);
            $.getJSON(url)
                .done(callback)
                .fail(_failCallback);


    };


    /**
     *
     * @param callback
     */
    self.getTripsDurationDistribution = function(callback) {

            var url = _dbServer + "get_trips_duration_distribution.php";
            logUrl(url);
            $.getJSON(url)
                .done(callback)
                .fail(_failCallback);


    };


    /**
     *
     * @param callback
     */
     self.getDistanceByBikeDistribution = function(callback) {

            var url = _dbServer + "get_distance_by_bike_distribution.php";
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

    /**
     *
     */
    self.getChicagoJson = function() {
        return _chicagoJson;
    };


    //HELPERS

    /**
     * Returns an array [lat,long] given the station id
     */
    self.getStationCoordinates = function(station_id) {
        var station = self.getStations()[station_id];
        return [parseFloat(station.station_latitude), parseFloat(station.station_longitude)];
    };


    // PRIVATE FUNCTIONS

    var loadChicagoJson = function(callback) {
        d3.json("resources/chi.json", function(error, json) {
            console.log("Chicago json loaded");
            _chicagoJson = json;
            callback(null,null);
        });
    };

    var loadStations = function(callback){

        var url = _dbServer + "get_all_stations";
        logUrl(url);
        $.getJSON( url )
            .done(function( json ) {
                _stations = d3.nest()
                              .key(function(d){return d.station_id;})
                              .rollup(function(d){
                                    return d[0];})
                              .map(json);

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


    var cache = function(url, callback, fail) {
        $.getJSON(cacheName(url))
            .done(function(json){
                console.log("Fetched cached version of " + url);
                callback(json);

            })
            .fail(fail);
    };

    var cacheName = function(url){
        var newUrl = url.replace(/=|&|\.|\?/g,"_");

        return "resources/cache/"+newUrl+".json";
    };


    /**
     * Initialization stuffs
     */
    var init = function() {

    } ();
}
