 
create table sharkprofile(
	email varchar(50),
    pname varchar(20),
    contact varchar(10),
	Address varchar(50),
    occupation varchar(50),
    City varchar(50),
    Profilepic varchar(50),
    Aadharpic varchar(50),
    categories varchar(50),
    companycount int,
    amount int,
    Additional varchar(100)
);
ALTER TABLE sharkprofile
ADD PRIMARY KEY (email);

drop table sharkprofile;
select * from sharkprofile;
truncate table sharkprofile;

