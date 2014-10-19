/**
 * @class: ChartsContainerController
 * @description template class
 *
 * @param parentController
 * @param svgContainer
 */
function ChartsContainerController(parentController, svgContainer) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _svgContainer = svgContainer;

    var _viewBoxWidth = svgContainer.attr("width");
    var _viewBoxHeight = svgContainer.attr("height");
    var _padding = {left: 20, top: 30, right: 0, bottom:0};
    var _margins = {betweenPopups : 10};

    var _singlePopupWidth = svgContainer.attr("width") / 2 - _padding.left * 2;
    var _doublePopupWidth = _singlePopupWidth * 2  + _margins.betweenPopups;
    var _popupHeight = 425;

    var _positionsAvailable = {"top-left" : true, "top-right": true,
                               "bottom-left" : true, "bottom-right" : true };
    var _openedPopups = [];


    // FACTORY
    var _chartsFactory;


    // PUBLIC METHODS
    /**
     * Handler for "VISUALIZATION_TYPE_CHANGED" notification.
     * Namely when the visualization type context changed, update map layers.
     */
    this.visualizationTypeChanged = function() {
        var visualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var chartsControllers = _chartsFactory.getChartsControllersClasses(visualizationType);

        // Remove all previous layers from the map
        //self.closeAllPopups();
        cleanCharts();

        // For each new layer controller class, instantiate the controller with a new layer group, and add that group
        // to the map
        chartsControllers.forEach(function(Controller) {

            // Change this addPopup
            var chartController = new Controller(self);
            var popup = new PopupController(self, chartController.getSize());
            self.add(popup);
            chartController.getView().setFrame(0, 0, popup.getView().getViewBoxWidth(), popup.getView().getViewBoxHeight());
            chartController.getView().setViewBox(0, 0, popup.getView().getViewBoxWidth(), popup.getView().getViewBoxHeight());
            popup.add(chartController);

        });
    };

    /**
     * @override
     * @param childController
     */
    var oldAdd = this.add;
    this.add = function(popupController) {
        // Add layer group
        //_mapContainer.addLayer(childController.getLayerGroup());

        // Call super MODIFIED
        self.getChildren().push(popupController);

        popupController.setParentController(self);
        //_svgLayerGroup.append(function(){return childController.getView().getSvg().node();});
        self.addPopup(popupController);
        popupController.updateView();

        //oldAdd.call(self, childController);
    };


    /**
     * @override
     * @param popupController
     */
    var oldRemove = this.remove;    // Save super
    this.remove = function(popupController) {
        //_mapContainer.removeLayer(popupController.getLayerGroup());

        popupController.dispose();
        // Call super
        oldRemove.call(self, popupController);

        self.closePopup(popupController);
        //popupController.getView().getSvg().remove();
    };

    /**
     * @param   size  string which specify the size of the popup "single" or "double"
     * @returns {PopupController} PopupChartController instance
     */
    this.addPopup = function(popup) {

        var x, y;
        var popupPosition;
        
        var size = popup.size();

        //find an available position
        if(size == "single") {

            if(_positionsAvailable["top-right"]) {
                x = _viewBoxWidth - _singlePopupWidth - _padding.left;
                y = 0 + _padding.top;
                popupPosition = "top-right";
            } else if(_positionsAvailable["top-left"]) {
                x = _viewBoxWidth - _singlePopupWidth * 2 - _padding.left - _margins.betweenPopups;
                y = 0 + _padding.top;
                popupPosition = "top-left";
            } else if(_positionsAvailable["bottom-right"]) {
                x = _viewBoxWidth - _singlePopupWidth - _padding.left;
                y = 0 + _popupHeight + _margins.betweenPopups + _padding.top;
                popupPosition = "bottom-right";
            } else if(_positionsAvailable["bottom-left"]) {
                x = _viewBoxWidth - _singlePopupWidth * 2 - _padding.left - _margins.betweenPopups;
                y = 0 + _popupHeight + _margins.betweenPopups + _padding.top;
                popupPosition = "bottom-left";
            } else {
                console.log("ERROR: no position available for the popup");
                return null;
            }

            _positionsAvailable[popupPosition] = false
        } else if (size == "double") {

            if(_positionsAvailable["top-left"] && _positionsAvailable["top-right"]){
                x = _viewBoxWidth - _doublePopupWidth - _padding.left;
                y = 0 + _padding.top;
                popupPosition = "top";
                _positionsAvailable["top-left"] = _positionsAvailable["top-right"] = false;
            } else if (_positionsAvailable["bottom-left"] && _positionsAvailable["bottom-right"]) {
                x = _viewBoxWidth - _doublePopupWidth - _padding.left;
                y = 0 + _popupHeight + _margins.betweenPopups + _padding.top;
                popupPosition = "bottom";
                _positionsAvailable["bottom-left"] = _positionsAvailable["bottom-right"] = false;
            } else {
                console.log("ERROR: no position available for the popup")
                return null;
            }

        } else {
            console.log(size + " is not a popup size");
        }

        var popupSvg = popup.getView().getSvg();

        popupSvg
            .classed("popup-controller", true)
            .attr("x", x)
            .attr("y", y)
            .attr("height", _popupHeight);

        if(size == "single"){
            popupSvg.attr("width", _singlePopupWidth);
        } else if (size == "double"){
            popupSvg.attr("width", _doublePopupWidth);
        }

        // var popup = new PopupController(this, popupSvg, size);

        popup.positionInsideContainer = popupPosition;
        popup.draw();
        _svgContainer.append(function(){return popup.getView().getSvg().node()});
        _openedPopups.push(popup);
        return popup;
    };


    /**
     * Close a popup given the popup instance
     * @param popup
     */
    this.closePopup = function(popup) {

        if(popup.getPopupSize() == "single"){

            _positionsAvailable[popup.positionInsideContainer] = true;

        } else if(popup.getPopupSize() == "double"){

            if(popup.positionInsideContainer == "top"){
                _positionsAvailable["top-left"] = _positionsAvailable["top-right"] = true;
            } else if (popup.positionInsideContainer == "bottom"){
                _positionsAvailable["bottom-left"] = _positionsAvailable["bottom-right"] = true;
            }

        }

        _openedPopups = _.without(_openedPopups, popup);
        popup.getContainerSvg().remove();

    };

    this.closeAllPopups = function() {
       for(var i in _positionsAvailable){
           _positionsAvailable[i] = true;
       }
       for(i in _openedPopups) {
           _openedPopups[i].getContainerSvg().remove();
       }
        _openedPopups = []
    };

    // PRIVATE METHODS
    var cleanCharts = function() {
        // Remove all children
        while(self.getChildren().length > 0) {
            self.remove(self.getChildren()[0]);
        }
    };

    var init = function() {
        _svgContainer
            .attr("viewBox","0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio","xMaxYMin meet");

        _chartsFactory = new ChartsFactory();

        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
        self.visualizationTypeChanged();
    } ();
}

// Inheritance
Utils.extend(ChartsContainerController, ViewController);