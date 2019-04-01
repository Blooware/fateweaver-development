var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});


exports.handler = (event, context, callback) => {
    var data = {
        student_id: event.form.student_id,
        aspiration: event.form.aspiration,
        destination: event.form.destination,
        industry: event.form.industry,
        plan_a: event.form.plan_a,
        plan_b: event.form.plan_b,
        confirmed_place: event.form.confirmed_place,
        notes: event.form.notes,
        added: new Date(Date.now()),
        added_id: "3001",
        csv: "Wizard",
    }

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("insert into fateweaver.destination_sessions set ? ", [data], function (err, results, fields) {
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
                body: "successfully added session"
            });
        });
    });
}








//john was here