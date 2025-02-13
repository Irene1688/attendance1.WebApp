using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Change_Student_Device_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_studentAttendance_studentDevice",
            //    table: "studentAttendance");

            migrationBuilder.DropColumn(
                name: "deviceCode",
                table: "studentDevice");

            migrationBuilder.DropColumn(
                name: "deviceOS",
                table: "studentDevice");

            migrationBuilder.DropColumn(
                name: "deviceType",
                table: "studentDevice");

            migrationBuilder.DropColumn(
                name: "macAddress",
                table: "studentDevice");

            migrationBuilder.DropColumn(
                name: "uuID",
                table: "studentDevice");

            //migrationBuilder.DropColumn(
            //    name: "deviceID",
            //    table: "studentAttendance");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "bindDate",
                table: "studentDevice",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "fingerprintHash",
                table: "studentDevice",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "isActive",
                table: "studentDevice",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "userId",
                table: "studentDevice",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_studentDevice_userId",
                table: "studentDevice",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_studentDevice_userDetail_userId",
                table: "studentDevice",
                column: "userId",
                principalTable: "userDetail",
                principalColumn: "userID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_studentDevice_userDetail_userId",
                table: "studentDevice");

            migrationBuilder.DropIndex(
                name: "IX_studentDevice_userId",
                table: "studentDevice");

            migrationBuilder.DropColumn(
                name: "fingerprintHash",
                table: "studentDevice");

            migrationBuilder.DropColumn(
                name: "isActive",
                table: "studentDevice");

            migrationBuilder.DropColumn(
                name: "userId",
                table: "studentDevice");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "bindDate",
                table: "studentDevice",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AddColumn<string>(
                name: "deviceCode",
                table: "studentDevice",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deviceOS",
                table: "studentDevice",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deviceType",
                table: "studentDevice",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "macAddress",
                table: "studentDevice",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "uuID",
                table: "studentDevice",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "deviceID",
                table: "studentAttendance",
                type: "int",
                nullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_studentAttendance_studentDevice",
                table: "studentAttendance",
                column: "deviceID",
                principalTable: "studentDevice",
                principalColumn: "deviceID");
        }
    }
}
