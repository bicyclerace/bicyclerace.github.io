/**
 * @class: NotificationCenter
 * @description Implements a publish subscribe pattern.
 * @author: Massimo De Marchi, Francesco
 */
function NotificationCenter () {
    // PRIVATE ATTRIBUTES
    var self = this;

    var _observers;

    // PUBLIC METHODS
    this.dispatch = function(notification) {
        if (_observers[notification] != undefined) {
            _observers[notification].forEach(function(observer) {
                observer.handler.apply();
            });
        }
    };

    this.subscribe = function(observer, callBack, notification) {

        if(!callBack) {
            console.log("try to subscribe without valid callback");
        }

        if (_observers[notification] == undefined) {
            _observers[notification] = [];
        }

        _observers[notification].push({
            target: observer,
            handler: callBack
        });
    };

    this.unsuscribeFromAll = function(observer) {
        for(var key in _observers) {
            _observers[key] = _observers[key].filter(function(obs) {
                return obs.target !== observer;
            });
        }
    };


    // PRIVATE METHODS
    var init = function() {
        _observers = {};
    } ();
}

var sharedNotificationCenter = sharedNotificationCenter || new NotificationCenter();
