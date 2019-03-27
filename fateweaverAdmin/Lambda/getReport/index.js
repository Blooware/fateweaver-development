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
var randomstring = require("randomstring");

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
exports.handler = (event, context, callback) => {

    connection.query(`select given_name as 'Given Name', family_name as 'Family Name', dob as 'DOB', postcode as 'Postcode', null as 'Learner Phone Number', upn as 'UPN', uln as 'ULN', (select if(length((select destination from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 1,((select destination from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)),(if((length((select concat('(Unconfirmed) ', aspiration) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 0), (select concat('(Unconfirmed) ', aspiration) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1),"ID08 Not obtained")))) as 'Intended Destination' from fateweaver.students where school_id = (select school_id from fateweaver.admins where cognito_id = ?)`, [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }


        var name = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
        });

      
        putObjectToS3("fateweaver-files", name + ".csv", ConvertToCSV(JSON.stringify(results)), function () {
            /* context.succeed({
                 statusCode: 200,
                 status: true,
                 body: ConvertToCSV(JSON.stringify(results))
             });*/

            var params = {
                "Bucket": "fateweaver-files",
                "Key": name + ".csv"
            };
            s3.getObject(params, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/CSV"
                        },
                        "body": JSON.stringify(data),
                        "isBase64Encoded": false
                    };
                   // console.log("Ready to callback");
                  //  callback(null, response);
                    
        context.succeed(data);
                    
                }
            });
        })

    });
}


function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    str += 'Given Name, Family Name, DOB, Postcode, Learner Phone Number, UPN, ULN, Intended Destination' + '\r\n';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function putObjectToS3(bucket, key, data, callback) {
   
    var params = {
        Bucket: bucket,
        Key: key,
        Body: data
    }
    s3.putObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        }
        else {
            console.log("Success adding file");
            callback();

        }
    });

}



//john was here