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
function CommunityGridLayerViewController(parentController, layerGroup) {
    ViewController.call(this, parentController);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // Contains all the layers of the VC
    var _layerGroup = layerGroup;

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

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var communityColors = d3.scale.category10(); // Add some color to our lives...


    var renderMap = function(json){
        console.log("chicago geoJSON",json);
        var districtName,
            communityName;
        var chicagoGeoJson = topojson.feature(json, json.objects.chicago_health2);

        console.log(chicagoGeoJson)
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
            _layerGroup.addLayer(chicagoLayer);
        });
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
}

Utils.extend(CommunityGridLayerViewController, ViewController);