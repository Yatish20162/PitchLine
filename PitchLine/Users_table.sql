create database pitchline;
use pitchline;

create table USERS(
	email varchar(50),
    pwd varchar(20),
    utype varchar(10),
    dos date
);
ALTER TABLE USERS
ADD PRIMARY KEY (email);
drop table USERS;
select * from USERS;
truncate table USERS;
insert into USERS(email, pwd, utype, dos) values("yatishgarg1353@gmail.com","yatish@2002","shark",curdate());
insert into USERS(email, pwd, utype, dos) values("hitengarg2005@gmail.com","hiten@1353","founder",curdate());
