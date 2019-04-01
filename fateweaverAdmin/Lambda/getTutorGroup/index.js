var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select * from fateweaver.tutor_groups where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_group_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            if (results.length > 0) {
                var groupData = results;
                connection.query("select * from fateweaver.students where tutor_group_id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_group_id, event.account.sub], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    var students = results;
                    context.succeed({
                        statusCode: 200,
                        status: true,
                        groupData: groupData,
                        students: students,

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








//john was here