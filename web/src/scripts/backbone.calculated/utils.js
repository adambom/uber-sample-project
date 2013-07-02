(function (Backbone, _) {
    // Override _.isEqual to allow for a custom implementation
    var isEqual = _.isEqual;

    _.isEqual = function (a, b) {
        return a && a.isEqual && typeof a.isEqual === 'function' ?
            a.isEqual(b) : isEqual(a, b);
    };


    Backbone.isEntity = function (object) {
        return object instanceof Backbone.Model || object instanceof Backbone.Collection;
    };

}(window.Backbone, window._));