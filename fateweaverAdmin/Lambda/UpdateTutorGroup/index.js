//fateweaverAdmin-postUpdateTutorGroup

'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    callback(null, event);
    
    var data = {
        name: event.form.groupInfo.Name,
        description: event.form.groupInfo.Description,
    };
    
    connection.query("select * from fateweaver.tutor_groups where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_group_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
        }
        if (results.length > 0) {
            connection.query("update fateweaver.tutor_groups set ? where id = ?", [data, event.form.tutor_group_id], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                }
                context.succeed({
                    statusCode: 200,
                    status: false,
                    body : results
                });
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg : "error finding admin access"
            });
        }
    });
    
}








//john was here