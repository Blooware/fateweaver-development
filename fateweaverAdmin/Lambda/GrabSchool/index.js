//fateweaverAdmin-postGrabSchool

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

    connection.query("select * from fateweaver.schools where id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            var schoolData = results;
            context.succeed({
                statusCode: 200,
                status: true,
                schoolData: schoolData,
                
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Failed School Lookup"
            });
        }

    });

}








//john was here