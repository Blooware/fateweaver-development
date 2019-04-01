
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require("aws-sdk");
global.fetch = require('node-fetch');

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user":  process.env.user,
    "password":  process.env.password,
    "port":  
    process.env.port
});

exports.handler = (event, context, callback) => {
    console.log(event);
    //callback(null, event);

    
    var poolData = {
        UserPoolId: 'eu-west-2_9yPc9js2X',
        ClientId: '4atq7kp8m6ibv56d3cgjbudhim'
    };

    // The FateweaverAdminUserpool

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: event.form.email
    };
    var dataPhoneNumber = {
        Name: 'phone_number',
        Value: '+15555555555'
    };

    
    var dataaddedSub = {
        Name : "custom:addedSub",
        Value : event.account.sub
    };
    var attributeaddedSub = new AmazonCognitoIdentity.CognitoUserAttribute(dataaddedSub);
    attributeList.push(attributeaddedSub);
    
   
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);

    
    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    //TODO this should be a temport password
    console.log(attributeList);

    userPool.signUp(event.form.email, event.form.password, attributeList, null, function (err, result) {

        if (err) {
            console.log(err);
            return;
        }

        //cognitoUser = result.user;
        console.log(JSON.stringify(result.userSub));

        var data = {
            email: event.form.email,
            cognito_id: result.userSub,
            added: new Date(Date.now()),
            added_id: event.account.sub,
            school_id: event.form.school_id
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
                status: true,
                body: results,

            });
        });
    });
}

    
    