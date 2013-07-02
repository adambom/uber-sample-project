(function (App, Backbone, _, $, undefined) {

    var __super__ = App.models.Model.prototype;

   App.models.Query = App.models.Model.extend({

        base: App.models.Model,

        defaults: {

            page: 1,

            pageLength: 5,

            term: ''
        },

        validate: function (attrs) {
            if (!attrs.page || attrs.page > attrs.lastPage) return;
            if (attrs.page < attrs.firstPage) return;
        },

        calculated: {

            pagination: {
                dependencies: ['page', 'pages'],
                getter: function () {
                    var page = this.get('page'),
                        pages = _.range(1, this.get('pages') + 1);

                    return _.map(pages, function (p) {
                        return {
                            label: p,
                            className: p === page ?
                                'active' : ''

                        };
                    });
                }
            },

            hasPagination: {
                dependencies: 'pagination',
                getter: function () {
                    return this.get('pagination').length > 1;
                }
            },

            firstPage: {
                dependencies: 'page',
                getter: function () {
                    return this.get('page') === 1;
                }
            },

            lastPage: {
                dependencies: ['page', 'pages'],
                getter: function () {
                    return this.get('page') === this.get('pages');
                }
            },

            prev: {
                dependencies: ['page'],
                getter: function () {
                    return this.get('page') !== 1 ? this.get('page') - 1 : undefined;
                }
            },

            next: {
                dependencies: ['page', 'lastPage'],
                getter: function () {
                    return this.get('lastPage') ? undefined : this.get('page') + 1;
                }
            },

            q: {
                dependencies: ['term'],
                getter: function () {
                    var term = this.get('term') || '';;

                    return term;
                }
            },

            isFiltered: {
                dependencies: ['term', 'page'],
                getter: function () {
                    return this.get('term') || this.get('page') > 1;
                }
            }
        },

        initialize: function () {
            this.on('change:term', function (model, changes, options) {
                this.set('page', 1, options);
            }, this);

            return __super__.initialize.apply(this, arguments);
        },

        toQuery: function (options) {
            if (options && options.computed) {
                return __super__.toJSON.apply(this, arguments);
            }

            var q = this.get('q'),
                sort = this.get('sort'),
                page = this.get('page'),
                pageLength = this.get('pageLength'),
                include = this.get('include'),
                exclude = this.get('exclude');

            return {
                page: page,
                pageLength: pageLength,
                q: q,
                sort: sort,
                include: include ? JSON.stringify(include) : '',
                exclude: exclude ? JSON.stringify(exclude) : ''
            };
        }
    });
}(window.UBER, window.Backbone, window._, window.jQuery));