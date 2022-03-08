odoo.define("ws_product_popup.dynamic_product_popup", function(require) {
    "use strict";
    var Dialog = require("web.Dialog");
    var publicWidget = require("web.public.widget");
    var publicWidget = require('web.public.widget');
    var wSaleUtils = require('website_sale.utils');
    var VariantMixin = require('sale.VariantMixin');
    publicWidget.registry.DynamicProductPopup = publicWidget.Widget.extend(VariantMixin, {
        selector: ".oe_product",
        events: {
            "click .js_hbb_show_popup": "_onClick",
            "click .hbb_btn_view_more": "_onClickSeeMore",
        },
        init: function(parent) {
            this._super.apply(this, arguments);
            this.wishlistProductIDs = [];
        },
        willStart: function() {
            var self = this;
            var def = this._super.apply(this, arguments);

            var wishDef = $.get('/shop/wishlist', {
                count: 1,
            }).then(function(res) {
                self.wishlistProductIDs = JSON.parse(res);
            });

            return Promise.all([def, wishDef]);
        },
        _onClickSeeMore: async function(ev) {
            ev.preventDefault();
            var self = this;
            var product_id = ev.currentTarget.parentElement.parentElement.parentElement.parentElement.querySelector("input[name='popup_prdt_id']").value

            if (product_id) {
                await $.get('/shop/product/' + product_id).then((data) => {
                    let el = $("<div><div/>");
                    el.html(data);
                    let modalContent = $("#product_detail", el);
                    let websitesale = new publicWidget.registry.WebsiteSale(self);
                    modalContent.find('.row .popup-header').append("<i class='fa fa-times fs-1 fw-normal cst-text-primary fs-1' data-dismiss='modal' style='font-weight:100;'></i>");
                    websitesale.setElement(modalContent);
                    let dialog = new Dialog(self, {
                        size: "extra-large",
                        backdrop: true,
                        dialogClass: "p-3",
                        $content: modalContent,
                        technical: false,
                        renderHeader: false,
                        renderFooter: false,
                    });
                    dialog.open();
                });
            } else {
                console.log('NO PRODUCT ID FOUND')
            }

        },
        _onClick: async function(ev) {
            ev.preventDefault();

            var self = this;
            var product_id = ev.currentTarget.parentElement.parentElement.querySelector("input[name='popup_prdt_id']").value

            if (product_id) {
                await $.get('/shop/product/' + product_id).then((data) => {
                    let el = $("<div><div/>");
                    el.html(data);
                    let modalContent = $("#product_detail", el);
                    let websitesale = new publicWidget.registry.WebsiteSale(self);
                    modalContent.find('.row .popup-header').append("<i class='fa fa-times fs-1 fw-normal cst-text-primary fs-1' data-dismiss='modal' style='font-weight:100;'></i>");
                    let wishlistBtn = modalContent.find('.o_add_wishlist_dyn');

                    wishlistBtn.on('click', function(ev) {
                        self._addNewProducts($(ev.currentTarget));
                    })

                    websitesale.setElement(modalContent);
                    let dialog = new Dialog(self, {
                        size: "extra-large",
                        backdrop: true,
                        dialogClass: "p-3",
                        $content: modalContent,
                        technical: false,
                        renderHeader: false,
                        renderFooter: false,
                    });
                    dialog.open();
                });
            } else {
                console.log('NO PRODUCT ID FOUND')
            }

        },
        _addNewProducts: function($el) {
            var self = this;
            var productID = $el.data('product-product-id');
            if ($el.hasClass('o_add_wishlist_dyn')) {
                productID = $el.parent().find('.product_id').val();
                if (!productID) { // case List View Variants
                    productID = $el.parent().find('input:checked').first().val();
                }
                productID = parseInt(productID, 10);
            }
            var $form = $el.closest('form');
            var templateId = $form.find('.product_template_id').val();
            // when adding from /shop instead of the product page, need another selector
            if (!templateId) {
                templateId = $el.data('product-template-id');
            }
            $el.prop("disabled", true).addClass('disabled');
            var productReady = this.selectOrCreateProduct(
                $el.closest('form'),
                productID,
                templateId,
                false
            );

            productReady.then(function(productId) {
                productId = parseInt(productId, 10);

                if (productId && !_.contains(self.wishlistProductIDs, productId)) {
                    return self._rpc({
                        route: '/shop/wishlist/add',
                        params: {
                            product_id: productId,
                        },
                    }).then(function() {
                        var $navButton = $('header .o_wsale_my_wish').first();
                        self.wishlistProductIDs.push(productId);
                        self._updateWishlistView();
                        self.favToastNotify()
                        wSaleUtils.animateClone($navButton, $el.closest('form'), 25, 40);
                    }).guardedCatch(function() {
                        $el.prop("disabled", false).removeClass('disabled');
                    });
                }
            }).guardedCatch(function() {
                $el.prop("disabled", false).removeClass('disabled');
            });
        },
        _updateWishlistView: function() {
            const $wishButton = $('.o_wsale_my_wish');
            if ($wishButton.hasClass('o_wsale_my_wish_hide_empty')) {
                $wishButton.toggleClass('d-none', !this.wishlistProductIDs.length);
            }
            $wishButton.find('.my_wish_quantity').text(this.wishlistProductIDs.length);
        },
        favToastNotify: function() {
            $('#product_detail .fa-times').trigger('click')
            var html = `
                <div class="hbb_favorite_toast">
                    <h4 class="cst-text-primary">A new item has been added to your favorites!</h4>
                </div>
            `;
            var cartnav_str = `
                <div style="z-index:100;bottom:-15px;" class="position-absolute w-100 text-center">
                    <i class="fw-bold cst-text-secondary material-icons">navigation</i>
                </div>`;

            let toast = $(html);
            let cartNav = $(cartnav_str);

            $("header .o_wsale_my_wish").append(toast);
            $("header .o_wsale_my_wish").append(cartNav);
            setTimeout(function() {
                cartNav.remove();
                toast.remove();
            }, 2000);
        },
    });
});