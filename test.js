
      // Gather info about today
      today = new Date();
      month = today.getMonth()+1;
      day = today.getDate();
      //term = (month>=9)?1:((month<=3)?2:3);
      if(month>=9){
        term = 1;
      } else {
        if (month=3){
          term = 2;
        }else{
          term = 3;
        }
      }

      
      acYr = today.getFullYear();
      if (term==1) acYr++;


      // Pull apart the date of birth
      pupY=2000;
      pupM=08;
      pupD=15;
      //pupTerm = (pupM>=9)?1:((pupM<=3)?2:3);

      if(pupM>=9){
        pupTerm = 1;
      } else {
        if (pupM<=3){
          pupTerm = 2;
        }else{
          pupTerm = 3;
        }
      }


      // Calculate the year group
      //yg=acYr-pupY-((pupTerm==1)?6:5);


  if(pupTerm == 1){
    console.log(acYr-pupY-6);
    console.log(2019-2000-6);
  } else {

    console.log(acYr-pupY-5);
    console.log(2019-2000-5);
  }



//sql stuff

//get current term
//if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3))

//get pupil term
//if(month(dob) >=9,1,if(month(dob) = 3, 2, 3))


//year group
//if((   if(month(NOW()) >=9    ,   1,   if(month(NOW()) = 3, 2, 3)) == 1, /*if current term is */ year(NOW()) - year(dob) - 6, /*if current term is not 1*/year(NOW()) - year(dob) - 5))


//get weird year
year(DATE_ADD(now(), INTERVAL 1 YEAR))

if(if(month(NOW()) >=9,1,if(month(NOW()) = 3, 2, 3)) = 1, year(DATE_ADD(now(), INTERVAL 1 YEAR)),year(now()))