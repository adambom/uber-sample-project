(function (App, Backbone, _, $) {

    var __super__ = Backbone.View.prototype;

    App.views.LocationsList = Backbone.View.extend({

        events: {
            'click .delete': 'deleteItem',
            'click .edit': 'makeEditable',
            'click .cancel': 'render',
            'click .save': 'saveEdit'
        },

        template: App.tmpl.locationsList,

        editTemplate: App.tmpl.editLocation,

        initialize: function () {
            this.listenTo(this.collection, 'destroy', this.render, this);
            this.listenTo(this.collection, 'sync', this.render, this);
        },

        render: function () {
            this.$el.html(this.template({
                locations: this.collection.toJSON()
            }));

            this.pagination = new App.views.Pagination({
                el: this.$('.paging'),
                model: this.collection.query
            });

            this.pagination.render();
        },

        deleteItem: function (e) {
            var id = $(e.target).data('location-id');
            this.collection.get(id).destroy();
        },

        makeEditable: function (e) {
            var id = $(e.target).data('location-id');
            var m = this.collection.get(id);
            var $parent = $(e.target).parents('tr');

            $parent.html(this.editTemplate(m.toJSON()));

            App.autocomplete($parent.find('.edit-address'), $parent.find('.edit-lat'), $parent.find('.edit-lng'))();
        },

        saveEdit: function (e) {
            var id = $(e.target).data('location-id');
            var m = this.collection.get(id);
            var $parent = $(e.target).parents('tr');

            m.save({
                nickname: $parent.find('.edit-nickname').val(),
                address: $parent.find('.edit-address').val(),
                lat: +$parent.find('.edit-lat').val(),
                lng: +$parent.find('.edit-lng').val()
            });
        },

        destructor: function () {
            this.pagination.remove();
        }

    });

})(window.UBER, window.Backbone, window._, window.$);