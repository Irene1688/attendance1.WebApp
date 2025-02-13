using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "courseSemester",
                columns: table => new
                {
                    semesterID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    startWeek = table.Column<DateOnly>(type: "date", nullable: false),
                    endWeek = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__courseSe__F2F37EA7D72E5851", x => x.semesterID);
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    feedbackId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    studentId = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false),
                    feedbackContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Feedback__2613FD240A0EE6B7", x => x.feedbackId);
                });

            migrationBuilder.CreateTable(
                name: "programme",
                columns: table => new
                {
                    programmeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    programmeName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tmp_ms_x__E49167C24EC7D561", x => x.programmeID);
                });

            migrationBuilder.CreateTable(
                name: "studentDevice",
                columns: table => new
                {
                    deviceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    studentID = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    deviceCode = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    deviceType = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    deviceOS = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    macAddress = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    bindDate = table.Column<DateOnly>(type: "date", nullable: true),
                    uuID = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__studentD__84BE14B71B8283B5", x => x.deviceID);
                });

            migrationBuilder.CreateTable(
                name: "userDetail",
                columns: table => new
                {
                    userID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    studentID = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    lecturerID = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    email = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    userPassword = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    accRole = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__userDeta__CB9A1CDF97B60F3A", x => x.userID);
                });

            migrationBuilder.CreateTable(
                name: "course",
                columns: table => new
                {
                    courseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    programmeID = table.Column<int>(type: "int", nullable: false),
                    semesterID = table.Column<int>(type: "int", nullable: false),
                    courseCode = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    courseName = table.Column<string>(type: "varchar(80)", unicode: false, maxLength: 80, nullable: false),
                    courseSession = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    lecturerID = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    courseActive = table.Column<bool>(type: "bit", nullable: true),
                    attendanceCodeMode = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    attendanceCodeDuration = table.Column<int>(type: "int", nullable: true),
                    classDay = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__course__2AA84FF16AF6CCB1", x => x.courseID);
                    table.ForeignKey(
                        name: "FK__course__programm__6FE99F9F",
                        column: x => x.programmeID,
                        principalTable: "programme",
                        principalColumn: "programmeID");
                    table.ForeignKey(
                        name: "FK__course__semester__440B1D61",
                        column: x => x.semesterID,
                        principalTable: "courseSemester",
                        principalColumn: "semesterID");
                });

            migrationBuilder.CreateTable(
                name: "adminProgramme",
                columns: table => new
                {
                    apID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userID = table.Column<int>(type: "int", nullable: true),
                    programmeID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__adminPro__5A28C0A8C465DF30", x => x.apID);
                    table.ForeignKey(
                        name: "FK__adminProg__progr__03F0984C",
                        column: x => x.programmeID,
                        principalTable: "programme",
                        principalColumn: "programmeID");
                    table.ForeignKey(
                        name: "FK__adminProg__userI__02FC7413",
                        column: x => x.userID,
                        principalTable: "userDetail",
                        principalColumn: "userID");
                });

            migrationBuilder.CreateTable(
                name: "attendanceRecord",
                columns: table => new
                {
                    recordID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    attendanceCode = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    startTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    endTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    courseID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__attendan__D825197EC0BDBED7", x => x.recordID);
                    table.ForeignKey(
                        name: "FK__attendanc__cours__4E88ABD4",
                        column: x => x.courseID,
                        principalTable: "course",
                        principalColumn: "courseID");
                });

            migrationBuilder.CreateTable(
                name: "enrolledStudent",
                columns: table => new
                {
                    enrolledID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    studentID = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    courseID = table.Column<int>(type: "int", nullable: false),
                    studentName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__enrolled__FF4DB9ECBAF09176", x => x.enrolledID);
                    table.ForeignKey(
                        name: "FK__enrolledS__cours__46E78A0C",
                        column: x => x.courseID,
                        principalTable: "course",
                        principalColumn: "courseID");
                });

            migrationBuilder.CreateTable(
                name: "studentAttendance",
                columns: table => new
                {
                    attendanceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    studentID = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    DateAndTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    courseID = table.Column<int>(type: "int", nullable: true),
                    remark = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    recordID = table.Column<int>(type: "int", nullable: false),
                    deviceID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__studentA__0F09E0C6A1440102", x => x.attendanceID);
                    table.ForeignKey(
                        name: "FK__studentAt__cours__49C3F6B7",
                        column: x => x.courseID,
                        principalTable: "course",
                        principalColumn: "courseID");
                    table.ForeignKey(
                        name: "FK_studentAttendance_attendanceRecord",
                        column: x => x.recordID,
                        principalTable: "attendanceRecord",
                        principalColumn: "recordID");
                    table.ForeignKey(
                        name: "FK_studentAttendance_studentDevice",
                        column: x => x.deviceID,
                        principalTable: "studentDevice",
                        principalColumn: "deviceID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_adminProgramme_programmeID",
                table: "adminProgramme",
                column: "programmeID");

            migrationBuilder.CreateIndex(
                name: "IX_adminProgramme_userID",
                table: "adminProgramme",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_attendanceRecord_courseID",
                table: "attendanceRecord",
                column: "courseID");

            migrationBuilder.CreateIndex(
                name: "IX_course_programmeID",
                table: "course",
                column: "programmeID");

            migrationBuilder.CreateIndex(
                name: "IX_course_semesterID",
                table: "course",
                column: "semesterID");

            migrationBuilder.CreateIndex(
                name: "IX_enrolledStudent_courseID",
                table: "enrolledStudent",
                column: "courseID");

            migrationBuilder.CreateIndex(
                name: "IX_studentAttendance_courseID",
                table: "studentAttendance",
                column: "courseID");

            migrationBuilder.CreateIndex(
                name: "IX_studentAttendance_deviceID",
                table: "studentAttendance",
                column: "deviceID");

            migrationBuilder.CreateIndex(
                name: "UQ_attendanceRecord_recordID_device",
                table: "studentAttendance",
                columns: new[] { "recordID", "deviceID" },
                unique: true,
                filter: "[deviceID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ_attendanceRecord_recordID_student",
                table: "studentAttendance",
                columns: new[] { "recordID", "studentID" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "adminProgramme");

            migrationBuilder.DropTable(
                name: "enrolledStudent");

            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "studentAttendance");

            migrationBuilder.DropTable(
                name: "userDetail");

            migrationBuilder.DropTable(
                name: "attendanceRecord");

            migrationBuilder.DropTable(
                name: "studentDevice");

            migrationBuilder.DropTable(
                name: "course");

            migrationBuilder.DropTable(
                name: "programme");

            migrationBuilder.DropTable(
                name: "courseSemester");
        }
    }
}
