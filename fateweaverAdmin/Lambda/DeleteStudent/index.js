'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    //callback(null, event);
    var school_id;
    connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
        if (err) {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            //callback(null,results);

            school_id = "*" + results[0].school_id + "*"

            connection.query("update fateweaver.students set school_id = ? where id = ?", [school_id, event.form.student_id], function (err, results, fields) {
                if (err) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                context.succeed({
                    statusCode: 200,
                    status: true,
                    body: results,
                });
            });
            
            
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "You dont have access to update students"
            });
        }

    });
    

}



