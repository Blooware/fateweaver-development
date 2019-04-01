var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select * from fateweaver.admins where cognito_id = ? ", [event.account.sub], function (err, results, fields) {
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
                    first_name: event.form.firstName,
                    last_name: event.form.lastName,
                    school_id: results[0].school_id,
                    role: event.form.role,
                    linkedin: event.form.linkedin,
                    added: new Date(Date.now()),
                    added_id: event.account.sub,
                }

                connection.query("insert into fateweaver.mentors set ? ", [data], function (err, results, fields) {
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
                        body: "successfully added mentor"
                    });
                });
            } else {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "can't find admin account"
                });
            }
        });
    });
}








//john was here