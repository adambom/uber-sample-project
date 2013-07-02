(function (App, Backbone, _, $, undefined) {

    var __super__ = Backbone.Calculated.Model.prototype;

    App.models.Model = Backbone.Calculated.Model.extend({

        base: Backbone.Calculated.Model,

        meta: [
            'id',
            'lastModified'
        ],

        constructor: function (attrs, options) {
            this.stash = [];

            return __super__.constructor.call(this, this.composeEntities(attrs, options), options);
        },

        bindModelDependency: function (model, dependency, events) {
            if (dependency) {
                model.on(events || 'add remove change', _.bind(this.recompute, this, dependency));
            }
        },

        composeEntities: function (attrs, options) {
            attrs = attrs || {};

            var composed = this.composed || [];

            for (var i = 0, l = composed.length; i < l; i++) {
                var composition = composed[i],
                    attr = composition.attribute,
                    entity = this.getComposedEntity(composition, attrs, options),
                    instance = new entity(attrs[attr], options);

                instance.parent = this;
                instance.resource = attr;

                attrs[attr] = instance;
            }

            return attrs;
        },

        getComposedEntity: function (composition, attrs, options) {
            return composition.entity || composition.getEntity(attrs, options);
        },

        toJSON: function (options) {
            options = options || {};

            var json = __super__.toJSON.apply(this, arguments);
            var omit = options && _.result(options, 'omit');

            if (options.cascade) {
                for (var attr in json) {
                    var value = json[attr];

                    if (_.has(json, attr) && typeof value === 'object' && Backbone.isEntity(value)) {
                        json[attr] = value.toJSON(options);
                    }
                }
            }

            return omit ? _.omit(json, omit) : json;
        },

        // TODO: fix this mess
        sync: function (method, model, options) {
            if (method !== 'delete') {
                options = options || {};
                options.omit = _.compact([].concat(
                    this.meta,
                    _.result(this, 'omit'),
                    _(this.calculated).pick(function (definition) { return !definition.save; }).keys().value()
                ));

                var success = options.success;

                options.success = function (response, responseText, xhr) {
                    var data = {};

                    if (method === 'create') {
                        data = _.pick(response, model.meta);
                    }

                    if (success) success(data);
                };
            }

            return __super__.sync.call(this, method, model, options);
        },

        clone: function () {
            return new this.constructor(this.toJSON({ cascade: true, serialize: 'all' }), { parse: true });
        },

        snapshot: function (id) {
            this.stash[id] = this.clone().toJSON();

            return this;
        },

        getSnapshot: function (id) {
            return this.stash[id];
        },

        clearSnapshot: function (id) {
            delete this.stash[id];

            return this;
        },

        revertTo: function (id, options) {
            this.set(this.stash[id] || {}, options);

            return this;
        },

        indexOf: function () {
            if (!this.collection) return -1;

            return this.collection.indexOf(this);
        }
    });

}(window.UBER, window.Backbone, window._, window.jQuery));