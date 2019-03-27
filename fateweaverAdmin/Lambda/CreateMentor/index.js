'use strict'
//TODO check school_id 
//TODO add school_id
//TODO Added_id

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {

    connection.query("select * from fateweaver.admins where cognito_id = ? ", [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }
        if (results.length > 0) {
            var data = {
                first_name: event.firstName,
                last_name: event.lastName,
                school_id: results[0].school_id,
                role: event.role,
                linkedin: event.linkedin,
                added: new Date(Date.now()),
                added_id: event.account.sub,
            }

            connection.query("insert into fateweaver.mentors set ? ", [data], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error adding that mentor err :" + err
                    });
                }

                context.succeed({
                    statusCode: 200,
                    status: true,
                    body: "successfully added mentor"
                });
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "can't find admin account"
            });
        }
    });
    /*

    
    
    var data = {
        first_name: event.firstName,
        last_name: event.lastName,
        school_id: "3005",
        role: event.role,
        linkedin: event.linkedin,
        added: new Date(Date.now()),
        added_id: event.account.sub,
    }

    connection.query("insert into fateweaver.mentors set ? ", [data], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }

        context.succeed({
            statusCode: 200,
            status: true,
            body: "successfully added mentor"
        });
    });
    */
}








//john was here