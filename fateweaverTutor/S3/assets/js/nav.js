
// A $( document ).ready() block.
$( document ).ready(function() {
    $('.insertNavHere').html(` <ul class="d-block sidebar-nav" style="height: 100%;overflow: hidden;"> <li style="padding-top: 150px;"> <a href="/tutor" style="color: #fff!important;padding-bottom: 10px;"> <i class="fa fa-home" style="padding-right: 10px;width: 60px;"></i>HOME </a> <a href="/tutor/groups" style="color: #fff!important;padding-bottom: 10px;"> <i class="fa fa-users" style="padding-right: 10px;width: 60px;"></i>GROUPS </a> <a href="/tutor/students" style="color: #fff!important;padding-bottom: 10px;"> <i class="fas fa-user-friends" style="padding-right: 10px;width: 60px;"></i>STUDENTS </a> <a href="/tutor/settings" style="color: #fff!important;padding-bottom: 10px;"> <i class="fas fa-chalkboard-teacher" style="padding-right: 10px;width: 60px;"></i>SETTINGS </a> <div style="position: absolute;bottom: 0px;width: 100%;padding-bottom: 25px;"> <a class="text-uppercase" onclick="signMeOut()" style="color: #fff!important;width: 100%;"> <i class="fa fa-sign-out" style="padding-right: 10px;width: 60px;"></i> <strong>LOG OUT</strong> </a> </div> </li> </ul>`);
    console.log("Complete");
});