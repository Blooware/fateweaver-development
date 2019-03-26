'use strict'

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
exports.handler = (event, context, callback) => {
   var params = {
        "Bucket": "fateweaver-files",
        "Key": event.form.name
    };  
    s3.getObject(params, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            /*let response = {
                "statusCode": 200,
                "headers": {
                    "Content-Type": event.file_ext
                },
                "body": JSON.stringify(data),
                "isBase64Encoded": false
            };*/

            context.succeed(data);

        }
    });
}