//fateweaverTutor-newDestinationSession


var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});


exports.handler = (event, context, callback) => {

    //select * from fateweaver.students where id = ? and id in (select id from fateweaver.students where tutor_group_id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?)))

    connection.query("select * from fateweaver.students where id = ? and id in (select id from fateweaver.students where tutor_group_id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?))) ", [event.form.student_id, event.account.sub], function (err, results, fields) {
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
                student_id: event.form.student_id,
                aspiration: event.form.aspiration,
                destination: event.form.destination,
                industry: event.form.industry,
                plan_a: event.form.plan_a,
                plan_b: event.form.plan_b,
                confirmed_place: event.form.confirmed_place,
                notes: event.form.notes,
                added: new Date(Date.now()),
                added_id: event.account.sub,
                csv: "Added Manually",
            }
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
        } else {
            context.succeed({
                statusCode: 200,
                status: true,
                errMsg: "You dont have access to that student"
            });
        }


    });



}