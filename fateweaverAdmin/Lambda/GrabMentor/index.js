//fateweaverAdmin-postGrabMentor
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

    connection.query("select * from fateweaver.mentors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting mentors :" + err
            });
        }
        var mentorData = results;
        connection.query("select fateweaver.interests.id as interest_id, fateweaver.interests.name as name from fateweaver.mentor_interests left join fateweaver.interests on fateweaver.interests.id=fateweaver.mentor_interests.interest_id where mentor_id = (select id from fateweaver.mentors where id = ? and  school_id =(select school_id from fateweaver.admins where cognito_id = ? limit 1))", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting mentors :" + err
                });
            }
            var mentorInterests = results;
            context.succeed({
                statusCode: 200,
                status: true,
                mentorData: mentorData,
                mentorInterests : mentorInterests,
            });


        
    });

}



/*context.succeed({
            statusCode: 200,
            status: true,
            mentorData: mentorData,
        });*/




//john was here