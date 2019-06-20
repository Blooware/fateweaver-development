var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select fateweaver.students.id, given_name, family_name, school_id, ( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) as smartYear, if((( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) = 13), (7 - month(NOW())), if(( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) > 13, 0 ,(((14 - ( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5))) * 12) - 12) + (7 - month(NOW())))) as monthsLeftSmart, if(((14 * 12) - (year * 12)) = 12, (7 - month(NOW())), ((14 * 12) - (year * 12))) as monthsLeft, if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1), (select if (DATE_FORMAT(dob, '%m') < 9, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 4 ) , (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 5 ) ))) as yearGroup, (select count(*) from fateweaver.student_interests where student_id = fateweaver.students.id) as loggedInterests, (select TIMESTAMPDIFF(MONTH, NOW(), fateweaver.destination_sessions.added) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as timeSinceLastSession, (select if((select count(*) from fateweaver.destination_sessions where student_id = fateweaver.students.id) > 0, if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 0, 1, 0) , 0)) as confirmedPlace, (select count(*) from fateweaver.mentor_assigned where student_id = fateweaver.students.id) as assignedMentors from fateweaver.students where school_id =  (select school_id from fateweaver.admins where cognito_id = ?) and if((( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) = 13), (7 - month(NOW())), if(( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5)) > 13, 0 ,(((14 - ( if ((if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))) = 1, ((if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))) - year(dob)) - 6, (if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now())) - year(dob)) - 5))) * 12) - 12) + (7 - month(NOW())))) != 0", [event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students"
                });
            }

            var final = [];

            for(i = 0; i < results.length; i++){
                var x = results[i];
                x.neetScore = calcNeetScore(results[i].monthsLeft,results[i].loggedInterests,results[i].timeSinceLastSession, results[i].confirmedPlace, results[i].assignedMentors)[0];
                x.neetCauses = calcNeetScore(results[i].monthsLeft,results[i].loggedInterests,results[i].timeSinceLastSession, results[i].confirmedPlace, results[i].assignedMentors)[1];

                final.push(x);
            }


            context.succeed({
                statusCode: 200,
                status: true,
                body: final
            });
        });
    });

}
/*select fateweaver.students.id, given_name, family_name, school_id, if(((14 * 12) - (year * 12)) = 12, (7 - month(NOW())), ((14 * 12) - (year * 12))) as monthsLeft, (select count(*) from fateweaver.student_interests where student_id = fateweaver.students.id) as loggedInterests, (select time_to_sec(timediff(NOW(), fateweaver.destination_sessions.added)) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as timeSinceLastSession, (select if((select count(*) from fateweaver.destination_sessions where student_id = fateweaver.students.id) > 0, if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 0, 1, 0) , 0)) as confirmedPlace, (select count(*) from fateweaver.mentor_assigned where student_id = fateweaver.students.id) as assigned_mentors from fateweaver.students  */
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








//john was here