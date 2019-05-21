//fateweaverAdmin-postDeleteStudentFile

//fateweaverAdmin-postDeleteStudent
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const moment = require('moment');
const fileType = require('file-type');
const sha1 = require('sha1');
var mysql = require('mysql');

var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("select * from fateweaver.student_files where id = ? and student_id in (select id from fateweaver.students where school_id = (select school_id from fateweaver.admins where cognito_id = ?)) ", [event.form.file_id, event.account.sub], function (err, results, fields) {
        if (err) {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            var row = results[0]
            var params = {
                Bucket: 'fateweaver-files',
                Key: row.path // get path
                // where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext' - full path name to your file without '/' at the beginning 
            };
            s3.deleteObject(params, function (err, data) {
                if (err)
                    context.succeed({
                        error: err,
                        stack: err.stack
                    }); // an error occurred
                else

                    connection.query("delete from fateweaver.student_files where id = ?", [event.form.file_id], function (err, results, fields) {
                        if (err) {
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error getting students :" + err
                            });
                        }
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "Deleted :" + row.name
                        });

                    });
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Can't find that file"
            });
        }
    });
}

//destination_sessions--
//mentor_assigned--
//student_files*
//From s3*
//student_interests
//student_mentor_links
//students


