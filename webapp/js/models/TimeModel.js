/**
 * @class TimeModel
 * @description this model store all the informations about the current time, date, animation state.
 *
 * @param parentModel
 * @constructor
 */
function TimeModel(parentModel) {
    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    var _parentModel = parentModel;

    var _playState = "pause",
        _date,
        _timeOfTheDay;


    var _startDate = new Date("06-27-2013");
    var _endDate = new Date("12-31-2013");

    ////////////////////////// PUBLIC METHODS //////////////////////////
    /**
     *
     * @param animationState
     */
    this.setPlayState = function(animationState) {
        _playState = animationState;
        parentModel.getNotificationCenter().dispatch(Notifications.time.PLAY_STATE_CHANGED);
    };

    /**
     *
     * @returns {string}
     */
    this.getPlayState = function() {
        return _playState;
    };

    /**
     *
     * @param date
     */
    this.setDate = function(date) {


        if(date >= _startDate && date <= _endDate) {
            var oldDate = _date;
            _date = date;
            if(TimeModel.daysBetween(oldDate,date) == 0 && oldDate != date){
                parentModel.getNotificationCenter().dispatch(Notifications.time.TIME_OF_THE_DAY_CHANGED);
            } else {
                parentModel.getNotificationCenter().dispatch(Notifications.time.DATE_CHANGED);
            }
        }



    };

    /**
     *
     */
    this.nextMonth = function() {

            self.setDate(new Date(_date.getFullYear(), _date.getMonth()+1,1));

    };


    /**
     *
     */
    this.previousMonth = function() {
        if( _date.getMonth()-1 != self.getStartDate().getMonth()) {
            self.setDate(new Date(_date.getFullYear(), _date.getMonth()-1,1));
        } else {
            self.setDate(self.getStartDate());
        }


    };


    /**
     * Return current date
     * @returns {Date}
     */
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

    /**
     *
     */
    this.setDayOfTheMonth = function(day) {
        self.setDate(new Date(_date.getFullYear(), _date.getMonth(),day));
    };

    // Parts of the day
    /**
     *
     * @returns {boolean}
     */
    this.isDay = function() {
        var coordinates = _parentModel.getMapModel().getDefaultFocusPoint();
        var times = SunCalc.getTimes(_date, coordinates[0], coordinates[1]);
        return _date >= times["sunrise"] && _date < times["sunset"];
    };

    /**
     *
     * @returns {boolean}
     */
    this.isNight = function() {
        return !self.isDay();
    };


    this.getStartDate = function () {
        return _startDate;
    };

    this.getEndDate = function () {
        return _endDate;
    };

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

TimeModel.monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

TimeModel.daysInMonth = function(month,year) {
    return new Date(year, month+1, 0).getDate();
}