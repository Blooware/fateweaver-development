//fateweaverAdmin-postRemoveStudentMentor

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    /*
    context.succeed({
        event : event,
    });
    */
   console.log("start");
   console.log(event.form.mentor_id);
   console.log(event.form.student_id);
    connection.query("select * from fateweaver.mentors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                
                if (results.length > 0) {
                    connection.query("delete from fateweaver.mentor_assigned where student_id = ? and mentor_id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.form.mentor_id, event.account.sub], function (err, results, fields) {
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
                            message: "Deleted Assigned Mentor"
                        });
                        
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