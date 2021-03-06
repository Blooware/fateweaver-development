var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null, event.form.student_id);
    var Year = null;
    var YearAdded = null;
    var school_id;
    if (event.form.studentInfo.year == "" || event.form.studentInfo.year == null) {
        Year = null;
        YearAdded = null;
    } else {
        Year = event.form.studentInfo.year;
        YearAdded = new Date(Date.now());
    }


    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {

        var TutorGroupsAdded = [];
        connection.query("select * from fateweaver.students where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.student_id, event.account.sub], function (err, results, fields) {
            if (err) {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }
            if (results.length > 0) {
                //callback(null,results);

                school_id = results[0].school_id

                //do the tutor group stuff
                connection.query("select * from fateweaver.tutor_groups where name = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.studentInfo.tutorGroup, event.account.sub], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                    }

                    if (results.length == 0) {
                        var dataGroup = {
                            name: event.form.studentInfo.tutorGroup,
                            description: "Auto Generated By Upload",
                            added: new Date(Date.now()),
                            added_id: event.account.sub,
                            csv: "added Manually",
                            school_id: school_id
                        }
                        connection.query("insert into fateweaver.tutor_groups set ? ", dataGroup, function (error, results, fields) {

                            console.log("Student added - There Wasn't a tutor Group");
                            console.log(results.insertId);
                            //now create a student using this group id
                            TutorGroupsAdded.push(event.form.studentInfo.tutorGroup);
                            updateStudent(results.insertId);

                        });
                    } else {
                        console.log("Student added - There Was a tutor Group");
                        console.log(results[0].id);
                        updateStudent(results[0].id);
                        //now create a student using this group id
                    }
                });

            } else {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "You dont have access to update students"
                });
            }

        });
        function updateStudent(Group_id) {
            var data = {
                given_name: event.form.studentInfo.givenName,
                family_name: event.form.studentInfo.familyName,
                dob: event.form.studentInfo.dob,
                gender: event.form.studentInfo.gender,
                postcode: event.form.studentInfo.postcode,
                upn: event.form.studentInfo.upn,
                uln: event.form.studentInfo.uln,
                tutor_group_id: Group_id,
                pp: event.form.studentInfo.pp,
                sen: event.form.studentInfo.sen,
                year: Year,
                year_added: YearAdded,

                added: new Date(Date.now()),
                added_id: event.account.sub,
            }
            connection.query("update fateweaver.students set ? where id = ?", [data, event.form.student_id], function (err, results, fields) {
                if (err) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                context.succeed({
                    statusCode: 200,
                    status: true,
                    body: results,
                    TutorGroupsAdded: TutorGroupsAdded
                });
            });

        }

    });
}