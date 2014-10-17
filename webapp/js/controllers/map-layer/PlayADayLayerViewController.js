/**
 * @class: PlayADayLayerViewController
 * @description template class
 *
 * @param parentController
 */
function PlayADayLayerViewController(parentController, layerGroup) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _animationStarted = false;
    var _animationSpeed = 50;
    var _animatedBikes = [];//{o
    var _map;
    var bikeIconScale = 0.7;
    var _minZoomLevelToEnlargeBikes = 12;
    var _animationIntervalObject;
    var _animationTrips;
    var _currentTime = null;

    var __debug = true;

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    this.dispose = function() {
        clearInterval(_animationIntervalObject);
        self.getView().getSvg().html("");
        _animatedBikes =  [];
        _animationStarted = false;
    };


    this.setAnimationSpeed = function(animationSpeed) {
        _animationSpeed = animationSpeed;
    };


    //Notifications callbacks
    this.onPlayStateChanged = function() {
        var playState = self.getModel().getTimeModel().getPlayState();
        if(playState == AnimationState.PLAY) {
            var now = self.getModel().getTimeModel().getDate();
            self.playDay(now);


        } else if(playState == AnimationState.PAUSE) {
            //TODO PAUSE
            clearInterval(_animationIntervalObject);
        }
    };


    this.playDay = function(date) {
        _currentTime = date;
        databaseModel.getTripsForPlayADay(date, startAnimation);
    };


    var _oldCoords = [];
    var _zoom;


    this.onDateChanged = function() {

        //No animation started yet
        if(!_animationStarted)
            return;

        var timeModel = self.getModel().getTimeModel();

        //if it is a different time
        //switch to another moment of the animation

        //g("time changed now:" + _currentTime + " last time:" + timeModel.getDate());
        if(_currentTime.getTime() != timeModel.getDate().getTime() && daysBetween(_currentTime,timeModel.getDate()) == 0) {
            if(__debug)console.log("ONLY time changed");
            self.dispose();
            startAnimation(_animationTrips);

        }

        //if it is a different day
        if(daysBetween(_currentTime,timeModel.getDate()) != 0) {
            if(__debug)console.log("dateChanged ON " + timeModel.getDate());
            self.dispose();
            self.playDay(timeModel.getDate());

        }


    };

    ////////////// PRIVATE METHODS
//moved in timeModel
    var daysBetween = function(first, second) {

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


    var startAnimation = function(trips) {
        _animationStarted = true;
        _animationTrips = trips;

        var timeModel = self.getModel().getTimeModel();


        var updateInterval = 1000;
        var currentTripId = 0;

        //discard all the trips before time
        var now = timeModel.getDate();

        for(var i = currentTripId; i < trips.length; i++) {
            var trip = trips[i];
            currentTripId = i;
            if (new Date(trip.starttime) > now) {
                break;
            }
        }

        if(__debug)console.log("started at trip " + currentTripId + " of " + trips.length);

        //skip some bikes if they are so many
        var skip = 1;


        _animationIntervalObject = window.setInterval(function() {
            var now = timeModel.getDate();

            for(var i = currentTripId; i < trips.length; i+=skip) {
                var trip = trips[i];

                if(new Date(trip.starttime) > now){
                    currentTripId = i;
                    break;
                } else {
                    var start = databaseModel.getStationCoordinates(trip.from_station_id);

                    var end = databaseModel.getStationCoordinates(trip.to_station_id);
                    var duration = parseInt((trip.seconds*1000) / _animationSpeed);
                    if(__debug)console.log("started at trip " + i + " of " + trips.length);
                    animateBike(start,end,duration)
                }
            }

            _currentTime = new Date(now.getTime() + _animationSpeed*updateInterval);

            timeModel.setDate(new Date(_currentTime));
        }, updateInterval);

    };


    var getAngle = function(startPoint,endPoint) {
        return Math.atan2(endPoint.y - startPoint.y,
                          endPoint.x - startPoint.x)*180/Math.PI - 90;
    };


    var getTranslateAttr = function (coord,angle,scale) {
       return "translate("+coord.x+","+coord.y+")"
           + "rotate(" + angle  + ")"
           + "scale(" + scale + ")";
    };


    function getTranslationFromAttr(attr) {
        var match = (/translate\(([+|-]?[\d|\.]*),([+|-]?[\d|\.]*)\)/).exec(attr);
        if(match == null){
            return [0,0];
        }
        else return [parseFloat(match[1]),parseFloat(match[2])];

    }


    var animateBike = function(from, to, duration) {

        var fromCoord = self.project(from[0], from[1]);//_map.latLngToLayerPoint(new L.LatLng(from[0], from[1]));
        var toCoord = self.project(to[0], to[1]);//_map.latLngToLayerPoint(new L.LatLng(to[0], to[1]));

        var fact = getBikeZoomFactor();

        var bike = self.getView().getSvg().append("g")
                     .classed("play-a-day-layer-bike",true);

        var angle = getAngle(fromCoord,toCoord);
        bike.append("polygon").attr("points","-5,0 5,0 0,20");

        bike
            .attr("transform",getTranslateAttr(fromCoord,angle,bikeIconScale*fact))
            .transition()
            .ease("linear")
            .duration(duration)
            .attr("transform",getTranslateAttr(toCoord,angle,bikeIconScale*fact))
            .each("end",function(){
                _animatedBikes = _.without(_animatedBikes, this);
                this.remove()});

        var endTime = new Date();
        endTime.setMilliseconds(endTime.getMilliseconds() + duration);
        bike._animationsInfo = {destination:new L.LatLng(to[0],to[1]),endTime: endTime};
        _animatedBikes.push(bike);

    };

    var getBikeZoomFactor = function() {
        var fact = 0.2;
        /*var mapZoom = _map.getZoom();
        if(mapZoom > _minZoomLevelToEnlargeBikes) {
            fact = (mapZoom - _minZoomLevelToEnlargeBikes);
        }*/
        return fact;
    };


    var draw = function() {

    };

    var registerToNotifications = function() {

        self.getNotificationCenter().subscribe(self, self.onPlayStateChanged,
            Notifications.time.PLAY_STATE_CHANGED);

        self.getNotificationCenter().subscribe(self, self.onDateChanged,
            Notifications.time.DATE_CHANGED);

        self.getNotificationCenter().subscribe(self, self.onDateChanged,
            Notifications.time.TIME_OF_THE_DAY_CHANGED);
    };





    var init = function() {
        _map = parentController.getMapContainer();
        draw();
        registerToNotifications();



    } ();
}

// Inheritance
Utils.extend(PlayADayLayerViewController, MapLayerController);