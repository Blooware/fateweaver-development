//fateweaverAdmin-postGrabTutorGroups

'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    //callback(null,event);
    connection.query("select * from fateweaver.tutor_groups where school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        context.succeed({
            statusCode: 200,
            status: true,
            body : results
        });

    });

}








//john was here