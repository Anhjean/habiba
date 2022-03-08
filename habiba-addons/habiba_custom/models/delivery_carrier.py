from odoo import models, fields

class DeliveryCarrier(models.Model):
    _inherit = 'delivery.carrier'

    x_is_pick_up = fields.Boolean(string='Is Pick up')
    