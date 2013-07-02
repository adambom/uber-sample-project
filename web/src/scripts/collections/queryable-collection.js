(function (App, Backbone, _, $, undefined) {

    var __super__ = Backbone.Collection.prototype;

    App.collections.Queryable = Backbone.Collection.extend({

        initialize: function (models, options) {
            options = options || {};

            this.query = options.query || new App.models.Query();

            this.query.on(this.fetchOn, function (model, changes, options) {
                if (!(options && options.fetch)) return;

                if (this.xhr) {
                    this.xhr.abort();
                }

                this.trigger('loading');
                this.xhr = this.fetch();
            }, this);
        },

        parse: function (response) {
            var data = response.data,
                lastModified = response.lastModified,
                owners = response.owners;

            this.query.set('pages', response.pages);

            return response.data;
        },

        fetchOn: 'change:page change:size change:q change:sort',

        search: function (term) {
            this.query.set('term', term, { fetch: true });

            return this;
        },

        page: function (page) {
            this.query.set('page', page, { fetch: true });

            return this;
        },

        firstPage: function () {
            return this.page(1);
        },

        lastPage: function () {
            return this.page(this.query.get('pages'));
        },

        nextPage: function () {
            return this.page(this.query.get('page') + 1);
        },

        prevPage: function () {
            return this.page(this.query.get('page') - 1);
        },

        isFiltered: function () {
            return this.query.get('isFiltered');
        },

        fetch: function (options) {
            options = options ? _.clone(options) : {};

            options.parse = true;
            options.data = $.extend(true, options.fetchOne ? {} : this.query.toQuery(), options.data || {});

            var collection = this,
                success = options.success;

            options.success = function (collection, resp, options) {
                if (!options.fetchOne) collection.query.set(resp.filter);

                if (success) success.apply(collection, arguments);
            };

            return __super__.fetch.call(this, options);
        }

    });

}(window.UBER, window.Backbone, window._, window.jQuery));