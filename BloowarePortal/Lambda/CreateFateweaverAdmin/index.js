//TODO check the current sub against the subs in the database for blooware admins
//TODO send an email with the temporary password
var mysql = require('mysql');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require("aws-sdk");
global.fetch = require('node-fetch');

var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    console.log(event);
    
    /*
    connection.query("select * from fateweaver.schools", [data], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }
        if(results.length > 0){
            // do the stuff
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "you dont have access to add an account"
            });
        }
    });
    */


    var poolData = {
        UserPoolId: 'eu-west-2_9yPc9js2X',
        ClientId: '4atq7kp8m6ibv56d3cgjbudhim'
    };

    // The FateweaverAdminUserpool

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: event.email
    };
    var dataPhoneNumber = {
        Name: 'phone_number',
        Value: '+15555555555'
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    //TODO this should be a temport password

    userPool.signUp(event.email, event.password, attributeList, null, function (err, result) {
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        //console.log('user name is ' + cognitoUser.getUsername());
        var data = {
            email: event.email,
            cognito_id: "3001",
            added: new Date(Date.now()),
            school_id: event.school_id
        }
        connection.query("insert into fateweaver.admins set ?", [data], function (err, results, fields) {
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
                status: false,
                errMsg: "you dont have access to add an account"
            });
        });


        /*
        callback(null, {
           //username: cognitoUser.getUsername(),
           event : event
        });
        */

    });


}
