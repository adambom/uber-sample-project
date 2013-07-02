(function (App, Backbone, _, $) {

    var __super__ = Backbone.View.prototype;

    App.views.Search = Backbone.View.extend({

        events: {
            'keyup .q': 'search',
            'click .clear': 'clear'
        },

        template: App.tmpl.search,

        render: function () {
            this.$el.html(this.template({}));
        },

        search: function (e) {
            var term = $(e.target).val();
            this.model.set('term', term, { fetch: true });

            this.$('.clear').toggle(term.length !== 0);
        },

        clear: function () {
            this.$('.q').val('').trigger('keyup');
        }

    });

})(window.UBER, window.Backbone, window._, window.$);