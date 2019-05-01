//fateweaverAdmin-postCreateTutor


var mysql = require('mysql');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var AWS = require("aws-sdk");
global.fetch = require('node-fetch');

var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    //console.log(event);
    //callback(null, event);
    var school_id;

    console.log("Before the session");
    
    connection.query("select * from fateweaver.admins where cognito_id = ?", [event.account.sub], function (err, results, fields) {
        console.log("This");
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error adding that mentor err :" + err
            });
        }
        if (results.length > 0) {
            school_id = results[0].school_id;
            connection.query("select * from fateweaver.tutors where email = ?", [event.form[0].email], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error :" + err
                    });
                }
                if (results.length > 0) {
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "Someone with that email already exists"
                    });
                } else {
                    //Do the stuff
                    begin();

                }
            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error You dont have permission"
            });
        }
    });



    function begin() {
        var poolData = {
            UserPoolId: 'eu-west-2_bXvoN04Fk',
            ClientId: '70esqgdtmbq0ao3u2a1lqo0dre'
        };

        // The FateweaverAdminUserpool

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: event.form[0].email
        };
        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: '+15555555555'
        };


        var dataaddedSub = {
            Name: "custom:addedSub",
            Value: event.account.sub
        };
        var attributeaddedSub = new AmazonCognitoIdentity.CognitoUserAttribute(dataaddedSub);
        attributeList.push(attributeaddedSub);


        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);


        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);
        //TODO this should be a temport password
        console.log(attributeList);
        console.log(event.form[0].password);
        console.log("Should sign up")
        userPool.signUp(event.form[0].email, event.form[0].password, attributeList, null, function (err, result) {

            if (err) {
                context.succeed({
                    statusCode: 200,
                    status: false,
                    errMsg: err
                });
            }

            //cognitoUser = result.user;
            console.log(JSON.stringify(result.userSub));

            var data = {
                email: event.form[0].email,
                cognito_id: result.userSub,
                added: new Date(Date.now()),
                added_id: event.account.sub,
                school_id: school_id,
                first_name : event.form[0].first_name,
                second_name : event.form[0].second_name,
                title : event.form[0].title,


            }
            console.log(data);
            connection.query("insert into fateweaver.tutors set ? ", [data], function (err, results, fields) {
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

}


