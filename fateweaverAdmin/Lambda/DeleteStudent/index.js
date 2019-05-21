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
    var school_id;

    connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
        if (err) {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {

            //Try to delete the files first
            //
            connection.query("select * from fateweaver.student_files where student_id = ?", [event.form.student_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }

                //delete files asyncronusly
                deleteFiles(results)
                async function deleteFiles(array) {
                    for (const item of array) {
                        await deleteFile(item);
                    }
                    console.log("Done");
                    deleteTheRest();
                    //Continue Deleting Stuff
                }
                async function deleteFile(item) {

                    console.log("Deleteing" + item.name);
                    var params = {
                        Bucket: 'fateweaver-files',
                        Key: item.path // get path
                        // where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext' - full path name to your file without '/' at the beginning 
                    };
                    s3.deleteObject(params, function (err, data) {
                        if (err)
                            context.succeed({
                                error: err,
                                stack: err.stack
                            }); // an error occurred
                        else
                            console.log("deleting id :" + item.id)
                        connection.query("delete from fateweaver.student_files where id = ? and student_id = ?", [item.id, event.form.student_id], function (err, results, fields) {
                            if (err) {
                                context.succeed({
                                    statusCode: 200,
                                    status: false,
                                    errMsg: "error getting students :" + err
                                });
                            }
                            console.log("delted id : " + item.id);
                        });
                    });
                }

            });

        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "You dont have access to Delete this student"
            });
        }

    });
    function deleteTheRest() {
        console.log("Now im deleting the rest");
        //destination_sessions
        
        connection.query("delete from fateweaver.destination_sessions where student_id = ?", [event.form.student_id], function (err, results, fields) {
            if (err) {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            //mentor_assigned
            connection.query("delete from fateweaver.mentor_assigned where student_id = ?", [event.form.student_id], function (err, results, fields) {
                if (err) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                //student_interests
                connection.query("delete from fateweaver.student_interests where student_id = ?", [event.form.student_id], function (err, results, fields) {
                    if (err) {
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    //student_mentor_links
                    connection.query("delete from fateweaver.student_mentor_links where student_id = ?", [event.form.student_id], function (err, results, fields) {
                        if (err) {
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error getting students :" + err
                            });
                        }
                        connection.query("delete from fateweaver.students where id = ?", [event.form.student_id], function (err, results, fields) {
                            if (err) {
                                context.succeed({
                                    statusCode: 200,
                                    status: false,
                                    errMsg: "error getting students :" + err
                                });
                            }
                        });
                    });
                });
            })
        });
        

    }


}

//destination_sessions--
//mentor_assigned--
//student_files*
//From s3*
//student_interests
//student_mentor_links
//students


