//fateweaverAdmin-postGrabInsights

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //callback(null,event);
    connection.query("select * from fateweaver.schools where id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            var schoolData = results;
            connection.query("select (1) as NEET_Students, (5) as NEET_Percentage, (7) as gapYear_Students, (46) as gapYear_Percentage, (86) as confirmed_Students, (32) as confirmed_Percentage, (96) as  Uni_Students, (21) as Uni_Percentage, (54) as  Apprentice_Students, (9) as Apprentice_Percentage, (17) as  FE_Students, (9) as FE_Percentage, (11) as  Job_Students, (7) as Job_Percentage", [event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error getting students :" + err
                    });
                }
                var insightData = results[0];
                context.succeed({
                    statusCode: 200,
                    status: true,
                    insightData: insightData,
                });
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Failed School Lookup"
            });
        }

    });

}
