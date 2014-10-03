Object.prototype.extend = function (base) {
    // Avoid instantiating the base class just to setup inheritance
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    // for a polyfill
    // Also, do a recursive merge of two prototypes, so we don't overwrite
    // the existing prototype, but still maintain the inheritance chain
    // Thanks to @ccnokes
    var origProto = this.prototype;
    this.prototype = Object.create(base.prototype);
    for (var key in origProto)  {
        this.prototype[key] = origProto[key];
    }
    // Remember the constructor property was set wrong, let's fix it
    this.prototype.constructor = this;
    // In ECMAScript5+ (all modern browsers), you can make the constructor property
    // non-enumerable if you define it like this instead
    Object.defineProperty(this.prototype, 'constructor', {
        enumerable: false,
        value: this
    });
};

