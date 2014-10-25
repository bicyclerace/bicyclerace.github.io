/**
 * Created by krbalmryde on 10/11/14.
 */
/**
 * @class CommunityGridLayerViewController
 * @description
 *
 * @param parentController
 * @param layer
 * @constructor
 */
function CommunityGridLayerViewController(parentController) {
    MapLayerController.call(this, parentController);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // Contains all the layers of the VC
//    var _layerGroup = layerGroup;

    //////////////////////////// PUBLIC METHODS ////////////////////////////
    /**
     * Getter for the layer group attribute
     *
     * Note: MapViewController needs this getter in order to remove layers from the map
     * @returns {*}
     */
//    this.getLayerGroup = function() {
//        return _layerGroup;
//    };


    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var communityColors = d3.scale.category10(); // Add some color to our lives...

    var _map = new L.Map("map", {center: [37.8, -96.9], zoom: 4})
        .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png"));

    var _svg = d3.select(_map.getPanes().overlayPane).append("svg");
    var _g = _svg.append("g").attr("class", "leaflet-zoom-hide");


    var renderMap = function(json){
        console.log("chicago geoJSON",json);
        var districtName,
            communityName;
        var chicagoGeoJson = topojson.feature(json, json.objects.chicago_health2);

        // console.log(chicagoGeoJson);
        chicagoGeoJson.features.forEach(function(feature) {
            var geoJson = {type: "FeatureCollection", features: [feature]};
            var chicagoLayer = L.geoJson(geoJson, {
                style: function (feature) {
                    '<p>Hello world!<br />This is a nice popup.</p>'
                    districtName = "<p><strong>District:</strong> " + feature.properties.district.name + "</p>";
                    communityName = "<p>&#10;<strong>Community:</strong> " + feature.properties.community.name + "</p>";
//                console.log(feature.properties.community.name + " " + feature.properties.district.name + "\n")
                    return {
                        color: communityColors(feature.properties.district.name),
                        fillOpacity: 0.25
                    }
                }
            }).bindPopup(districtName + communityName);
            self.getLayerGroup().addLayer(chicagoLayer);
        });
        
        /* Programatticaly find which stations are in which communities */
        var stations = self.getModel().getDBModel().getStations();
        var stationsInCommunities = [];
        
        chicagoGeoJson.features.forEach(function(feature) {
            var stationsInThis = [];
            feature.geometry.coordinates.forEach(function(array) {
                var geom;
                if (array.every(function(element) { return element.length === 2; })) {
                    geom = array;
                } else {
                    geom = array[0];
                }
                d3.values(stations).forEach(function(station) {
                    var point = [station.station_longitude, station.station_latitude];
                    var inStation = pointInPolygon( point, geom );
                    if (inStation) {
                        stationsInThis.push(station.station_id);
                    }
                })
            })
            stationsInCommunities.push({ community: feature.id, stations: stationsInThis });
            
        });
        // console.log(JSON.stringify(stationsInCommunities));
    };


    var draw = function() {
        var json = self.getModel().getDBModel().getChicagoJson();
//            console.log("FrumpyPigSkin! geoJSON",json);
        var chicagoGeoJson = topojson.feature(json, json.objects.chicago_health2);
        var _transform = d3.geo.transform({point: projectPoints});
        var _path = d3.geo.path().projection(_transform);

        function projectPoints(x,y) {
            var point = _map.latLngToLayerPoint(new L.LatLng(y,x));
            this.stream.point(point.x, point.y);
        }

        function reset() {
            var bounds = _path.bounds(chicagoGeoJson);
            var topLeft = bounds[0];
            var bottomRight = bounds[1];

            _svg.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            _g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft);

            feature.attr("d", _path);
        }

        var _feature = g.selectAll("path")
            .data(chicagoGeoJson.features)
            .enter().append("path");

        _map.on("viewreset", reset);
        reset();

        /*
         var stations = self.getModel().getDBModel().getStations();
         for(var stationId in stations) {
         var latitude = stations[stationId].station_latitude;
         var longitude = stations[stationId].station_longitude;
         _layerGroup.addLayer(L.marker([latitude, longitude], {icon: mapPin}));
         }*/

    };

    var init = function() {
        draw();
    } ();
    
    /* From: https://github.com/substack/point-in-polygon */
    function pointInPolygon (point, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        
        var x = point[0], y = point[1];
        
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    };
}

Utils.extend(CommunityGridLayerViewController, MapLayerController);