var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null,event);

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select * from fateweaver.schools where id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            if (results.length > 0) {
                var schoolData = results;
                context.succeed({
                    statusCode: 200,
                    status: true,
                    schoolData: schoolData,

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








//john was here