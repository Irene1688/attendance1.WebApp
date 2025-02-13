using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Delete_AdminProgramme_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "adminProgramme");

            migrationBuilder.AlterColumn<int>(
                name: "userId",
                table: "studentDevice",
                type: "int",
                nullable: true,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "userId",
                table: "studentDevice",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "adminProgramme",
                columns: table => new
                {
                    apID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    programmeID = table.Column<int>(type: "int", nullable: true),
                    userID = table.Column<int>(type: "int", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_adminProgramme_programmeID",
                table: "adminProgramme",
                column: "programmeID");

            migrationBuilder.CreateIndex(
                name: "IX_adminProgramme_userID",
                table: "adminProgramme",
                column: "userID");
        }
    }
}
