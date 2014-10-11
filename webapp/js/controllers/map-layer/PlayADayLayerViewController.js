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
    var _animationSpeed = 50;
    var _svg,_g;
    var _map;



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

    /*map.on("viewreset", reset);

     // this puts stuff on the map!
     reset();
     transition();

     // Reposition the SVG to cover the features.
     function reset() {
     var bounds = d3path.bounds(collection),
     topLeft = bounds[0],
     bottomRight = bounds[1];


     // here you're setting some styles, width, heigh etc
     // to the SVG. Note that we're adding a little height and
     // width because otherwise the bounding box would perfectly
     // cover our features BUT... since you might be using a big
     // circle to represent a 1 dimensional point, the circle
     // might get cut off.

     text.attr("transform",
     function(d) {
     return "translate(" +
     applyLatLngToLayer(d).x + "," +
     applyLatLngToLayer(d).y + ")";
     });


     // for the points we need to convert from latlong
     // to map units
     begend.attr("transform",
     function(d) {
     return "translate(" +
     applyLatLngToLayer(d).x + "," +
     applyLatLngToLayer(d).y + ")";
     });

     ptFeatures.attr("transform",
     function(d) {
     return "translate(" +
     applyLatLngToLayer(d).x + "," +
     applyLatLngToLayer(d).y + ")";
     });

     // again, not best practice, but I'm harding coding
     // the starting point

     marker.attr("transform",
     function() {
     var y = featuresdata[0].geometry.coordinates[1]
     var x = featuresdata[0].geometry.coordinates[0]
     return "translate(" +
     map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
     map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
     });


     // Setting the size and location of the overall SVG container
     svg.attr("width", bottomRight[0] - topLeft[0] + 120)
     .attr("height", bottomRight[1] - topLeft[1] + 120)
     .style("left", topLeft[0] - 50 + "px")
     .style("top", topLeft[1] - 50 + "px");


     // linePath.attr("d", d3path);
     linePath.attr("d", toLine)
     // ptPath.attr("d", d3path);
     g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

     } // end reset
*/


     var transform = d3.geo.transform({
        point: projectPoint
    });
    var d3path = d3.geo.path().projection(transform);

    function projectPoint(x, y) {
            var map = parentController.getMapContainer();
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
     }



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

        var skip = 1;

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

            now = new Date(now.getTime() + _animationSpeed*updateInterval);
            timeModel.setDate(now);
        }, updateInterval);
/*
        var trip = trips[10];
        var start = databaseModel.getStationCoordinates(trip.from_station_id);
        var end = databaseModel.getStationCoordinates(trip.to_station_id);
        var duration = parseInt((trip.seconds*1000) / _animationSpeed);
        animateBike(start,end,duration)*/

    };


    var animateBike = function(from, to, duration) {



        var fromCoord = _map.latLngToLayerPoint(new L.LatLng(from[0], from[1]));
        var toCoord = _map.latLngToLayerPoint(new L.LatLng(to[0], to[1]));

        _g.append("circle")
            .attr("fill","#EE9999")
            .attr("opacity",0.5)
            .attr("cx",fromCoord.x)
            .attr("cy",fromCoord.y)
            .attr("r",5)
            .transition()
            .duration(duration)
            .attr("cx",toCoord.x)
            .attr("cy",toCoord.y)
            .each("end",function(){this.remove()});
        //
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

        draw();
        registerToNotifications();
    } ();
}

// Inheritance
Utils.extend(PlayADayLayerViewController, ViewController);