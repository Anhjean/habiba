# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request
from datetime import datetime, timedelta
import logging
import json
_logger = logging.getLogger(__name__)


class HabibaFAQ(http.Controller):
    @http.route(['/faq'], type='http', auth="public", methods=['GET'], website=True)
    def faq(self, **kw):
        data = {
            'faq_items':request.env['habiba.faq_item'].sudo().search([
        ])}
        return request.render('habiba_custom.faq',data)


class HBBAboutUs(http.Controller):
    @http.route(['/aboutus'], type='http', auth="public", methods=['GET'], website=True)
    def faq(self, **kw):
        return request.render('habiba_custom.aboutus')


class HBBFeedback(http.Controller):
    @http.route(['/feedback'], type='http', auth="public", methods=['GET'], website=True)
    def faq(self, **kw):
        return request.render('habiba_custom.feedback')


class HBBShippingPolicy(http.Controller):
    @http.route(['/privacypolicy/shipping'], type='http', auth="public", methods=['GET'], website=True)
    def faq(self, **kw):
        return request.render('habiba_custom.shipping_policy')


class HBBPaymentPolicy(http.Controller):
    @http.route(['/privacypolicy/payment'], type='http', auth="public", methods=['GET'], website=True)
    def faq(self, **kw):
        return request.render('habiba_custom.payment_policy')


class HBBPrivacyPolicy(http.Controller):
    @http.route(['/privacypolicy'], type='http', auth="public", methods=['GET'], website=True)
    def faq(self, **kw):
        return request.render('habiba_custom.privacy_policy')


# class DaySchedule(http.Controller):
#     @http.route(['/delivery/work_schedule'], type='http', auth="public", methods=['GET'], website=True)
#     def day_shedule(self, **kw):
#         _logger.info('******** date ********')
#         _logger.info(kw)
#         # try:
#         _logger.info('******** date ********')
#         str_date = kw['date']
#         _logger.info(str_date)
#         date = datetime.strptime(str(kw['date']), '%d/%m/%Y')
#         _logger.info(date)
#         resp = request.env['company.work_schedule'].sudo().search([
#             ('date', '=', date)])
#         _logger.info('******** resp ********')
#         _logger.info(resp)
#         if len(resp) > 0:
#             res_dict = {
#                 'morning_opening_time': resp.morning_opening_time,
#                 'morning_closing_time': resp.morning_closing_time,
#                 'evening_opening_time': resp.evening_opening_time,
#                 'evening_closing_time': resp.evening_closing_time
#             }
#         else:
#             res_dict = {}
#         _logger.info(res_dict)
#         res_json = json.dumps(res_dict)
#         _logger.info(res_json)
#         # return res_dict
#         # except:
#         return res_json
