
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '35.246.18.23',
    user: 'root',
    password: 'Kx49g2teJq4vuIcK',
    port: 3306
});

connection.query("select * from fateweaver.upload_progress", [], function (error, results, fields) {
  
  console.log(results.length);
});