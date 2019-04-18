//fateweaverAdmin-postUpdateTutor

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null, event);

    connection.query("select * from fateweaver.tutors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_id, event.account.sub], function (err, results, fields) {
        if (err) {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting tutor :" + err
            });
        }
        if (results.length > 0) {
            var data = {
                title: event.form.tutorInfo.title,
                first_name: event.form.tutorInfo.first_name,
                second_name: event.form.tutorInfo.second_name,
                email: event.form.tutorInfo.email,
            }
            connection.query("update fateweaver.tutors set ? where id = ? ", [data, event.form.tutor_id], function (error, results, fields) {
                if (err) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting tutor :" + err
                    });
                } else {
                    context.succeed({
                        statusCode: 200,
                        status: true,
                        body: results,
                    });
                }

            });
        } else {

        }
    });
}