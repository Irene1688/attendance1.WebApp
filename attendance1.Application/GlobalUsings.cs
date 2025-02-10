global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.AspNetCore.Http;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Logging;
global using Microsoft.Extensions.Options;
global using Microsoft.IdentityModel.Tokens;

global using System.IdentityModel.Tokens.Jwt;
global using System.Globalization;
global using System.Net;
global using System.Runtime.CompilerServices;
global using System.Security.Claims;
global using System.Security.Cryptography;
global using System.Text;
global using System.Text.Json;
global using System.Text.RegularExpressions;

// Interfaces
global using attendance1.Application.Interfaces;
global using attendance1.Domain.Interfaces;

// Services
global using attendance1.Application.Services;

// DTOs
global using attendance1.Application.DTOs.Models;
global using attendance1.Application.DTOs.AccountDTOs;
global using attendance1.Application.DTOs.Admin;
global using attendance1.Application.DTOs.AttendanceDTOs;
global using attendance1.Application.DTOs.AuthDTOs;
global using attendance1.Application.DTOs.CommonDTOs;
global using attendance1.Application.DTOs.CourseDTOs;
global using attendance1.Application.DTOs.Lecturer;
global using attendance1.Application.DTOs.LecturerDTOs;
global using attendance1.Application.DTOs.ProfileDTODs;
global using attendance1.Application.DTOs.ProgrammeDTOs;
global using attendance1.Application.DTOs.StudentDTOs;

// Other custom usings
global using attendance1.Application.Common.Enum;
global using attendance1.Application.Common.Logging;
global using attendance1.Application.Common.Response;
global using attendance1.Application.Common.Settings;
global using attendance1.Application.Extensions;
global using attendance1.Domain.Entities;
