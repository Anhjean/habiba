odoo.define("custom_website.add_dynamic", function (require) {
  "use strict";

  var ajax = require("web.ajax");
  var utils = require("web.utils");
  var wSaleUtils = require("website_sale.utils");
  var publicWidget = require("web.public.widget");
  var core = require("web.core");
  var _t = core._t;

  publicWidget.registry.addDynamicCart = publicWidget.Widget.extend({
    selector: 'form[action="/shop/cart/update_json"]',
    events: {
      submit: "_onSubmit",
    },

    /**
     * @constructor
     */
    init: function () {
      this._super.apply(this, arguments);
    },
    /**
     * @override
     */
    start: function () {
      return this._super.apply(this, arguments);
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} ev
     */
    _onSubmit: async function (ev) {
      var self = this;

      ev.preventDefault(); //
      await ajax
        .jsonRpc("/shop/cart/update_json", "call", {
          product_id: parseInt($("input[name='product_id']", self.$el).val()),
          add_qty: parseInt($("input[name='add_qty']", self.$el).val()),
        })
        .then(function (data) {
          wSaleUtils.updateCartNavBar(data);
          $("input[name='add_qty']", self.$el).val("1");
          var $navButton = $("header .o_wsale_my_cart").first();
          var animation = wSaleUtils.animateClone(
            $navButton,
            $(".oe_product_image", self.$el),
            25,
            40
          );
        });
    },
  });
});
