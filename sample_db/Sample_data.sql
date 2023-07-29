INSERT into User_Title VALUES
("관리자"), 
("새싹");

INSERT into Mark_list VALUES
("프로그래밍", "공부"), 
("등산", "운동");

SELECT *from Mark_list;

INSERT into Skill_Mark VALUES
("html", "프로그래밍", 1),
("css", "프로그래밍", 1),
("java", "프로그래밍", 1),
("python", "프로그래밍", 1),
("js", "프로그래밍", 2),
("frontend", "프로그래밍", 3),
("backend", "프로그래밍", 3),
("중간시험", "프로그래밍", 4),
("jsp", "프로그래밍", 5),
("react", "프로그래밍", 5),
("spring", "프로그래밍", 5),
("diango", "프로그래밍", 5),
("node", "프로그래밍", 5);

SELECT *from Skill_Mark;

INSERT into Details_mark (target_mark, skill_field, mark_list, level) VALUES
("프로그래밍", "html", "기본", 1),
("프로그래밍", "html", "심화", 2),
("프로그래밍", "css", "기본", 1),
("프로그래밍", "css", "심화", 2),
("프로그래밍", "java", "기본", 1),
("프로그래밍", "java", "심화", 2),
("프로그래밍", "python", "기본", 1),
("프로그래밍", "python", "심화", 2);

SELECT *from Details_mark;

insert Shop_item (type, item_name, local, price) values 
("shop", "1번템", "object.png", 1000),
("shop", "2번템", "object.png", 1000),
("shop", "3번템", "object.png", 1000),
("shop", "4번템", "object.png", 1000);

insert More_data values ("https://www.youtube.com/watch?v=pkr48S22zH0", 1), ("https://www.youtube.com/watch?v=--D4WMPEIZI", 2);

select *from Shop_item;
-- user와 독립 적인 것들

INSERT into User VALUES
("admin1", "admin"),
("admin2", "admin");

SELECT *from User;

INSERT into User_data (user_name, user_id, choice_mark, user_title) VALUES 
("관리자1", "admin1", "프로그래밍", "관리자"), 
("관리자2", "admin2", "프로그래밍", "관리자");

SELECT *from User_data;

INSERT into User_friend VALUES
("관리자1", "관리자2"),
("관리자2", "관리자1");

SELECT *from User_friend;

INSERT into User_skill VALUES
("관리자1", "html"),
("관리자1", "css"),
("관리자1", "java"),
("관리자1", "python"),
("관리자2", "html"),
("관리자2", "css"),
("관리자2", "java"),
("관리자2", "python");

SELECT *from User_skill;

INSERT into User_mark VALUES
("관리자1", 1, 100, current_time()), ("관리자2", 4, 100, current_time());

SELECT *from User_mark;

INSERT into User_bluetooth VALUES
("관리자1", "bt_mac1"),
("관리자2", "bt_mac2");

SELECT *from User_bluetooth;

insert into User_avatar values
("관리자1", "식별하는무언가1", "식별하는무언가2", 1),
("관리자2", "식별하는무언가3", "식별하는무언가4", 2);

select *from User_avatar;

alter table User_avatar alter column look set default 1;
alter table User_avatar alter column color set default 2;

insert into User_space values
("관리자1", 2, 3), 
("관리자2", 3, 4);

select *from User_space;

-- 테이블 초기화
-- DELETE from User;
-- DELETE from Mark_list;
-- DELETE from Avatar_item;
-- DELETE from Shop_item;