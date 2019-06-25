//fateweaverAdmin-postAddStudentSubject

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null, event);

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
                    name : event.form.studentInfo.subject,
                    added : new Date(Date.now()),
                    added_id : event.account.sub,
                    added_school_id = results[0].school_id
                }


                connection.query("insert into fateweaver.subjects set ?", [data], function (err, results, fields) {
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
                        body: "successfully added subject"
                    });

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