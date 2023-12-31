INSERT into User_Title VALUES
("관리자", "all", 1), 
("새싹", "all", 0);

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

insert into More_data values ("https://www.youtube.com/watch?v=pkr48S22zH0", 1, "타입지정바람"), ("https://www.youtube.com/watch?v=--D4WMPEIZI", 2, "타입지정 바람");

select *from More_data;

insert into Shop_item (type, item_name, image_local, asset_local, price) values
("cap", "모자1", "object.png", "object.png", 1000),
("cap", "모자2", "object.png", "object.png", 2000),
("top", "상의1", "object.png", "object.png", 3000),
("top", "상의2", "object.png", "object.png", 4000),
("bottom", "하의1", "object.png", "object.png", 5000),
("bottom", "하의2", "object.png", "object.png", 6000),
("glass", "안경1", "object.png", "object.png", 7000),
("glass", "안경2", "object.png", "object.png", 8000);

select *from Shop_item;

insert into VR_exam (target_mark, skill_field, exam, correct, exam_type) values 
("프로그래밍", "html", "문제1", "답2", "stand"),
("프로그래밍", "html", "문제2", "답3", "stand"),
("프로그래밍", "css", "문제1", "답4", "stand"),
("프로그래밍", "css", "문제2", "답1", "stand"),
("프로그래밍", "java", "문제1", "답3", "stand"),
("프로그래밍", "java", "문제2", "답4", "stand"),
("프로그래밍", "js", "문제1", "답1", "stand"),
("프로그래밍", "js", "문제2", "답3", "stand");

select *from VR_exam;

insert into VR_exam_option values 
("답1", 1),
("답2", 1),
("답3", 1),
("답4", 1),
("답1", 2),
("답2", 2),
("답3", 2),
("답4", 2),
("답1", 3),
("답2", 3),
("답3", 3),
("답4", 3),
("답1", 4),
("답2", 4),
("답3", 4),
("답4", 4),
("답1", 5),
("답2", 5),
("답3", 5),
("답4", 5),
("답1", 6),
("답2", 6),
("답3", 6),
("답4", 6),
("답1", 7),
("답2", 7),
("답3", 7),
("답4", 7),
("답1", 8),
("답2", 8),
("답3", 8),
("답4", 8);

select *from VR_exam_option order by exam_id;
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

INSERT into User_skill (user_name, skill_field) VALUES
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

insert into User_date_mark (user_name, mark_list, is_clear) values
("관리자1", "사용자목표1", true),
("관리자1", "사용자목표2", false),
("관리자2", "사용자목표3", true),
("관리자2", "사용자목표4", false);

select  *from User_date_mark;

INSERT into User_identifier_code VALUES
("bt_uuid",  "관리자1", "c4ab6dc8-e2ce-4fa4-a6b6-76f49309ae14"),
("bt_uuid", "관리자2", "2e6ea08d-5c69-430f-891a-ce1359065a99");

SELECT *from User_identifier_code;

insert into User_avatar values
("관리자1", "cat", "식별하는무언가1", "식별하는무언가2", 1),
("관리자2", "monkey", "식별하는무언가3", "식별하는무언가4", 2);

select *from User_avatar;

insert into User_inventory values
("관리자1", 1),
("관리자1", 3),
("관리자1", 5),
("관리자1", 7),
("관리자2", 2),
("관리자2", 4),
("관리자2", 6),
("관리자2", 8);

select *from User_inventory;

insert into User_space values
("관리자1", 2, 3), 
("관리자2", 3, 4);

select *from User_space;

insert into VR_exam_stat values("관리자1", 1, 100);
insert into VR_exam_stat values("관리자2", 1, 0);

select *from VR_exam_stat;
select *from VR_exam;

-- 테이블 초기화
-- DELETE from User;
-- DELETE from Mark_list;
-- DELETE from Avatar_item;
-- DELETE from Shop_item;
