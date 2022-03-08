odoo.define("custom_website.product_modal", function (require) {
  "use strict";

  var ajax = require("web.ajax");
  var publicWidget = require("web.public.widget");
  var utils = require("web.utils");
  var wSaleUtils = require("website_sale.utils");
  var VariantMixin = require("sale.VariantMixin");
  var core = require("web.core");
  var _t = core._t;

  publicWidget.registry.productModal = publicWidget.Widget.extend(
    VariantMixin,
    {
      selector: ".oe_product",
      events: {
        "click a.product_name": "_onClick",
        "click a.d-block.h-100": "_onClick",
        "click #add_to_cart": "_onSubmit",
        "click #product_details > form > div > div.css_quantity.input-group > div.input-group-append > a":
          "_incrementQuantity",
        "click #product_details > form > div > div.css_quantity.input-group > div.input-group-prepend > a":
          "_decrementQuantity",
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
        this.backupEl = this.$el;
        return this._super.apply(this, arguments);
      },

      //--------------------------------------------------------------------------
      // Handlers
      //--------------------------------------------------------------------------

      _onSubmit: async function (ev) {
        var self = this;
        ev.preventDefault();
        let data = {};
        let $form = $("form", self.$el);

        $form.serializeArray().forEach((field) => {
          if (!isNaN(field.value)) data[field.name] = parseInt(field.value);
        });
        await ajax
          .jsonRpc("/shop/cart/update_json", "call", {
            ...data,
            product_custom_attribute_values: self.getCustomVariantValues(
              $form.find(".js_product")
            ),
            variant_values: self.getSelectedVariantValues(
              $form.find(".js_product")
            ),
          })
          .then(function (data) {
            wSaleUtils.updateCartNavBar(data);
            $("input[name='add_qty']", self.$el).val("1");
            var $navButton = $("header .o_wsale_my_cart").first();
            var animation = wSaleUtils
              .animateClone(
                $navButton,
                $(".oe_product_image", self.$el),
                25,
                40
              )
              .then(() => self.$el.modal("hide"));
          });
      },
      _incrementQuantity: function (ev) {
        let value = parseInt(
          $(
            "#product_details > form > div > div.css_quantity.input-group > input"
          ).val()
        );
        $(
          "#product_details > form > div > div.css_quantity.input-group > input"
        ).val(value + 1);
      },
      _decrementQuantity: function (ev) {
        let value = parseInt(
          $(
            "#product_details > form > div > div.css_quantity.input-group > input"
          ).val()
        );
        $(
          "#product_details > form > div > div.css_quantity.input-group > input"
        ).val(value == 1 ? 1 : value - 1);
      },
      /**
       * @private
       * @param {Event} ev
       */
      _onClick: async function (ev) {
        var self = this;
        ev.preventDefault();
        await $.get(ev.currentTarget.href).then((data) => {
          let el = $("<div><div/>");
          el.html(data);
          let modalContent = $("#product_detail", el).addClass("modal-content");
          $("div[role='search']", modalContent).remove();
          el = $('<div class="modal"><div class"modal-dialog"></div></div>');
          (".modal-dialog", el).append(modalContent);
          $("#wrapwrap").append(el);
          self.setElement(el);
          self.modal = el;
          self.$el.modal("show").on("hidden.bs.modal", () => {
            self.setElement(self.backupEl);
            self.modal.remove();
          });
        });
      },
    }
  );
});
