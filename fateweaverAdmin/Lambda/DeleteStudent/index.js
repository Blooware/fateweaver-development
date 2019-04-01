var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    var school_id;

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
            if (err) {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            if (results.length > 0) {
                school_id = "*" + results[0].school_id + "*";
                connection.query("update fateweaver.students set school_id = ? where id = ?", [school_id, event.form.student_id], function (err, results, fields) {
                    if (err) {
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    context.succeed({
                        statusCode: 200,
                        status: true,
                        body: results,
                    });
                });


            } else {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "You dont have access to update students"
                });
            }

        });
    });


}



