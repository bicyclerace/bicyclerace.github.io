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

    this.dispose = function () {
        self.getNotificationCenter().unsuscribeFromAll(self);
    };


    this.setLatLng = function(lat,lng) {
        _lat = lat;
        _lng = lng;
        var position = parentController.project(_lat,_lng);
        self.getView().setFramePosition(position.x - _frame.width/2, position.y - _frame.height);
    };


    this.closePopup = function() {
        parentController.remove(self);
        self.dispose();
    };


    this.getContentViewController = function() {
      return _contentView;
    };


    var super_updateView = self.updateView;
    this.updateView = function() {
        _contentView.getView().setFrame(0,0,self.getView().getFrameWidth(), self.getView().getFrameHeight() - _bottomHeight);
        _contentView.getView().setViewBox(0,0,self.getView().getFrameWidth(), self.getView().getFrameHeight() - _bottomHeight);

        _closeButton.getView().setFrame(self.getView().getFrameWidth() - 2 , 0.5, 1.5 , 1.5);
        super_updateView();
    };

    this.setContentViewFrame = function(width,height) {
        self.getView().setViewBox(0,0,width, height - _bottomHeight);
        self.getView().setFrame(0,0,width, height - _bottomHeight);


        self.updateView();
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

        self.getNotificationCenter().subscribe(self, self.onZoomChanged, Notifications.mapController.ZOOM_CHANGED);


        _contentView = new ViewController(self);
        _contentView.getView().getSvg().classed("map-layer-popup-view-controller-content-view", true);

        self.add(_contentView);

        _closeButton = new UIButtonViewController(self);

        _closeButton.setImage("img/popup-controller-close-button.png");
        _closeButton.onClick(self.closePopup);
        self.add(_closeButton);

        self.setContentViewFrame(_frame.width,_frame.height + _bottomHeight);

        draw();
    } ();
}

Utils.extend(MapLayerPopupViewController, ViewController);