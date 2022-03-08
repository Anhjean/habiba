$(document).ready(function() {
    odoo.define('habiba_custom.script', function(require) {
        // "use strict";
        var rpc = require('web.rpc')

        if ($('.o_job_infos span.o_force_ltr')) { $('.o_job_infos span.o_force_ltr').text('Location: ' + $('.o_job_infos span.o_force_ltr').text()) }
        if ($('.o_job_infos .deadline span')) { $('.o_job_infos .deadline span').text('Deadline of application: ' + $('.o_job_infos .deadline span').text()) }

    });

});