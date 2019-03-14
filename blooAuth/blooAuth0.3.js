/* paste these script tags in html
<script src="js/vendor/jquery-3.1.0.js"></script>
<script src="js/vendor/aws-cognito-sdk.min.js"></script>
<script src="js/vendor/amazon-cognito-identity.min.js"></script>
<script src="js/blooAuth.js"></script>
*/

var userPool;
var authToken;
var cognitoUser;
//aws account
var poolData = {
    UserPoolId: 'eu-west-2_8rW2VVDJ6',
    ClientId: '41a5q2kln7v3k856nnjqt7fble'
};

function connectToPool(poolId, clientId, callback) {
    poolData.UserPoolId = poolId;
    poolData.ClientId = clientId;
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData); -
        callback();
}



function getUser(callback) {
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
        cognitoUser.getSession(function sessionCallback(err, session) {
            if (err) {
                callback(err);
            } else if (!session.isValid()) {
                callback(null);
            } else {
                cognitoUser.getUserAttributes(function (err, result) {
                    if (err) {
                        alert(err);
                        return;
                    }
                    callback(result);
                });
            }
        });
    } else {
        callback(null);
    }
}

function forgotPassword(email){
  
    cognitoUser = createCognitoUser(email);
    cognitoUser.forgotPassword({
        onSuccess: function (result) {
            alert(result);
        },
        onFailure: function(err) {
            alert(err);
        },
        inputVerificationCode() {
            var verificationCode = prompt('Please input verification code ' ,'');
            var newPassword = prompt('Enter new password ' ,'');
            cognitoUser.confirmPassword(verificationCode, newPassword, this);
        }
    });
}

function signedIn(callback) {
    authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    authToken.then(function updateAuthMessage(token) {
        if (token) {
            callback({ success: true, token });
        } else {
            callback({ success: false });
        }
    });
}

function getIdToken(callback) {
    authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    authToken.then(function updateAuthMessage(token) {
        if (token) {
            callback({ success: true, token });
        } else {
            callback({ success: false });
        }
    });
}

function getJwtToken(callback) {
    authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    authToken.then(function updateAuthMessage(token) {
        if (token) {
            callback({ success: true, token });
        } else {
            callback({ success: false });
        }
    });
}

function signOut(callback) {
    try {
        userPool.getCurrentUser().signOut();
        callback();
    } catch (e) {
        callback();
    }
}

function signIn(email, password, onSuccess, onFailure) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    cognitoUser = createCognitoUser(email);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onFailure
    });
}

function verify(email, code, onSuccess, onFailure) {
    createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
        if (!err) {
            onSuccess(result);
        } else {
            onFailure(err);
        }
    });
}

function signUp(email, password, custom, onSuccess, onFailure) {

    if (custom.company){
        var dataCompany = {
            Name: 'custom:company',
            Value: custom.company
        };
        var attributeCompany = new AmazonCognitoIdentity.CognitoUserAttribute(dataCompany);

        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        
        userPool.signUp(email, password, [attributeEmail, attributeCompany], null,
                        function signUpCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        }
        );
        
    } else {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    
        userPool.signUp(email, password, [attributeEmail], null,
                        function signUpCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        }
        );
    }
}

/*ignore*/
function createCognitoUser(email) {
    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
}

function getUserInfo(x) {

    console.log(user);
}