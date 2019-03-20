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
    //callback(null,event.base64String);
    //callback(null,event);

    
    let request = event.body;
    let base64String = event.form.base64String;
    let buffer = new Buffer(base64String, 'base64');
    let fileMime = fileType(buffer);

    if (fileMime === null) {
        return context.fail('The string suppplied is not a file type');
    }

    let file = getFile(fileMime, buffer);
    let params = file.params;

    var fileStuff = file;

    s3.putObject(params, function (err, data) {
        if (err) {
            console.log(params);
            return console.log(err);
        }
        // store to sql database
        // check they have access to the event

        connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [ event.form.student_id, event.account.sub], function (error, results, fields) {
            connection.end(function (err) {
                if (err) { console.log("Error ending the connection:", err); }
                //  reconnect in order to prevent the"Cannot enqueue Handshake after invoking quit"
                connection = mysql.createConnection({
                    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
                    user: 'blooware',
                    password: 'blooware18',
                    port: 3306
                });
                if(results.length > 0){
                    var inserted = {
                        student_id : results[0].id,
                        name : event.form.name,
                        path : fileStuff.uploadFile.name,
                        file_ext : fileStuff.uploadFile.type,
                        added : new Date(Date.now()),
                        added_id : event.account.sub

                    }
                    console.log(inserted);

                    connection.query("insert into fateweaver.student_files set ? ", [inserted], function (error, results, fields) {
                        connection.end(function (err) {
                            if (err) { console.log("Error ending the connection:", err); }
                            //  reconnect in order to prevent the"Cannot enqueue Handshake after invoking quit"
                            connection = mysql.createConnection({
                                host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
                                user: 'blooware',
                                password: 'blooware18',
                                port: 3306
                            });

                            console.log(results);
                            console.log('File Name:', fileStuff.uploadFile.name);
                            //return console.log("Console: " , fileStuff.uploadFile.name);
                            callback(null,{
                                statusCode: 200,
                                status: true,
                                body: results
                            });
                        });
                    });
                } else {
                    callback(null,{
                        statusCode: 200,
                        status: false,
                        errMsg: "you dont have access to this student"
                    });
                }
            });
        });
    });


}

let getFile = function (fileMime, buffer) {
    let fileExt = fileMime.ext;
    let hash = sha1(new Buffer(new Date().toString()));
    let now = moment().format('YYY - MM - DD HH: mm: ss');

    let fileName = hash + '.' + fileExt;
    let fileFullName = fileName;
    let fileFullPath = 'bucket name' + fileFullName;

    let params = {
        Bucket: 'fateweaver-files',
        Key: fileFullName,
        Body: buffer
    };

    let uploadFile = {
        size: buffer.toString('ascii').length,
        type: fileMime.mime,
        name: fileName,
        full_path: fileFullPath
    };

    return {
        'params': params,
        'uploadFile': uploadFile
    };
}