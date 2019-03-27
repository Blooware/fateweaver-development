//fateweaverAdmin-postAddStudentInterest
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

    connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
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
                student_id: event.form.student_id,
                interest_id: event.form.studentInfo.interest,
                added: new Date(Date.now()),

            }

            connection.query("select * from student_interests where student_id = ? and interest_id = ?", [event.form.student_id, event.form.studentInfo.interest], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error adding that mentor err :" + err
                    });
                }
                if (results.length > 0) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "Student already has this interest"
                    });
                } else {
                    connection.query("insert into fateweaver.student_interests set ?", [data], function (err, results, fields) {
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
                            body: "successfully added intrest"
                        });

                    });
                }
            });


        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "couldn't find admin account"
            });
        }
    });


}
/*context.succeed({
            statusCode: 200,
            status: true,
            body: "successfully added mentor"
        });
        */







//john was here