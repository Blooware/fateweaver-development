//fateweaverAdmin-postGrabMentor

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select * from fateweaver.mentors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting mentors :" + err
                });
            }
            var mentorData = results;
            connection.query("select fateweaver.interests.id as interest_id, fateweaver.interests.name as name from fateweaver.mentor_interests left join fateweaver.interests on fateweaver.interests.id=fateweaver.mentor_interests.interest_id where mentor_id = (select id from fateweaver.mentors where id = ? and  school_id =(select school_id from fateweaver.admins where cognito_id = ? limit 1))", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting mentors :" + err
                    });
                }
                var mentorInterests = results;

                

                connection.query("select given_name, family_name, dob, gender, postcode, upn, uln, tutor_group_id, pp, sen, fateweaver.students.added, fateweaver.students.csv,  if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1),    (select if (DATE_FORMAT(dob, '%m') < 9, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 4 ) , (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 5 ) ))) as yearGroup, fateweaver.students.id as student_id, fateweaver.tutor_groups.name as tutorGroup, (select aspiration from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as aspiration, (select if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 1,((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)),((select concat('(Unconfirmed) ', aspiration) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)))) as destination from fateweaver.students left join fateweaver.tutor_groups on fateweaver.tutor_groups.id=fateweaver.students.tutor_group_id where fateweaver.students.id in (select student_id from fateweaver.mentor_assigned where mentor_id = ? and school_id =(select school_id from fateweaver.admins where cognito_id = ? limit 1))", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting mentors :" + err
                        });
                    }
                    var mentorStudents = results;

                    connection.query("select fateweaver.industries.id as industry_id, fateweaver.industries.name as name from fateweaver.mentor_industries left join fateweaver.industries on fateweaver.industries.id=fateweaver.mentor_industries.industry_id where mentor_id = (select id from fateweaver.mentors where id = ? and  school_id =(select school_id from fateweaver.admins where cognito_id = ? limit 1)) order by fateweaver.mentor_industries.added limit 1", [event.form.mentor_id, event.account.sub], function (err, results, fields) {
                        if (err) {
                            console.log("Error getting tutor groups:", err);
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error getting mentors :" + err
                            });
                        }
                        var mentorIndustries = results;

                        context.succeed({
                            statusCode: 200,
                            status: true,
                            mentorData: mentorData,
                            mentorInterests: mentorInterests,
                            mentorStudents: mentorStudents,
                            mentorIndustries : mentorIndustries,
                        });

                    });

                });
            });
        });
    });

}

