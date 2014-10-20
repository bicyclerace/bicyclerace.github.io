/**
 * @class: FlowBalanceLayerViewController
 * @description template class
 *
 * @param parentController
 */
function FlowBalanceLayerViewController(parentController) {
    // Call the base class constructor
    MapLayerController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;
    var _maxCircleRadius = 10;
    var _barWidth = 0.7;


    var __debug = true;



    //////////////////////////// PUBLIC METHODS ////////////////////////////

    /**
     * Handler for the TIME_OF_THE_DAY_CHANGED notification
     */
    this.timeChanged = function() {
        draw();
    };


    ////////////// PRIVATE METHODS

    var openPopup = function(station) {
        var popup = new MapLayerPopupViewController(self);

        var contentBox = {
            width: 20,
            height: 15,
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
        var titleBox = {
            x: contentBox.padding.left,
            y: contentBox.padding.top,
            width: contentBox.width - contentBox.padding.left - contentBox.padding.right,
            height: (contentBox.height - contentBox.padding.top - contentBox.padding.bottom) / 3
        };

        var label = new UILabelViewController(self);
        label.getView().setFrame(titleBox.x, titleBox.y, titleBox.width, titleBox.height);
        label.getView().setViewBox(0, 0, titleBox.width, titleBox.height);
        label.setText(station.name);

        _containerVC.add(label);
        
        var infoBox = {
            x: contentBox.padding.left,
            y: contentBox.padding.top,
            width: contentBox.width - contentBox.padding.left - contentBox.padding.right,
            height: ((contentBox.height - contentBox.padding.top - contentBox.padding.bottom) / 3) *2
        };

        // inflow label
        var flowWidth = infoBox.width / 3;
        var labelHeight = infoBox.height / 3;
        label = new UILabelViewController(self);
        label.getView().setFrame(infoBox.x, contentBox.padding.top + titleBox.height, flowWidth, labelHeight);
        label.getView().setViewBox(0, 0, flowWidth, labelHeight);
        label.setText("Inflow:");

        _containerVC.add(label);

        // inflow value label
        label = new UILabelViewController(self);
        label.getView().setFrame(infoBox.x + flowWidth, contentBox.padding.top + titleBox.height, flowWidth *2, labelHeight);
        label.getView().setViewBox(0, 0, flowWidth *2, labelHeight);
        label.setText(parseInt(station.inflow) + " bikes/hour");

        _containerVC.add(label);

        // Outflow label
        label = new UILabelViewController(self);
        label.getView().setFrame(titleBox.x, contentBox.padding.top + titleBox.height + labelHeight, flowWidth, labelHeight);
        label.getView().setViewBox(0, 0, flowWidth, labelHeight);
        label.setText("Outflow:");

        _containerVC.add(label);

        // Outflow value label
        label = new UILabelViewController(self);
        label.getView()
            .setFrame(titleBox.x + flowWidth, contentBox.padding.top + titleBox.height + labelHeight, flowWidth *2, labelHeight);
        label.getView().setViewBox(0, 0, flowWidth *2, labelHeight);
        label.setText(parseInt(station.outflow) + " bikes/hour");

        _containerVC.add(label);

        // Difference label
        label = new UILabelViewController(self);
        label.getView().setFrame(titleBox.x, contentBox.padding.top + titleBox.height + labelHeight *2, flowWidth, labelHeight);
        label.getView().setViewBox(0, 0, flowWidth, labelHeight);
        label.setText("Gap:");

        _containerVC.add(label);

        // Difference value label
        label = new UILabelViewController(self);
        label.getView()
            .setFrame(titleBox.x + flowWidth, contentBox.padding.top + titleBox.height + labelHeight *2, flowWidth *2, labelHeight);
        label.getView().setViewBox(0, 0, flowWidth *2, labelHeight);
        label.setText(parseInt(Math.abs(station.imbalance)) + " bikes/hour");

        _containerVC.add(label);



        popup.getContentViewController().add(_containerVC);
        popup.setLatLng(station.latitude, station.longitude);
        self.add(popup);
    };


    var draw = function() {

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

        self.removeAllChildren();

        databaseModel.getStationsInflowAndOutflowFilterByHour(startDate, endDate, function(json) {
            console.log("GOT DATA");

            var hours = endDate.getHours() - startDate.getHours();
            var difference = json.map(function(station) {
                return {
                    name: stations[station["station_id"]]["station_name"],
                    latitude: parseFloat(stations[station["station_id"]]["station_latitude"]),
                    longitude: parseFloat(stations[station["station_id"]]["station_longitude"]),
                    inflow: parseFloat(station["inflow"]) / hours,
                    outflow: parseFloat(station["outflow"]) / hours,
                    imbalance: (parseFloat(station["inflow"]) / hours) - (parseFloat(station["outflow"] / hours))
                };
            });

            difference.sort(function(a, b) {
                return Math.abs(a.imbalance) - Math.abs(b.imbalance);
            });

            var min = d3.min(difference, function(station) {
                return station.imbalance;
            });

            var max = d3.max(difference, function(station) {
                return station.imbalance;
            });

            var imbalanceColor = d3.scale.linear();
            imbalanceColor
                .domain([min, 0, max])
                .range([ColorsModel.colors.outflow,"#ffffff", ColorsModel.colors.inflow]);

            var stationButton;
            var stationBox = {
                x: 0,
                y:0,
                width: 2,
                height: 2,
                margin:0.1
            };

            difference.forEach(function(station) {
                var stationPoint = self.project(station.latitude, station.longitude);
                stationBox.x = stationPoint.x;
                stationBox.y = stationPoint.y;

                stationButton = new UIButtonViewController(self);
                stationButton.getView().setFrame(stationBox.x - (stationBox.width /2), stationBox.y - (stationBox.height /2), stationBox.width, stationBox.height);
                stationButton.getView().setViewBox(0, 0, stationBox.width, stationBox.height);
                stationButton.getView().addClass("station");

                var circle = stationButton.getView().getSvg().append("circle");
                circle
                    .attr("cx", stationBox.width /2)
                    .attr("cy", stationBox.height /2)
                    .attr("r", (stationBox.height - stationBox.margin * 2) /2)
                    .style("pointer-events", "none")
                    .style("fill", imbalanceColor(station.imbalance))
                    .style("stroke-width", stationBox.margin)
                    .style("stroke", "#ffffff");

                stationButton.onDoubleClick(openPopup, station);

                self.add(stationButton);
            });
        });
    };



    var init = function() {
        //Legenda
        self.getModel().getLegendaModel().setStaticEntries(
            [
                {name:"inflow" , color:ColorsModel.colors.inflow},
                {name:"outflow" , color:ColorsModel.colors.outflow}
            ]
        );

        //draw();
        self.getNotificationCenter().subscribe(self, self.timeChanged, Notifications.time.TIME_OF_THE_DAY_CHANGED);
    } ();
}

// Inheritance
Utils.extend(FlowBalanceLayerViewController, MapLayerController);