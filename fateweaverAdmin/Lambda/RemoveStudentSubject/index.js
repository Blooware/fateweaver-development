//fateweaverAdmin-postRemoveStudentSubject


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
                finished : new Date(Date.now()),
            }

            connection.query("update fateweaver.student_subjects set ? where student_id = ? and subject_id = ? and finished is null", [data, event.form.student_id, event.form.subject_id], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error updating :" + err
                    });
                }
                context.succeed({
                    statusCode: 200,
                    status: true,
                    message: "Removed Subject"
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