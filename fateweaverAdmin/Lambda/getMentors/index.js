var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("SELECT id, first_name, last_name, role, linkedin, added FROM fateweaver.mentors where school_id = (select school_id from fateweaver.admins where cognito_id = ?) order by id desc", [event.account.sub], function (err, results, fields) {
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
                body: results
            });
        });
    });
}








