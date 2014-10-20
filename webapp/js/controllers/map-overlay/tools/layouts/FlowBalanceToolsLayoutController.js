/**
 * @class FlowBalanceToolsLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function FlowBalanceToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;

    // Tools
    var _legendViewController;

    var _dayCategoriesMultiButton;


    // Categories titles
    var _categoryForTitle = {
        "Morning": TimeModel.DayCategories.MORNING,
        "Lunch" : TimeModel.DayCategories.LUNCH_TIME,
        "After work": TimeModel.DayCategories.AFTER_WORK,
        "Evening" : TimeModel.DayCategories.EVENING,
        "Night" : TimeModel.DayCategories.NIGHT
    };


    ////////////////////////////// PUBLIC METHODS //////////////////////////////
    /**
     * @override
     */
    var _superUpdateView = this.updateView;
    this.updateView = function() {
        // Put your code here..
        var contentBox = self.getView().getViewBox();

        //Legend tool
        var legendSize = {width: 200, height: 200, marginRight: 10};
        _legendViewController.getView().setFrame( self.getView().getViewBoxWidth() - legendSize.width - legendSize.marginRight,
                                         self.getView().getViewBoxHeight() - legendSize.height,
                                         legendSize.width,
                                         legendSize.height);

        // Multibutton
        var multiButtonSize = {
            width: 700,
            height: 100
        };
        _dayCategoriesMultiButton.getView()
            .setFrame(contentBox.x, contentBox.height - multiButtonSize.height, multiButtonSize.width, multiButtonSize.height);
        _dayCategoriesMultiButton.getView()
            .setViewBox(0, 0, multiButtonSize.width, multiButtonSize.height);

        // Call super
        _superUpdateView.call(self);

    };

    /**
     * Handler fot the TIME_OF_THE_DAY_CHANGED notification
     */
    this.timeChanged = function() {

    };

    /**
     * Handler for the multibutton call back
     */
    this.changeTime = function(title) {
        self.getModel().getTimeModel().setCategoryStartTime(_categoryForTitle[title]);
        _dayCategoriesMultiButton.selectButton(title);
    };

    //////////////////////////// PRIVATE METHODS ////////////////////////////

    // Given a category returns it title
    var titleForCategory = function(dayCategory) {
        var catTitle;
        d3.keys(_categoryForTitle).forEach(function(title) {
            if(dayCategory == _categoryForTitle[title]) {
                catTitle = title;
            }
        });

        return catTitle;
    };


    // Init
    var init = function() {
        self.getView().addClass("flow-balance-tool-layout-controller");

        // Setup legend
        _legendViewController = new UILegendaViewController(self);
        self.add(_legendViewController);

        // Setup day categories multi button
        _dayCategoriesMultiButton = new UIMultiButtonViewController(self, d3.keys(_categoryForTitle));
        _dayCategoriesMultiButton.getView().addClass("day-categories");
        _dayCategoriesMultiButton.onButtonSelected(self.changeTime);
        self.add(_dayCategoriesMultiButton);

        self.changeTime(titleForCategory(TimeModel.DayCategories.MORNING));

        self.getNotificationCenter().subscribe(self, self.timeChanged, Notifications.time.TIME_OF_THE_DAY_CHANGED);
    } ();
}

Utils.extend(FlowBalanceToolsLayoutController, ViewController);