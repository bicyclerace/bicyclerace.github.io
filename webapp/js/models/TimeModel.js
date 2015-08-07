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


    // Data range
    var _startDate = new Date("06-27-2013");
    var _endDate = new Date("12-31-2013");

    // TODO decide the default date for visualizations
    var _defaultDate = new Date("10-10-2013 12:00:00");

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
                // Update sunrise and sunset time
                var coordinates = _parentModel.getMapModel().getDefaultFocusPoint();
                var times = SunCalc.getTimes(_date, coordinates[0], coordinates[1]);

                TimeModel.DayCategories.SUNRISE.start.hours = times["sunrise"].getHours();
                TimeModel.DayCategories.SUNRISE.start.minutes = times["sunrise"].getMinutes();
                TimeModel.DayCategories.SUNRISE.end.hours = times["sunriseEnd"].getHours();
                TimeModel.DayCategories.SUNRISE.end.minutes = times["sunriseEnd"].getMinutes();

                TimeModel.DayCategories.SUNSET.start.hours = times["sunsetStart"].getHours();
                TimeModel.DayCategories.SUNSET.start.minutes = times["sunsetStart"].getMinutes();
                TimeModel.DayCategories.SUNSET.end.hours = times["sunset"].getHours();
                TimeModel.DayCategories.SUNSET.end.minutes = times["sunset"].getMinutes();

                TimeModel.DayCategories.DAY_TIME.start.hours = times["sunrise"].getHours();
                TimeModel.DayCategories.DAY_TIME.start.minutes = times["sunrise"].getMinutes();
                TimeModel.DayCategories.DAY_TIME.end.hours = times["sunset"].getHours();
                TimeModel.DayCategories.DAY_TIME.end.minutes = times["sunset"].getMinutes();

                TimeModel.DayCategories.NIGHT_TIME.start.hours = times["sunset"].getHours();
                TimeModel.DayCategories.NIGHT_TIME.start.minutes = times["sunset"].getMinutes();
                TimeModel.DayCategories.NIGHT_TIME.end.hours = times["sunrise"].getHours();
                TimeModel.DayCategories.NIGHT_TIME.end.minutes = times["sunrise"].getMinutes();


                // Dispatch notification
                parentModel.getNotificationCenter().dispatch(Notifications.time.DATE_CHANGED);

                if(oldDate.getHours() != date.getHours || oldDate.getMinutes() != date.getMinutes) {
                    parentModel.getNotificationCenter().dispatch(Notifications.time.TIME_OF_THE_DAY_CHANGED);
                }
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



    // Day categories
    /**
     * Returns true if the current time is in the given category range
     * @param dayCategory = @see TimeModel.DayCategories enum
     * @returns {boolean}
     */
    this.isCurrentCategory = function(dayCategory) {
        var hours = self.getDate().getHours();
        var minutes = self.getDate().getMinutes();


        return hours >= dayCategory.start.hours && hours <= dayCategory.end.hours
            || (hours == dayCategory.end.hours && minutes <= dayCategory.end.minutes)
            || (dayCategory.end.hours < dayCategory.start.hours && (
                hours > dayCategory.start.hours
                || hours < dayCategory.end.hours
                || (hours == dayCategory.start.hours && minutes > dayCategory.start.minutes)
                || (hours == dayCategory.end.hours && minutes < dayCategory.end.minutes)
                ));
    };

    /**
     * Set the TimeModel time on the start time of the given category
     * @param dayCategory
     */
    this.setCategoryStartTime = function(dayCategory) {
        var currentDate = new Date(self.getDate());

        currentDate.setHours(dayCategory.start.hours);
        currentDate.setMinutes(dayCategory.start.minutes);
        self.setDate(currentDate);
    };




    ////////////////////////////// PRIVATE METHODS //////////////////////////////
    var init = function () {
        //TODO initial date
        _date = _defaultDate;

    } ();
}

var AnimationState = {
    PLAY: "play",
    PAUSE: "pause"
};

TimeModel.DayCategories = {
    // 6:00 - 11:59
    MORNING: {
        start: {
            hours: 6,
            minutes: 0
        },
        end: {
            hours: 11,
            minutes: 59
        }
    },
    // 12:00 - 13:30
    LUNCH_TIME: {
        start: {
            hours: 12,
            minutes: 0
        },
        end: {
            hours: 13,
            minutes: 30
        }
    },
    // 17:00 - 18:59
    AFTER_WORK: {
        start: {
            hours: 17,
            minutes: 0
        },
        end: {
            hours: 18,
            minutes: 59
        }
    },
    // 19:00 - 23:59
    EVENING: {
        start: {
            hours: 19,
            minutes: 0
        },
        end: {
            hours: 23,
            minutes: 59
        }
    },
    // 00:00 - 05:59
    NIGHT: {
        start: {
            hours: 0,
            minutes: 0
        },
        end: {
            hours: 5,
            minutes: 59
        }
    },
    // UPDATE based on the date
    SUNRISE: {
        start: {
            hours: 6,
            minutes: 0
        },
        end: {
            hours: 6,
            minutes: 2
        }
    },
    // UPDATE based on the date
    SUNSET: {
        start: {
            hours: 19,
            minutes: 0
        },
        end: {
            hours: 19,
            minutes: 3
        }
    },
    DAY_TIME: {
        start: {
            hours: 6,
            minutes: 0
        },
        end: {
            hours: 18,
            minutes: 59
        }
    },
    NIGHT_TIME: {
        start: {
            hours: 19,
            minutes: 4
        },
        end: {
            hours: 5,
            minutes: 59
        }
    }
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
};