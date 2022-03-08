odoo.define("custom_website.cart", function (require) {
  "use strict";

  var publicWidget = require("web.public.widget");
  var core = require("web.core");
  var _t = core._t;

  var timeout;

  publicWidget.registry.websiteSaleCartLink = publicWidget.Widget.extend({
    selector: '#top_menu a[href$="http://104.248.148.146:8069/shop/cart"]',
    events: {
      click: "_onClick",
    },

    /**
     * @constructor
     */
    init: function () {
      this._super.apply(this, arguments);
      this._popoverRPC = null;
    },
    /**
     * @override
     */
    start: function () {
      this.offcanvas = $("#cart-offcanvas").offcanvas({
        overlay: true,
        container: "#wrapwrap",
        coverage: "280px",
        origin: "right",
        effect: "slide-in-over",
      });
      this.offcanvas.offcanvas("hide");
      $(".offcanvas-element").addClass("card");
      this.offcanvas.addClass("card-content");
      return this._super.apply(this, arguments);
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} ev
     */
    _onClick: function (ev) {
      ev.preventDefault(); //
      var self = this;
      clearTimeout(timeout);
      if ($("#wrapwrap").hasClass("offcanvas-open")) {
        self.offcanvas.offcanvas("hide");
        return;
      }
      timeout = setTimeout(function () {
        self._popoverRPC = $.get("/shop/cart", {
          type: "popover",
        }).then(function (data) {
          self.offcanvas.html(data);
          self.offcanvas.offcanvas("show");
        });
      }, 10);
    },
  });
});
