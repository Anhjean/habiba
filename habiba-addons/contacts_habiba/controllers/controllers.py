# -*- coding: utf-8 -*-
# from odoo import http


# class ContactHabiba(http.Controller):
#     @http.route('/contact_habiba/contact_habiba/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/contact_habiba/contact_habiba/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('contact_habiba.listing', {
#             'root': '/contact_habiba/contact_habiba',
#             'objects': http.request.env['contact_habiba.contact_habiba'].search([]),
#         })

#     @http.route('/contact_habiba/contact_habiba/objects/<model("contact_habiba.contact_habiba"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('contact_habiba.object', {
#             'object': obj
#         })
