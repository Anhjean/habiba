odoo.define("custom_snippets.s_google_reviews", function (require) {
  "use strict";

  const publicWidget = require("web.public.widget");
  const DynamicSnippetCarousel = require("website.s_dynamic_snippet_carousel");

  publicWidget.registry.dynamic_snippet_products = DynamicSnippetCarousel.extend(
    {
      selector: ".s_google_reviews",

      //--------------------------------------------------------------------------
      // Private
      //--------------------------------------------------------------------------

      /**
       * @override
       */
      _fetchData: async function () {
        const cards = await this._rpc({
          route: "/custom_snippets/google_reviews",
        });
        this.data = [...$(cards)]
          .filter((node) => node.nodeType === 1)
          .map((el) => {
            return el.outerHTML;
          });
      },
    }
  );
});
