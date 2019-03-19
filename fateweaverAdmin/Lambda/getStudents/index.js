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

    connection.query("select * from fateweaver.students left join fateweaver.destination_sessions on fateweaver.destination_sessions.student_id=fateweaver.students.id where school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)", [event.account.sub], function (err, results, fields) {
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
            body: results
        });
    });
}








//john was here