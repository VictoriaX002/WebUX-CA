/* Students Table - Victoria Bieganska */
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

INSERT INTO students
VALUES(3, 'Patric', 'jane', 1274);

INSERT INTO students
VALUES(4, 'Ahmed', 'Dal', 9678);

create table events (
  event_id INT PRIMARY KEY,
  event_name VARCHAR(255),
  event_date DATE,
  event_time TIME,
  event_location VARCHAR(255),
  society_id INT,
/*  FOREIGN KEY (society_id) REFERENCES departments(dept_id) */
)
