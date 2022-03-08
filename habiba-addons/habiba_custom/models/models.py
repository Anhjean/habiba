from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
from odoo.exceptions import UserError
from datetime import datetime, timedelta
import logging
import json
_logger = logging.getLogger(__name__)


class HomeCategory(models.Model):
    _inherit = "product.public.category"

    is_featured = fields.Boolean(string='Featured on website')


class HomeProduct(models.Model):
    _inherit = "product.template"

    is_featured = fields.Boolean(string='Featured on website')


class ResCompanyInherit(models.Model):
    _inherit = "res.company"

    default_morning_opening_time = fields.Float(
        string='Default Morning Opening Time')
    default_morning_closing_time = fields.Float(
        string='Default Morning Closing Time')
    default_evening_opening_time = fields.Float(
        string='Default Evening Opening Time')
    default_evening_closing_time = fields.Float(
        string='Default Evening Closing Time')
    weekend_morning_opening_time = fields.Float(
        string='Weekend Morning Opening Time')
    weekend_morning_closing_time = fields.Float(
        string='Weekend Morning Closing Time')
    weekend_evening_opening_time = fields.Float(
        string='Weekend Evening Opening Time')
    weekend_evening_closing_time = fields.Float(
        string='Weekend Evening Closing Time')

    closing_time_note = fields.Text(string='Closing Time Note')
    holiday_note = fields.Text(string='Holiday Note')
    emergency_note = fields.Text(string='Emergency Note')


class CompanyWorkSchedule(models.Model):
    _name = "company.work_schedule"
    _rec_name = 'type_of_day'

    type_of_day = fields.Selection(string='Type of day', required=True, default='normal_day',
                                   selection=[
                                       ('normal_day', 'Normal day'),
                                       ('weekend_day', 'Weekend Day'),
                                       ('holiday', 'Holiday'),
                                   ]
                                   )
    date = fields.Date(string='Date', required=True)
    morning_opening_time = fields.Float(
        string='Morning Opening Time', digits=(24, 2), copy=False, default=lambda self: self.env.company.default_morning_opening_time)
    morning_closing_time = fields.Float(
        string='Morning Closing Time', digits=(24, 2), copy=False, default=lambda self: self.env.company.default_morning_closing_time)
    evening_opening_time = fields.Float(
        string='Evening Opening Time', digits=(24, 2), copy=False, default=lambda self: self.env.company.default_evening_opening_time)
    evening_closing_time = fields.Float(
        string='Evening Closing Time', digits=(24, 2), copy=False, default=lambda self: self.env.company.default_evening_closing_time)

    _sql_constraints = [
        ('date_uniq', 'unique (date)',
         "There is already a schedule for that date !"),
    ]

    @api.onchange('type_of_day')
    def onchange_type_of_day(self):
        company = self.env.user.company_id
        if self.type_of_day == 'normal_day':
            self.morning_opening_time = company.default_morning_opening_time
            self.morning_closing_time = company.default_morning_closing_time
            self.evening_opening_time = company.default_evening_opening_time
            self.evening_closing_time = company.default_evening_closing_time
        elif self.type_of_day == 'weekend_day':
            self.morning_opening_time = company.weekend_morning_opening_time
            self.morning_closing_time = company.weekend_morning_closing_time
            self.evening_opening_time = company.weekend_evening_opening_time
            self.evening_closing_time = company.weekend_evening_closing_time


class HBBLandingCarousel(models.Model):
    _name = "habiba.homecarousel_item"

    picture = fields.Image('Picture')
    title = fields.Char(string='Title')
    description = fields.Char(string='Description')
    btn_primary = fields.Char(string='Button Primary')
    btn_primary_link = fields.Char(string='Link')
    btn_secondary = fields.Char(string='Button Primary Link')
    btn_secondary_link = fields.Char(string='Link')


class HBBFAQ(models.Model):
    _name = "habiba.faq_item"

    title = fields.Char(string='Title')
    description = fields.Text(string='Description')
