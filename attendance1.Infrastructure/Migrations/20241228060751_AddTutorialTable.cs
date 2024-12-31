using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTutorialTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "tutorialID",
                table: "enrolledStudent",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "tutorial",
                columns: table => new
                {
                    tutorialID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tutorialName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tutorialClassDay = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    courseID = table.Column<int>(type: "int", nullable: false),
                    lecturerID = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    UserDetailUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tutorial__2613FD240A0EE6B7", x => x.tutorialID);
                    table.ForeignKey(
                        name: "FK__tutorial__course__49C3F6B7",
                        column: x => x.courseID,
                        principalTable: "course",
                        principalColumn: "courseID");
                    table.ForeignKey(
                        name: "FK_tutorial_userDetail_UserDetailUserId",
                        column: x => x.UserDetailUserId,
                        principalTable: "userDetail",
                        principalColumn: "userID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_enrolledStudent_tutorialID",
                table: "enrolledStudent",
                column: "tutorialID");

            migrationBuilder.CreateIndex(
                name: "IX_tutorial_courseID",
                table: "tutorial",
                column: "courseID");

            migrationBuilder.CreateIndex(
                name: "IX_tutorial_UserDetailUserId",
                table: "tutorial",
                column: "UserDetailUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__enrolledS__tutor__46E78A0C",
                table: "enrolledStudent");

            migrationBuilder.DropTable(
                name: "tutorial");

            migrationBuilder.DropIndex(
                name: "IX_enrolledStudent_tutorialID",
                table: "enrolledStudent");

            migrationBuilder.DropColumn(
                name: "tutorialID",
                table: "enrolledStudent");
        }
    }
}
