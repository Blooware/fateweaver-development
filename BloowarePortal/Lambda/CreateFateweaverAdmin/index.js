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
    //callback(null, event);
    
    
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
        Value: event.form.email
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

    userPool.signUp(event.form.email, "Event.form.password2!", attributeList, null, function (err, result) {
        if (err) {
            context.succeed({
                statusCode: 200,
                status: false,
                err : err,
                erroris : "The error is here1"
            });
            return;
        }
        cognitoUser = result.user;
        console.log("Stuff" + cognitoUser);
        var CognitoDataStuff;
        callback(null, {
            cognitoUser: cognitoUser,
            results : results,
            resultssub : results.sub,
        })
        //console.log('user name is ' + cognitoUser.getUsername());
        /*
        cognitoUser.getUserAttributes(function(err, result) {

            if (err) {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    err : err,
                    erroris : "The error is here2"
                });
            }
            CognitoDataStuff = result;

            var data = {
                email: event.form.email,
                cognito_id: "result.user.sub",
                added: new Date(Date.now()),
                added_id : event.account.sub,
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
                    body : results,
                    User : cognitoUser,
                    CognitoDataStuff : CognitoDataStuff
    
                });
            });
            
        });
        */
        

        


        
        
        

    });
    
    


}
