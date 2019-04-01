var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
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

                connection.query("select * from fateweaver.student_interests where student_id = ? and interest_id = ?", [event.form.student_id, event.form.studentInfo.interest], function (err, results, fields) {
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
    });
}