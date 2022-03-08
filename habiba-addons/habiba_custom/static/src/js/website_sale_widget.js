odoo.define("habiba_custom.website_sale_widget", function(require) {
    var publicWidget = require("web.public.widget");
    var wSaleUtils = require("website_sale.utils");
    require("website_sale_options.website_sale");

    publicWidget.registry.WebsiteSale.include({
        _onProductReady: function() {
            if (!this.$form.hasClass("js_hbb_json_cart")) {
                return this._super.apply(this, arguments);
            }
            this._hbbProductJson();
        },

        _hbbProductJson: function() {
            var self = this;
            var productCustomVariantValues = self.getCustomVariantValues(
                self.$form.find(".js_product")
            );
            var noVariantAttributeValues = self.getNoVariantAttributeValues(
                self.$form.find(".js_product")
            );
            this._rpc({
                route: "/shop/cart/update_json",
                params: {
                    product_id: parseInt(
                        self.$form.find("input[name='product_id']").val()
                    ),
                    add_qty: 1,
                    product_custom_attribute_values: JSON.stringify(
                        productCustomVariantValues
                    ),
                    no_variant_attribute_values: JSON.stringify(noVariantAttributeValues),
                },
            }).then(function(data) {
                console.log('data****', data)
                wSaleUtils.updateCartNavBar(data);
                // var $navButton = $("header .o_wsale_my_cart").first();
                // var animation = wSaleUtils.animateClone(
                //   $navButton,
                //   self.$form.find(".oe_product_image"),
                //   25,
                //   40
                // );
                // Promise.all([animation]);
                console.log('data******', data)
                self.toastNotify();
            });
        },

        toastNotify: function() {
            $('#product_detail .fa-times').trigger('click')
            var html = `
                <div class="hbb_cart_toast">
                    <h4 class="cst-text-primary">A new item has been added to your cart!</h4>
                </div>
            `;
            var cartnav_str = `
                <div style="z-index:100;bottom:-25px;" class="position-absolute w-100 text-center">
                    <i class="fw-bold cst-text-secondary material-icons">navigation</i>
                </div>`;

            let toast = $(html);
            let cartNav = $(cartnav_str);

            $("header").append(toast);
            $("#cart-div").append(cartNav);
            setTimeout(function() {
                cartNav.remove();
                toast.remove();
            }, 2000);
        },
    });
});