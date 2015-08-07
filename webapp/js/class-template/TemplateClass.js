/**
 * @class: TemplateClass
 * @description template class
 *
 * @param arg1 description of the arguments
 * @param arg2 ..
 * @param arg3 ..
 * @constructor description of constructor
 */
function TemplateClass(arg1, arg2, arg3) {
    // Call the base class constructor
    BaseClass.call();

    // PRIVATE ATTRIBUTES
    var self = this;

    // use undescore to mark class private variables
    var _privateVariable = arg1;

    // PUBLIC METHODS
    /**
     * Method description
     * @param newValue = param description (specify ranges, unit measures, etc)
     * @returns {TemplateClass}
     */
    this.setPrivateVariable = function(newValue) {
        _privateVariable = newValue;

        // Return current context so that we can chain functions
        return self;
    };

    /**
     *
     * @returns {_privateVariable} a variable that represents ... etc
     */
    this.getPrivateVariable = function() {
        return _privateVariable;
    };

    // PRIVATE METHODS
    var thisIsAPrivateMethod = function() {

    };

    /**
     * Initialization stuffs
     */
    var init = function() {

    } ();
}

// States that TemplateClass inherits from BaseClass
TemplateClass.extend(BaseClass);