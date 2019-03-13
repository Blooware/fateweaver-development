'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    var data = {
        age: event.Age,
        info: event.Info,
        name: event.Name,
        tutor_group_id: event.TutorGroupId,
        added : new Date(Date.now()),
    }

    connection.query("select * from fateweaver.students where name = ? and info = ? and age = ? and id = ? ", [event.Name, event.Info, event.Age, event.Duplicate], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
        }
        if (results.length > 0){
            connection.query("update fateweaver.students set ? where id = ?", [data, event.Duplicate], function (err, results, fields) {
                if (err) {
                    console.log(err)
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg : "error updating student data at " + event.Duplicate
                    });
                }
                context.succeed({
                    statusCode: 200,
                    status: true,
                    body : "successfully updated student"
                });
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg : "Couldn't Find The Duplicate with the id of " + event.Duplicate
            });
        }
    });
}








//john was here