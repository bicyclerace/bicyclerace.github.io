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
    var openPopup = function(data) {
        var popup = new MapLayerPopupViewController(self);

        var contentBox = {
            width: 20,
            height: 10,
            scale: 17
        };

        popup.setContentViewFrame(contentBox.width, contentBox.height);



        // Setup container View Controller
        var _containerVC = new ViewController(self);
        _containerVC.getView().setFrame(0,0, contentBox.width, contentBox.height);
        _containerVC.getView().setViewBox(0,0, contentBox.width * contentBox.scale, contentBox.height * contentBox.scale);

        contentBox = {
            width: contentBox.width * contentBox.scale,
            height: contentBox.height * contentBox.scale,
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        };


        // Station name label
        var nameBox = {
            x: contentBox.padding.left,
            y: contentBox.padding.top,
            width: contentBox.width - contentBox.padding.left - contentBox.padding.right,
            height: (contentBox.height - contentBox.padding.top - contentBox.padding.bottom) / 2
        };

        var label = new UILabelViewController(self);
        label.getView().setFrame(nameBox.x, nameBox.y, nameBox.width, nameBox.height);
        label.getView().setViewBox(0, 0, nameBox.width, nameBox.height);
        label.setText(data.stationName);

        _containerVC.add(label);

        // Flow label
        var flowWidth = nameBox.width / 3;
        label = new UILabelViewController(self);
        label.getView().setFrame(nameBox.x, contentBox.padding.top + nameBox.height, flowWidth, nameBox.height);
        label.getView().setViewBox(0, 0, flowWidth, nameBox.height);
        label.setText("Flow:");

        _containerVC.add(label);

        // Popularity label
        label = new UILabelViewController(self);
        label.getView().setFrame(nameBox.x + flowWidth, contentBox.padding.top + nameBox.height, flowWidth *2, nameBox.height);
        label.getView().setViewBox(0, 0, flowWidth *2, nameBox.height);
        label.setText(parseInt(data.popularity) + " bikes/day");

        _containerVC.add(label);



        popup.getContentViewController().add(_containerVC);
        popup.setLatLng(data.latitude, data.longitude);
        self.add(popup);
    };

    var draw = function() {
        var stations = self.getModel().getDBModel().getStations();
        self.getModel().getDBModel().getStationsPopularity(function(popularities) {
            //
            var minPopularity = d3.min(popularities, function(p) {
                return parseFloat(p["popularity"]);
            });
            var maxPopularity = d3.max(popularities, function(p) {
                return parseFloat(p["popularity"]);
            });

            var popularityColor = d3.scale.linear();
            popularityColor
                .domain([minPopularity, maxPopularity])
                .range(["#fecc5c", "#bd0026"]);

            var stationButton;
            var stationBox = {x: 0, y:0, width: 2, height: 2, margin:0.1};

            popularities.reverse().forEach(function(popularity) {
                var id = popularity["station_id"];
                var name = stations[id]["station_name"];
                var latitude = stations[id]["station_latitude"];
                var longitude = stations[id]["station_longitude"];
                var bikesPerDay = popularity["popularity"];

                var stationPoint = self.project(latitude, longitude);
                stationBox.x = stationPoint.x;
                stationBox.y = stationPoint.y;

                stationButton = new UIButtonViewController(self);
                stationButton.getView().setFrame(stationBox.x - (stationBox.width /2), stationBox.y - (stationBox.height /2), stationBox.width, stationBox.height);
                stationButton.getView().setViewBox(0, 0, stationBox.width, stationBox.height);
                stationButton.getView().addClass("station" + id);

                var circle = stationButton.getView().getSvg().append("circle");
                circle
                    .attr("cx", stationBox.width /2)
                    .attr("cy", stationBox.height /2)
                    .attr("r", (stationBox.height - stationBox.margin * 2) /2)
                    .style("pointer-events", "none")
                    .style("fill", popularityColor(bikesPerDay))
                    .style("stroke-width", stationBox.margin)
                    .style("stroke", "#ffffff");

                stationButton.onDoubleClick(openPopup, {
                    stationName: name,
                    latitude: latitude,
                    longitude: longitude,
                    popularity: bikesPerDay
                });


                //stationButton.getView().getSvg().select(".ui-circle-button .circle").style("fill", "#000000");
                self.add(stationButton);

                /*
                 self.getLayerGroup().addLayer(L.marker([latitude, longitude], {
                 icon: L.divIcon({
                 className: "icon-location popularity" + id
                 //className: "fa fa-map-marker fa-2x popularity" + id
                 })
                 }).bindPopup(name));*/

                /*
                 d3.select(".popularity" + id)
                 .data([bikesPerDay])
                 .style("color", popularityColor)
                 .style("font-size", "30px");*/
            });

            /*
            d3.xml("img/circle.svg", "image/svg+xml", function(xml) {
                var circleSvg = document.importNode(xml.documentElement, true);

             //stationButton.getView().getSvg().node().appendChild(circleSvg);
                //d3.select("#viz").node().appendChild(importedNode);

            });*/

        });
    };

    var init = function() {

    } ();
}

Utils.extend(StationsPopularityLayerViewController, MapLayerController);