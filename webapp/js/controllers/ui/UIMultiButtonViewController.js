/**
 * @class UIMultiButtonViewController.js
 * @description
 *
 * @param parentController
 * @constructor
 */
function UIMultiButtonViewController(parentController, buttonsTitles){
    ViewController.call(this, parentController);
    //////////////////// PRIVATE ATTRIBUTES ///////////////////////
    var self = this;
    var _buttonsTitles = buttonsTitles;


    var _defaultViewBox = {x: 0, y: 0, width: 50, height: 50};
    var _callback;
    var _buttonWidth = 50;
    var _buttonHeight = 20;
    var _buttons = [];

    //////////////////// PUBLIC METHODS ///////////////////////
    this.onButtonSelected = function(callback) {
        _callback = callback;
    };


    this.updateView = function (){

        if( self.getView().getViewBoxHeight() && self.getView().getViewBoxWidth() ){
            _buttonWidth = self.getView().getViewBoxWidth() / buttonsTitles.length;
            _buttonHeight = self.getView().getViewBoxHeight();
            for(var i in _buttons) {
                var button = _buttons[i];
                button.getView().setFrame(_buttonWidth * i, 0, _buttonWidth, _buttonHeight);
                button.getView().setViewBox(0, 0, _buttonWidth, _buttonHeight);
            }
        }


    };

    this.selectButton = function(title) {

        _buttons.forEach(function(b){
            if(b.getTitle() != title){
                b.deselect();
            } else {
                b.select();
            }
        });
    };

    var onClick = function (button) {
        _callback(button.getTitle());

    };

    var init = function(){
        self.getView().getSvg().classed("ui-multibutton", true);



        for(var i in _buttonsTitles) {
            var title = _buttonsTitles[i];

            var button = new UIButtonViewController(self);
            button.setTitle(title);
            button.onClick(onClick, button);
            self.add(button);
            _buttons.push(button);

        }
    }();
}

Utils.extend(UIMultiButtonViewController, ViewController);
