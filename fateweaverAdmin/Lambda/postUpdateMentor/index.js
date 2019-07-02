//fateweaverAdmin-postUpdateMentor

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null, event);

    connection.query("select * from fateweaver.mentors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
        if (err) {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting Mentor :" + err
            });
        }
        if (results.length > 0) {


            var data = {
                role: event.form.mentorInfo.role,
                first_name: event.form.mentorInfo.firstName,
                last_name: event.form.mentorInfo.lastName,
            }
            console.log(data);
            connection.query("update fateweaver.mentors set ? where id = ?", [data, event.form.mentor_id], function (error, results, fields) {
                if (error) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting Mentor :" + error
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