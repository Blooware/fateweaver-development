//fateweaverAdmin-getIndustries

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
        connection.query("select * from fateweaver.industries", [], function (err, results, fields) {
            if (err) {
                console.log("Error getting tutor groups:", err);
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: "error adding that mentor err :" + err
                });
            }
            context.succeed({
                statusCode: 200,
                status: true,
                body: results
            });
        });
}