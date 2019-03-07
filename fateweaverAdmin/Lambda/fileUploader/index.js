'use strict'

let csvToJson = require('convert-csv-to-json');

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
    var fields = ["Name", "Information", "More Stuff"];





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

        s3.getObject({
            Bucket: "fateweaver-files",
            Key: file.fileFullName
        }, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                callback(err);
            } else {
                if (data.Body.toString('ascii') == null) {
                    callback(null, {
                        statusCode: 200,
                        status: false,
                        errMsg: "Couldn't Detect CSV file"
                    });
                } else {
                    console.log("Raw text:\n" + data.Body.toString('ascii'));

                    var Data = csvTojs(data.Body.toString('ascii').replace("\r", "") + "*")
                    if (Data.length <= 1) {
                        callback(null, {
                            statusCode: 200,
                            status: false,
                            errMsg: "Couldn't find any data in the CSV file"
                        });
                    } else {
                        // if the data fields are not in the list then return the name of the feild that is incorrect

                        for (var i = 0; i < fields.length; i++) {
                            if (Data[0][fields[i]] != null) {
                                console.log(fields[i])
                                /*
                                callback(null, {
                                    statusCode: 200,
                                    status: true,
                                    errMsg: "could find the field named " + fields[i],
                                });
                                */
                            } else {
                                callback(null, {
                                    statusCode: 200,
                                    status: false,
                                    errMsg: "couldn't find the field named " + fields[i],
                                });
                            }
                        }

                        // For Each Row 
                        for (var i = 0; i < Data.length; i++) {
                            //console.log(Data[i].Name);
                            var set = {
                                name : Data[i].Name,
                                info : Data[i].info,
                                age : Data[i].age,
                                tutor_group_id : Data[i].tutor_group_id,
                                added : new Date(Date.now()),
                                added_id : "3001",
                            }
                            connection.query("insert into fateweaver.students set ?", [set], function (error, results, fields) {
                                connection.end(function (err) {
                                    if (err) { console.log("Error ending the connection:", err); }
                                    //  reconnect in order to prevent the"Cannot enqueue Handshake after invoking quit"
                                    connection = mysql.createConnection({
                                        host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
                                        user: 'blooware',
                                        password: 'blooware18',
                                        port: 3306
                                    });
                                    if (results.length == 0) {
                                        callback(null, {
                                            statusCode: 200,
                                            status: false,
                                            errMsg: "Couldn't find that combination "
                                        });
                                    } else {
                                        callback(null, {
                                            statusCode: 200,
                                            status: true,
                                            body: results
                                        });
                                    }
                                });
                            });

                            callback(null, {
                                    statusCode: 200,
                                    status: false,
                                    Success: Data[i].Name,
                                });
                        }

                        /*
                        var TheData = Data[0];

                        callback(null, {
                            "Raw text": "Raw text:\n" + data.Body.toString('ascii') + "*",
                            databody: data.body,
                            jsonmaybe: Data,
                            DataZero: Data[0],
                            DataZeroName: Data[0].Name,
                            DataZeroZero: Data[0][0],
                            DataZeroOne: Data[0][1],
                            TheData: TheData,
                            TheDataZero: TheData[0],
                            TheDataName: TheData.Name,
                            TheDataDotName: TheData["Name"],
                            DataName: Data[0]["Name"],
                        });
                        */
                    }


                }



            }
        });
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
        'fileFullName': fileFullName
    };

}




function csvTojs(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};

        var row = lines[i],
            queryIdx = 0,
            startValueIdx = 0,
            idx = 0;

        if (row.trim() === '') { continue; }

        while (idx < row.length) {
            /* if we meet a double quote we skip until the next one */
            var c = row[idx];

            if (c === '"') {
                do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
            }

            if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
                /* we've got a value */
                var value = row.substr(startValueIdx, idx - startValueIdx).trim();

                /* skip first double quote */
                if (value[0] === '"') { value = value.substr(1); }
                /* skip last comma */
                if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
                /* skip last double quote */
                if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }

                var key = headers[queryIdx++];
                obj[key] = value;
                startValueIdx = idx + 1;
            }

            ++idx;
        }

        result.push(obj);
    }
    return result;
}