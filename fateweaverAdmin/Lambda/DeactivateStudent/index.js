//fateweaverAdmin-postDeactivateStudent


var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting Admin Account :" + err
            });
        }
        if (results.length > 0) {
            var data = {
                student_id: event.form.student_id,
                added: new Date(Date.now()),
                added_id: event.account.sub
            }
            connection.query("insert into fateweaver. deactivation_log set ?", [data], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting deactivationg account :" + err
                    });
                }

                connection.query("update fateweaver.students set active = 0 where id = ? ", [event.form.student_id], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting Admin Account :" + err
                        });
                    }
                    context.succeed({
                        statusCode: 200,
                        status: true,
                        message: "deactivated student"
                    });
                });


            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Couldn't find Admin account"
            });
        }
    });
}