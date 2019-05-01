//fateweaverAdmin-postAssignTutorGroup


var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    /*
    callback(null,{
        tutor_id : event.form.tutor_id,
        group: event.form.tutorInfo.group_id,
        
    });
    */

    connection.query("select * from fateweaver.tutors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            var tutorInfo = results;
            console.log("stuff;: " + event.form.tutor_id + " " + event.form.tutorInfo.group_id)
            connection.query("select * from fateweaver.tutor_assigned_groups where tutor_id = ? and group_id = ?", [event.form.tutor_id, event.form.tutorInfo.group_id], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                console.log(results);
                if (results.length > 0) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "Already assigned to this group"
                    });
                } else {
                    var data = {
                        tutor_id: event.form.tutorInfo.group_id,
                        group_id: event.form.tutor_id,
                        school_id: tutorInfo[0].school_id,
                        added: new Date(Date.now()),
                        added_id: event.account.sub,
                    }
                    console.log(data);
                    connection.query("insert into fateweaver.tutor_assigned_groups set ? ", [data], function (err, results, fields) {
                        if (err) {
                            console.log("Error getting tutor groups:", err);
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error adding group :" + err
                            });
                        }
                        context.succeed({
                            statusCode: 200,
                            status: true,
                            body: results
                        });

                    });
                }
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Failed Tutor Lookup"
            });
        }

    });

}