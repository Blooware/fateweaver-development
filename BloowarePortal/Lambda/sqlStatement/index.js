select  *, if ((select count(student_id) from fateweaver.deactivation_log where student_id = fateweaver.students.id ) >= 1, 

(if((SELECT active FROM fateweaver.deactivation_log where student_id = fateweaver.students.id order by added desc limit 1) = 0, 




(select DATE_FORMAT(date('1970-12-31 23:59:59') + interval -1* (

if((select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where student_id = fateweaver.students.id and active = 1) is null , UNIX_TIMESTAMP(added) , (select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where student_id = fateweaver.students.id and active = 1) + unix_timestamp(added) )

- (select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where active = 0 and student_id =  fateweaver.students.id)

)
 second,'%j days %Hh:%im:%ss') as time_Active2) 

, 



(select DATE_FORMAT(date('1970-12-31 23:59:59') + interval -1* (

( (select UNIX_TIMESTAMP(added)  - unix_timestamp())
+ 
(select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where student_id = fateweaver.students.id and active = 1)
)

- (select sum(UNIX_TIMESTAMP(added)) from fateweaver.deactivation_log where active = 0 and student_id =  fateweaver.students.id)

)
 second,'%j days %Hh:%im:%ss') as time_Active2)

)), 

(select DATE_FORMAT(date('1970-12-31 23:59:59') + interval (UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(added))  second,'%j days %Hh:%im:%ss') as time_Active1)

)as timeActive from fateweaver.students 