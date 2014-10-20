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



    //////////////////////////// PUBLIC METHODS ////////////////////////////


    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var communityColors = d3.scale.category10(); // Add some color to our lives...


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
        d3.json("resources/chi.json", renderMap);
        
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