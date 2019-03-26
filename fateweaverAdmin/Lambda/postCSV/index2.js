'use strict'

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

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const moment = require('moment');
const fileType = require('file-type');
const sha1 = require('sha1');

var numberOfStudents = 0;

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

var connection2 = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

async function insertData(NewData, file) {
    var x = await insertTutorGroup(NewData, file);
    //x = results.insertId
    console.log("Completed creation of students and Tutor Groups (If needed)");

}

exports.handler = (event, context, callback) => {


    setTimeout(function () {
        callback(null, {
            statusCode: 200,
            status: false,
            //Success: Data[i].Name,
            Counted: numberOfStudents,
            specialties: "the number of duplicates"
        });
    }, 3000)

    var fields = ["Name", "Info", "Age", "TutorGroup"];

    let base64String = event.base64String;
    let buffer = new Buffer(base64String, 'base64');
    let fileMime = fileType(buffer);
    let file = getFile(fileMime, buffer);
    let params = file.params;

    s3.putObject(params, function (err, data) {
        if (err) {
            console.log(params);
            return console.log(err);
        }

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
                                console.log(fields[i]);
                            } else {
                                callback(null, {
                                    statusCode: 200,
                                    status: false,
                                    errMsg: "couldn't find the field named " + fields[i],
                                });
                            }
                        }

                        // For Each Row 

                        numberOfStudents = Data.length;
                        for (var i = 0; i < Data.length; i++) {
                            insertData(Data[i], file);

                        }

                    }
                }
            }
        });
    });


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
function insertTutorGroup(NewData, file) {
    return new Promise(resolve => {
        var x = NewData.TutorGroup;
        //resolve(null);


        connection2.query("select * from fateweaver.tutor_groups where name = ?", [x], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
            }


            if (results.length == 0) {
                var dataGroup = {
                    name: x,
                    description: "Auto Generated By Upload",
                    added: new Date(Date.now()),
                    added_id: "3001",
                    csv: file.fileFullName
                }
                connection2.query("insert into fateweaver.tutor_groups set ? ", dataGroup, function (error, results, fields) {

                    CreateStudent(results.insertId, NewData, file.fileFullName, function () {

                        console.log("Student added - There Wasn't a tutor Group");
                    });

                });
            } else {

                CreateStudent(results[0].id, NewData, file.fileFullName, function () {
                    console.log("Student added - There Was a tutor Group");

                    resolve(null);
                });

            }
        });

    });

}

/**/
function CreateStudent(Group_id, Data, fileFullName, callback2) {
    var dset = {
        name: Data.Name,
        info: Data.Info,
        age: Data.Age,
        tutor_group_id: Group_id,
        added: new Date(Date.now()),
        added_id: "3001",
        csv: fileFullName
    }
    console.log(dset);
    connection.query("insert into fateweaver.students set ?", [dset], function (error, results, fields) {

        callback2();

    });
}