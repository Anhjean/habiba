odoo.define("hbb_custom.DeliveryPickup", function(require) {
    "use strict";
    var publicWidget = require("web.public.widget");

    publicWidget.registry.DeliveryPickup = publicWidget.Widget.extend({
        selector: ".oe_cart",
        events: {
            "click .o_delivery_carrier_select": "_onClickPickup",
        },
        _onClickPickup: async function(ev) {
            $("#delivery_method .o_delivery_carrier_select").removeClass(
                "showPickup"
            );
            $(ev.currentTarget).addClass("showPickup");
        },
    });
});

// function str_hour(int_hr) {
//     var str_hr = int_hr.toString()
//     if (str_hr.length == 1) {
//         return '0' + str_hr
//     }
//     return str_hr
// }

// $('#delivery_date').on('change', function() {
//     $('#select_hour_str option').remove()
//     $('#warning_note p').addClass('d-none')
//     var str_date = $(this).val()
//     if (str_date) {
//         var date = new Date(str_date)
//         var domain = [
//             ["date", "=", date],
//             "|", ["type_of_day", "=", "weekend_day"],
//             ["type_of_day", "=", "holiday"],
//         ];

//         get_schedule(domain).then(function(response) {
//             console.log(response)
//             if (response.length > 0) {
//                 var data = response[0]

//                 var mrng_opng_time_hour = parseInt(data.morning_opening_time)
//                 var mrng_opng_time_min = ((data.morning_opening_time % 1) * 60).toFixed()
//                 var mrng_clsg_time_hour = parseInt(data.morning_closing_time)
//                 var mrng_clsg_time_min = ((data.morning_closing_time % 1) * 60).toFixed()

//                 var evng_opng_time_hour = parseInt(data.evening_opening_time)
//                 var evng_opng_time_min = ((data.evening_opening_time % 1) * 60).toFixed()
//                 var evng_clsg_time_hour = parseInt(data.evening_closing_time)
//                 var evng_clsg_time_min = ((data.evening_closing_time % 1) * 60).toFixed()

//                 var type = data.type_of_day

//                 if (type == 'weekend_day') {
//                     $('#emergency_note').removeClass('d-none')
//                 } else if (type == 'holiday') {
//                     $('#holiday_note').removeClass('d-none')
//                 }
//             } else {
//                 console.log('normal day')
//                 var mrng_opng_time_hour = parseInt($("input[name='default_morning_opening_time']").val())
//                 var mrng_opng_time_min = (($("input[name='default_morning_opening_time']").val() % 1) * 60).toFixed()
//                 var mrng_clsg_time_hour = parseInt($("input[name='default_morning_closing_time']").val())
//                 var mrng_clsg_time_min = (($("input[name='default_morning_closing_time']").val() % 1) * 60).toFixed()

//                 var evng_opng_time_hour = parseInt($("input[name='default_evening_opening_time']").val())
//                 var evng_opng_time_min = (($("input[name='default_evening_opening_time']").val() % 1) * 60).toFixed()
//                 var evng_clsg_time_hour = parseInt($("input[name='default_evening_closing_time']").val())
//                 var evng_clsg_time_min = (($("input[name='default_evening_closing_time']").val() % 1) * 60).toFixed()
//             }
//             console.log([mrng_opng_time_hour, mrng_opng_time_min, mrng_clsg_time_hour, mrng_clsg_time_min, evng_opng_time_hour, evng_opng_time_min, evng_clsg_time_hour, evng_clsg_time_min])
//             for (let i = mrng_opng_time_hour; i <= evng_clsg_time_hour; i++) {
//                 if ((i == mrng_opng_time_hour && parseInt(mrng_opng_time_min) >= 40) || (i == evng_opng_time_hour && parseInt(evng_opng_time_min) >= 40)) {
//                     $("#select_hour_str").append(`<option value='${i}' disabled='disabled'>${str_hour(i)}</option>`);
//                 } else if ((i == mrng_clsg_time_hour && parseInt(mrng_clsg_time_min) <= 20) || (i == evng_clsg_time_hour && parseInt(evng_clsg_time_min) <= 20)) {
//                     $("#select_hour_str").append(`<option value='${i}' disabled='disabled'>${str_hour(i)}</option>`);
//                 } else if (i > mrng_clsg_time_hour && i < evng_opng_time_hour) {
//                     $("#select_hour_str").append(`<option value='${i}' disabled='disabled'>${str_hour(i)}</option>`);
//                 } else {
//                     $("#select_hour_str").append(`<option value='${i}'>${str_hour(i)}</option>`);
//                 }
//             }

//         })
//     }
// })

// $('#select_hour_str').on('change', function() {
//     console.log('changing time...')
//     $('#select_time_str option').remove()
//     var str_date = $('#delivery_date').val()
//     var hour = $('#select_hour_str').val()
//     if (str_date) {
//         var date = new Date(str_date)
//         var domain = [
//             ["date", "=", date],
//             "|", ["type_of_day", "=", "weekend_day"],
//             ["type_of_day", "=", "holiday"],
//         ];

//         get_schedule(domain).then(function(response) {
//             console.log(response)
//             if (response.length > 0) {
//                 var data = response[0]

//                 var mrng_opng_time_hour = parseInt(data.morning_opening_time)
//                 var mrng_opng_time_min = parseInt(((data.morning_opening_time % 1) * 60).toFixed())
//                 var mrng_clsg_time_hour = parseInt(data.morning_closing_time)
//                 var mrng_clsg_time_min = parseInt(((data.morning_closing_time % 1) * 60).toFixed())

//                 var evng_clsg_time_hour = parseInt(data.evening_closing_time)
//                 var evng_clsg_time_min = parseInt(((data.evening_closing_time % 1) * 60).toFixed())
//                 var evng_opng_time_hour = parseInt(data.evening_opening_time)
//                 var evng_opng_time_min = parseInt(((data.evening_opening_time % 1) * 60).toFixed())

//             } else {
//                 console.log('normal day')
//                 var mrng_opng_time_hour = parseInt($("input[name='default_morning_opening_time']").val())
//                 var mrng_opng_time_min = (($("input[name='default_morning_opening_time']").val() % 1) * 60).toFixed()
//                 var mrng_clsg_time_hour = parseInt($("input[name='default_morning_closing_time']").val())
//                 var mrng_clsg_time_min = (($("input[name='default_morning_closing_time']").val() % 1) * 60).toFixed()

//                 var evng_opng_time_hour = parseInt($("input[name='default_evening_opening_time']").val())
//                 var evng_opng_time_min = (($("input[name='default_evening_opening_time']").val() % 1) * 60).toFixed()
//                 var evng_clsg_time_hour = parseInt($("input[name='default_evening_closing_time']").val())
//                 var evng_clsg_time_min = (($("input[name='default_evening_closing_time']").val() % 1) * 60).toFixed()
//             }

//             console.log([mrng_opng_time_hour, mrng_opng_time_min, mrng_clsg_time_hour, mrng_clsg_time_min, evng_opng_time_hour, evng_opng_time_min, evng_clsg_time_hour, evng_clsg_time_min])
//             for (let i = 0; i < 60; i++) {
//                 if ((parseInt(hour) == mrng_opng_time_hour && i < mrng_opng_time_min + 20) || (parseInt(hour) == evng_opng_time_hour && i < evng_opng_time_min + 20)) {
//                     $("#select_time_str").append(`<option value='${i}' disabled='disabled'>${str_hour(i)}</option>`);
//                 } else if ((parseInt(hour) == mrng_clsg_time_hour && i > mrng_clsg_time_min - 20) || (parseInt(hour) == evng_clsg_time_hour && i > evng_clsg_time_min - 20)) {
//                     $("#select_time_str").append(`<option value='${i}' disabled='disabled'>${str_hour(i)}</option>`);
//                 } else {
//                     $("#select_time_str").append(`<option value='${i}'>${str_hour(i)}</option>`);
//                 }
//             }
//         })
//     }
// })

// function get_schedule(domain) {
//     console.log(domain)
//     return new Promise(async(resolve) => {
//         const data = await rpc.query({
//             model: "company.work_schedule",
//             method: "search_read",
//             args: [
//                 domain, ["type_of_day", "morning_opening_time", "morning_closing_time", "evening_opening_time", "evening_closing_time"],
//             ],
//         });
//         resolve(data);
//     });
// }