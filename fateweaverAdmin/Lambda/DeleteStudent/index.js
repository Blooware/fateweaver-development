//fateweaverAdmin-postDeleteStudent
var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    var school_id;

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
            if (err) {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            if (results.length > 0) {
                //destination_sessions
                connection.query("delete from fateweaver.destination_sessions where student_id = ?", [event.form.student_id], function (err, results, fields) {
                    if (err) {
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    //mentor_assigned
                    connection.query("delete from fateweaver.mentor_assigned where student_id = ?", [event.form.student_id], function (err, results, fields) {
                        if (err) {
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error getting students :" + err
                            });
                        }
                        //student_files
                        //For each file delete it from s3
                        

                    
                    });
                });

                //destination_sessions--
                //mentor_assigned--
                //student_files*
                //From s3*
                //student_intrests
                //student_mentor_links
                //students




            } else {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "You dont have access to update students"
                });
            }

        });
    });


}



