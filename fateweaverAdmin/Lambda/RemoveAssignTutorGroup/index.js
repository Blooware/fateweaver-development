//fateweaverAdmin-postRemoveAssignTutorGroup

var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": process.env.host,
    "user": process.env.user,
    "password": process.env.password,
    "port": process.env.port
});

exports.handler = (event, context, callback) => {
    /*
    callback(null,{
        tutor_id : event.form.tutor_id,
        group: event.form.tutorInfo.group_id,
        
    });
    */

    connection.query("select * from fateweaver.tutors where id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_id, event.account.sub], function (err, results, fields) {
        if (err) {
            console.log("Error getting tutor groups:", err);
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "error getting students :" + err
            });
        }
        if (results.length > 0) {
            var tutorInfo = results;
            
            connection.query("delete from fateweaver.tutor_assigned_groups where tutor_id = ? and group_id = ? and school_id = (select school_id from fateweaver.admins where cognito_id = ?)", [event.form.tutor_id, event.form.tutorInfo.group_id, event.account.sub], function (err, results, fields) {
                if (err) {
                    console.log("Error getting tutor groups:", err);
                    context.succeed({
                        statusCode: 200,
                        status: false,
                        errMsg: "error deleting association :" + err
                    });
                }
                context.succeed({
                    statusCode: 200,
                    status: true,
                    message: "Deleted Tutor Account Link"
                });

            });
        } else {
            context.succeed({
                statusCode: 200,
                status: false,
                errMsg: "Failed Tutor Lookup"
            });
        }

    });

}

<form method="post" class="removeGroup">
                <div class="form-group" style="padding:30px;padding-left:0px;padding-top:0px;">
                    <p class="d-inline"
                        style="text-align: right;cursor: pointer;text-decoration: underline; float:left; "
                        onclick="$('.popupAssign').attr('style', $('.popupAssign').attr('style') + ';display: none!important;');">
                        Close</p>

                </div>

                <select id="Groups" name="group_id" required>
                    <option value="">Select Tutor Group</option>
                </select>

                <button type="submit">Remove</button>

            </form>