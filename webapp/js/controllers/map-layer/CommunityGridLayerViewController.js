/**
 * Created by krbalmryde on 10/11/14.
 */
/**
 * @class CommunityGridLayerViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function CommunityGridLayerViewController(parentController) {
    MapLayerController.call(this, parentController);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    /**
     * Handler for notification
     */
    this.communityGridVisibilityChanged = function() {
        if(self.getModel().getMapModel().getGridStatus()) {
            self.getView().show();
        } else {
            self.getView().hide();
        }
    };

    /////////////////////////// PRIVATE METHODS ////////////////////////////

    var draw = function() {
        console.log("Drawing community");
        var json = databaseModel.getChicagoJson();
        var features = topojson.feature(json, json["objects"]["chicago_health2"]).features;


        var projection = self.d3projection;

        // Create a path generator.
        var path = d3.geo.path()
            .projection(projection);

        // Paths
        self.getView().getSvg().append("g").selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("d", path)
            .classed("ciao", true)
            .style("fill", "rgba(0,0,0,0)")
            .style("stroke", "#ef3b2c")
            .style("stroke-width", "0.5")
            .style("stroke-dasharray", "2,2");

        // Community names
        self.getView().getSvg().append("g").selectAll("text")
            .data(features)
            .enter()
            .append("text")
            .attr("x", function(d) {
                var coord = d3.geo.centroid(d);
                var point = self.project(coord[1], coord[0]);
                return point.x;
            })
            .attr("y", function(d) {
                var coord = d3.geo.centroid(d);
                var point = self.project(coord[1], coord[0]);
                return point.y;
            })
            .style("text-anchor", "middle")
            .style("font-size", "3px")
            .text(function(d) {
                return d["properties"]["community"]["name"];
            });


    };

    var init = function() {
        self.getView().addClass("community-grid-layer-view-controller");
        draw();
        self.getNotificationCenter()
            .subscribe(self, self.communityGridVisibilityChanged, Notifications.mapController.COMMUNITY_GRID_STATUS_CHANGED);
        self.communityGridVisibilityChanged();
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