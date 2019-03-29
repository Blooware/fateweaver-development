var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    
    event.response.autoConfirmUser = true;

    // Set the email as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty("email")) {
        event.response.autoVerifyEmail = true;
    }
    
    console.log(event);
    //console.log("AddedSub: " + event.request.userAttributes.AddedSub);
    //console.log("Sub: " + event.request.userAttributes.AddedSub.sub);
    //console.log("Sub: " + event.request.userAttributes['custom:addedSub']);
    connection.query("select * from fateweaver.blooware_admins where cognito_id = ?", [event.request.userAttributes['custom:addedSub']], function (err, results, fields) {
        if (err) {
            console.log("i got an error");
            console.log("Error getting tutor groups:", err);
        }
        if(results.length > 0){
            //console.log("i should be calling back??");
            //callback(null, event);
            context.succeed(event);
            
        } else {
            console.log("Not verified account???");
            callback("Not Verified to make accounts");
        }
    });
    
    
    
    // Confirm the user
    
    /*
    // Set the phone number as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty("phone_number")) {
        event.response.autoVerifyPhone = true;
    }
    */

    // Return to Amazon Cognito
    
};