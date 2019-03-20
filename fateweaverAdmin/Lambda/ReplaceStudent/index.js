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
    connection.query("select school_id from fateweaver.admins where cognito_id = ?", [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            var data = {
                given_name: event.form[0].studentData.given_name,
                family_name: event.form[0].studentData.family_name,
                dob: event.form[0].studentData.dob,
                gender: event.form[0].studentData.gender,
                postcode: event.form[0].studentData.postcode,
                upn: event.form[0].studentData.upn,
                uln: event.form[0].studentData.uln,
                tutor_group_id: event.form[0].studentData.tutor_group_id,
                pp: event.form[0].studentData.pp,
                sen: event.form[0].studentData.sen,
                added: new Date(Date.now()),
                added_id: event.account.sub,
                csv: "Replaced",
                school_id: results[0].school_id,
            }

            connection.query("update fateweaver.students set ? where id = ? ", [data, event.form[0].studentData.Duplicate], function (err, results, fields) {
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
                });
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Couldn't find admin account"
            });
        }
    });

}








//john was here