/**
 * @class WeatherModel
 * @description this model holds all the information about the Chicago weather.
 *
 * @param parentModel
 * @constructor
 */

var weatherModel = weatherModel || new WeatherModel();

function WeatherModel() {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _history;

    ////////////////////////// PUBLIC METHODS //////////////////////////

    /**
     * Loads historical data
     * @param callback
     */
    this.loadData = function(callback) {
        var weatherPath = "resources/weather.json";

        $.getJSON( weatherPath )
            .done(function( json ) {
                _history = json;
                callback(null, null);
            })
            .fail(_failCallback);
    };

    /**
     * Return weather conditions at the given time and day
     * @param date
     */
    this.getConditionAtTime = function(date) {
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() +1)).slice(-2);
        var day = ("0" + (date.getDate())).slice(-2);
        var key = year + month + day;

        var hours = date.getHours();
        var minutes = date.getMinutes();

        var distance = 24;
        var tmpDistance;
        var condition = null;
        _history[key]["observations"].forEach(function(observation) {
            tmpDistance = Math.abs(parseInt(observation["hour"]) - hours);
            if(tmpDistance < distance) {
                distance = tmpDistance;
                condition = observation["conditions"];
            }
        });

        return condition;
    };

    /**
     * Return celsius temperature at the given time and day
     * @param date
     */
    this.getCelsiusAtTime = function(date) {
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() +1)).slice(-2);
        var day = ("0" + (date.getDate())).slice(-2);
        var key = year + month + day;

        var hours = date.getHours();
        var minutes = date.getMinutes();

        var distance = 24;
        var tmpDistance;
        var temperature = null;
        _history[key]["observations"].forEach(function(observation) {
            tmpDistance = Math.abs(parseInt(observation["hour"]) - hours);
            if(tmpDistance < distance) {
                distance = tmpDistance;
                temperature = observation["celsius"];
            }
        });

        return temperature;
    };

    /**
     * Return fahrenheit temperature at the given time and day
     * @param date
     */
    this.getFahrenheitAtTime = function(date) {
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() +1)).slice(-2);
        var day = ("0" + (date.getDate())).slice(-2);
        var key = year + month + day;

        var hours = date.getHours();
        var minutes = date.getMinutes();

        var distance = 24;
        var tmpDistance;
        var temperature = null;
        _history[key]["observations"].forEach(function(observation) {
            tmpDistance = Math.abs(parseInt(observation["hour"]) - hours);
            if(tmpDistance < distance) {
                distance = tmpDistance;
                temperature = observation["fahrenheit"];
            }
        });

        return temperature;
    };

    // TODO debug
    this.getHistory = function() {
        return _history;
    };

    // PRIVATE METHODS
    var _failCallback = function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
    };


    var init = function () {

    } ();
}
