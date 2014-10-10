/**
 * @class: PlayADayLayerViewController
 * @description template class
 *
 * @param parentController
 */
function PlayADayLayerViewController(parentController, layerGroup) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;
    var _layerGroup = layerGroup;
    var _animationSpeed;



    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * Getter for the layer group attribute
     *
     * Note: MapViewController needs this getter in order to remove layers from the map
     * @returns {*}
     */
    this.getLayerGroup = function() {
        return _layerGroup;
    };


    this.getLayer = function() {
        //return _layer;
    };


    this.setAnimationSpeed = function(animationSpeed) {
        _animationSpeed = animationSpeed;
    };


    //Notifications callbacks
    this.onPlayStateChanged = function() {
        var playState = self.getModel().getTimeModel().getPlayState();
        if(playState == AnimationState.PLAY) {
            console.log("play");
            var day = self.getModel().getTimeModel().getDate();
            databaseModel.getTripsForPlayADay(day, startAnimation);


        } else if(playState == AnimationState.PAUSE) {

        }
    };


    this.onDateChanged = function() {

    };

    // PRIVATE METHODS

    var startAnimation = function(trips) {
        console.log(trips);
        var stations = databaseModel.getStations();
        var trip  = trips[0];



        var startLat = stations[trip.from_station_id].latitude;

        animateBike()
    };

    var animateBike = function(from, to, duration) {

        var line = L.polyline([from, to]);
        var animatedMarker = L.animatedMarker(line.getLatLngs());

        //var markerLayer = L.marker(self.getModel().getMapModel().getFocusPoint());
        _layerGroup.addLayer(animatedMarker);
    };

    var draw = function() {

    };

    var registerToNotifications = function() {

        self.getNotificationCenter().subscribe(self, self.onPlayStateChanged,
            Notifications.time.PLAY_STATE_CHANGED);

        self.getNotificationCenter().subscribe(self, self.onDateChanged(),
            Notifications.time.DATE_CHANGED);
    };

    var init = function() {
        draw();
        registerToNotifications();
    } ();
}

// Inheritance
Utils.extend(PlayADayLayerViewController, ViewController);