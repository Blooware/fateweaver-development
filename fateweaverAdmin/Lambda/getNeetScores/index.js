var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {
        connection.query("select fateweaver.students.id, given_name, family_name, school_id, if(((14 * 12) - (year * 12)) = 12, (7 - month(NOW())), ((14 * 12) - (year * 12))) as monthsLeft, (select count(*) from fateweaver.student_interests where student_id = fateweaver.students.id) as loggedInterests, (select time_to_sec(timediff(NOW(), fateweaver.destination_sessions.added)) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as timeSinceLastSession, (select if((select count(*) from fateweaver.destination_sessions where student_id = fateweaver.students.id) > 0, if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 0, 1, 0) , 0)) as confirmedPlace, (select count(*) from fateweaver.mentor_assigned where student_id = fateweaver.students.id) as assigned_mentors from fateweaver.students where school_id = (select school_id from fateweaver.admins where cognito_id = ?) ", [event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students"
                });
            }

            context.succeed({
                statusCode: 200,
                status: true,
                body: results
            });
        });
    });

}
/*select fateweaver.students.id, given_name, family_name, school_id, if(((14 * 12) - (year * 12)) = 12, (7 - month(NOW())), ((14 * 12) - (year * 12))) as monthsLeft, (select count(*) from fateweaver.student_interests where student_id = fateweaver.students.id) as loggedInterests, (select time_to_sec(timediff(NOW(), fateweaver.destination_sessions.added)) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as timeSinceLastSession, (select if((select count(*) from fateweaver.destination_sessions where student_id = fateweaver.students.id) > 0, if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 0, 1, 0) , 0)) as confirmedPlace, (select count(*) from fateweaver.mentor_assigned where student_id = fateweaver.students.id) as assigned_mentors from fateweaver.students  */
function calcNeetScore(timeleft, loggedInterests, timeSinceLastSession, confirmedPlace, assignedMentors) {

    var priority = 0;

    if (timeleft < 6) {
        priority += 6;
    }

    if (loggedInterests < 1) {
        priority += 2;
    } else {
        priority += 0;
    }

    if (timeleft < 12) {
        priority += 12 - (timeleft + (timeSinceLastSession / 3));//value out of 12
    }

    if (assignedMentors < 1) {
        priority += 1;
    }

    //highest score is 20, above a 10 is considered high risk
    if (confirmedPlace != true) {
        if (priority >= 12) {
            console.log("High priority " + priority);
            return priority;
        } else {
            return priority;
        }
    } else if (confirmedPlace) {
        return priority;
    }
}








//john was here