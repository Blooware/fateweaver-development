'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    //callback(null,event);

    connection.query("select *, fateweaver.tutor_groups.name as tutorGroup from fateweaver.students left join fateweaver.tutor_groups on fateweaver.tutor_groups.id=fateweaver.students.tutor_group_id where fateweaver.students.id = ? and fateweaver.students.school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)", [event.form.student_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        var studentData = results;
        connection.query("select * from fateweaver.destination_sessions where student_id in (select id from fateweaver.students where id = ? and  school_id = (select school_id from fateweaver.admins where cognito_id = ?)) order by id desc", [event.form.student_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            var destinations = results;
            connection.query("select * from fateweaver.student_files where student_id = (select id from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                var studentFiles = results;


                context.succeed({
                    statusCode: 200,
                    status: true,
                    studentData: studentData,
                    destinations: destinations,
                    studentFiles: studentFiles,
                });

            });
        });
    });

}








//john was here