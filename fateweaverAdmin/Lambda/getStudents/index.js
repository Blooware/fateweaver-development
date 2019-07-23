var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});
var util = require('util');

exports.handler = (event, context, callback) => {

    connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", [event.account.sub], function (err, results, fields) {

        connection.query("select *, if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1),    (select if (DATE_FORMAT(dob, '%m') < 9, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 4 ) , (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 5 ) ))) as yearGroup, fateweaver.students.id as student_id, fateweaver.tutor_groups.name as tutorGroup, (select aspiration from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as aspiration, (select if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 1,((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)),((select concat('(Unconfirmed) ', aspiration) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)))) as destination from fateweaver.students left join fateweaver.tutor_groups on fateweaver.tutor_groups.id=fateweaver.students.tutor_group_id where fateweaver.students.school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1);", [event.account.sub], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error getting students :" + err
                });
            }

            /*
            const util = require('util');

            const query = util.promisify(connection.query).bind(connection);

            (async () => {
                try {
                    const rows = await query('SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = 25;');
                    console.log(rows);
                    
                } finally {
                    (async () => {
                        try {
                            const rows = await query('SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = 26;');
                            console.log(rows);
                        } finally {
                            console.log("Finished first one??");

                            (async () => {
                                try {
                                    const rows = await query('SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = 27;');
                                    console.log(rows);
                                } finally {
                                    console.log("Finished second one??");
                                    //connection.end();
                                }
                            })()

                            //connection.end();
                        }
                    })()
                    console.log("Fully Finished??");
                    //connection.end();
                }
            })()
            */
           
            

            
            

            
            /*
            processJsonData(NewJson);

            async function processJsonData(array) {
                var count = -1;
                for (const item of array) {
                    console.log("Item is :" + item);
                    count = count + 1
                    console.log("Count: " + count);
                    await delayedJsonData(item, count);
                }
                console.log("Finished");
                console.log(NewJson);
                
            }

            async function delayedJsonData(key, count) {

                console.log(count);
                console.log(key.student_id);
                console.log("Student_id : " + NewJson[count].student_id);
                console.log("name : " + NewJson[count].given_name + " " + NewJson[count].family_name);
                //console.log(key);
                
                (async () => {
                    try {
                        const rows = await query('SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = 27;');
                        
                        console.log(rows);
                        NewJson[count].Interests = rows
                    } finally {
                        console.log("Finished second one??");
                        
                        //connection.end();
                    }
                })()

                console.log("Done json adder??");
            


            }

            */
            /*
            async function JsonAdder(count) {

                connection.query("SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = ?;", [NewJson[count].student_id], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    console.log("Got data for :" + NewJson[count].student_id);
                    console.log(results);
                    NewJson[count].Interests = results;

                });
            }
            */


            /*

                connection.query("SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = ?;", [NewJson[0].student_id], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    console.log("2");
                    console.log(results);
                    NewJson[0].Interests = results;

                });

            console.log(NewJson)
            */
            /*
            context.succeed({
                statusCode: 200,
                status: true,
                body: NewJson,
                //tutor_groups: results
            });
            */



            /*
            var NewJson = [];
            
            NewJson = results;
            //NewJson[0].Interests = {"name": "Interest1", "id" : "1" }
            
            for(var i = 0; i < results.length; i++){
                console.log(NewJson[i].student_id);
                //run a sql statment for the data and then add it here
                
                connection.query("SELECT * FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = ?;", [NewJson[i].student_id], function (err, results, fields) {
                    if (err) {
                        console.log("Error getting tutor groups:", err);
                        context.succeed({
                            statusCode: 200,
                            status: false,
                            errMsg: "error getting students :" + err
                        });
                    }
                    console.log(results);
                    NewJson[i].Interests = results;
    
                });
                
            }
            console.log(NewJson);
            */
            
            var studentInfo = results;
            
            connection.query("select id, name, description, added, csv from fateweaver.tutor_groups where school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1)", [event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                
                
                
                
                context.succeed({
                    statusCode: 200,
                    status: true,
                    body: studentInfo,
                    tutor_groups: results
                });
    
            });
    
            
        });
    });

}