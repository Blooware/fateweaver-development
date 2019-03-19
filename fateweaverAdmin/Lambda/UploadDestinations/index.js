'use strict'

//TODO : add school_id
//TODO : Added_id


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

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    //callback(null,event);
    var fields = ["UPN", "Aspiration", "Destination", "Industry", "Plan A", "Plan B", "Confirmed Place", "Notes"];

    //callback(null, fields[0]);


    let base64String = event.form.base64String;
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
                    var JsonData = csvTojs(data.Body.toString('ascii').replace("\r", "") + "*")
                    if (JsonData.length <= 1) {
                        callback(null, {
                            statusCode: 200,
                            status: false,
                            errMsg: "Couldn't find any data in the CSV file"
                        });
                    } else {
                        processFields(fields, JsonData);
                    }
                }
            }
        });
    });

    var Added = [];
    var notAdded = [];
    var TutorGroupsAdded = [];
    //callback(null, "List");
    function delay() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    async function delayedJsonData(item) {
        // This is where i would add them to mysql
        var dset = {
            UPN : item["UPN"],
            aspiration : item["Aspiration"],
            destination : item["Destination"],
            industry : item["Industry"],
            plan_a : item["Plan A"],
            plan_b : item["Plan B"],
            confirmed_place : item["Confirmed Place"],
            notes : item["Notes"],

            added: new Date(Date.now()),
            added_id: event.account.sub,
            csv: file.fileFullName
        };
        console.log("Now adding a Destination for a student???");

        connection.query("select * from fateweaver.students where upn = ?", [item["UPN"]], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
            }
            if(results.length > 0){
                var jsonDestination = {
                    student_id : results[0].id,
                    aspiration : item["Aspiration"],
                    destination : item["Destination"],
                    industry : item["Industry"],
                    plan_a : item["Plan A"],
                    plan_b : item["Plan B"],
                    confirmed_place : item["Confirmed Place"],
                    notes : item["Notes"],
                    added: new Date(Date.now()),
                    added_id: event.account.sub,
                    csv: file.fileFullName
                }
                connection.query("insert into fateweaver.destination_sessions set ?", [jsonDestination], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        notAdded.push({dset});
                    }

                    Added.push({dset});
                });
            } else {
                notAdded.push({dset});
            }
        });
        /*
        connection.query("select * from fateweaver.tutor_groups where name = ?", [item["Tutor Group"]], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
            }

            if (results.length == 0) {
                var dataGroup = {
                    name: item["Tutor Group"],
                    description: "Auto Generated By Upload",
                    added: new Date(Date.now()),
                    added_id: "3001",
                    csv: file.fileFullName
                }
                connection.query("insert into fateweaver.tutor_groups set ? ", dataGroup, function (error, results, fields) {

                    console.log("Student added - There Wasn't a tutor Group");
                    console.log(results.insertId);
                    //now create a student using this group id
                    TutorGroupsAdded.push(item["Tutor Group"]);
                    createStudent(results.insertId, item, file);

                });
            } else {
                console.log("Student added - There Was a tutor Group");
                console.log(results[0].id);
                createStudent(results[0].id, item, file);
                //now create a student using this group id

            }
        });
        */

        await delay();

    }
    async function processJsonData(array) {
        for (const item of array) {
            await delayedJsonData(item);
        }


        console.log("Finished Itterating");
        context.succeed({
            Done: Added,
            NotDone: notAdded,

        });
    }



    function delay() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    async function delayedFields(field, JsonData) {

        if (JsonData[0][field] != null) {
            console.log(field);
        } else {


            callback(null, {
                statusCode: 200,
                status: false,
                errMsg: "couldn't find the field named " + field,
            });
        }
        console.log(JsonData)
        await delay();
        console.log(fields);
    }
    async function processFields(array, JsonData) {
        for (const item of array) {
            await delayedFields(item, JsonData);
        }
        console.log("Finished Itterating through the fields");
        console.log("Now i would do this json data :")
        console.log(JsonData);
        processJsonData(JsonData);
        //Now process the students

    }

    async function createStudent(Group_id, StudentInfo, file) {


        var dset = {
            given_name: StudentInfo["Given Name"],
            family_name: StudentInfo["Family Name"],
            dob: StudentInfo.DOB,
            postcode: StudentInfo.Postcode,
            upn: StudentInfo.UPN,
            uln: StudentInfo.ULN,
            tutor_group_id: Group_id,
            gender: StudentInfo.Gender,
            pp: StudentInfo.PP,
            sen: StudentInfo.SEN,


            added: new Date(Date.now()),
            added_id: event.account.sub,
            csv: file.fileFullName
        }

        connection.query("select * from fateweaver.students where given_name = ? and postcode = ? and upn = ?  ", [StudentInfo["Given Name"], StudentInfo.Postcode, StudentInfo.UPN], function (error, results, fields) {
            if (results.length > 0) {
                //append to Not added
                var jsonStudent = {
                    given_name: StudentInfo["Given Name"],
                    family_name: StudentInfo["Family Name"],
                    dob: StudentInfo.DOB,
                    postcode: StudentInfo.Postcode,
                    upn: StudentInfo.UPN,
                    uln: StudentInfo.ULN,
                    tutor_group_id: Group_id,
                    Duplicate: results[0].id,
                    TutorGroupId: Group_id,
                    gender: StudentInfo.Gender,
                    pp: StudentInfo.PP,
                    sen: StudentInfo.SEN,
                }
                notAdded.push({ jsonStudent });
            } else {
                connection.query("insert into fateweaver.students set ?", [dset], function (error, results, fields) {
                    var jsonStudent = {
                        given_name: StudentInfo["Given Name"],
                        family_name: StudentInfo["Family Name"],
                        dob: StudentInfo.DOB,
                        postcode: StudentInfo.Postcode,
                        upn: StudentInfo.UPN,
                        uln: StudentInfo.ULN,
                        tutor_group_id: Group_id,
                        gender: StudentInfo.Gender,
                        pp: StudentInfo.PP,
                        sen: StudentInfo.SEN,
                    }
                    Added.push({ jsonStudent });
                    console.log(results);
                });

            }
        });

        console.log(Group_id);
        console.log(StudentInfo);
    }


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