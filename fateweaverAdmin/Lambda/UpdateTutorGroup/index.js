var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null, event);

    var data = {
        name: event.form.groupInfo.Name,
        description: event.form.groupInfo.Description,
    };

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select * from fateweaver.tutor_groups where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_group_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
            }
            if (results.length > 0) {
                connection.query("update fateweaver.tutor_groups set ? where id = ?", [data, event.form.tutor_group_id], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                    }
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        body: results
                    });
                });
            } else {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error finding admin access"
                });
            }
        });
    });

}








//john was here