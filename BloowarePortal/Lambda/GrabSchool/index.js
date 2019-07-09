//Bloowarefateweaver-postGrabSchool

'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    connection.query("select * from fateweaver.schools where id = ?", [event.form.school_id], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }
        var schoolInfo = results;
        connection.query("select  *, if ((select count(student_id) from fateweaver.deactivation_log where student_id = fateweaver.students.id ) >= 1, (if((SELECT active FROM fateweaver.deactivation_log where student_id = fateweaver.students.id order by added desc limit 1) = 0, (select DATE_FORMAT(date('1970-12-31 23:59:59') + interval -1* (if((select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where student_id = fateweaver.students.id and active = 1) is null , UNIX_TIMESTAMP(added) , (select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where student_id = fateweaver.students.id and active = 1) + unix_timestamp(added) )- (select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where active = 0 and student_id =  fateweaver.students.id)) second,'%j days %Hh:%im:%ss') as time_Active2) , (select DATE_FORMAT(date('1970-12-31 23:59:59') + interval -1* (( (select UNIX_TIMESTAMP(added)  - unix_timestamp())+ (select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where student_id = fateweaver.students.id and active = 1))- (select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where active = 0 and student_id =  fateweaver.students.id))second,'%j days %Hh:%im:%ss') as time_Active2))), (select DATE_FORMAT(date('1970-12-31 23:59:59') + interval (UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(added))  second,'%j days %Hh:%im:%ss') as time_Active1))as timeActive from fateweaver.students where school_id = ? ", [event.form.school_id], function (err, results, fields) {
        
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "err :" + err,
                    school_id : event.form.school_id
                });
            }
            var studentList = results


            context.succeed({
                statusCode: 200,
                status: true,
                body: schoolInfo,
                studentList : studentList,
                chargable_students: "Not yet implimented",
            });
        });
    });
    
}