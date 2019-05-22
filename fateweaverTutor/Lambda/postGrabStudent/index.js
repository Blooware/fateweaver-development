//fateweaverTutor-postGrabStudent

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null,event);
    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select *, DATE_FORMAT(fateweaver.students.added, '%d/%m/%Y') as added, if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1),    (select if (DATE_FORMAT(dob, '%m') < 9, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 4 ) , (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 5 ) ))) as yearGroup, DATE_FORMAT(fateweaver.students.dob, '%Y-%m-%d') as dateOfBirth, fateweaver.tutor_groups.name as tutorGroup from fateweaver.students left join fateweaver.tutor_groups on fateweaver.tutor_groups.id=fateweaver.students.tutor_group_id where fateweaver.students.id = ? and fateweaver.students.tutor_group_id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?))", [event.form.student_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor students:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            var studentData = results;
            connection.query(" select * from fateweaver.destination_sessions where student_id = ? and student_id in (select id from fateweaver.students where tutor_group_id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?)))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor destinations:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting destinations :" + err
                    });
                }
                var destinations = results;
                connection.query("select * from fateweaver.student_files where student_id = ? and student_id in (select id from fateweaver.students where tutor_group_id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?)))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor studentFiles:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting studentFiles :" + err
                        });
                    }
                    var studentFiles = results;
                    connection.query("select fateweaver.interests.id as interest_id, fateweaver.interests.name as name from fateweaver.student_interests left join fateweaver.interests on fateweaver.interests.id=fateweaver.student_interests.interest_id where student_id = ? and student_id in (select id from fateweaver.students where tutor_group_id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?)))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                        if (err) {
                            console.log("Error getting tutor studentInterests:", err);
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error getting studentInterests :" + err
                            });
                        }
                        var studentInterests = results;

                        connection.query("select id, first_name, last_name, role, linkedin, fateweaver.mentors.added  from fateweaver.mentors where school_id = (select school_id from fateweaver.tutors where cognito_id = ? limit 1)", [event.account.sub], function (err, results, fields) {
                            if (err) {
                                console.log("Error getting tutor mentorList:", err);
                                context.succeed({
                                    statusCode: 200,
                                    status: false,
                                    errMsg: "error getting mentorList :" + err
                                });
                            }
                            var mentorList = results;
                            //assigned mentors
                            connection.query("select id, first_name, last_name, role, linkedin, fateweaver.mentors.added  from fateweaver.mentors where id in (select  mentor_id from fateweaver.mentor_assigned where student_id = ? and student_id in (select id from fateweaver.students where tutor_group_id in (select group_id from fateweaver.tutor_assigned_groups where tutor_id = (select id from fateweaver.tutors where cognito_id = ?))))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                                if (err) {
                                    console.log("Error getting tutor assignedMentors:", err);
                                    context.succeed({
                                        statusCode: 200,
                                        status: false,
                                        errMsg: "error getting assignedMentors :" + err
                                    });
                                }
                                var assignedMentors = results;

                                context.succeed({
                                    statusCode: 200,
                                    status: true,
                                    studentData: studentData,
                                    destinations: destinations,
                                    studentFiles: studentFiles,
                                    studentInterests: studentInterests,
                                    mentorList: mentorList,
                                    assignedMentors: assignedMentors,
                                });
                            });
                        });
                    });

                });
            });
        });
    });

}
