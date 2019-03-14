var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com', 
    user     : 'blooware',
    password : 'blooware18',
    port     :  3306
});


exports.handler = (event, context, callback) => {
    //callback(null,"Hello");
    
    connection.query("select *, fateweaver.students.name as studentName from fateweaver.articles left join fateweaver.students on fateweaver.students.id = fateweaver.articles.student_id where student_id = ?",event.id, function (error, results, fields) {
        connection.end( function(err) {
            if (err) {console.log("Error ending the connection:",err);}
    //  reconnect in order to prevent the"Cannot enqueue Handshake after invoking quit"
            connection = mysql.createConnection({
            host     : 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com', 
            user     : 'blooware',
            password : 'blooware18',
            port     :  3306
            });
            callback(null, {
                statusCode: 200,
                body: results
            });
        });
    });
};
