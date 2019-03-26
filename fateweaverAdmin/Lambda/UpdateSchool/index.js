//postUpdateSchool

'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    //callback(null, event);
    
    var data = {
        name : event.form[0].Name,
        email : event.form[0].Email,
        logo : event.form[0].Logo,
        address_1 : event.form[0].Address1,
        address_2 : event.form[0].Address2,
        address_3 : event.form[0].Address3,
        postcode : event.form[0].Postcode,
        county : event.form[0].County,
        town : event.form[0].Town,
        country : event.form[0].Country,
    }
    //callback(null,data);
    
    var school_id;
    connection.query("select school_id from fateweaver.admins where cognito_id = ?", [event.account.sub], function (err, results, fields) {
        if (err) {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            school_id = results[0].school_id;
            
            connection.query("update fateweaver.schools set ? where id = ?", [data ,school_id], function (err, results, fields) {
                if (err) {
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

        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "You dont have access to update students"
            });
        }

    });
    
    
    

}