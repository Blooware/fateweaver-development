var added_sub = "Not set yet";
var token;
$(document).ready(function () {
    connectToPool('eu-west-2_bXvoN04Fk', '70esqgdtmbq0ao3u2a1lqo0dre', function () {
        checkAuth(function (result) {
            if (result == true) {
                $('html').show();
                getJwtToken(function (x) {
                    token = x.token;
                    refresh();
                    $('html').show();
                });
            }
        });
    });
});

function checkAuth(callback) {
    signedIn(function (response) {
        if (response.success) {
            callback(true);
        } else {
            window.location.href = '/portal/signIn'
        }
    });
}

function signMeOut() {
    signOut(function () {
        checkAuth();
    });
}
