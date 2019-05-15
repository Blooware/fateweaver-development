//fateweaverAdmin-postAssignStudentMentor



var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    
    context.succeed({
        event : event,
    });

    
    //assign them to a student / mentor new mysql table


    
}