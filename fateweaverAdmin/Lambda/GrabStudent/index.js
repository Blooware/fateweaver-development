//fateweaverAdmin-postGrabStudent
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
        connection.query("select *, DATE_FORMAT(fateweaver.students.added, '%d/%m/%Y') as added, if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1),   ( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5))) as yearGroup, DATE_FORMAT(fateweaver.students.dob, '%Y-%m-%d') as dateOfBirth, fateweaver.tutor_groups.name as tutorGroup from fateweaver.students left join fateweaver.tutor_groups on fateweaver.tutor_groups.id=fateweaver.students.tutor_group_id where fateweaver.students.id = ? and fateweaver.students.school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)", [event.form.student_id, event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            var studentData = results;
            connection.query("SELECT fateweaver.destination_sessions.id as id, aspiration, destination, fateweaver.industries.name as industry, plan_a, plan_b, confirmed_place, notes, added, csv FROM fateweaver.destination_sessions left join fateweaver.industries on fateweaver.destination_sessions.industry= fateweaver.industries.id where student_id in (select id from fateweaver.students where id = ? and  school_id = (select school_id from fateweaver.admins where cognito_id = ?)) order by id desc", [event.form.student_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                var destinations = results;
                connection.query("select * from fateweaver.student_files where student_id = (select id from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    var studentFiles = results;
                    connection.query("select fateweaver.interests.id as interest_id, fateweaver.interests.name as name from fateweaver.student_interests left join fateweaver.interests on fateweaver.interests.id=fateweaver.student_interests.interest_id where student_id = (select id from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                        if (err) {
                            console.log("Error getting tutor groups:", err);
                            context.succeed({
                                statusCode: 200,
                                status: false,
                                errMsg: "error getting students :" + err
                            });
                        }
                        var studentInterests = results;

                        connection.query("select id, first_name, last_name, role, linkedin, fateweaver.mentors.added  from fateweaver.mentors where school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)", [event.account.sub], function (err, results, fields) {
                            if (err) {
                                console.log("Error getting tutor groups:", err);
                                context.succeed({
                                    statusCode: 200,
                                    status: false,
                                    errMsg: "error getting students :" + err
                                });
                            }
                            var mentorList = results;
                            //assigned mentors
                            connection.query("select id, first_name, last_name, role, linkedin, fateweaver.mentors.added  from fateweaver.mentors where id in (select  mentor_id from fateweaver.mentor_assigned where student_id = (select id from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)))", [event.form.student_id, event.account.sub], function (err, results, fields) {
                                if (err) {
                                    console.log("Error getting tutor groups:", err);
                                    context.succeed({
                                        statusCode: 200,
                                        status: false,
                                        errMsg: "error getting students :" + err
                                    });
                                }
                                var assignedMentors = results;

                                connection.query("select id, name from fateweaver.industries", [event.account.sub], function (err, results, fields) {
                                    if (err) {
                                        console.log("Error getting tutor groups:", err);
                                        context.succeed({
                                            statusCode: 200,
                                            status: false,
                                            errMsg: "error getting students :" + err
                                        });
                                    }
                                    var industries = results;

                                    getNEETScore(event, function(neetScore, neetCauses){
                                        context.succeed({
                                            statusCode: 200,
                                            status: true,
                                            studentData: studentData,
                                            destinations: destinations,
                                            studentFiles: studentFiles,
                                            studentInterests: studentInterests,
                                            mentorList: mentorList,
                                            assignedMentors: assignedMentors,
                                            industries: industries,
                                            neetScore,
                                            neetCauses
                                        });
                                    })

                                });
                            });
                        });
                    });

                });
            });
        });
    });

}



function getNEETScore(event, callback){
    connection.query("select fateweaver.students.id, given_name, family_name, school_id, ( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) as smartYear, if((( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) = 13), (7 - month(NOW())), if(( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) > 13, 0 ,(((14 - ( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5))) * 12) - 12) + (7 - month(NOW())))) as monthsLeftSmart, if(((14 * 12) - (year * 12)) = 12, (7 - month(NOW())), ((14 * 12) - (year * 12))) as monthsLeft, if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1), (select if (DATE_FORMAT(dob, '%m') < 9, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 4 ) , (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 5 ) ))) as yearGroup, (select count(*) from fateweaver.student_interests where student_id = fateweaver.students.id) as loggedInterests, (select TIMESTAMPDIFF(MONTH, NOW(), fateweaver.destination_sessions.added) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as timeSinceLastSession, (select if((select count(*) from fateweaver.destination_sessions where student_id = fateweaver.students.id) > 0, if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 0, 1, 0) , 0)) as confirmedPlace, (select count(*) from fateweaver.mentor_assigned where student_id = fateweaver.students.id) as assignedMentors from fateweaver.students where school_id =  (select school_id from fateweaver.admins where cognito_id = ?) and fateweaver.students.id = ?", [event.account.sub, event.form.student_id], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students"
            });
        }

        callback(calcNeetScore(results[0].monthsLeftSmart,results[0].loggedInterests,results[0].timeSinceLastSession, results[0].confirmedPlace, results[0].assignedMentors)[0], calcNeetScore(results[0].monthsLeftSmart,results[0].loggedInterests,results[0].timeSinceLastSession, results[0].confirmedPlace, results[0].assignedMentors)[1]);

    });
}


function calcNeetScore(timeleft, loggedInterests, timeSinceLastSession, confirmedPlace, assignedMentors) {

    var causes = [];
        var priority = 0;
    
        if (timeleft < 6) {
            priority += 6;
            causes.push({problem: timeleft + " months left", solution:"Needs a confirmed destination."});
            
        }
    
        if (loggedInterests < 1) {
            priority += 2;
            causes.push({problem:"Not enough interests.", solution:"Find more interests"});
        } else {
            priority += 0;
        }
    
        if (timeleft < 12) {
            priority += 12 - (timeleft + (timeSinceLastSession / 3));//value out of 12
            
        }
    
        if (assignedMentors < 1) {
            priority += 1;
            causes.push({problem:"No assigned mentors.", solution:"Find a mentor"});
        }
    
        //highest score is 20, above a 10 is considered high risk
        if (confirmedPlace != 1) {
            if (priority >= 12) {
                console.log("High priority " + priority);
                return [priority,causes];
            } else {
                return [priority,causes];
            }
        } else {
         
            return [0,causes];
        }
    }

