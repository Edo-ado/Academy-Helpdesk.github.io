Create DATABASE DBAcademyHelpDesk;
USE DBAcademyHelpDesk;

CREATE TABLE Roles (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) UNIQUE,
    Description VARCHAR(255),
    Active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Insurances (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Description VARCHAR(100),
    Active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Positions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) UNIQUE,
    Description VARCHAR(255),
    Active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE SLA (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    MinTimeHours INT,
    MaxTimeHours INT,
    Active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Institutions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) UNIQUE,
    Location VARCHAR(255),
    Active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Categories (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    SLAId INT,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (SLAId) REFERENCES SLA(Id)
);

CREATE TABLE Tags (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CategoryId INT,
    Tag VARCHAR(100),
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

CREATE TABLE Specialities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CategoryId INT,
    Speciality VARCHAR(100),
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    InsuranceId INT,
    UserName VARCHAR(50) UNIQUE,
    Email VARCHAR(50) UNIQUE,
    Password VARCHAR(255),
    RoleId INT,
    Last_Login DATETIME NULL,
    InstitutionId INT NULL,
    PositionId INT NULL,
    State BOOLEAN,
    Work_Charge VARCHAR(100) NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (InsuranceId) REFERENCES Insurances(Id),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id),
    FOREIGN KEY (InstitutionId) REFERENCES Institutions(Id),
    FOREIGN KEY (PositionId) REFERENCES Positions(Id)
);

CREATE TABLE Tickets (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    CategoryId INT,
    Title VARCHAR(100),
    Description VARCHAR(255),
    Priority INT,
    Ticket_Start_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Ticket_End_Date DATETIME,
    State VARCHAR(50),
    Resolution_Time BIGINT,
    Ticket_Response_SLA DATETIME,
    Ticket_Resolution_SLA DATETIME,
    Response_Compliance BOOLEAN,
    Resolution_Compliance BOOLEAN,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

CREATE TABLE TicketHistory (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    TicketId INT,
    Last_State VARCHAR(50),
    Actual_State VARCHAR(50),
    UserAtCharge INT,
    Update_Date DATETIME,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UserAtCharge) REFERENCES Users(Id)
);

CREATE TABLE Archivador (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    HistoryTicketId INT,
    TicketId INT,
    Image BLOB,
    UploadDate DATETIME,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (HistoryTicketId) REFERENCES TicketHistory(Id),
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id)
);

CREATE TABLE Technician_Specialities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    SpecialityId INT,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (SpecialityId) REFERENCES Specialities(Id)
);

CREATE TABLE Assignments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    TicketId INT,
    UserId INT,
    Assigned_Date DATETIME,
    Remarks VARCHAR(255),
    Assignment_Method VARCHAR(50),
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Ratings (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    TicketId INT,
    UserId INT,
    Rating INT,
    Comment VARCHAR(255),
    Rating_Date DATETIME,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Notifications (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    TicketId INT NULL,
    Message VARCHAR(255),
    Is_Read BOOLEAN,
    Created_At DATETIME,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id)
);

CREATE TABLE AutoTriage (
    IdAT INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    ConditionAT VARCHAR(255) NOT NULL,
    Action VARCHAR(255) NOT NULL,
    DateCreation DATETIME DEFAULT CURRENT_TIMESTAMP,
    IdCategories INT NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (IdCategories) REFERENCES Categories(Id)
);



INSERT INTO Insurances (Name, Description, Active)
VALUES
('Guest', 'User in training who uses the system for academic support', TRUE),
('Technician', 'User responsible for resolving incidents or support tickets', TRUE),
('Administrator', 'User with full privileges to manage the system', TRUE);

INSERT INTO SLA (MinTimeHours, MaxTimeHours, Active)
VALUES
(4, 48, TRUE),   
(8, 72, TRUE),   
(2, 24, TRUE),  
(6, 72, TRUE);  

INSERT INTO Categories (Name, SLAId, Active)
VALUES
('Academic Services', 1, TRUE),
('Student and Administrative Services', 2, TRUE),
('Technology', 3, TRUE),
('Physical Infrastructure and Maintenance', 4, TRUE);


INSERT INTO Tags (CategoryId, Tag, Active) VALUES
(1, 'Schedules', TRUE),
(1, 'Enrollments', TRUE),
(1, 'Scholarships', TRUE),
(1, 'Records', TRUE),
(1, 'Evaluations', TRUE),
(1, 'Grades', TRUE),
(1, 'Certifications', TRUE);


INSERT INTO Tags (CategoryId, Tag, Active) VALUES
(2, 'Library', TRUE),
(2, 'Transportation', TRUE),
(2, 'Extracurricular Activities', TRUE),
(2, 'Student Orientation', TRUE),
(2, 'Administrative Procedures', TRUE),
(2, 'Payments', TRUE);


INSERT INTO Tags (CategoryId, Tag, Active) VALUES
(3, 'Hardware', TRUE),
(3, 'Software', TRUE),
(3, 'Connectivity', TRUE),
(3, 'Computer Labs', TRUE),
(3, 'Virtual Campus', TRUE);


INSERT INTO Tags (CategoryId, Tag, Active) VALUES
(4, 'Classrooms', TRUE),
(4, 'Furniture', TRUE),
(4, 'Lighting', TRUE),
(4, 'Security', TRUE),
(4, 'Cleaning', TRUE),
(4, 'Accessibility', TRUE),
(4, 'Sports Areas', TRUE);


INSERT INTO Specialities (CategoryId, Speciality, Active) VALUES
(1, 'Academic Registrar', TRUE),
(1, 'Program Coordinator', TRUE),
(1, 'Academic Secretary', TRUE);


INSERT INTO Specialities (CategoryId, Speciality, Active) VALUES
(2, 'Accountant', TRUE),
(2, 'Student Coordinator', TRUE),
(2, 'Librarian', TRUE),
(2, 'Service Administrator', TRUE),
(2, 'Student Advisor', TRUE);


INSERT INTO Specialities (CategoryId, Speciality, Active) VALUES
(3, 'IT Support', TRUE),
(3, 'Systems Technician', TRUE),
(3, 'Network Administrator', TRUE);


INSERT INTO Specialities (CategoryId, Speciality, Active) VALUES
(4, 'Maintenance Technician', TRUE),
(4, 'Cleaning Supervisor', TRUE),
(4, 'Electric Technician', TRUE),
(4, 'Safety Officer', TRUE);


INSERT INTO Roles (Name, Description )
VALUES ('Technician', 'Manage technical tickets.');

INSERT INTO Roles (Name, Description )
VALUES ('Student', 'User who can create tickets.');

INSERT INTO Roles (Name, Description )
VALUES ('Administrator', 'Assign tickets to the technician.');


INSERT INTO Institutions (Name, Location)
VALUES 
('Liceo San José de Alajuela', 'Alajuela, Costa Rica'),
('Colegio Técnico Profesional de Heredia', 'Heredia, Costa Rica'),
('Instituto Educativo Santa María', 'San José, Costa Rica');

INSERT INTO Insurances (Name, Description)
VALUES
('INS', 'National Insurance Institute'),
('Medismart', 'Private medical insurance'),
('No insurance', 'User without medical coverage');

INSERT INTO Users (InsuranceId, UserName, Email, Password, RoleId, Last_Login, InstitutionId, State, Work_Charge)
VALUES
(1, 'tech_maria', 'maria.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Network Technician'),
(2, 'tech_pedro', 'pedro.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Software Support'),
(3, 'student_jose', 'jose.student@liceoalajuela.cr', 'hashed_password_123', 2, NOW(), 1, TRUE, NULL);


INSERT INTO Technician_Specialities (UserId, SpecialityId)
VALUES
(1, 7)