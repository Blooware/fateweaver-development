//fateweaverTutor-postAssignStudentMentor


var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

   console.log("start");
   console.log(event.form.mentorAssign.Mentors);
   console.log(event.form.student_id);
    connection.query("select * from fateweaver.tutor_assigned_groups where group_id = (select tutor_group_id from fateweaver.students where id = ?) and tutor_id = (select id from fateweaver.tutors where cognito_id = ? )", [event.form.student_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.tutors where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                
                if (results.length > 0) {
                    var school_id = results[0].school_id;
                    
                    console.log(
                        event.form.student_id + " " +  event.form.mentorAssign.Mentors + " " + event.account.sub
                    );
                    
                    connection.query("select * from fateweaver.mentor_assigned where student_id = ? and mentor_id = ? and school_id = (select school_id from fateweaver.tutors where cognito_id = ?)", [event.form.student_id, event.form.mentorAssign.Mentors, event.account.sub], function (err, results, fields) {
                        if (err) {
                            console.log("Error getting tutor groups:", err);
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error getting students :" + err
                            });
                        }
                        console.log("length : " + results.length);
                        if (results.length > 0) {
                            //Dont add to database
                            
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "Already Assigned to this Mentor"
                            });
                            
                        }
                        else {
                            
                            var data = {
                                student_id: event.form.student_id,
                                mentor_id: event.form.mentorAssign.Mentors,
                                school_id: school_id,
                                added: new Date(Date.now()),
                                added_id: event.account.sub,
                            }
                            connection.query("insert into fateweaver.mentor_assigned set ? ", [data], function (err, results, fields) {
                                if (err) {
                                    console.log("Error getting tutor groups:", err);
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
                            
                        }
                        
                    });
                    
                } else {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "Couldn't find Student"
                    });
                }
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Couldn't find Mentor"
            });
        }
    });
}