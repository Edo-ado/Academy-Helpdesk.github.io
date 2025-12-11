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
    MaxTimeResponse INT,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    MaxTimeResolution INT NULL DEFAULT NULL
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
    Descripcion VARCHAR(255) DEFAULT 'Sin descripción',
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (SLAId) REFERENCES SLA(Id)
);

CREATE TABLE Tags (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Tag VARCHAR(100) NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Specialities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Speciality VARCHAR(100) NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Category_Tags (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CategoryId INT NOT NULL,
    TagId INT NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    FOREIGN KEY (TagId) REFERENCES Tags(Id)
);

CREATE TABLE Category_Specialities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CategoryId INT NOT NULL,
    SpecialityId INT NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    FOREIGN KEY (SpecialityId) REFERENCES Specialities(Id)
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

CREATE TABLE Priorities (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Description VARCHAR(255),
    Active BOOLEAN NOT NULL DEFAULT 1
);




CREATE TABLE Tickets (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    TechnicianId INT,
    CategoryId INT,
    Title VARCHAR(100),
    Description VARCHAR(255),
    Priority INT,
    Ticket_Start_Date Datetime DEFAULT CURRENT_TIMESTAMP,
    Ticket_End_Date Datetime,
    State VARCHAR(50),
    Resolution_Time BIGINT,
    Ticket_Response_SLA DATETIME,
    Ticket_Resolution_SLA DATETIME,
    Response_Compliance BOOLEAN,
    Resolution_Compliance BOOLEAN,
    
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (TechnicianId) REFERENCES Users(Id),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    FOREIGN KEY (Priority) REFERENCES Priorities(Id)
    );

CREATE TABLE TicketHistory (
    Id INT PRIMARY KEY AUTO_INCREMENT,
TicketId INT NOT NULL,
    Last_State VARCHAR(50),
    Actual_State VARCHAR(50) NOT NULL,
    Observation TEXT,
    UserAtCharge INT,
    Update_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UserAtCharge) REFERENCES Users(Id)
);



CREATE TABLE Archivador (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    HistoryTicketId INT NOT NULL,
    TicketId INT NOT NULL,
    Image VARCHAR(255) NOT NULL,
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

CREATE TABLE Autotriage (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CategoryId INT NOT NULL,
    PriorityMin INT DEFAULT NULL,       -- NULL = todas las prioridades
    SpecialityId INT NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    RuleOrder INT NOT NULL DEFAULT 1,   -- orden de ejecución de reglas
    CONSTRAINT fk_autotriage_category FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    CONSTRAINT fk_autotriage_speciality FOREIGN KEY (SpecialityId) REFERENCES Specialities(Id)
);

CREATE TABLE UserTickets (
    UserId INT NOT NULL,
    TicketId INT NOT NULL,
    PRIMARY KEY (UserId, TicketId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id)
);


CREATE TABLE TicketComments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    TicketId INT NOT NULL,
    UserId INT NOT NULL,
    CommentText TEXT NOT NULL,
    CommentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
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

INSERT INTO Priorities (Name, Description, Active) VALUES
('Baja', 'Incidencias de bajo impacto.', 1),
('Media', 'Incidencias que afectan parcialmente al usuario.', 1),
('Alta', 'Incidencias urgentes que impiden trabajar.', 1);


INSERT INTO SLA (MaxTimeResponse, MaxTimeResolution, Active) VALUES
(4, 48, TRUE),
(6, 72, TRUE),
(1, 24, TRUE),
(6, 72, TRUE);

INSERT INTO Categories (Name, SLAId, Descripcion, Active) VALUES
('Academic Services', 1, 'Services related to teaching, courses, and academic support for students.', TRUE),
('Student and Administrative Services', 2, 'Support for student needs, administrative requests, and institutional services.', TRUE),
('Technology', 3, 'Technology support including systems, software, and technical assistance.', TRUE),
('Physical Infrastructure and Maintenance', 4, 'Maintenance and management of physical spaces, equipment, and infrastructure.', TRUE);


INSERT INTO Tags (Tag) VALUES
('Schedules'),
('Enrollments'),
('Scholarships'),
('Records'),
('Evaluations'),
('Grades'),
('Certifications'),
('Library'),
('Transportation'),
('Extracurricular Activities'),
('Student Orientation'),
('Administrative Procedures'),
('Payments'),
('Hardware'),
('Software'),
('Connectivity'),
('Computer Labs'),
('Virtual Campus'),
('Classrooms'),
('Furniture'),
('Lighting'),
('Security'),
('Cleaning'),
('Accessibility'),
('Sports Areas');

INSERT INTO Specialities (Speciality) VALUES
('Academic Registrar'),
('Program Coordinator'),
('Academic Secretary'),
('Accountant'),
('Student Coordinator'),
('Librarian'),
('Service Administrator'),
('Student Advisor'),
('IT Support'),
('Systems Technician'),
('Network Administrator'),
('Maintenance Technician'),
('Cleaning Supervisor'),
('Electric Technician'),
('Safety Officer');


INSERT INTO Roles (Name, Description) VALUES
('Technician', 'Manage technical tickets.'),
('Student', 'User who can create tickets.'),
('Administrator', 'Assign tickets to the technician.');

INSERT INTO Institutions (Name, Location) VALUES
('Liceo San José de Alajuela', 'Alajuela, Costa Rica'),
('Colegio Técnico Profesional de Heredia', 'Heredia, Costa Rica'),
('Instituto Educativo Santa María', 'San José, Costa Rica'),
('Colegio Técnico de Cartago', 'Cartago, Costa Rica');

INSERT INTO Insurances (Name, Description) VALUES
('INS', 'National Insurance Institute'),
('Medismart', 'Private medical insurance'),
('No insurance', 'User without medical coverage');

-- USUARIOS: Técnicos, Estudiantes
INSERT INTO Users (InsuranceId, UserName, Email, Password, RoleId, Last_Login, InstitutionId, State, Work_Charge) VALUES
-- Técnicos originales (RoleId = 1)
(1, 'tech_maria', 'maria.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Network Technician'),
(2, 'tech_pedro', 'pedro.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Software Support'),
(1, 'tech_ana', 'ana.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Hardware Specialist'),
(2, 'tech_carlos', 'carlos.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'System Administrator'),
(3, 'tech_luisa', 'luisa.tech@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Network Support'),
-- Estudiantes (RoleId = 2)
(3, 'student_jose', 'jose.student@liceoalajuela.cr', 'hashed_password_123', 2, NOW(), 1, TRUE, NULL),
(3, 'student_mario', 'mario.student@liceoalajuela.cr', 'hashed_password_321', 2, NOW(), 1, TRUE, NULL),
(2, 'student_ana', 'ana.student@heredia.cr', 'hashed_password_456', 2, NOW(), 2, TRUE, NULL),
(1, 'student_luis', 'luis.student@santamaria.cr', 'hashed_password_789', 2, NOW(), 3, TRUE, NULL),
-- Técnicos adicionales (RoleId = 1)
(2, 'coordinator_ashley', 'ashley.coordinator@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Program Coordinator'),
(2, 'secretary_fabian', 'fabian.secr@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Academic Secretary'),
(1, 'advisor_math', 'mathew.ads@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Student Advisor'),
(2, 'tech_pepito', 'pedro.techelectrical@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Electrical Technician'),
(3, 'cleaning_caleb', 'caleb.clean@helpdesk.com', '123LOL', 1, NOW(), NULL, TRUE, 'Cleaning Supervisor'),
-- Más estudiantes
(3, 'student_carla', 'carla.student@cartago.cr', 'hashed_password_111', 2, NOW(), 4, TRUE, NULL);

-- ESPECIALIDADES DE TÉCNICOS
INSERT INTO Technician_Specialities (UserId, SpecialityId) VALUES
-- Técnicos originales
(1, 11), -- tech_maria - Network Administrator
(2, 9),  -- tech_pedro - IT Support
(2, 10), -- tech_pedro - Systems Technician
(4, 9),  -- tech_ana - IT Support
(5, 10), -- tech_carlos - Systems Technician
(5, 11), -- tech_carlos - Network Administrator
(6, 11), -- tech_luisa - Network Administrator
-- Técnicos adicionales
(10, 3), -- coordinator_ashley - Academic Secretary
(10, 4), -- coordinator_ashley - Accountant
(11, 5), -- secretary_fabian - Student Coordinator
(11, 2), -- secretary_fabian - Program Coordinator
(12, 14), -- advisor_math - Electric Technician
(13, 13), -- tech_pepito - Cleaning Supervisor
(13, 12), -- tech_pepito - Maintenance Technician
(14, 13); -- cleaning_caleb - Cleaning Supervisor

-- ========================================
-- TICKETS CON VARIEDAD DE ESTADOS Y FECHAS
-- ========================================


INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, Ticket_Start_Date, State, Ticket_Response_SLA, Ticket_Resolution_SLA) VALUES
(4, 3, 'No puedo acceder al campus virtual', 'Aparece error 404 al intentar ingresar', 3, DATE_SUB(NOW(), INTERVAL 1 HOUR), 'Pendiente', DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 HOUR), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 HOUR), INTERVAL 24 HOUR)),
(11, 1, 'Consulta sobre proceso de matrícula', 'Necesito información sobre fechas de matrícula para el próximo ciclo', 1, DATE_SUB(NOW(), INTERVAL 3 HOUR), 'Pendiente', DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 HOUR), INTERVAL 48 HOUR)),
(10, 2, 'Problema con pago de mensualidad', 'El sistema no registra mi último pago', 2, DATE_SUB(NOW(), INTERVAL 5 HOUR), 'Pendiente', DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 HOUR), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 HOUR), INTERVAL 72 HOUR)),
(10, 1, 'Consulta sobre retiro de curso', 'Información sobre proceso y fechas', 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), 'Pendiente', DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 HOUR), INTERVAL 48 HOUR)),
(1, 1, 'Duplicado de carnet estudiantil', 'Perdí mi carnet :`v', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Pendiente', DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 HOUR), INTERVAL 48 HOUR));

-- Tickets ASIGNADOS (ya tienen técnico pero no iniciados)
INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, Ticket_Start_Date, State, Ticket_Response_SLA, Ticket_Resolution_SLA) VALUES
(1, 3, 'Falla en red del laboratorio 3', 'La conexión se cae cada 10 minutos', 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Asignado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 24 HOUR)),
(2, 3, 'Error al instalar software educativo', 'Aparece mensaje de error durante instalación', 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Asignado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 24 HOUR)),
(4, 1, 'Corrección de calificaciones', 'Hay notas incorrectas en mi historial académico', 2, DATE_SUB(NOW(), INTERVAL 3 DAY), 'Asignado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 DAY), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 DAY), INTERVAL 48 HOUR)),
(5, 2, 'Solicitud de certificado de estudios', 'Necesito certificado para trámite externo', 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Asignado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 72 HOUR)),
(1, 1, 'Cambio de sección de curso', 'Necesito cambiar de horario', 1, DATE_SUB(NOW(), INTERVAL 6 HOUR), 'Asignado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 6 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 6 HOUR), INTERVAL 48 HOUR)),
(4, 1, 'Acceso a actas de examen', 'No puedo ver mis resultados', 2, DATE_SUB(NOW(), INTERVAL 8 HOUR), 'Asignado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 HOUR), INTERVAL 48 HOUR));

-- Tickets EN PROCESO (activamente siendo trabajados)
INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, Ticket_Start_Date, State, Ticket_Response_SLA, Ticket_Resolution_SLA, Response_Compliance) VALUES
(1, 3, 'Computadora del laboratorio no enciende', 'PC número 15 no responde al encender', 3, DATE_SUB(NOW(), INTERVAL 4 DAY), 'En Proceso', DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 DAY), INTERVAL 24 HOUR), TRUE),
(10, 1, 'Error en sistema de inscripción', 'No me permite inscribir el curso de matemáticas', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), 'En Proceso', DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 DAY), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 DAY), INTERVAL 48 HOUR), TRUE),
(14, 4, 'Aire acondicionado del aula 201 no funciona', 'Hace mucho calor en el salón', 2, DATE_SUB(NOW(), INTERVAL 5 DAY), 'En Proceso', DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 DAY), INTERVAL 72 HOUR), TRUE),
(4, 2, 'Actualización de datos personales', 'Cambié de dirección y necesito actualizar información', 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'En Proceso', DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 72 HOUR), TRUE),
(14, 4, 'Luz fundida en pasillo principal', 'Pasillo está muy oscuro', 2, DATE_SUB(NOW(), INTERVAL 7 HOUR), 'En Proceso', DATE_ADD(DATE_SUB(NOW(), INTERVAL 7 HOUR), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 7 HOUR), INTERVAL 72 HOUR), TRUE);

-- Tickets RESUELTOS (terminados, esperando confirmación)
INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, Ticket_Start_Date, Ticket_End_Date, State, Resolution_Time, Ticket_Response_SLA, Ticket_Resolution_SLA, Response_Compliance, Resolution_Compliance) VALUES
(1, 3, 'Impresora de red no imprime', 'La impresora del laboratorio 2 no responde', 2, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Resuelto', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 7 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 7 DAY), INTERVAL 24 HOUR), TRUE, TRUE),
(10, 1, 'Consulta sobre horario de clases', 'No aparece mi horario en el sistema', 1, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 'Resuelto', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 6 DAY), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 6 DAY), INTERVAL 48 HOUR), TRUE, TRUE),
(2, 3, 'Lentitud en sistema de biblioteca virtual', 'El catálogo tarda mucho en cargar', 2, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 'Resuelto', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 DAY), INTERVAL 24 HOUR), TRUE, TRUE),
(2, 3, 'Software de diseño no abre archivos', 'Aparece error al abrir proyectos', 3, DATE_SUB(NOW(), INTERVAL 18 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY), 'Resuelto', 518400, DATE_ADD(DATE_SUB(NOW(), INTERVAL 18 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 18 DAY), INTERVAL 24 HOUR), TRUE, TRUE);

-- Tickets CERRADOS (completamente finalizados y validados)
INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, Ticket_Start_Date, Ticket_End_Date, State, Resolution_Time, Ticket_Response_SLA, Ticket_Resolution_SLA, Response_Compliance, Resolution_Compliance) VALUES
(14, 4, 'Puerta del aula 305 no cierra bien', 'La cerradura está dañada', 2, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), 'Cerrado', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 15 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 15 DAY), INTERVAL 72 HOUR), TRUE, TRUE),
(4, 2, 'Problema con acceso a biblioteca', 'Mi carnet no funciona en los torniquetes', 1, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), 'Cerrado', 345600, DATE_ADD(DATE_SUB(NOW(), INTERVAL 12 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 12 DAY), INTERVAL 72 HOUR), TRUE, TRUE),
(1, 3, 'Email institucional no recibe correos', 'No me llegan notificaciones al correo', 3, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), 'Cerrado', 259200, DATE_ADD(DATE_SUB(NOW(), INTERVAL 10 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 10 DAY), INTERVAL 24 HOUR), TRUE, TRUE),
(10, 1, 'Solicitud de constancia de notas', 'Necesito constancia para beca', 1, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), 'Cerrado', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 20 DAY), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 20 DAY), INTERVAL 48 HOUR), TRUE, TRUE),
(1, 3, 'Proyector del aula 101 no funciona', 'No se proyecta imagen', 2, DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY), 'Cerrado', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 25 DAY), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 25 DAY), INTERVAL 24 HOUR), TRUE, TRUE),
(4, 2, 'Error en recibo de pago', 'El monto mostrado es incorrecto', 2, DATE_SUB(NOW(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY), 'Cerrado', 345600, DATE_ADD(DATE_SUB(NOW(), INTERVAL 22 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 22 DAY), INTERVAL 72 HOUR), TRUE, TRUE),
(5, 2, 'Problema con beca estudiantil', 'No aparece mi beca en el sistema', 3, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY), 'Cerrado', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 30 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 30 DAY), INTERVAL 72 HOUR), TRUE, TRUE),
(14, 4, 'Silla rota en biblioteca', 'Silla del puesto 23 está dañada', 1, DATE_SUB(NOW(), INTERVAL 28 DAY), DATE_SUB(NOW(), INTERVAL 23 DAY), 'Cerrado', 432000, DATE_ADD(DATE_SUB(NOW(), INTERVAL 28 DAY), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 28 DAY), INTERVAL 72 HOUR), TRUE, TRUE);

INSERT INTO Tickets (TechnicianId, CategoryId, Title, Description, Priority, Ticket_Start_Date, Ticket_End_Date, State, Ticket_Response_SLA, Ticket_Resolution_SLA) VALUES
(14, 4, 'Se meo un chiquillo', 'Aula 3 piso 15', 3, DATE_SUB(NOW(), INTERVAL 1 HOUR), null, 'Pendiente', DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 HOUR), INTERVAL 1 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 HOUR), INTERVAL 24 HOUR)),
(14, 4, 'Se Cayo el porton', 'Se cayo el porton', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), null, 'Asignado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 HOUR), INTERVAL 48 HOUR)),
(14, 4, 'Adriana Salteeee', 'Enrique', 2, DATE_SUB(NOW(), INTERVAL 5 HOUR), null, 'En Proceso', DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 HOUR), INTERVAL 6 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 HOUR), INTERVAL 72 HOUR)),
(14, 4, 'Watajai', 'Ok Mañana 💜', 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 5 HOUR), 'Resuelto', DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 HOUR), INTERVAL 48 HOUR)),
(14, 4, 'Sybau', 'Filamento ', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 6 HOUR), 'Cerrado', DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 HOUR), INTERVAL 4 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 HOUR), INTERVAL 48 HOUR));


-- ========================================
-- RELACIÓN USUARIOS - TICKETS
-- ========================================
INSERT INTO UserTickets (UserId, TicketId) VALUES
-- Tickets Pendientes (1-5)
(7, 1), (8, 2), (9, 3), (10, 4), (11, 5),
-- Tickets Asignados (6-11)
(7, 6), (8, 7), (9, 8), (10, 9), (11, 10), (12, 11),
-- Tickets En Proceso (12-16)
(7, 12), (8, 13), (9, 14), (10, 15), (11, 16),
-- Tickets Resueltos (17-20)
(7, 17), (8, 18), (9, 19), (10, 20),
-- Tickets Cerrados (21-28)
(11, 21), (12, 22), (7, 23), (8, 24), (9, 25), (10, 26), (11, 27), (12, 28);

-- ========================================
-- HISTORIAL DE TICKETS
-- ========================================

-- Historial para tickets PENDIENTES (solo estado inicial)
INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, UserAtCharge, Update_Date) VALUES
(1, NULL, 'Pendiente', 7, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, NULL, 'Pendiente', 8, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(3, NULL, 'Pendiente', 9, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(4, NULL, 'Pendiente', 10, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(5, NULL, 'Pendiente', 11, DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- Historial para tickets ASIGNADOS (Creado -> Asignado)
INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, UserAtCharge, Update_Date) VALUES
(6, NULL, 'Pendiente', 7, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 'Pendiente', 'Asignado', 1, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 30 MINUTE),
(7, NULL, 'Pendiente', 8, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(7, 'Pendiente', 'Asignado', 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 45 MINUTE),
(8, NULL, 'Pendiente', 9, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(8, 'Pendiente', 'Asignado', 4, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 1 HOUR),
(9, NULL, 'Pendiente', 10, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(9, 'Pendiente', 'Asignado', 5, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 20 MINUTE),
(10, NULL, 'Pendiente', 11, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(10, 'Pendiente', 'Asignado', 1, DATE_SUB(NOW(), INTERVAL 6 HOUR) + INTERVAL 30 MINUTE),
(11, NULL, 'Pendiente', 12, DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(11, 'Pendiente', 'Asignado', 4, DATE_SUB(NOW(), INTERVAL 8 HOUR) + INTERVAL 45 MINUTE);

-- Historial para tickets EN PROCESO (Creado -> Asignado -> En Proceso)
INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, UserAtCharge, Update_Date) VALUES
(12, NULL, 'Pendiente', 7, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(12, 'Pendiente', 'Asignado', 1, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 1 HOUR),
(12, 'Asignado', 'En Proceso', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(13, NULL, 'Pendiente', 8, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(13, 'Pendiente', 'Asignado', 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 30 MINUTE),
(13, 'Asignado', 'En Proceso', 10, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(14, NULL, 'Pendiente', 9, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(14, 'Pendiente', 'Asignado', 14, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 2 HOUR),
(14, 'Asignado', 'En Proceso', 14, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(15, NULL, 'Pendiente', 10, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(15, 'Pendiente', 'Asignado', 4, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 1 HOUR),
(15, 'Asignado', 'En Proceso', 4, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(16, NULL, 'Pendiente', 11, DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(16, 'Pendiente', 'Asignado', 14, DATE_SUB(NOW(), INTERVAL 7 HOUR) + INTERVAL 1 HOUR),
(16, 'Asignado', 'En Proceso', 14, DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- Historial para tickets RESUELTOS (Creado -> Asignado -> En Proceso -> Resuelto)
INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, UserAtCharge, Update_Date) VALUES
(17, NULL, 'Pendiente', 7, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(17, 'Pendiente', 'Asignado', 1, DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 1 HOUR),
(17, 'Asignado', 'En Proceso', 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(17, 'En Proceso', 'Resuelto', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(18, NULL, 'Pendiente', 8, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(18, 'Pendiente', 'Asignado', 10, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 30 MINUTE),
(18, 'Asignado', 'En Proceso', 10, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(18, 'En Proceso', 'Resuelto', 10, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(19, NULL, 'Pendiente', 9, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(19, 'Pendiente', 'Asignado', 2, DATE_SUB(NOW(), INTERVAL 8 DAY) + INTERVAL 2 HOUR),
(19, 'Asignado', 'En Proceso', 2, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(19, 'En Proceso', 'Resuelto', 2, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(20, NULL, 'Pendiente', 10, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(20, 'Pendiente', 'Asignado', 2, DATE_SUB(NOW(), INTERVAL 18 DAY) + INTERVAL 2 HOUR),
(20, 'Asignado', 'En Proceso', 2, DATE_SUB(NOW(), INTERVAL 17 DAY)),
(20, 'En Proceso', 'Resuelto', 2, DATE_SUB(NOW(), INTERVAL 12 DAY));

-- Historial para tickets CERRADOS (Creado -> Asignado -> En Proceso -> Resuelto -> Cerrado)
INSERT INTO TicketHistory (TicketId, Last_State, Actual_State, UserAtCharge, Update_Date) VALUES
(21, NULL, 'Pendiente', 11, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(21, 'Pendiente', 'Asignado', 14, DATE_SUB(NOW(), INTERVAL 15 DAY) + INTERVAL 2 HOUR),
(21, 'Asignado', 'En Proceso', 14, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(21, 'En Proceso', 'Resuelto', 14, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(21, 'Resuelto', 'Cerrado', 11, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(22, NULL, 'Pendiente', 12, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(22, 'Pendiente', 'Asignado', 4, DATE_SUB(NOW(), INTERVAL 12 DAY) + INTERVAL 1 HOUR),
(22, 'Asignado', 'En Proceso', 4, DATE_SUB(NOW(), INTERVAL 11 DAY)),
(22, 'En Proceso', 'Resuelto', 4, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(22, 'Resuelto', 'Cerrado', 12, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(23, NULL, 'Pendiente', 7, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(23, 'Pendiente', 'Asignado', 1, DATE_SUB(NOW(), INTERVAL 10 DAY) + INTERVAL 1 HOUR),
(23, 'Asignado', 'En Proceso', 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(23, 'En Proceso', 'Resuelto', 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(23, 'Resuelto', 'Cerrado', 7, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(24, NULL, 'Pendiente', 8, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(24, 'Pendiente', 'Asignado', 10, DATE_SUB(NOW(), INTERVAL 20 DAY) + INTERVAL 30 MINUTE),
(24, 'Asignado', 'En Proceso', 10, DATE_SUB(NOW(), INTERVAL 19 DAY)),
(24, 'En Proceso', 'Resuelto', 10, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(24, 'Resuelto', 'Cerrado', 8, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(25, NULL, 'Pendiente', 9, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(25, 'Pendiente', 'Asignado', 1, DATE_SUB(NOW(), INTERVAL 25 DAY) + INTERVAL 1 HOUR),
(25, 'Asignado', 'En Proceso', 1, DATE_SUB(NOW(), INTERVAL 24 DAY)),
(25, 'En Proceso', 'Resuelto', 1, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(25, 'Resuelto', 'Cerrado', 9, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(26, NULL, 'Pendiente', 10, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(26, 'Pendiente', 'Asignado', 4, DATE_SUB(NOW(), INTERVAL 22 DAY) + INTERVAL 1 HOUR),
(26, 'Asignado', 'En Proceso', 4, DATE_SUB(NOW(), INTERVAL 21 DAY)),
(26, 'En Proceso', 'Resuelto', 4, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(26, 'Resuelto', 'Cerrado', 10, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(27, NULL, 'Pendiente', 11, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(27, 'Pendiente', 'Asignado', 5, DATE_SUB(NOW(), INTERVAL 30 DAY) + INTERVAL 1 HOUR),
(27, 'Asignado', 'En Proceso', 5, DATE_SUB(NOW(), INTERVAL 29 DAY)),
(27, 'En Proceso', 'Resuelto', 5, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(27, 'Resuelto', 'Cerrado', 11, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(28, NULL, 'Pendiente', 12, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(28, 'Pendiente', 'Asignado', 14, DATE_SUB(NOW(), INTERVAL 28 DAY) + INTERVAL 2 HOUR),
(28, 'Asignado', 'En Proceso', 14, DATE_SUB(NOW(), INTERVAL 27 DAY)),
(28, 'En Proceso', 'Resuelto', 14, DATE_SUB(NOW(), INTERVAL 23 DAY)),
(28, 'Resuelto', 'Cerrado', 12, DATE_SUB(NOW(), INTERVAL 23 DAY));

-- ========================================
-- ARCHIVADOR (EVIDENCIAS)
-- ========================================

-- Evidencias para diferentes estados del historial
INSERT INTO Archivador (HistoryTicketId, TicketId, Image, UploadDate) VALUES
-- Tickets En Proceso (evidencias al iniciar trabajo)
(15, 14, 'pared-fea.png', DATE_SUB(NOW(), INTERVAL 4 DAY));
-- ========================================
-- ASIGNACIONES
-- ========================================

INSERT INTO Assignments (TicketId, UserId, Assigned_Date, Remarks, Assignment_Method) VALUES
-- Tickets Asignados
(6, 1, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 30 MINUTE, 'Asignado por especialidad en redes.', 'Automático'),
(7, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 45 MINUTE, 'Asignado por experiencia en software.', 'Automático'),
(8, 4, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 1 HOUR, 'Asignado manualmente por administrador.', 'Manual'),
(9, 5, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 20 MINUTE, 'Asignación automática por disponibilidad.', 'Automático'),
(10, 1, DATE_SUB(NOW(), INTERVAL 6 HOUR) + INTERVAL 30 MINUTE, 'Asignado por disponibilidad.', 'Automático'),
(11, 4, DATE_SUB(NOW(), INTERVAL 8 HOUR) + INTERVAL 45 MINUTE, 'Asignado manualmente.', 'Manual'),
-- Tickets En Proceso
(12, 1, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 1 HOUR, 'Asignación automática por categoría.', 'Automático'),
(13, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 30 MINUTE, 'Asignado por especialidad académica.', 'Automático'),
(14, 14, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 2 HOUR, 'Asignación manual por tipo de infraestructura.', 'Manual'),
(15, 4, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 1 HOUR, 'Asignado automáticamente.', 'Automático'),
(16, 14, DATE_SUB(NOW(), INTERVAL 7 HOUR) + INTERVAL 1 HOUR, 'Asignación por carga de trabajo.', 'Automático'),
-- Tickets Resueltos
(17, 1, DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 1 HOUR, 'Asignación por especialidad en hardware.', 'Automático'),
(18, 10, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 30 MINUTE, 'Asignación automática por carga de trabajo.', 'Automático'),
(19, 2, DATE_SUB(NOW(), INTERVAL 8 DAY) + INTERVAL 2 HOUR, 'Asignado manualmente por complejidad.', 'Manual'),
(20, 2, DATE_SUB(NOW(), INTERVAL 18 DAY) + INTERVAL 2 HOUR, 'Asignación manual por complejidad.', 'Manual'),
-- Tickets Cerrados
(21, 14, DATE_SUB(NOW(), INTERVAL 15 DAY) + INTERVAL 2 HOUR, 'Asignación por especialidad en mantenimiento.', 'Automático'),
(22, 4, DATE_SUB(NOW(), INTERVAL 12 DAY) + INTERVAL 1 HOUR, 'Asignación automática.', 'Automático'),
(23, 1, DATE_SUB(NOW(), INTERVAL 10 DAY) + INTERVAL 1 HOUR, 'Asignado por especialidad en comunicaciones.', 'Automático'),
(24, 10, DATE_SUB(NOW(), INTERVAL 20 DAY) + INTERVAL 30 MINUTE, 'Asignación manual por prioridad.', 'Manual'),
(25, 1, DATE_SUB(NOW(), INTERVAL 25 DAY) + INTERVAL 1 HOUR, 'Asignación automática por categoría.', 'Automático'),
(26, 4, DATE_SUB(NOW(), INTERVAL 22 DAY) + INTERVAL 1 HOUR, 'Asignación automática.', 'Automático'),
(27, 5, DATE_SUB(NOW(), INTERVAL 30 DAY) + INTERVAL 1 HOUR, 'Asignación por especialidad.', 'Automático'),
(28, 14, DATE_SUB(NOW(), INTERVAL 28 DAY) + INTERVAL 2 HOUR, 'Asignado automáticamente.', 'Automático');

-- ========================================
-- VALORACIONES (Solo para tickets cerrados)
-- ========================================

INSERT INTO Ratings (TicketId, UserId, Rating, Comment, Rating_Date) VALUES
(21, 11, 5, 'Excelente servicio, problema resuelto rápidamente.', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(22, 12, 4, 'Buena atención, aunque tardó un poco más de lo esperado.', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(23, 7, 5, 'Muy profesional y eficiente. Quedé muy satisfecho.', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(24, 8, 4, 'Buen trabajo, el técnico explicó todo claramente.', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(25, 9, 5, 'Rápido y efectivo. Muy buen técnico.', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(26, 10, 3, 'Funciona, pero la explicación pudo ser mejor.', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(27, 11, 5, 'Excelente atención y seguimiento.', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(28, 12, 4, 'Buen servicio, cumplió con lo prometido.', DATE_SUB(NOW(), INTERVAL 23 DAY));





INSERT INTO TicketComments (TicketId, UserId, CommentText, CommentDate)
VALUES
(1, 2, 'Estoy revisando el problema de inicio de sesión.', '2025-10-25 09:30:00'),
(1, 3, 'Confirmo que el error ocurre solo en Chrome.', '2025-10-25 10:10:00'),
(2, 5, 'Se reemplazó el cable de red, el equipo ya conecta.', '2025-10-26 14:45:00'),
(3, 4, 'Pendiente de aprobación por parte del supervisor.', '2025-10-27 08:20:00'),
(4, 2, 'Actualicé el sistema operativo, funciona correctamente.', '2025-10-27 15:00:00'),
(5, 6, 'El usuario confirmó que el error persiste, reabrí el ticket.', '2025-10-28 09:10:00'),
(6, 2, 'Asignado al técnico Juan Pérez para seguimiento.', '2025-10-28 10:00:00'),
(7, 7, 'Se resolvió reiniciando el servidor de base de datos.', '2025-10-29 13:30:00'),
(8, 8, 'El problema se debe a permisos de usuario, ya corregido.', '2025-10-30 11:00:00'),
(9, 3, 'Falta documentación adjunta del usuario.', '2025-10-30 12:15:00');



INSERT INTO UserTickets (UserId, TicketId) values
(9, 29),
(9, 30),
(9, 31),
(9, 32),
(9, 33);

INSERT INTO Users 
(InsuranceId, UserName, Email, Password, RoleId, Last_Login, InstitutionId, PositionId, State, Work_Charge, Active) 
VALUES
(1, 'admin_ashley', 'ashley.admin@helpdesk.com', 'admin123', 3, NOW(), NULL, NULL, TRUE, 'System Administrator', TRUE);



-- Category 1: Academic Services
INSERT INTO Category_Specialities (CategoryId, SpecialityId) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8);

INSERT INTO Category_Tags (CategoryId, TagId) VALUES
(1, 1),  -- Schedules
(1, 2),  -- Enrollments
(1, 3),  -- Scholarships
(1, 4),  -- Records
(1, 5),  -- Evaluations
(1, 6),  -- Grades
(1, 7),  -- Certifications
(1, 8);  -- Library


-- Category 2: Student & Administrative Services
INSERT INTO Category_Specialities (CategoryId, SpecialityId) VALUES
(2, 4),
(2, 5),
(2, 7),
(2, 8);

INSERT INTO Category_Tags (CategoryId, TagId) VALUES
(2, 4),   -- Records
(2, 9),   -- Transportation
(2, 10),  -- Extracurricular Activities
(2, 11),  -- Student Orientation
(2, 12),  -- Administrative Procedures
(2, 13);  -- Payments


-- Category 3: Technology
INSERT INTO Category_Specialities (CategoryId, SpecialityId) VALUES
(3, 9),
(3, 10),
(3, 11);

INSERT INTO Category_Tags (CategoryId, TagId) VALUES
(3, 14), -- Hardware
(3, 15), -- Software
(3, 16), -- Connectivity
(3, 17), -- Computer Labs
(3, 18); -- Virtual Campus


-- Category 4: Physical Infrastructure and Maintenance
INSERT INTO Category_Specialities (CategoryId, SpecialityId) VALUES
(4, 12),
(4, 13),
(4, 14),
(4, 15);

INSERT INTO Category_Tags (CategoryId, TagId) VALUES
(4, 19), -- Classrooms
(4, 20), -- Furniture
(4, 21), -- Lighting
(4, 22), -- Security
(4, 23), -- Cleaning
(4, 24), -- Accessibility
(4, 25); -- Sports Areas

INSERT INTO Users
(InsuranceId, UserName, Email, Password, RoleId, Last_Login, InstitutionId, State, Work_Charge, Active)
VALUES
(1, 'Javier Milei', 'ThePowerOfFriendShip@gmail.com', 'Sored123456', 2, null, 1, TRUE, 'Usuario Cliente', TRUE);


INSERT INTO Autotriage (CategoryId, PriorityMin, SpecialityId, RuleOrder, Active)
VALUES
    (1, 2, 1, 1, TRUE),   -- R1: Hardware, prioridad >= Media (2), Soporte Hardware
    (2, NULL, 2, 2, TRUE),-- R2: Redes, todas las prioridades, especialidad Redes
    (3, NULL, 3, 3, TRUE);-- R3: Soporte Usuario Final, todas, Helpdesk


ALTER TABLE `dbacademyhelpdesk`.`notifications` 
ADD COLUMN `TriggeredByUserId` INT(11) NULL DEFAULT NULL AFTER `Active`,
ADD COLUMN `EventType` VARCHAR(45) NULL DEFAULT NULL AFTER `TriggeredByUserId`;
ADD COLUMN `LastStateTicket` VARCHAR(45) NULL DEFAULT NULL AFTER `EventType`,
ADD COLUMN `ActualStateTicket` VARCHAR(45) NULL DEFAULT NULL AFTER `LastStateTicket`;

INSERT INTO Technician_Specialities (UserId, SpecialityId)
VALUES (1, 1);



--123LOL
UPDATE Users 
SET Password = '$2a$12$ZXKWkA.3Fm11Dx5VkeB1muDF8GQMQ7WXGqgP.xy5vumG/DXakREum'
WHERE Email = 'fabian.secr@helpdesk.com';