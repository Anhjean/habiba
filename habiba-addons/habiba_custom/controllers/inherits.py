from odoo import http
import logging
import json
from odoo.http import request
from datetime import datetime, date
from odoo.addons.website.controllers.main import Website
from odoo.addons.website_sale.controllers.main import TableCompute
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.addons.website.controllers.main import QueryURL

_logger = logging.getLogger(__name__)


class HabibaHome(Website):
    @http.route(auth='public')
    def index(self, *args, **kw):
        response = super(HabibaHome, self).index(**kw)
        ppg = request.env['website'].get_current_website().shop_ppg or 20
        ppr = request.env['website'].get_current_website().shop_ppr or 4
        url = "/shop/"
        data = {}

        products = request.env['product.template'].sudo().search(
            [('is_featured', '=', True)])
        data['bins'] = TableCompute().process(products, ppg, ppr)
        data['pager'] = request.website.pager(
            url=url, total=1, page=0, step=ppg, scope=7, url_args=kw)

        data['featured_categories'] = request.env['product.public.category'].sudo().search(
            [('is_featured', '=', True)] + request.website.website_domain())

        data['carousel_items'] = request.env['habiba.homecarousel_item'].sudo().search([
        ])

        data.update(response.qcontext)

        attrib_list = request.httprequest.args.getlist('attrib')
        attrib_values = [[int(x) for x in v.split("-")]
                         for v in attrib_list if v]
        data['attrib_values'] = attrib_values
        data['keep'] = QueryURL(
            '/shop', category=0, search='', attrib=attrib_list, order=kw.get('order'))

        return request.render("website.homepage", data)


class HabibaHomeWebsiteSale(WebsiteSale):
    @http.route(auth='public')
    def shop(self, *args, **post):
        response = super(HabibaHomeWebsiteSale, self).shop(*args, **post)
        data = {}
        data['product_tags'] = request.env['product.tag'].sudo().search([
            ('active', '=', True)])

        data.update(response.qcontext)

        if 'product_tag' in post:
            product_tag = request.env['product.tag'].sudo().browse(
                int(post['product_tag']))
            ppg = request.env['website'].get_current_website().shop_ppg or 20
            ppr = request.env['website'].get_current_website().shop_ppr or 4

            products = request.env['product.template'].sudo().search(
                [('tag_ids', '=', product_tag.id)])

            data['bins'] = TableCompute().process(products, ppg, ppr)

            return request.render("habiba_custom.tag_products", data)

        return request.render("website_sale.products", data)

    # def cart_update_json(auth='public'):
    #     """This route is called when changing quantity from the cart or adding
    #     a product from the wishlist."""
    #     order = request.website.sale_get_order(force_create=1)
    #     if order.state != 'draft':
    #         request.website.sale_reset()
    #         return {}

    #     value = order._cart_update(product_id=product_id, line_id=line_id, add_qty=add_qty, set_qty=set_qty)

    #     if not order.cart_quantity:
    #         request.website.sale_reset()
    #         return value

    #     order = request.website.sale_get_order()
    #     value['cart_quantity'] = order.cart_quantity

    #     if not display:
    #         return value

    #     value['website_sale.cart_lines'] = request.env['ir.ui.view']._render_template("website_sale.cart_lines", {
    #         'website_sale_order': order,
    #         'date': fields.Date.today(),
    #         'suggested_products': order._cart_accessories()
    #     })
    #     value['website_sale.short_cart_summary'] = request.env['ir.ui.view']._render_template("website_sale.short_cart_summary", {
    #         'website_sale_order': order,
    #     })
    #     return value

    # @http.route(auth='public')
    # def product(self, *args, **kwargs):
    #     response = super(HabibaHomeWebsiteSale, self).product(*args, **kwargs)

    #     data = {}
    #     data['current_category'] = response.qcontext['category']
    #     data.update(response.qcontext)

    #     order = request.website.sale_get_order()
    #     redirection = self.checkout_redirection(order) or self.checkout_check_address(order)
    #     if redirection:
    #         return redirection

    #     render_values = self._get_shop_payment_values(order, **post)
    #     render_values['only_services'] = order and order.only_services or False

    #     if render_values['errors']:
    #         render_values.pop('acquirers', '')
    #         render_values.pop('tokens', '')

    #     return request.render("habiba_custom.habiba_productdetails", data)

    # @http.route(auth='public')
    # def cart(self, *args, **kwargs):
    #     website_theme = ''
    #     try:
    #         website_id = request.session.force_website_id
    #         website = http.request.env['website'].sudo().browse(
    #             int(website_id))
    #         website_theme = website.theme_id.name
    #     except:
    #         pass

    #     if website_theme == 'habiba_custom':
    #         response = super(WebsiteSaleInherit, self).cart(*args, **kwargs)

    #         data = {}
    #         data.update(response.qcontext)

    #         return request.render("habiba_custom.cart", data)

    #     return super(WebsiteSaleInherit, self).cart(*args, **kwargs)

    # @http.route(auth='public')
    # def cart_update(self, *args, **kwargs):
    #     if 'group_pricelist' in kwargs:
    #         try:
    #             pricelist_id = kwargs['group_pricelist']
    #             website_id = request.session.force_website_id
    #             website = http.request.env['website'].sudo().browse(
    #                 int(website_id))

    #             sale_order = request.website.sale_get_order(force_create=True)
    #             if sale_order.state != 'draft':
    #                 request.session['sale_order_id'] = None
    #                 sale_order = request.website.sale_get_order(
    #                     force_create=True)

    #             product_custom_attribute_values = None
    #             if kwargs.get('product_custom_attribute_values'):
    #                 product_custom_attribute_values = json.loads(
    #                     kwargs.get('product_custom_attribute_values'))

    #             no_variant_attribute_values = None
    #             if kwargs.get('no_variant_attribute_values'):
    #                 no_variant_attribute_values = json.loads(
    #                     kwargs.get('no_variant_attribute_values'))

    #             group_pricelist = request.env['product.pricelist'].sudo().search([
    #                 ('id', '=', pricelist_id),
    #                 ('company_id', '=', website.company_id.id),
    #                 ('website_id', '=', website_id),
    #                 ('selectable', '=', True),
    #                 ('active', '=', True),
    #                 ('is_buygroup_pricelist', '=', True),
    #             ])
    #             if len(group_pricelist) > 0:
    #                 group_pricelist_id = group_pricelist[0]

    #                 sale_order._cart_update(
    #                     group_pricelist_id=group_pricelist_id,
    #                     product_id=int(kwargs.get('product_id')),
    #                     add_qty=kwargs.get('add_qty'),
    #                     set_qty=kwargs.get('set_qty'),
    #                     product_custom_attribute_values=product_custom_attribute_values,
    #                     no_variant_attribute_values=no_variant_attribute_values
    #                 )
    #                 return request.redirect("/shop/cart")

    #         except:
    #             pass
    #     else:
    #         return super(WebsiteSaleInherit, self).cart_update(*args, **kwargs)
