IF OBJECT_ID('dbo.StaffTask', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.StaffTask (
        task_id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(150) NOT NULL,
        task_type NVARCHAR(50) NOT NULL,
        description NVARCHAR(1000) NULL,
        priority NVARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
        status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
        due_at DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        completed_at DATETIME2 NULL,
        resolution_note NVARCHAR(1000) NULL,
        assigned_staff_id INT NULL,
        created_by_user_id INT NULL,
        room_id INT NULL,
        CONSTRAINT FK_StaffTask_Staff FOREIGN KEY (assigned_staff_id) REFERENCES dbo.Staffs(staff_id),
        CONSTRAINT FK_StaffTask_User FOREIGN KEY (created_by_user_id) REFERENCES dbo.[User](user_id),
        CONSTRAINT FK_StaffTask_Room FOREIGN KEY (room_id) REFERENCES dbo.Room(room_id)
    );
END
