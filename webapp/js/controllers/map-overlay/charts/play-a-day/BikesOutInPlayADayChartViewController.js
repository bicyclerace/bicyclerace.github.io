/**
 * @class BikesOutInPlayADayChartViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function BikesOutInPlayADayChartViewController(parentController) {
    // Call super constructor
    ChartViewController.call(this, parentController);
    /////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////
    var self = this;

    //Chart
    var _columnChart;

    // Buttons
    var _genderButton,
        _userTypeButton,
        _ageButton;

    // Padding
    var _padding = {left: 10, top: 20, right: 10, bottom: 10};
    var _defaultViewBox = {x: 0, y: 0, width: 500, height: 425};

    /////////////////////////// PUBLIC METHODS ///////////////////////////
    /**
     * @override
     */
    var super_updateView = this.updateView;
    this.updateView = function() {
        //var parentWidth = self.getParentController().getView().getViewBoxWidth();
        //var parentHeight = self.getParentController().getView().getViewBoxHeight();

        var contentBox = {
            x: _padding.left,
            y: _padding.top,
            width: self.getView().getViewBoxWidth() - _padding.left - _padding.right,
            height: self.getView().getViewBoxHeight() - _padding.top - _padding.bottom
        };

        var heightParts = 6;
        var heightUnit = contentBox.height / heightParts;

        var widthParts = 10;
        var widthUnit = contentBox.width / widthParts;

        var chartHeight = 4;
        var chartMarginBottom = 0.3 * heightUnit;
        
        // Update buttons
        _genderButton.getView().setFrame(contentBox.x, contentBox.y + heightUnit * (chartHeight) + chartMarginBottom,
            contentBox.width, heightUnit*0.48);
        _genderButton.getView().setViewBox(0,0,
            contentBox.width, heightUnit*0.48);

        _userTypeButton.getView().setFrame(contentBox.x, contentBox.y + heightUnit * (chartHeight + 0.5) + chartMarginBottom,
            contentBox.width, heightUnit*0.48);
        _userTypeButton.getView().setViewBox(0,0,
            contentBox.width, heightUnit*0.48);

        _ageButton.getView().setFrame(contentBox.x, contentBox.y + heightUnit * (chartHeight + 1) + chartMarginBottom,
            contentBox.width, heightUnit*0.48);
        _ageButton.getView().setViewBox(0,0,
            contentBox.width, heightUnit*0.48);



        // Update charts
        var chartPad = {left: 0, right: 0, top: 30, bottom: 0};
        
        _columnChart.getView().setFrame(contentBox.x,
                contentBox.y + chartPad.top,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * chartHeight - chartPad.top - chartPad.bottom);

        _columnChart.getView().setViewBox(0,
                0,
                contentBox.width - chartPad.left - chartPad.right,
                heightUnit * chartHeight - chartPad.top - chartPad.bottom);

        self.updateData();

        // Call super
        super_updateView.call(self);
    };


    this.onFilterChanged = function() {
        var filterModel = self.getModel().getFilterModel();
        
        //select the right button
        _ageButton.selectButton(filterModel.getAgeFilter());
        _genderButton.selectButton(filterModel.getGenderFilter());
        _userTypeButton.selectButton(filterModel.getUserTypeFilter());

        //
        self.updateData();
    };

    this.updateData = function() {
        var playModel = self.getModel().getPlayADayModel();

        var activeTrips = playModel.getActiveTrips();
        var filteredTrips = playModel.getActiveFilteredTrips();

        _columnChart.setData(["Total active", "Filtered"],[activeTrips.length, filteredTrips.length],"", "BIKES",
            [ColorsModel.colors.otherBikes,
             ColorsModel.colors.filteredBikes
            ]);
    };


    /////////////////////////// PRIVATE METHODS ///////////////////////////



    var addBehaviors = function() {
        var filterModel = self.getModel().getFilterModel();

        _genderButton.onButtonSelected(function(selected){
            filterModel.setGenderFilter(selected);
        });
        _ageButton.onButtonSelected(function(selected){
            filterModel.setAgeFilter(selected);
        });
        _userTypeButton.onButtonSelected(function(selected){
            filterModel.setUserTypeFilter(selected);
        });

    };

    var onButtonFilterClicked = function() {

    };



    var init = function() {

        self.getView().addClass("bikes-out-in-play-a-day-chart-view-controller");
        self.getView().setFrame(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);
        self.getView().setViewBox(_defaultViewBox.x, _defaultViewBox.y, _defaultViewBox.width, _defaultViewBox.height);

        // Add column chart
        _columnChart = new  UIPlayADayChartViewController(self);
        self.add(_columnChart);



        // Add buttons
        _genderButton = new UIMultiButtonViewController(self, FilterModel.toArray(FilterModel.GENDER_FILTER));
        self.add(_genderButton);

        _ageButton = new UIMultiButtonViewController(self, FilterModel.toArray(FilterModel.AGE_FILTER));
        self.add(_ageButton);

        _userTypeButton = new UIMultiButtonViewController(self, FilterModel.toArray(FilterModel.USER_TYPE_FILTER));
        self.add(_userTypeButton);

        self.setSize(PopupController.SIZE.FULL);

        addBehaviors();

        self.getNotificationCenter().subscribe(self, self.onFilterChanged, Notifications.filter.ON_FILTER_CHANGED);
        self.getNotificationCenter().subscribe(self, self.updateData, Notifications.playADay.TRIPS_DATA_CHANGED);
        self.onFilterChanged();
    } ();
}


Utils.extend(BikesOutInPlayADayChartViewController, ChartViewController);

// USEFUL
//var parseDate = d3.time.format("%d-%b-%y").parse;