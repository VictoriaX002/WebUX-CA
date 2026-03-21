drop table if exists students;

create table students (
  id INT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  student_num INT
);

INSERT INTO students
VALUES(1, 'John', 'Doe', 1234);

INSERT INTO students
VALUES(2, 'Jane', 'Doe', 5678);
