from odoo import http
from odoo.http import request

import requests


class CustomSnippets(http.Controller):
    @http.route(
        ["/custom_snippets/google_reviews"], type="json", auth="public", website=True
    )
    def cart(self):
        url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJLXqimXQndTERREK06uyyF3s&fields=reviews&key=AIzaSyC96AGMmUCLPI1Ioq73C8nlOfz36Na6bEE"

        payload = {}
        headers = {}

        response = requests.request("GET", url, headers=headers, data=payload)

        data = response.json()["result"]["reviews"]
        return request.env["ir.ui.view"]._render_template(
            "custom_snippets.s_google_reviews_card", {"reviews": data}
        )
