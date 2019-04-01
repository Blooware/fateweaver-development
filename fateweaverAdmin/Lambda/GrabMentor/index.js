var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
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
                    mentorInterests: mentorInterests,
                });
            });
        });
    });

}



//john was here