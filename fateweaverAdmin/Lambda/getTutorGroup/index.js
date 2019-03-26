//fateweaverAdmin-postGrabSchool

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
                    students : students,
                    
                });

            });

            /*
            context.succeed({
                statusCode: 200,
                status: true,
                groupData: groupData,
                
            });
            */
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Failed School Lookup"
            });
        }

    });
    

}








//john was here