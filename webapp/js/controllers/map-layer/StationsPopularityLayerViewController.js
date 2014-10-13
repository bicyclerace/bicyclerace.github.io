/**
 * @class StationsPopularityLayerViewController
 * @description
 *
 * @param parentController
 * @param layer
 * @constructor
 */
function StationsPopularityLayerViewController(parentController, layerGroup) {
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
    var draw = function() {
        var stations = self.getModel().getDBModel().getStations();
        self.getModel().getDBModel().getStationsPopularity(function(popularities) {
            //
            var minPopularity = d3.min(popularities, function(p) {
                return p["popularity"];
            });
            var maxPopularity = d3.max(popularities, function(p) {
                return p["popularity"];
            });

            var popularityColor = d3.scale.linear();
            popularityColor
                .domain([minPopularity, maxPopularity])
                .range(["#fecc5c", "#bd0026"]);

            popularities.forEach(function(popularity) {
                var id = popularity["station_id"];
                var name = stations[id]["station_name"];
                var latitude = stations[id]["station_latitude"];
                var longitude = stations[id]["station_longitude"];
                var bikesPerDay = popularity["popularity"];
                _layerGroup.addLayer(L.marker([latitude, longitude], {
                    icon: L.divIcon({
                        className: "icon-location popularity" + id
                        //className: "fa fa-map-marker fa-2x popularity" + id
                    })
                }).bindPopup(name));
                d3.select(".popularity" + id)
                    .data([bikesPerDay])
                    .style("color", popularityColor)
                    .style("font-size", "30px");
            });
        });

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

Utils.extend(StationsPopularityLayerViewController, ViewController);