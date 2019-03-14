var mysql = require('mysql');
var bcrypt = require('bcryptjs');

var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});


exports.handler = (event, context, callback) => {
    //callback(null,event.customerName);

    
    
    /*encrypt password*/
    
    var salt = bcrypt.genSaltSync(10); //salt does a thing
    var encryptedPassword = bcrypt.hashSync(event.password, salt); //generate encrypted password
    
    var data = {
        name: event.name,
        email: event.email,
        password: encryptedPassword,
        added: new Date(Date.now()),
        user: event.user
    }
    
    connection.query("insert into fateweaver.schools set ?", [data], function (error, results, fields) {
        connection.end(function (err) {
            if (err) { console.log("Error ending the connection:", err); }
            //  reconnect in order to prevent the "Cannot enqueue Handshake after invoking quit"
            connection = mysql.createConnection({
                host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
                user: 'blooware',
                password: 'blooware18',
                port: 3306
            });
            callback(null, {
                statusCode: 200,
                body: results
            });
        });
    });

};
