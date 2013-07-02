(function (Backbone, _, undefined) {
    var __super__ = Backbone.Model.prototype;

    Backbone.Calculated.Model = Backbone.Model.extend({

        constructor: function (attributes, options) {
            this.calculated = this.calculated || {};
            this._buildTree();

            options = _.extend(options || {}, { computeAll: true });

            return __super__.constructor.call(this, attributes, options);
        },

        // Custom isEqual method; prevents attempting to crawl the dependency tree
        isEqual: function (other) {
            // If they're the same constructor check attributes only
            if (this.constructor === other.constructor) {
                return _.isEqual(this.attibutes, other.attributes);
            }

            return false;
        },

        _buildTree: function () {
            this.dependencies = {};

            for (var field in this.calculated) {
                var calculated = this.calculated[field],
                    dependencies = _.flatten([calculated.dependencies]),
                    node = this._setNode(field);

                for (var i = 0, l = dependencies.length; i < l; i++) {
                    node.connect(this._setNode(dependencies[i]));
                }
            }
        },

        _getNode: function (id) {
            var node = this.dependencies[id] || new Backbone.Calculated.Node(id);

            return node;
        },

        _setNode: function (id) {
            var node = this._getNode(id);

            this.dependencies[id] = node;

            return node;
        },

        _invalidate: function (dependency) {
            var model = this;

            dependency.search(function (node) {
                if (node.valid) {
                    node.valid = false;

                    if (model.calculated[node.id]) delete model.attributes[node.id];
                } else {
                    return false;
                }
            }, true);

            return this;
        },

        _compute: function (dependency, changes, options) {
            var model = this,
                current = this.attributes,
                prev = this._previousAttributes,
                attr, val;

            dependency.search(function (node) {
                attr = node.id;

                // Validate node.
                node.valid = node.valid || _.has(current, attr);

                if (model.calculated[attr] && !node.valid && node.canCalculate()) {
                    node.valid = true;
                    val = model.calculated[attr].getter.call(model);

                    if (!_.isEqual(current[attr], val)) changes.push(attr);
                    if (!_.isEqual(prev[attr], val)) {
                        model.changed[attr] = val;
                    } else {
                        delete model.changed[attr];
                    }

                    current[attr] = val;
                } else {
                    /*
                     * If this is a calculated property
                     * we can't calculate it since at least one
                     * of its dependencies is not valid
                     */
                    return dependency.id === attr;
                }
            });

            return this;
        },

        _computeCalculated: function (changes, options) {
            var i, l,
                compute = [],
                check = options && options.computeAll ?
                    _.keys(this.attributes) : changes;

            for (i = 0, l = check.length; i < l; i++) {
                var attr = check[i],
                    dependency = this.dependencies[attr];

                if (dependency) {
                    this._invalidate(dependency);
                    compute.push(dependency);
                }
            }

            for (i = 0, l = compute.length; i < l; i++) {
                this._compute(compute[i], changes, options);
            }

            return this;
        },

        recompute: function (dependency, options) {
            var changes = [],
                changing = this._changing,
                current = this.attributes,
                prev = this._previousAttributes;

            this._changing = true;

            if (!changing) {
                this._previousAttributes = _.clone(this.attributes);
                this.changed = {};
            }

            this._invalidate.apply(this, arguments)
                ._compute.call(this, dependency, changes, options);

            // Trigger all relevant attribute changes.
            if (changes.length) this._pending = true;
            for (var i = 0, l = changes.length; i < l; i++) {
                this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }

            if (changing) return this;

            while (this._pending) {
                this._pending = false;
                this.trigger('change', this, options);
            }

            this._pending = false;
            this._changing = false;

            return this;
        },

        set: function (key, val, options) {
            var attr, attrs, unset, changes, changing, prev, current;

            if (key == null) return this;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = options || {};

            // Run validation.
            if (!this._validate(attrs, options)) return false;

            // Extract attributes and options.
            unset = options.unset;
            silent = options.silent;
            changes = [];
            changing = this._changing;
            this._changing = true;

            if (!changing) {
                this._previousAttributes = _.clone(this.attributes);
                this.changed = {};
            }
            current = this.attributes, prev = this._previousAttributes;

            // Check for changes of `id`.
            if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

            // For each `set` attribute, update or delete the current value.
            for (attr in attrs) {
                // Delegate for entities
                if (Backbone.isEntity(current[attr]) && !Backbone.isEntity(attrs[attr])) {
                    current[attr].set(attrs[attr], options);
                } else {
                    val = attrs[attr];

                    if (!_.isEqual(current[attr], val)) changes.push(attr);
                    if (!_.isEqual(prev[attr], val)) {
                        this.changed[attr] = val;
                    } else {
                        delete this.changed[attr];
                    }

                    if (unset) {
                        delete current[attr];
                    } else {
                        current[attr] = val;
                    }
                }
            }

            // Handle calculated fields
            this._computeCalculated(changes, options);

            // Trigger all relevant attribute changes.
            if (!silent) {
                if (changes.length) this._pending = true;
                for (var i = 0, l = changes.length; i < l; i++) {
                    this.trigger('change:' + changes[i], this, current[changes[i]], options);
                }
            }

            if (changing) return this;

            while (this._pending) {
                this._pending = false;
                this.trigger('change', this, options);
            }

            this._pending = false;
            this._changing = false;
            return this;
        },

        indexOf: function () {
            if (!this.collection) return -1;

            return this.collection.indexOf(this);
        }

    });

}(window.Backbone, window._));