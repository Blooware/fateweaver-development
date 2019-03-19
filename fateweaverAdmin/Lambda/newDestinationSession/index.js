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
    var data = {
        student_id: event.student_id,
        aspiration: event.aspiration,
        destination: event.destination,
        industry: event.industry,
        plan_a: event.plan_a,
        plan_b: event.plan_b,
        confirmed_place: event.confirmed_place,
        notes: event.notes,
        added: new Date(Date.now()),
        added_id: "3001",
        csv: "Wizard",
    }

    connection.query("insert into fateweaver.destination_sessions set ? ", [data], function (err, results, fields) {
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
            body: "successfully added session"
        });
    });
}








//john was here