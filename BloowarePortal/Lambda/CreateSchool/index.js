'use strict'
//TODO check school_id 
//TODO add school_id
//TODO Added_id

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    console.log(event);
    callback(null, event.form[0]);

    var data = {
        name: event.form[0].name,
        description: event.form[0].description,
        added: new Date(Date.now()),
        added_id: event.account.sub
    }
    connection.query("select * from fateweaver.schools", [data], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }
        context.succeed({
            statusCode: 200,
            status: true,
            body: results
        });
    });

}








