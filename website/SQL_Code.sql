/* Students Table - Victoria Bieganska */
drop table if exists support;
drop table if exists societies;
drop table if exists events;
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

CREATE TABLE societies (
    society_id SERIAL PRIMARY KEY,
    society_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    meeting_day VARCHAR(20),
    contact_email VARCHAR(100)
);

INSERT INTO societies (society_name, category, description, meeting_day, contact_email)
VALUES
('Gaming Society', 'Entertainment', 'A place for gamers to connect, compete, and have fun.', 'Friday', 'gaming@college.ie'),

('Tech Society', 'Academic', 'For students interested in programming, AI, and new technologies.', 'Wednesday', 'tech@college.ie'),

('Sports Society', 'Fitness', 'Organises sports activities and competitions for students.', 'Monday', 'sports@college.ie'),

('Art Society', 'Creative', 'A creative space for painting, drawing, and design.', 'Thursday', 'art@college.ie'),

('Music Society', 'Creative', 'For students who enjoy playing instruments and performing music.', 'Tuesday', 'music@college.ie'),

('Islamic Society', 'Cultural', 'A society that supports Muslim students through events, talks, and community activities.', 'Friday', 'isoc@college.ie');

CREATE TABLE support (
  id INT PRIMARY key,
  name VARCHAR(255),
  feedback_type VARCHAR(255),
  support_query VARCHAR(255),
  date_raised TIMESTAMP DEFAULT(CURRENT_TIMESTAMP)
);

INSERT INTO support (id, name, feedback_type, support_query)
VALUES (1, 'Jane Doe', 'Events', 'Test Query');


/* Students Table - Abdurahman Bouderbala */
CREATE TABLE rooms (
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR(100) NOT NULL,
  capacity INT,
  floor INT,
  status VARCHAR(50) DEFAULT 'Available'
);

INSERT INTO rooms (room_name, capacity, floor, status)
VALUES
('Room A101', 10, 1, 'Available'),
('Room B202', 6, 2, 'Available'),
('Room C303', 20, 3, 'Occupied'),
('Study Pod 1', 2, 1, 'Available'),
('Conference Room', 30, 4, 'Available');


/* Student Marketplace - Peace Azeta */
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  student_id INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

/* Sample data */
INSERT INTO products (title, description, price, student_id)
VALUES
('Laptop', 'Good condition', 500, 1),
('Notebook', 'With notes', 20, 2),
('Sweater', 'Brand new', 33, 3);

create table events (  /*Haya Darwish */
  event_id INT PRIMARY KEY,
  event_name VARCHAR(255),
  event_date DATE,
  event_time TIME,
  event_location VARCHAR(255),
  society_id INT,
  FOREIGN KEY (society_id) REFERENCES societies(society_id) 
);

INSERT INTO events (event_id, event_name, event_date, event_time, event_location, society_id)
VALUES
(1, 'Gaming Tournament Night', '2026-04-15', '18:00:00', 'Main Hall', 1),

(2, 'AI & Machine Learning Workshop', '2026-04-18', '14:00:00', 'Lab 2', 2),

(3, 'Inter-Society Football Match', '2026-04-20', '16:30:00', 'Sports मैदान', 3),

(4, 'Art Exhibition Showcase', '2026-04-22', '12:00:00', 'Art Studio', 4),

(5, 'Live Music Jam Session', '2026-04-25', '19:00:00', 'Auditorium', 5);

CREATE TABLE applications ( /*Haya Darwish */
  application_id INT PRIMARY KEY,
  student_id INT,
  event_id INT,
  application_date DATE,
  status VARCHAR(50),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);
