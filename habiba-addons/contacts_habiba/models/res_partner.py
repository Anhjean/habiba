# -*- coding: utf-8 -*-

from datetime import date, datetime, timedelta
from odoo import models, fields, api

class Partner(models.Model):
    _inherit = "res.partner" 
    
    sequence = fields.Char(string="Sequence",readonly=True)
    birth_date = fields.Date('Birth Date', required=False)

    _sql_constraints = [
     ('uniq_email', 'unique(email)', 'Email must be unique'),
     ('uniq_mobile', 'unique(mobile)', 'Mobile must be unique'),
]    

    @api.model
    def create(self, vals):
        #inherit create function to implement sequence
        if not vals.get('sequence'):
            vals['sequence'] = self.env['ir.sequence'].next_by_code('res.partner.code') or _('New')
        return super(Partner, self).create(vals)
    

    def send_notification(self):
        #function to send reminder when it is partner birthday
        print('========================================================')

        contact_ids = self.env['res.partner'].search([])
        user_ids = self.env['res.users'].search([]).filtered(lambda user:user.has_group('hr.group_hr_user'))
        for contact in contact_ids:
            current_date=datetime.now()
            current_month=current_date.month
            current_date = current_date.day
            if  contact.birth_date:
                if contact.birth_date.month == current_month  and contact.birth_date.day == current_date:
                    print('-----------------------------------------------------------------',contact.name)
                    for user in user_ids:
                        activity = self.env['mail.activity'].create({
                                    'note':'<strong>'+str(contact.name)+'Birthday</strong>',
                                    'summary': 'Birthday Notification',
                                    'res_id': contact.id,
                                    'user_id': user.id,
                                    'activity_type_id': self.env.ref('mail.mail_activity_data_todo').id,
                                    'res_model_id': self.env['ir.model'].search([('model', '=', 'res.partner')], limit=1).id,
                                })
                        print('33333333333333333333333333333333333333333333333333333333333333333333333333333333333333',activity)
       