'use strict'

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const moment = require('moment');
const fileType = require('file-type');
const sha1 = require('sha1');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    //callback(null,event);


    let base64String = event.base64String;
    let buffer = new Buffer(base64String, 'base64');
    let fileMime = fileType(buffer);

    //This is where the File should be checked if its a csv
    //if (fileMime === null) {
    //    return context.fail('The string suppplied is not a file type');
    //}

    let file = getFile(fileMime, buffer);
    let params = file.params;

    s3.putObject(params, function (err, data) {
        if (err) {
            console.log(params);
            return console.log(err);
        }
        // store to sql database
        // check they have access to the event
        var inserted = {
            event_id: "3001",
            name: "event.form.name",
            //path: fileStuff.uploadFile.name,
            //file_ext: fileStuff.uploadFile.type,
            added: new Date(Date.now()),
            added_sub: "event.account.sub"

        }
        console.log(inserted)
        //console.log('File Name:', fileStuff.uploadFile.name);

        //return console.log("Console: " , fileStuff.uploadFile.name);

        /*
        var AWS = require('aws-sdk');
        var s3 = new AWS.S3();

        exports.handler = function(event, context, callback) {

        // Retrieve the bucket & key for the uploaded S3 object that
        // caused this Lambda function to be triggered
        var src_bkt = event.Records[0].s3.bucket.name;
        var src_key = event.Records[0].s3.object.key;

            // Retrieve the object
            s3.getObject({
                Bucket: src_bkt,
                Key: src_key
            }, function(err, data) {
                if (err) {  
                    console.log(err, err.stack);
                    callback(err);
                } else {
                    console.log("Raw text:\n" + data.Body.toString('ascii'));
                    callback(null, null);
                }   
            });
        };
        */
        
        s3.getObject({
                Bucket: "fateweaver-files",
                Key: file.fileFullName
            }, function(err, data) {
                if (err) {  
                    console.log(err, err.stack);
                    callback(err);
                } else {
                    console.log("Raw text:\n" + data.Body.toString('ascii'));
                    callback(null, "Raw text:\n" + data.Body.toString('ascii'));
                }   
            });
        /*
        callback(null, {
            statusCode: 200,
            status: true,

        });
        */
    });


}

let getFile = function (fileMime, buffer) {
    let hash = sha1(new Buffer(new Date().toString()));
    let now = moment().format('YYY - MM - DD HH: mm: ss');

    let fileName = hash + '.' + ".csv"; //let fileName = hash + '.' + fileExt;
    let fileFullName = fileName;
    let fileFullPath = 'bucket name' + fileFullName;

    let params = {
        Bucket: 'fateweaver-files',
        Key: fileFullName,
        Body: buffer
    };

    let uploadFile = {
        size: buffer.toString('ascii').length,
        type: "text/csv",
        name: fileName,
        full_path: fileFullPath
    };

    return {
        'params': params,
        'uploadFile': uploadFile,
        'fileFullName' : fileFullName
    };
}