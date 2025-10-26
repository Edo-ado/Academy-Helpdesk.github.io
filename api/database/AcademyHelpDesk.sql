DROP DATABASE IF EXISTS DBAcademyHelpDesk;
CREATE DATABASE DBAcademyHelpDesk;
USE DBAcademyHelpDesk;

-- TABLAS
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
    UserCode Char(8) UNIQUE,
    Work_Charge VARCHAR(100) NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (InsuranceId) REFERENCES Insurances(Id),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id),
    FOREIGN KEY (InstitutionId) REFERENCES Institutions(Id),
    FOREIGN KEY (PositionId) REFERENCES Positions(Id)
    
);

CREATE TABLE Tickets (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    TechnicianId INT,
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
    FOREIGN KEY (TechnicianId) REFERENCES Users(Id),
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

CREATE TABLE UserTickets (
    UserId INT NOT NULL,
    TicketId INT NOT NULL,
    PRIMARY KEY (UserId, TicketId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id)
);


DELIMITER $$

CREATE TRIGGER trg_random_user_id_usercode
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    DECLARE randomCode CHAR(8);
  
    REPEAT
        SET randomCode = LPAD(FLOOR(RAND() * 100000000), 8, '0');
    UNTIL NOT EXISTS (SELECT 1 FROM Users WHERE UserCode = randomCode)
    END REPEAT;

    SET NEW.UserCode = randomCode;
END$$

DELIMITER ;




-- INSERTS INICIALES
INSERT INTO SLA (MinTimeHours, MaxTimeHours, Active) VALUES
(4, 48, TRUE),
(8, 72, TRUE),
(2, 24, TRUE),
(6, 72, TRUE);

INSERT INTO Categories (Name, SLAId, Active) VALUES
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
(1, 'Certifications', TRUE),
(2, 'Library', TRUE),
(2, 'Transportation', TRUE),
(2, 'Extracurricular Activities', TRUE),
(2, 'Student Orientation', TRUE),
(2, 'Administrative Procedures', TRUE),
(2, 'Payments', TRUE),
(3, 'Hardware', TRUE),
(3, 'Software', TRUE),
(3, 'Connectivity', TRUE),
(3, 'Computer Labs', TRUE),
(3, 'Virtual Campus', TRUE),
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
(1, 'Academic Secretary', TRUE),
(2, 'Accountant', TRUE),
(2, 'Student Coordinator', TRUE),
(2, 'Librarian', TRUE),
(2, 'Service Administrator', TRUE),
(2, 'Student Advisor', TRUE),
(3, 'IT Support', TRUE),
(3, 'Systems Technician', TRUE),
(3, 'Network Administrator', TRUE),
(4, 'Maintenance Technician', TRUE),
(4, 'Cleaning Supervisor', TRUE),
(4, 'Electric Technician', TRUE),
(4, 'Safety Officer', TRUE);

INSERT INTO Roles (Name, Description) VALUES
('Technician', 'Manage technical tickets.'),
('Student', 'User who can create tickets.'),
('Administrator', 'Assign tickets to the technician.');

INSERT INTO Institutions (Name, Location) VALUES
('Liceo San José de Alajuela', 'Alajuela, Costa Rica'),
('Colegio Técnico Profesional de Heredia', 'Heredia, Costa Rica'),
('Instituto Educativo Santa María', 'San José, Costa Rica');

INSERT INTO Insurances (Name, Description) VALUES
('INS', 'National Insurance Institute'),
('Medismart', 'Private medical insurance'),
('No insurance', 'User without medical coverage');

INSERT INTO Users (InsuranceId, UserName, Email, Password, RoleId, Last_Login, InstitutionId, State, Work_Charge) VALUES
(1, 'tech_maria', 'maria.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Network Technician'),
(2, 'tech_pedro', 'pedro.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Software Support'),
(3, 'student_jose', 'jose.student@liceoalajuela.cr', 'hashed_password_123', 2, NOW(), 1, TRUE, NULL),
(1, 'tech_ana', 'ana.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Hardware Specialist'),
(2, 'tech_carlos', 'carlos.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'System Administrator'),
(3, 'tech_luisa', 'luisa.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Network Support'),
(3, 'student_mario', 'mario.student@liceoalajuela.cr', 'hashed_password_321', 2, NOW(), 1, TRUE, NULL),
(2, 'student_ana', 'ana.student@heredia.cr', 'hashed_password_456', 2, NOW(), 2, TRUE, NULL),
(1, 'student_luis', 'luis.student@santamaria.cr', 'hashed_password_789', 2, NOW(), 3, TRUE, NULL);

INSERT INTO Technician_Specialities (UserId, SpecialityId) VALUES
(4, 10),
(5, 11),
(6, 12);

-- INSERTS DE TICKETS INICIALES
INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, State) VALUES
(4, 3, 'Problema con la computadora del laboratorio', 'La computadora no arranca después de una actualización.', 3, 'Asignado'),
(5, 1, 'Error en la matrícula en línea', 'No puedo acceder al sistema de matrícula.', 2, 'Asignado'),
(6, 2, 'Duda sobre pago de transporte', 'No aparece el monto a pagar del bus estudiantil.', 1, 'Asignado');

INSERT INTO UserTickets (UserId, TicketId) VALUES
(7, 1),
(8, 2),
(9, 3);

INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, UserAtCharge, Update_Date) VALUES
(1, 'Creado', 'Asignado', 4, NOW()),
(2, 'Creado', 'Asignado', 5, NOW()),
(3, 'Creado', 'Asignado', 6, NOW());

INSERT INTO Archivador (HistoryTicketId, TicketId, UploadDate) VALUES
(1, 1, NOW()),
(2, 2, NOW()),
(3, 3, NOW());

INSERT INTO Assignments (TicketId, UserId, Assigned_Date, Remarks, Assignment_Method) VALUES
(1, 4, NOW(), 'Asignado automáticamente por categoría Tecnología.', 'Automático'),
(2, 5, NOW(), 'Asignado por administrador debido a experiencia en sistemas.', 'Manual'),
(3, 6, NOW(), 'Asignación automática según carga de trabajo.', 'Automático');

INSERT INTO Ratings (TicketId, UserId, Rating, Comment, Rating_Date) VALUES
(1, 7, 5, 'Excelente atención del técnico Ana.', NOW()),
(2, 8, 4, 'Buena respuesta, aunque tardó un poco.', NOW()),
(3, 9, 3, 'El problema se resolvió, pero sin mucha explicación.', NOW());

-- TICKETS ADICIONALES PARA TODOS LOS TECNICOS Y ESTUDIANTES
INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, State) VALUES
(1, 3, 'Falla en red del laboratorio', 'La red no conecta a internet.', 3, 'Asignado'),
(1, 3, 'Problema con impresora de red', 'La impresora del laboratorio no imprime.', 2, 'Asignado'),
(2, 3, 'Error en software de matrícula', 'El sistema muestra errores al registrar materias.', 2, 'Asignado'),
(2, 3, 'Actualización de software incompleta', 'Falla durante la instalación de software educativo.', 3, 'Asignado'),
(4, 1, 'Solicitud de certificado académico', 'Usuario no puede descargar su certificado.', 1, 'Asignado'),
(4, 1, 'Corrección de notas', 'Notas incorrectas en el sistema académico.', 2, 'Asignado'),
(5, 2, 'Duda sobre pagos administrativos', 'Usuario no sabe el monto a pagar.', 1, 'Asignado'),
(5, 2, 'Actualización de datos estudiantiles', 'Cambios no se reflejan en la plataforma.', 2, 'Asignado'),
(6, 3, 'Problema en aula virtual', 'No puede acceder al aula virtual.', 2, 'Asignado'),
(6, 3, 'Falla en conectividad de laboratorio', 'El laboratorio pierde conexión intermitente.', 3, 'Asignado');

INSERT INTO UserTickets (UserId, TicketId) VALUES
(3, 4), (3, 5),
(7, 6), (7, 7),
(8, 8), (8, 9),
(9, 10), (9, 11);

INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, UserAtCharge, Update_Date) VALUES
(4, 'Creado', 'Asignado', 1, NOW()),
(5, 'Creado', 'Asignado', 1, NOW()),
(6, 'Creado', 'Asignado', 2, NOW()),
(7, 'Creado', 'Asignado', 2, NOW()),
(8, 'Creado', 'Asignado', 4, NOW()),
(9, 'Creado', 'Asignado', 4, NOW()),
(10, 'Creado', 'Asignado', 5, NOW()),
(11, 'Creado', 'Asignado', 5, NOW()),
(12, 'Creado', 'Asignado', 6, NOW()),
(13, 'Creado', 'Asignado', 6, NOW());

INSERT INTO Archivador (HistoryTicketId, TicketId, UploadDate) VALUES
(4, 4, NOW()),
(5, 5, NOW()),
(6, 6, NOW()),
(7, 7, NOW()),
(8, 8, NOW()),
(9, 9, NOW()),
(10, 10, NOW()),
(11, 11, NOW()),
(12, 12, NOW()),
(13, 13, NOW());

INSERT INTO Assignments (TicketId, UserId, Assigned_Date, Remarks, Assignment_Method) VALUES
(4, 1, NOW(), 'Asignación automática.', 'Automático'),
(5, 1, NOW(), 'Asignación automática.', 'Automático'),
(6, 2, NOW(), 'Asignación automática.', 'Automático'),
(7, 2, NOW(), 'Asignación automática.', 'Automático'),
(8, 4, NOW(), 'Asignación automática.', 'Automático'),
(9, 4, NOW(), 'Asignación automática.', 'Automático'),
(10, 5, NOW(), 'Asignación automática.', 'Automático'),
(11, 5, NOW(), 'Asignación automática.', 'Automático'),
(12, 6, NOW(), 'Asignación automática.', 'Automático'),
(13, 6, NOW(), 'Asignación automática.', 'Automático');

INSERT INTO Ratings (TicketId, UserId, Rating, Comment, Rating_Date) VALUES
(4, 3, 4, 'Buena atención.', NOW()),
(5, 3, 5, 'Excelente respuesta.', NOW()),
(6, 7, 4, 'Resuelto correctamente.', NOW()),
(7, 7, 3, 'Tardó un poco en responder.', NOW()),
(8, 8, 5, 'Muy profesional.', NOW()),
(9, 8, 4, 'Buen soporte técnico.', NOW()),
(10, 9, 3, 'Pudo mejorar la comunicación.', NOW()),
(11, 9, 4, 'Problema resuelto.', NOW()),
(12, 8, 5, 'Excelente atención.', NOW()),
(13, 8, 4, 'Resuelto a tiempo.',NOW());


