/**
 * @class TimeModel
 * @description this model store all the informations about the current time, date, animation state.
 *
 * @param parentModel
 * @constructor
 */
function TimeModel(parentModel) {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _parentModel = parentModel;

    var _playState = "pause",
        _date,
        _timeOfTheDay;

    // PUBLIC METHODS
    this.setPlayState = function(animationState) {
        _playState = animationState;
        parentModel.getNotificationCenter().dispatch(Notifications.time.PLAY_STATE_CHANGED);
    };

    this.getPlayState = function() {
        return _playState;
    };

    this.setDate = function(date) {
        var oldDate = _date;
        _date = date;
        if(TimeModel.daysBetween(oldDate,date) == 0 && oldDate != date){
            parentModel.getNotificationCenter().dispatch(Notifications.time.TIME_OF_THE_DAY_CHANGED);
        } else {
            parentModel.getNotificationCenter().dispatch(Notifications.time.DATE_CHANGED);
        }



    };

    this.getDate = function() {
        return _date;
    };

    /**
     *
     * @param hours
     */
    this.setHours = function(hours) {
        _date.setHours(hours);
        parentModel.getNotificationCenter().dispatch(Notifications.time.TIME_OF_THE_DAY_CHANGED);
    };

    /**
     *
     * @returns {number|*}
     */
    this.getHours = function() {
        return _date.getHours();
    };

    /**
     *
     * @param minutes
     */
    this.setMinutes = function(minutes) {
        _date.setMinutes(minutes);
        parentModel.getNotificationCenter().dispatch(Notifications.time.TIME_OF_THE_DAY_CHANGED);
    };

    /**
     *
     * @returns {number|*}
     */
    this.getMinutes = function() {
        return _date.getMinutes();
    };

    /*
    this.setTimeOfTheDay = function(time) {
        _timeOfTheDay = time;
        parentModel.getNotificationCenter().dispatch(Notifications.time.TIME_OF_THE_DAY_CHANGED);
    };

    this.getTimeOfTheDay = function() {
        return _timeOfTheDay;
    };*/

    // PRIVATE METHODS



    var init = function () {
        //TODO initial date
        _date = new Date("10-10-2013 12:00:00");

    } ();
}

var AnimationState = {
    PLAY: "play",
    PAUSE: "pause"
};

TimeModel.daysBetween = function(first, second) {

    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(days);
};