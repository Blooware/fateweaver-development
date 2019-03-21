'use strict'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    //callback(null,event);


    var required = ["givenName", "familyName", "bod", "gender", "postcode", "upn", "uln", "tutorGroup", "pp", "sen"]

    console.log(Object.keys(event.form[0]));
    var keys = Object.keys(event.form[0]);

    //callback(null, keys);

    processJsonData(keys);

    async function processJsonData(array) {
        for (const item of array) {
            console.log("Item is :" + item);
            await delayedJsonData(item);
        }
        console.log("Finished Checks");



        var school_id;



        var TutorGroupsAdded = [];
        var Added = [];
        var notAdded = [];

        connection.query("select * from fateweaver.admins where cognito_id = ? limit 1", [event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
            }
            school_id = results[0].school_id;
            console.log("School : " + school_id);


            connection.query("select * from fateweaver.tutor_groups where name = ? and school_id = ?", [event.form[0].tutorGroup, school_id], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                }

                if (results.length == 0) {
                    var dataGroup = {
                        name: event.form[0].tutorGroup,
                        description: "Auto Generated By Upload",
                        added: new Date(Date.now()),
                        added_id: event.account.sub,
                        csv: "Added Manually",
                        school_id: school_id
                    }
                    connection.query("insert into fateweaver.tutor_groups set ? ", dataGroup, function (error, results, fields) {

                        console.log("Student added - There Wasn't a tutor Group");
                        console.log(results.insertId);
                        //now create a student using this group id
                        TutorGroupsAdded.push(event.form[0].tutorGroup);
                        createStudent(results.insertId, event.form);

                    });
                } else {
                    console.log("Student added - There Was a tutor Group");
                    console.log(results[0].id);
                    createStudent(results[0].id, event.form);
                    //now create a student using this group id

                }
            });
        });
        function delay() {
            return new Promise(resolve => setTimeout(resolve, 300));
        }
        function createStudent(Group_id, StudentInfo, file) {

            var dset = {
                given_name: event.form[0].givenName,
                family_name: event.form[0].familyName,
                dob: event.form[0].dob,
                postcode: event.form[0].postcode,
                upn: event.form[0].upn,
                uln: event.form[0].uln,
                tutor_group_id: Group_id,
                gender: event.form[0].gender,
                pp: event.form[0].pp,
                sen: event.form[0].sen,
                school_id: school_id,

                added: new Date(Date.now()),
                added_id: event.account.sub,
                csv: "Added Manually"
            }


            connection.query("select * from fateweaver.students where given_name = ? and family_name = ? and postcode = ? and upn = ? and school_id = ?  ", [event.form[0].givenName, event.form[0].familyName, event.form[0].postcode, event.form[0].upn, school_id], function (error, results, fields) {
                if (results.length > 0) {
                    context.succeed({
                        status: false,
                        errmsg: "didn't add Found a duplicate",
                    });
                } else {

                    connection.query("insert into fateweaver.students set ?", [dset], function (error, results, fields) {

                        context.succeed({
                            status: true,
                            body: results,
                            //TutorGroupsAdded : TutorGroupsAdded
                        });
                        console.log(results);

                    });

                }
            });

            console.log(Group_id);
            console.log(StudentInfo);

        }
        //stuff

    }
    async function delayedJsonData(key) {
        console.log(key);
        if (required.includes(key) == true) {
            //console.log(required.hasOwnProperty("familyName"));
            console.log(event.form[0][key])
            if ((event.form[0][key] == null) || (event.form[0][key] == "")) {
                context.succeed({
                    status: false,
                    required: key
                });
            } else {
                console.log("checked " + key);
            }

        } else {
            console.log("checked " + key);
        }

    }



}