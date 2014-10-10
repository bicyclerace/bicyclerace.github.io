/**
 * @class: PlayADayLayerViewController
 * @description template class
 *
 * @param parentController
 */
function PlayADayLayerViewController(parentController) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;
    var _animationSpeed;



    // PUBLIC METHODS
    this.getLayer = function() {
        //return _layer;
    };


    this.setAnimationSpeed = function(animationSpeed) {
        _animationSpeed = animationSpeed;
    };


    //Notifications callbacks
    this.onPlayStateChanged = function() {

    };


    this.onDateChanged = function() {

    };

    // PRIVATE METHODS
    var draw = function() {

    };

    var registerToNotifications = function() {

        self.getNotificationCenter.subscribe(self, self.onPlayStateChanged,
            Notifications.time.PLAY_STATE_CHANGED);

        self.getNotificationCenter.subscribe(self, self.onDateChanged(),
            Notifications.time.DATE_CHANGED);
    };

    var init = function() {
        draw();
        registerToNotifications();
    } ();
}

// Inheritance
Utils.extend(PlayADayLayerViewController, ViewController);