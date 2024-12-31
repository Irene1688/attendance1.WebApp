using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace attendance1.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshTokenColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "refreshToken",
                table: "userDetail",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "refreshTokenExpiryTime",
                table: "userDetail",
                type: "datetime",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "refreshToken",
                table: "userDetail");

            migrationBuilder.DropColumn(
                name: "refreshTokenExpiryTime",
                table: "userDetail");
        }
    }
}
