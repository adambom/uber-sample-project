(function (App, Backbone, _, $) {

    var __super__ = Backbone.View.prototype;

    App.views.Pagination = Backbone.View.extend({

        events: {
            'click .nextPage': 'nextPage',
            'click .prevPage': 'prevPage',
            'click .page': 'page'
        },

        template: App.tmpl.pagination,

        initialize: function () {
            this.listenTo(this.model, 'change:page', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },

        nextPage: function (e) {
            this.model.set('page', this.model.get('next'), { validate: true });
        },

        prevPage: function (e) {
            this.model.set('page', this.model.get('prev'), { validate: true });
        },

        page: function (e) {
            this.model.set('page', $(e.target).data('page'), { validate: true });
        }

    });

})(window.UBER, window.Backbone, window._, window.$);