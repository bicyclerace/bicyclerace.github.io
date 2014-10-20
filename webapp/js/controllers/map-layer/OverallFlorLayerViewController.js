/**
 * @class: OverallFlorLayerViewController
 * @description template class
 *
 * @param parentController
 */
function OverallFlorLayerViewController(parentController) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;


    var __debug = true;
    var _selectionModel = self.getModel().getSelectionModel();
    var _maxFlowStroke = 2;
    var _baseOpacity = 0.15;

    var _legendaModel = self.getModel().getLegendaModel();

    //cached
    var _flowData = null;

    //////////////////////////// PUBLIC METHODS ////////////////////////////

    /**
     * unsubscribe from all notifications
     * @override
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        self.getNotificationCenter().unsuscribeFromAll(self);

        // Call super
        super_dispose.call(self);
    };

    /**
     * Handler for the TIME_OF_THE_DAY_CHANGED notification
     */
    this.timeChanged = function() {
        drawOverallFlow();
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var drawOverallFlow = function() {
        var stations = databaseModel.getStations();
        var timeModel = self.getModel().getTimeModel();
        var category;

        if(timeModel.isCurrentCategory(TimeModel.DayCategories.MORNING)) {
            category = TimeModel.DayCategories.MORNING;
        } else if(timeModel.isCurrentCategory(TimeModel.DayCategories.LUNCH_TIME)) {
            category = TimeModel.DayCategories.LUNCH_TIME;
        } else if(timeModel.isCurrentCategory(TimeModel.DayCategories.AFTER_WORK)) {
            category = TimeModel.DayCategories.AFTER_WORK;
        } else if(timeModel.isCurrentCategory(TimeModel.DayCategories.EVENING)) {
            category = TimeModel.DayCategories.EVENING;
        } else if(timeModel.isCurrentCategory(TimeModel.DayCategories.NIGHT)) {
            category = TimeModel.DayCategories.NIGHT;
        }

        var startDate = new Date(2013, 0, 1, category.start.hours, category.start.minutes);
        var endDate = new Date(2013, 0, 1, category.end.hours, category.end.minutes);
        var flowsLimit = 300;
        self.getModel().getDBModel().getStationsFlowFilterByHour(startDate, endDate, flowsLimit, function(json) {

            console.log("got data");

            // Compute min and max for the scale
            var min = d3.min(json, function(connection) {
                return parseFloat(connection["flow"]);
            });

            var max = d3.max(json, function(connection) {
                return parseFloat(connection["flow"]);
            });

            // Setup scale
            var maxStrokeWidth = 2;
            var widthScale = d3.scale.linear();
            widthScale
                .domain([min, max])
                .range([0, maxStrokeWidth]);

            var opacityScale = d3.scale.linear();
            var opacityBounds = {min: 0.2, max: 0.8};
            opacityScale
                .domain([min, max])
                .range([opacityBounds.min, opacityBounds.max]);

            // draw connections
            self.getView().getSvg().selectAll(".connection").remove();
            var connections = self.getView().getSvg().selectAll(".connection").data(json);
            connections.enter()
                .append("line")
                .classed("connection", true)
                .attr("x1", function(connection) {
                    var startPointCoord = databaseModel.getStationCoordinates(connection["from_station_id"]);
                    var startPoint = self.project(startPointCoord[0],startPointCoord[1]);
                    return startPoint.x;
                })
                .attr("y1", function(connection) {
                    var startPointCoord = databaseModel.getStationCoordinates(connection["from_station_id"]);
                    var startPoint = self.project(startPointCoord[0],startPointCoord[1]);
                    return startPoint.y;
                })
                .attr("x2", function(connection) {
                    var endPointCoord = databaseModel.getStationCoordinates(connection["to_station_id"]);
                    var endPoint = self.project(endPointCoord[0],endPointCoord[1]);
                    return endPoint.x;
                })
                .attr("y2", function(connection) {
                    var endPointCoord = databaseModel.getStationCoordinates(connection["to_station_id"]);
                    var endPoint = self.project(endPointCoord[0],endPointCoord[1]);
                    return endPoint.y;
                })
                .attr("opacity", function(connection) {
                    return opacityScale(parseFloat(connection["flow"]));
                })
                .attr("stroke-width", function(connection) {
                    return widthScale(parseFloat(connection["flow"]));
                })
                .attr("stroke", ColorsModel.colors.totalFlow);
        });
    };



    var init = function() {
        //deselect all stations
        _selectionModel.deselectAllStations();

        self.getNotificationCenter().subscribe(self, self.timeChanged, Notifications.time.TIME_OF_THE_DAY_CHANGED);

        self.timeChanged();
    } ();
}

// Inheritance
Utils.extend(OverallFlorLayerViewController, MapLayerController);