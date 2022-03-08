$(document).ready(function() {
    odoo.define('habiba_custom.shop', function(require) {
        // "use strict";
        var rpc = require('web.rpc')

        //show category
        // if (location.search.includes('active_category=')) {
        //     var param = location.search.split('=')[1]
        //     var categ_id = param.split('#')[0]
        //     if (categ_id) {
        //         var categ = $('#shopCategSwiper #pills-' + categ_id + '-tab')[0];
        //         categ.click()
        //     }
        // }

        // search bar
        $('#search_btn').on('click', function(ev) {
            if ($('#search_bar').hasClass('d-none')) {
                $('#search_bar').removeClass('d-none')
                $('#search_bar').addClass('d-block')
            } else {
                $('#search_bar').removeClass('d-block')
                $('#search_bar').addClass('d-none')
            }
        })

        // show category products
        $('#shopCategSwiper').on('click', function(ev) {
            if ($('#categ_products').hasClass('d-none')) {
                $('#product_tags').addClass('d-none');
                $('#all_products').addClass('d-none');
                $('#tag_products').addClass('d-none');
                $('#categ_products').removeClass('d-none');
            }
        })

        // show all
        $('#filter_btn').on('click', function(ev) {
            if ($('#all_products').hasClass('d-none')) {
                $('#tag_products').addClass('d-none');
                $('#categ_products').addClass('d-none');
                $('#shopCategSwiper #pills-tab .nav-link.active').removeClass('active')
                $('#all_products').removeClass('d-none');
                $('#product_tags').removeClass('d-none');
            } else {
                $('#product_tags').toggleClass('d-none');
            }
        });

        // filter products by tags
        $('#product_tags input').on('click', function(ev) {
            $('#tag_products > div *').remove()
            $('#all_products').addClass('d-none');
            $('#categ_products').addClass('d-none');
            $('#tag_products').removeClass('d-none');
            let id = this.value;
            url = location.pathname + '?product_tag=' + id;

            let spinner = ` <div class="search_spinner_elt d-flex justify-content-center position-absolute top-50 start-50 translate-middle" style="z-index:2">
                                <div class="spinner-border" role="status" style="color:#f3c851;">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                            <div class="search_spinner_elt position-absolute top-0 h-100 w-100 bg-white"
                                style="opacity:0.8;">
                            </div>`
            $('#tag_products').append(spinner);

            $.ajax({
                type: "GET",
                url: url,
                cache: "false",
                success: function(res) {
                    $('.search_spinner_elt').remove()
                    $('#tag_products > div').html($(res))
                },
                Error: function(x, e) {
                    alert("Some error");
                }
            });
        })

    });

});