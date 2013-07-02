(function (App, Backbone, _, $) {

    var __super__ = App.models.Query.prototype;

    App.models.Location = App.models.Query.extend({

        initialize: function () {
            if (this.isNew()) {
                this.set('lastModified', (new Date()).toGMTString());
            }
        },

        validate: function (attrs) {
            if (!_.isString(attrs.nickname)) {
                return 'Name must be a string.';
            }

            if (!attrs.nickname) {
                return 'Name must not be blank.';
            }

            if (!_.isString(attrs.address)) {
                return 'Address must be a string.';
            }

            if (!attrs.address) {
                return 'Address must not be blank.';
            }

            if (!_.isNumber(attrs.lat)) {
                return 'Latitude must be a entered as a number';
            }

            if (!_.isNumber(attrs.lng)) {
                return 'Longitude must be a entered as a number';
            }
        }

    });

})(window.UBER, window.Backbone, window._, window.$);