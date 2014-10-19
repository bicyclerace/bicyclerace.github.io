/**
 * @class: MalLalyerPopupViewController
 * @description MalLalyerPopupViewController class implements an MVC controller. It contains also the UIView that it manages.
 *
 * @param parentController
 */
function MapLayerPopupViewController(parentController) {

    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _frame = {width: 30, height: 20};
    var _bottomHeight = 2;
    var _lat,_lng;
    var _contentView;
    var _closeButton;
    /////////////////////////////// PUBLIC METHODS ///////////////////////////////

    this.onZoomChanged = function() {

    };


    this.setLatLng = function(lat,lng) {
        _lat = lat;
        _lng = lng;
        var position = parentController.project(_lat,_lng);
        self.getView().setFramePosition(position.x - _frame.width/2, position.y - _frame.height);
    };


    this.closePopup = function() {
        parentController.remove(self);
    };

    /**
     * @Override
     * @param child
     */
    this.add = function(childController) {
        self.getChildren().push(childController);
        childController.setParentController(self);
        _contentView.add(childController.getView());
        childController.updateView();
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////

    var draw = function() {
        //Bottom triangle

        var v1 = [_frame.width/2, _frame.height],
            v2 = [_frame.width/2 - 0.8, _frame.height - _bottomHeight - 0.1],
            v3 = [_frame.width/2 + 0.8, _frame.height - _bottomHeight - 0.1];

        self.getView().getSvg()
            .append("polygon")
            .classed("background-triangle", true)
            .attr("points", v1 + " " + v2 + " " + v3)
        ;

    };


    var init = function() {
        self.getView().getSvg().classed("map-layer-popup-view-controller", true);

        _contentView = new ViewController(self);
        _contentView.getView().getSvg().classed("map-layer-popup-view-controller-content-view", true);
        _contentView.getView().setFrame(0,0,_frame.width, _frame.height - _bottomHeight);
        _contentView.getView().setViewBox(0,0,_frame.width, _frame.height - _bottomHeight);
        self.add(_contentView);


        self.getNotificationCenter().subscribe(self, self.onZoomChanged, Notifications.mapController.ZOOM_CHANGED);
        self.getView().setViewBox(0,0,_frame.width, _frame.height);
        self.getView().setFrame(0,0,_frame.width, _frame.height);


        _closeButton = new UIButtonViewController(self);
        _closeButton.getView().setFrame(_frame.width - 2 , 0.5, 1.5 , 1.5);
        _closeButton.setImage("img/popup-controller-close-button.png");
        _closeButton.onClick(self.closePopup);
        self.add(_closeButton);

        draw();
    } ();
}

Utils.extend(MapLayerPopupViewController, ViewController);