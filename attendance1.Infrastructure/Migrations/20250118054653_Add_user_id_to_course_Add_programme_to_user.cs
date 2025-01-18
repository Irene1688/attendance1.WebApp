using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_user_id_to_course_Add_programme_to_user : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProgrammeId",
                table: "userDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "course",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_userDetail_ProgrammeId",
                table: "userDetail",
                column: "ProgrammeId");

            migrationBuilder.CreateIndex(
                name: "IX_course_UserId",
                table: "course",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_course_userDetail_UserId",
                table: "course",
                column: "UserId",
                principalTable: "userDetail",
                principalColumn: "userID");

            migrationBuilder.AddForeignKey(
                name: "FK_userDetail_programme_ProgrammeId",
                table: "userDetail",
                column: "ProgrammeId",
                principalTable: "programme",
                principalColumn: "programmeID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_course_userDetail_UserId",
                table: "course");

            migrationBuilder.DropForeignKey(
                name: "FK_userDetail_programme_ProgrammeId",
                table: "userDetail");

            migrationBuilder.DropIndex(
                name: "IX_userDetail_ProgrammeId",
                table: "userDetail");

            migrationBuilder.DropIndex(
                name: "IX_course_UserId",
                table: "course");

            migrationBuilder.DropColumn(
                name: "ProgrammeId",
                table: "userDetail");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "course");
        }
    }
}
