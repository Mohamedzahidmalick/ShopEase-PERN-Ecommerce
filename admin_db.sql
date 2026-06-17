--create table admins (id serial primary key,name varchar(100),email varchar(100) unique,password text,image text);

--delete from admins where email='admin@grr.la';

--insert into admins(name,email,password) values ('Admin','admin@grr.la','$2b$10$RgZA7UJDomASbPyR.Sf1N.elqYh7U08gR05e/62uRVh1T.WkD5uuu');

--select * from admins;

--ALTER TABLE admins ADD COLUMN phone_no TEXT;

select * from admins ;

