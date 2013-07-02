(function (App, Backbone, _, $) {

    var __super__ = App.collections.Queryable.prototype;

    App.collections.Locations = App.collections.Queryable.extend({

        initialize: function () {
            __super__.initialize.call(this);

            this.listenTo(this.query, 'change:page', this.fetch);
        },

        url: '/locations/',

        comparator: function (location) {
            return -(new Date(location.get('lastModified')).getTime());
        },

        midpoint: function () {
            if (!this.length) return undefined;

            var coords = this.map(function (location) {
                var lat = location.get('lat') * Math.PI / 180;
                var lng = location.get('lng') * Math.PI / 180;

                return {
                    x: Math.cos(lat) * Math.cos(lng),
                    y: Math.cos(lat) * Math.sin(lng),
                    z: Math.sin(lat),
                    w: 1
                };
            });

            var totalWeight = _.pluck(coords, 'w').reduce(function (a, b) {
                return a + b;
            }, 0);

            var x = 0;
            var y = 0;
            var z = 0;

            _.each(coords, function (coord) {
                x += coord.x * coord.w / totalWeight;
                y += coord.y * coord.w / totalWeight;
                z += coord.z * coord.w / totalWeight;
            });

            var lng = Math.atan2(y, x) * 180 / Math.PI;
            var hyp = Math.sqrt(x * x + y * y);
            var lat = Math.atan2(z, hyp) * 180 / Math.PI;

            return {
                lat: lat,
                lng: lng
            };
        }

    });

})(window.UBER, window.Backbone, window._, window.$);