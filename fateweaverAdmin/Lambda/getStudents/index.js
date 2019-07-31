var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user":  process.env.user,
    "password":  process.env.password,
    "port":  process.env.port
});
var util = require('util');

exports.handler = (event, context, callback) => {
    
    
    // node native promisify
    const query = util.promisify(connection.query).bind(connection);
    var rows1;
    var rows2;
    //var totalRows = [{ "name":"Student1", "Interests" : [{"Name" : "Acting"}, {"Name" : "Dancing"}] } ,{"name":"Student2"}];
    //var totalRows = [{ "name":"Student1"}, {"name":"Student2"}];
    var totalRows;
    //console.log(totalRows);
    console.log(event.account.sub);
    var count = -1;



    (async () => {
        try {
            const rows = await query("select fateweaver.schools.name as school_name, active, given_name, family_name, dob, gender, fateweaver.students.postcode, upn, uln, tutor_group_id, pp, sen, fateweaver.students.added, fateweaver.students.csv, if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1),    (select if (DATE_FORMAT(dob, '%m') < 9, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 4 ) , (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 5 ) ))) as yearGroup, fateweaver.students.id as student_id, fateweaver.tutor_groups.name as tutorGroup, (select aspiration from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as aspiration, (select if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 1,((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)),((select concat('(Unconfirmed) ', aspiration) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)))) as destination from fateweaver.students left join fateweaver.schools on fateweaver.students.school_id=fateweaver.schools.id left join fateweaver.tutor_groups on fateweaver.tutor_groups.id=fateweaver.students.tutor_group_id where fateweaver.students.school_id = (select school_id from fateweaver.admins where cognito_id = '" + event.account.sub + "' limit 1)");
            console.log(rows);
            totalRows = rows;
            //totalRows.push(rows);
            console.log("Length of rows1:" + totalRows.length);
            console.log("rows1");
            // for rows do an async call
            //when done print totalRows
            processJsonData(totalRows);
            async function processJsonData(array) {
                for (const item of array) {
                    count += 1;
                    console.log("Item is :" + item);
                    await delayedJsonData(item, count);
                }
                console.log("Finished Checks");
                console.log(totalRows);
                
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
                        body: totalRows,
                        tutor_groups: results
                    });
        
                });
                
            }

            /*
            (async () => {
                try {
                    const rows = await query('SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = 25 ;');
                    console.log(rows);
                    //totalRows.push(rows);
                    rows2 = rows;
                    console.log("rows2");
                    console.log(rows1);
                    console.log(rows2);
                    totalRows[0].Interests = rows;
                    console.log(totalRows);

                    




                } finally {
                    console.log("Finally1");
                    
                    connection.end();


                }
            })()
            */
        } finally {
            console.log("Finally2");
            
            //connection.end();
        }
    })()

    async function delayedJsonData(student, count) {
        console.log(student);
        console.log("Count:" + count);
        console.log("Id:" + student.student_id);
        console.log("Name:" + student.family_name);
        
        await (async () => {
            try {
                const rows = await query('SELECT interest_id, name, fateweaver.student_interests.added FROM fateweaver.student_interests left join fateweaver.interests on fateweaver.student_interests.interest_id = fateweaver.interests.id where fateweaver.student_interests.student_id = "' + student.student_id + '" ;');
                console.log(rows);
                //totalRows.push(rows);
                rows2 = rows;
                console.log("rows2");
                totalRows[count].Interests = rows;
                //console.log(totalRows);
                
                (async () => {
                    try {
                        const rows = await query('SELECT fateweaver.subjects.name, fateweaver.subjects.added, fateweaver.subjects.id FROM fateweaver.student_subjects left join fateweaver.subjects on fateweaver.student_subjects.subject_id = fateweaver.subjects.id where fateweaver.student_subjects.student_id = "' + student.student_id + '" and finished is null ;');
                        console.log(rows);
                        //totalRows.push(rows);
                        rows2 = rows;
                        console.log("rows2");
                        totalRows[count].Subjects = rows;
                        //console.log(totalRows);
        
                    } finally {
                        console.log("Finallyxxx:" + count);
                        
                        //connection.end();
        
        
                    }
                })()
                

            } finally {
                console.log("Finallyzzz:" + count);
                
                //connection.end();


            }
        })()

    }
    
    
    /*
    connection.query("select active, given_name, family_name, dob, gender, postcode, upn, uln, tutor_group_id, pp, sen, fateweaver.students.added, fateweaver.students.csv, if (fateweaver.students.year is not null , if((DATE_FORMAT(now(), '%m')) < 9, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year, DATE_FORMAT(now(), '%y') - DATE_FORMAT(year_added, '%y') + fateweaver.students.year + 1),    (select if (DATE_FORMAT(dob, '%m') < 9, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 4 ) , (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) - 5 ) ))) as yearGroup, fateweaver.students.id as student_id, fateweaver.tutor_groups.name as tutorGroup, (select aspiration from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1) as aspiration, (select if(length((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)) > 1,((select confirmed_place from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)),((select concat('(Unconfirmed) ', aspiration) from fateweaver.destination_sessions where student_id = fateweaver.students.id order by id desc limit 1)))) as destination from fateweaver.students left join fateweaver.tutor_groups on fateweaver.tutor_groups.id=fateweaver.students.tutor_group_id where fateweaver.students.school_id = (select school_id from fateweaver.admins where cognito_id = ? limit 1);", [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
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
    */
}



/*
context.succeed({
            statusCode: 200,
            status: true,
            body: results
        });
        */