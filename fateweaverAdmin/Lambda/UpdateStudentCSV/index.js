var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    //stuff
    var data = {
        age: event.Age,
        info: event.Info,
        name: event.Name,
        tutor_group_id: event.TutorGroupId,
        added: new Date(Date.now()),
    }


    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {

        connection.query("select * from fateweaver.students where id = ? ", [event.Duplicate], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
            }
            if (results.length > 0) {
                connection.query("update fateweaver.students set ? where id = ?", [data, event.Duplicate], function (err, results, fields) {
                    if (err) {
                        console.log(err)
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error updating student data at " + event.Duplicate
                        });
                    }
                    context.succeed({
                        statusCode: 200,
                        status: true,
                        body: "successfully updated student"
                    });
                });
            } else {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "Couldn't Find The Duplicate with the id of " + event.Duplicate
                });
            }
        });
    });


}








