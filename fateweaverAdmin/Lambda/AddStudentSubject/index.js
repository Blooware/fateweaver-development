//fateweaverAdmin-postAddStudentSubject

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null, event);
    connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }
        if (results.length > 0) {
            var studentData = results[0];
            connection.query("select * from fateweaver.subjects where name = ? ", [event.form.studentInfo.subject], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error adding that mentor err :" + err
                    });
                }
                if (results.length > 0) {
                    student_subject(results[0].id, event.form.student_id);
                } else {
                    var data = {
                        name: event.form.studentInfo.subject,
                        added: new Date(Date.now()),
                        added_id: event.account.sub,
                        added_school_id: studentData.school_id,
                    }


                    connection.query("insert into fateweaver.subjects set ?", [data], function (err, results, fields) {
                        if (err) {
                            console.log("Error getting tutor groups:", err);
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error adding that mentor err :" + err
                            });
                        }
                        student_subject(results.insertId, event.form.student_id);
                    });
                }
                function student_subject(id, student_id) {
                    connection.query("select * from fateweaver.student_subjects where subject_id = ? and student_id = ? and finished is null", [id, student_id], function (err, results, fields) {
                        if (err) {
                            console.log("Error getting tutor groups:", err);
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error adding that Subject err :" + err
                            });
                        }
                        if (results.length > 0) {
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "You are already studdying that"
                            });
                            
                        } else {
                            var data = {
                                student_id: student_id,
                                subject_id: id,
                                added: new Date(Date.now()),
                            }
                            connection.query("insert into fateweaver.student_subjects set ?", [data], function (err, results, fields) {
                                if (err) {
                                    console.log("Error getting tutor groups:", err);
                                    context.succeed({
                                        statusCode: 200,
                                        status: false,
                                        errMsg: "error adding that Subject err :" + err
                                    });
                                }
                                context.succeed({
                                    statusCode: 200,
                                    status: true,
                                    body: "successfully added subject"
                                });
                            });
                        }
                    });
                }

            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "couldn't find admin account"
            });
        }
    });



}