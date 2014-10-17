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

    var _singlePopupWidth = 500;
    var _doublePopupWidth = _singlePopupWidth * 2  + _margins.betweenPopups;
    var _popupHeight = 425;

    var _positionsAvailable = {"top-left" : true, "top-right": true,
                               "bottom-left" : true, "bottom-right" : true };
    var _openedPopups = [];


    // PUBLIC METHODS
    /**
     * Handler for "VISUALIZATION_TYPE_CHANGED" notification.
     * Namely when the visualization type context changed, update map layers.
     */
    this.visualizationTypeChanged = function() {
        var visualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var chartsControllersFactory = _layersControllersFactory.getLayersControllers(visualizationType);

        // Remove all previous layers from the map
        self.closeAllPopups();

        // For each new layer controller class, instantiate the controller with a new layer group, and add that group
        // to the map
        layersViewControllers.forEach(function(Controller) {
            //var layerGroup = L.layerGroup();
            //_mapContainer.addLayer(layerGroup);
            //_layersControllers.push(new Controller(self, layerGroup));
            self.add(new Controller(self));
        });
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

        var popupSvg = _svgContainer.append("svg")
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
        
        popup.svgContainer(popupSvg);
        popup.positionInsideContainer = popupPosition;
        popup.draw();
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
       for(i in _positionsAvailable){
           _positionsAvailable[i] = true;
       }
       for(i in _openedPopups) {
           _openedPopups[i].getContainerSvg().remove();
       }
        _openedPopups = []
    };

    // PRIVATE METHODS
    var draw = function() {
        
        /*var popupOne = new PopupController(self).size("double");
            // popupTwo = new PopupController(self).size("single"),
            // popupThree = new PopupController(self).size("double");
            
        var chartOne = new ChartController();
        
        popupOne.chartController(chartOne);
        // popupTwo.chartController(chartOne);
        // popupThree.chartController(chartOne);
        
        self.addPopup(popupOne);*/
        // self.addPopup(popupTwo);
        // self.addPopup(popupThree);

    };

    var init = function() {
        _svgContainer
            .attr("viewBox","0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio","xMaxYMin meet");


        //TODO REMOVE

        self.addPopup(new PopupController(self,"single"));
        self.addPopup(new PopupController(self,"single"));


        draw();
    } ();
}

// Inheritance
Utils.extend(ChartsContainerController, ViewController);