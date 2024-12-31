using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTutorialIdToAttendanceRecordTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "tutorialID",
                table: "attendanceRecord",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_attendanceRecord_tutorialID",
                table: "attendanceRecord",
                column: "tutorialID");

            migrationBuilder.AddForeignKey(
                name: "FK__attendanc__tutor__4E88ABD4",
                table: "attendanceRecord",
                column: "tutorialID",
                principalTable: "tutorial",
                principalColumn: "tutorialID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__attendanc__tutor__4E88ABD4",
                table: "attendanceRecord");

            migrationBuilder.DropIndex(
                name: "IX_attendanceRecord_tutorialID",
                table: "attendanceRecord");

            migrationBuilder.DropColumn(
                name: "tutorialID",
                table: "attendanceRecord");
        }
    }
}
