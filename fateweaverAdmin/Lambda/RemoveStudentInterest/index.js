//fateweaverAdmin-postRemoveStudentInterest

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {


    connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)  ", [event.form.student_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            connection.query("delete from fateweaver.student_interests where student_id = ? and interest_id = ?", [event.form.student_id, event.form.interest_id, event.account.sub], function (err, results, fields) {
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
                    message: results
                });

            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Couldn't find Mentor"
            });
        }
    });

}