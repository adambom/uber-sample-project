(function (Backbone, undefined) {

    Backbone.Calculated.Node = function (id) {
        this.id = id;
        this.inEdges = [];
        this.outEdges = [];
    };

    _.extend(Backbone.Calculated.Node.prototype, {
        valid: false,

        isLeaf: function () {
            return !this.outEdges.length;
        },

        canCalculate: function () {
            var edges = this.outEdges;

            for (var i = 0, l = edges.length; i < l; i++) {
                if (!edges[i].valid) return false;
            }

            return true;
        },

        connect: function (node) {
            this.outEdges.push(node);
            node.inEdges.push(this);
        },

        search: function (visitor, force) {
            var queue = [], visited = {}, node;

            queue.push(this);
            visited[this.id] = true;

            while (queue.length) {
                var el = queue.shift();

                if (visitor(el) !== false) {
                    for (var i = 0, l = el.inEdges.length; i < l; i++) {
                        node = el.inEdges[i];

                        if (!visited[node.id]) {
                            queue.push(node);
                            // Only mark the node as visited if it was calculated.
                            visited[node.id] = force || node.valid;
                        }
                    }
                }
            }
        }

    });

})(window.Backbone);