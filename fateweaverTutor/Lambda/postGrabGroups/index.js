//fateweaverTutor-postGrabGroups

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null,event);
    connection.query("select id, name, description, added  from  fateweaver.tutor_groups where id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?))  ", [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        var groups = results;
        context.succeed({
            statusCode: 200,
            status: true,
            groups : groups
        });
    });
};


