USE [master]
GO
/****** Object:  Database [StudentAttendanceSystem]    Script Date: 4/9/2024 5:46:10 PM ******/
CREATE DATABASE [StudentAttendanceSystem]
 CONTAINMENT = NONE
 ON  PRIMARY 
 /****** Auto Generated Path ******/
--( NAME = N'StudentAttendanceSystem', FILENAME = N'C:\Irene AppsFiles\New folder (2)\MSSQL16.SQLEXPRESS\MSSQL\DATA\StudentAttendanceSystem.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
-- LOG ON 
--( NAME = N'StudentAttendanceSystem_log', FILENAME = N'C:\Irene AppsFiles\New folder (2)\MSSQL16.SQLEXPRESS\MSSQL\DATA\StudentAttendanceSystem_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
-- WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
( NAME = N'StudentAttendanceSystem', FILENAME = 'StudentAttendanceSystem.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
LOG ON 
( NAME = N'StudentAttendanceSystem_log', FILENAME = 'StudentAttendanceSystem_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
/****** ================== ******/
ALTER DATABASE [StudentAttendanceSystem] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [StudentAttendanceSystem].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [StudentAttendanceSystem] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET ARITHABORT OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [StudentAttendanceSystem] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [StudentAttendanceSystem] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET  DISABLE_BROKER 
GO
ALTER DATABASE [StudentAttendanceSystem] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [StudentAttendanceSystem] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [StudentAttendanceSystem] SET  MULTI_USER 
GO
ALTER DATABASE [StudentAttendanceSystem] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [StudentAttendanceSystem] SET DB_CHAINING OFF 
GO
ALTER DATABASE [StudentAttendanceSystem] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [StudentAttendanceSystem] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [StudentAttendanceSystem] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [StudentAttendanceSystem] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [StudentAttendanceSystem] SET QUERY_STORE = ON
GO
ALTER DATABASE [StudentAttendanceSystem] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [StudentAttendanceSystem]
GO
/****** Object:  Table [dbo].[adminProgramme]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[adminProgramme](
	[apID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NULL,
	[programmeID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[apID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[attendanceRecord]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[attendanceRecord](
	[recordID] [int] IDENTITY(1,1) NOT NULL,
	[attendanceCode] [varchar](10) NOT NULL,
	[Date] [date] NOT NULL,
	[startTime] [time](7) NULL,
	[endTime] [time](7) NULL,
	[courseID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[recordID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[course]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[course](
	[courseID] [int] IDENTITY(1,1) NOT NULL,
	[programmeID] [int] NOT NULL,
	[semesterID] [int] NOT NULL,
	[courseCode] [varchar](10) NOT NULL,
	[courseName] [varchar](80) NOT NULL,
	[courseSession] [varchar](15) NOT NULL,
	[lecturerID] [varchar](20) NOT NULL,
	[courseActive] [bit] NULL,
	[attendanceCodeMode] [varchar](10) NULL,
	[attendanceCodeDuration] [int] NULL,
	[classDay] [varchar](15) NULL,
PRIMARY KEY CLUSTERED 
(
	[courseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[courseSemester]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[courseSemester](
	[semesterID] [int] IDENTITY(1,1) NOT NULL,
	[startWeek] [date] NOT NULL,
	[endWeek] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[semesterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[enrolledStudent]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[enrolledStudent](
	[enrolledID] [int] IDENTITY(1,1) NOT NULL,
	[studentID] [varchar](15) NOT NULL,
	[courseID] [int] NOT NULL,
	[studentName] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[enrolledID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feedback]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feedback](
	[feedbackId] [int] IDENTITY(1,1) NOT NULL,
	[studentId] [nvarchar](15) NOT NULL,
	[rating] [int] NOT NULL,
	[feedbackContent] [nvarchar](max) NULL,
	[date] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[feedbackId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[programme]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[programme](
	[programmeID] [int] IDENTITY(1,1) NOT NULL,
	[programmeName] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[programmeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[studentAttendance]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[studentAttendance](
	[attendanceID] [int] IDENTITY(1,1) NOT NULL,
	[studentID] [varchar](15) NOT NULL,
	[DateAndTime] [datetime] NOT NULL,
	[courseID] [int] NULL,
	[remark] [varchar](255) NULL,
	[recordID] [int] NOT NULL,
	[deviceID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[attendanceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_attendanceRecord_recordID_device] UNIQUE NONCLUSTERED 
(
	[recordID] ASC,
	[deviceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_attendanceRecord_recordID_student] UNIQUE NONCLUSTERED 
(
	[recordID] ASC,
	[studentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[studentDevice]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[studentDevice](
	[deviceID] [int] IDENTITY(1,1) NOT NULL,
	[studentID] [varchar](15) NOT NULL,
	[deviceCode] [varchar](255) NULL,
	[deviceType] [varchar](255) NULL,
	---[deviceOS] [varchar](255) NULL, /*** un-used ****/
	---[macAddress] [varchar](255) NULL, /*** un-used ****/
	[bindDate] [date] NULL,
	[uuID] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[deviceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userDetail]    Script Date: 4/9/2024 5:46:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userDetail](
	[userID] [int] IDENTITY(1,1) NOT NULL,
	[userName] [varchar](50) NULL,
	[studentID] [varchar](15) NULL,
	[lecturerID] [varchar](15) NULL,
	[email] [varchar](50) NULL,
	[userPassword] [varchar](255) NULL,
	[accRole] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[userID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Feedback] ADD  DEFAULT (getdate()) FOR [date]
GO
ALTER TABLE [dbo].[adminProgramme]  WITH CHECK ADD FOREIGN KEY([programmeID])
REFERENCES [dbo].[programme] ([programmeID])
GO
ALTER TABLE [dbo].[adminProgramme]  WITH CHECK ADD FOREIGN KEY([userID])
REFERENCES [dbo].[userDetail] ([userID])
GO
ALTER TABLE [dbo].[attendanceRecord]  WITH CHECK ADD FOREIGN KEY([courseID])
REFERENCES [dbo].[course] ([courseID])
GO
ALTER TABLE [dbo].[course]  WITH CHECK ADD FOREIGN KEY([programmeID])
REFERENCES [dbo].[programme] ([programmeID])
GO
ALTER TABLE [dbo].[course]  WITH CHECK ADD FOREIGN KEY([semesterID])
REFERENCES [dbo].[courseSemester] ([semesterID])
GO
ALTER TABLE [dbo].[enrolledStudent]  WITH CHECK ADD FOREIGN KEY([courseID])
REFERENCES [dbo].[course] ([courseID])
GO
ALTER TABLE [dbo].[studentAttendance]  WITH CHECK ADD FOREIGN KEY([courseID])
REFERENCES [dbo].[course] ([courseID])
GO
ALTER TABLE [dbo].[studentAttendance]  WITH CHECK ADD  CONSTRAINT [FK_studentAttendance_attendanceRecord] FOREIGN KEY([recordID])
REFERENCES [dbo].[attendanceRecord] ([recordID])
GO
ALTER TABLE [dbo].[studentAttendance] CHECK CONSTRAINT [FK_studentAttendance_attendanceRecord]
GO
ALTER TABLE [dbo].[studentAttendance]  WITH CHECK ADD  CONSTRAINT [FK_studentAttendance_course] FOREIGN KEY([courseID])
REFERENCES [dbo].[course] ([courseID])
GO
ALTER TABLE [dbo].[studentAttendance] CHECK CONSTRAINT [FK_studentAttendance_course]
GO
ALTER TABLE [dbo].[studentAttendance]  WITH CHECK ADD  CONSTRAINT [FK_studentAttendance_studentDevice] FOREIGN KEY([deviceID])
REFERENCES [dbo].[studentDevice] ([deviceID])
GO
ALTER TABLE [dbo].[studentAttendance] CHECK CONSTRAINT [FK_studentAttendance_studentDevice]
GO
USE [master]
GO
ALTER DATABASE [StudentAttendanceSystem] SET  READ_WRITE 
GO
/********* Insert Dummy Data **********/
INSERT INTO [dbo].[userDetail] (userName, lecturerID, email, accRole, userPassword) 
VALUES 
('admin123', 'admin001', 'ADM123@uts.edu.my', 'Admin', 'admin123'),
('irene123', 'LEC001', 'irene123@uts.edu.my', 'Lecturer', 'irene123');
INSERT INTO [dbo].[userDetail] (userName, studentID, email, accRole, userPassword) 
VALUES 
('Irene', 'SDT12345678', 'SDT12345678@student.uts.edu.my', 'Student', 'Irene123');
GO

