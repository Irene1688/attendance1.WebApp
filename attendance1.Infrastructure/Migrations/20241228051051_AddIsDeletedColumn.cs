using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "userDetail",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "programme",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "enrolledStudent",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "courseSemester",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "course",
                type: "bit",
                nullable: true,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "userDetail");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "programme");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "enrolledStudent");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "courseSemester");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "course");
        }
    }
}
