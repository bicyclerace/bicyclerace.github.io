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

    var _animationSpeed = 50;
    var _svg,_g;
    var _animatedBikes = [];//{o
    var _map;
    var bikeIconScale = 0.7;
    var _minZoomLevelToEnlargeBikes = 12;

    var _currentTime = null;

    //////////////////////////// PUBLIC METHODS ////////////////////////////


    this.setAnimationSpeed = function(animationSpeed) {
        _animationSpeed = animationSpeed;
    };


    //Notifications callbacks
    this.onPlayStateChanged = function() {
        var playState = self.getModel().getTimeModel().getPlayState();
        if(playState == AnimationState.PLAY) {



            console.log("play");
            var now = self.getModel().getTimeModel().getDate();
            self.playDay(now);


        } else if(playState == AnimationState.PAUSE) {

        }
    };


    this.playDay = function(date) {
        _currentTime = date;
        databaseModel.getTripsForPlayADay(date, startAnimation);
    };


    this.resetAnimation = function () {
        //reset bikes
        for(var i in _animatedBikes){

            try{
                _animatedBikes[i].remove();
            }catch(err){
                console.log("error removing a bike");
            }

        }
        _animatedBikes = [];
    };


    var _oldCoords = [];
    var _zoom;
    this.onBeforeMapReset = function() {

        _zoom = _map.getZoom()
        for(var i in _animatedBikes){
            var translation = getTranslationFromAttr(_animatedBikes[i].attr("transform"));
            var point = new L.point(translation[0], translation[1]);
            var coord = _map.layerPointToLatLng(point);
            _animatedBikes[i]._animationsInfo.oldCoords = coord;
        }//unproject
    };


    this.onMapReset = function() {

        _svg.attr("width", 3000)
            .attr("height", 3000)
            .style("left","0px")
            .style("top", "0px");


       var fact = getBikeZoomFactor();



        var now = new Date();
        //Update zoom accordingly
        for(var i in _animatedBikes){
            try {
                var newDuration = _animatedBikes[i]._animationsInfo.endTime - now;

                var newPoint = _map.latLngToLayerPoint(_animatedBikes[i]._animationsInfo.oldCoords);
                var destinationPoint = _map.latLngToLayerPoint(_animatedBikes[i]._animationsInfo.destination);
                var angle = getAngle(newPoint,destinationPoint);
                _animatedBikes[i].interrupt() //stop previous
                    .attr("transform",getTranslateAttr(newPoint,angle,bikeIconScale*fact))
                    .transition()
                    .duration(newDuration)
                    .attr("transform",getTranslateAttr(destinationPoint,angle,bikeIconScale*fact))
                    .each("end",function(){
                        _animatedBikes = _.without(_animatedBikes, this);
                        this.remove()});
            } catch(exc) {
                _animatedBikes[i].remove();
            }

        }



    };


    this.onDateChanged = function() {
        var timeModel = self.getModel().getTimeModel();

        //if it is a different time
        //switch to another moment of the animation

        //if it is a different day
        if(daysBetween(_currentTime,timeModel.getDate()) != 0) {
            console.log("dateChanged");
            self.resetAnimation();
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

    var projectPoint = function(x, y) {
            var map = parentController.getMapContainer();
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
    };



    var startAnimation = function(trips) {
        console.log(trips);
        var timeModel = self.getModel().getTimeModel();


        var updateInterval = 300;
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

        //skip some bikes if they are so many
        var skip = 1;

        var start = databaseModel.getStationCoordinates(trips[0].from_station_id);

        var end = databaseModel.getStationCoordinates(trips[0].to_station_id);
        var duration = parseInt((trips[0].seconds*100000) / _animationSpeed);

        animateBike(start,end,duration);

        window.setInterval(function() {
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

                    animateBike(start,end,duration)
                }
            }

            _currentTime = new Date(now.getTime() + _animationSpeed*updateInterval);
            timeModel
            timeModel.setDate(_currentTime);
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

        var fromCoord = _map.latLngToLayerPoint(new L.LatLng(from[0], from[1]));
        var toCoord = _map.latLngToLayerPoint(new L.LatLng(to[0], to[1]));

        var fact = getBikeZoomFactor();

        var bike = _g.append("g")
                     .classed("play-a-day-layer-bike",true);

        var angle = getAngle(fromCoord,toCoord);
        bike.append("polygon").attr("points","-5,0 5,0 0,20");

        bike
            .attr("transform",getTranslateAttr(fromCoord,angle,bikeIconScale*fact))
            .transition()
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
        var fact = 1;
        var mapZoom = _map.getZoom();
        if(mapZoom > _minZoomLevelToEnlargeBikes) {
            fact = (mapZoom - _minZoomLevelToEnlargeBikes);
        }
        return fact;
    };


    var draw = function() {
        _svg = d3.select("#test-lay");
        //TODO SIZES
        _svg.attr("width",3000);
        _svg.attr("height",3000);
        _g = _svg.append("g").attr("class", "leaflet-zoom-hide");

        //var svg = d3.select(_layerGroup.getPanes().overlayPane).append("svg");
    };

    var registerToNotifications = function() {

        self.getNotificationCenter().subscribe(self, self.onPlayStateChanged,
            Notifications.time.PLAY_STATE_CHANGED);

        self.getNotificationCenter().subscribe(self, self.onDateChanged,
            Notifications.time.DATE_CHANGED);
    };

    var init = function() {
        _map = parentController.getMapContainer();
        _map.on("beforeviewreset", self.onBeforeMapReset);
        _map.on("viewreset", self.onMapReset);
        draw();
        registerToNotifications();



        var p = self.getModel().getMapModel().fromLatLngToLayerPoint(41.874337, -87.639566);
        //DEBUG
        self.getView().getSvg().append("circle")
            .attr("id","dcircle")
            .attr("cx", p.x)
            .attr("cy", p.y)
            .attr("fill","#FF0000")
            .attr("r", 10);
    } ();
}

// Inheritance
Utils.extend(PlayADayLayerViewController, MapLayerController);