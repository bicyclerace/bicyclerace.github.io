/**
 * @class UIStationsSelectionViewController
 * @description
 *
 * @param parentController
 * @constructor
 */
function UIStationsSelectionViewController(parentController) {
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;

    // Buttons
    var _selectAllButton;
    var _deselectAllButton;
    var _applyActionToCommunityButton;


    // Layout
    var _defaultViewBox = {x: 0, y: 0, width: 400, height: 100};
    var _padding = {top: 10, bottom: 10, left: 10, right: 10};



    //////////////////// PUBLIC METHODS ///////////////////////
    /**
     * @override
     */
    var superUpdateView = this.updateView;
    this.updateView = function() {


        // Call super method
        superUpdateView.call(self);
    };


    //////////////////// PRIVATE METHODS ///////////////////////
    var addBehaviours = function() {
        _selectAllButton.onClick(function() {
            self.getModel().getSelectionModel().selectAllStations();
        });

        _deselectAllButton.onClick(function() {
            self.getModel().getSelectionModel().deselectAllStations();
        });

        _applyActionToCommunityButton.onClick(function() {
            self.getModel().getSelectionModel().extendStationSelectionToCommunity();
        });
    };

    var init = function() {
        // Add button css class
        self.getView().addClass("ui-stations-selection-view-controller");
        self.getView().setViewBox(0, 0, _defaultViewBox.width, _defaultViewBox.height);

        var box = {width: _defaultViewBox.width / 4, height: _defaultViewBox.height};

        // Select all button
        _selectAllButton = new UIButtonViewController(self);
        _selectAllButton.getView()
            .setFrame(0, 0, box.width, box.height);
        _selectAllButton.getView()
            .setViewBox(0, 0, box.width, box.height);
        _selectAllButton.setTitle("ALL");
        self.add(_selectAllButton);

        // Deselect all button
        _deselectAllButton = new UIButtonViewController(self);
        _deselectAllButton.getView()
            .setFrame(box.width, 0, box.width, box.height);
        _deselectAllButton.getView()
            .setViewBox(0, 0, box.width, box.height);
        _deselectAllButton.setTitle("NONE");
        self.add(_deselectAllButton);
        
        // Apply
        _applyActionToCommunityButton = new  UIButtonViewController(self);
        _applyActionToCommunityButton.getView()
            .setFrame(box.width *2, 0, box.width *2, box.height);
        _applyActionToCommunityButton.getView()
            .setViewBox(0, 0, box.width * 2, box.height);
        _applyActionToCommunityButton.setTitle("COMMUNITY");
        self.add(_applyActionToCommunityButton);

        addBehaviours();
    } ();
}

Utils.extend(UIStationsSelectionViewController, ViewController);
