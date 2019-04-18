//fateweaverAdmin-postGrabTutor


var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select title, first_name, second_name, email, added from fateweaver.tutors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            if (results.length > 0) {
                var tutorInfo = results;
                connection.query("select id, name, description, added from fateweaver.tutor_groups where school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.account.sub], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    var tutorGroups = results;
                    context.succeed({
                        statusCode: 200,
                        status: true,
                        tutorInfo: tutorInfo,
                        tutorGroups: tutorGroups,
                    });

                });
            } else {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "Failed School Lookup"
                });
            }

        });
    });
}