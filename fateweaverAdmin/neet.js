var timeleft = 6; //time - how long left until they leave education months
var loggedInterests = 0; //int - how many iterests in database linked to them?
var timeSinceLastSession = 12; //time - how long since last career session?? months
var confirmedPlace = false; //boolean - do they have a confirmed destination??
var assignedMentors = 0; //int - how many assigned mentors do they have??


var priority = 0;

if(timeleft < 6){
    priority += 6; 
}

if (loggedInterests < 1) {
    priority += 2;
} else {
    priority += 0;
}

if(timeleft < 12 ){
    priority += 12 - (timeleft + (timeSinceLastSession / 3));//value out of 12
}

if(assignedMentors < 1){
    priority += 1;
}

//highest score is 20, above a 10 is considered high risk
if(confirmedPlace != true){
    if(priority >= 12){
        console.log("High priority " + priority);
    }else {
        console.log("Low priority " + priority)
    }
} else if(confirmedPlace){
    console.log("Low priority " + priority)
}

function calcNeetScore(timeleft, loggedInterests, timeSinceLastSession, confirmedPlace, assignedMentors) {

    var priority = 0;

    if (timeleft < 6) {
        priority += 6;
    }

    if (loggedInterests < 1) {
        priority += 2;
    } else {
        priority += 0;
    }

    if (timeleft < 12) {
        priority += 12 - (timeleft + (timeSinceLastSession / 3));//value out of 12
    }

    if (assignedMentors < 1) {
        priority += 1;
    }

    //highest score is 20, above a 10 is considered high risk
    if (confirmedPlace != true) {
        if (priority >= 12) {
            console.log("High priority " + priority);
            return priority;
        } else {
            return priority;
        }
    } else if (confirmedPlace) {
        return priority;
    }
}
console.log(calcNeetScore(2,0,3,false,0));