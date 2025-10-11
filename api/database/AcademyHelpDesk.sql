create database DBAcademyHelpDesk;
use DBAcademyHelpDesk;
CREATE TABLE Roles (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) UNIQUE,
    Description VARCHAR(255)
);

CREATE TABLE Insurances (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    InsuranceType VARCHAR(100)
);

CREATE TABLE Positions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) UNIQUE,
    Description VARCHAR(255)
);

CREATE TABLE SLA (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    MinTimeHours INT,
    MaxTimeHours INT
);

CREATE TABLE Institutions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) UNIQUE,
    Location VARCHAR(255)
);

CREATE TABLE Categories (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    SLAId INT,
    FOREIGN KEY (SLAId) REFERENCES SLA(Id)
);

CREATE TABLE Tags (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CategoryId INT,
    Tag VARCHAR(100),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

CREATE TABLE Specialities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CategoryId INT,
    Speciality VARCHAR(100),
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
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UserAtCharge) REFERENCES Users(Id)
);

CREATE TABLE Archivador (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    HistoryTicketId INT,
    TicketId INT,
    Image BLOB,
    UploadDate DATETIME,
    FOREIGN KEY (HistoryTicketId) REFERENCES TicketHistory(Id),
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id)
);

CREATE TABLE Technician_Specialities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    SpecialityId INT,
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
    FOREIGN KEY (IdCategories) REFERENCES Categories(Id)
);