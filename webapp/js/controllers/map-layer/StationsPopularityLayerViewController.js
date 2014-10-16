/**
 * @class StationsPopularityLayerViewController
 * @description
 *
 * @param parentController
 * @param layer
 * @constructor
 */
function StationsPopularityLayerViewController(parentController) {
    MapLayerController.call(this, parentController);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;



    //////////////////////////// PUBLIC METHODS ////////////////////////////

    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {
        draw();

        // Call super
        super_updateView.call(self);
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
                self.getLayerGroup().addLayer(L.marker([latitude, longitude], {
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

    } ();
}

Utils.extend(StationsPopularityLayerViewController, MapLayerController);