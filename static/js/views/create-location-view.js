(function (App, Backbone, _, $) {

    var __super__ = Backbone.View.prototype;

    App.views.CreateLocation = Backbone.View.extend({

        events: {
            'click #submitNewLocation': 'create'
        },

        template: App.tmpl.createLocation,

        initialize: function () {
            this.gc = new google.maps.Geocoder();
        },

        render: function () {
            this.$el.html(this.template({}));
            this.autocomplete = App.autocomplete(this.$('#inputAddress'), this.$('#inputLat'), this.$('#inputLon'));
            this.autocomplete();
        },

        create: function (e) {
            e.preventDefault();

            var m = new App.models.Location({
                nickname: this.$('#inputName').val(),
                address: this.$('#inputAddress').val(),
                lat: +this.$('#inputLat').val(),
                lng: +this.$('#inputLon').val()
            });

            if (!m.isValid()) {
                return;
            }

            this.collection.add(m);

            m.save();

            this.blank();
        },

        blank: function () {
            this.$('input').each(function () {
                $(this).val('');
            });
        }

    });

})(window.UBER, window.Backbone, window._, window.$);