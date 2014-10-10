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
        _date = date;
        parentModel.getNotificationCenter().dispatch(Notifications.time.DATE_CHANGED);
    };

    this.getDate = function() {
        return _date;
    };

    this.setTimeOfTheDay = function(time) {
        _timeOfTheDay = time;
        parentModel.getNotificationCenter().dispatch(Notifications.time.TIME_OF_THE_DAY_CHANGED);
    };

    this.getTimeOfTheDay = function() {
        return _timeOfTheDay;
    };

    // PRIVATE METHODS
    var init = function () {
        //TODO initial date
        _date = new Date("10-10-2013");

    } ();
}

var AnimationState = {
    PLAY: "play",
    PAUSE: "pause"
};
