using System;
using System.Collections.Generic;
using attendance1.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace attendance1.Infrastructure.Persistence.Contexts;

public partial class ApplicationDbContext : DbContext
{
    // public ApplicationDbContext()
    // {
    // }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AttendanceRecord> AttendanceRecords { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<CourseSemester> CourseSemesters { get; set; }

    public virtual DbSet<EnrolledStudent> EnrolledStudents { get; set; }

    public virtual DbSet<Programme> Programmes { get; set; }

    public virtual DbSet<StudentAttendance> StudentAttendances { get; set; }

    public virtual DbSet<StudentDevice> StudentDevices { get; set; }

    public virtual DbSet<Tutorial> Tutorials { get; set; }

    public virtual DbSet<UserDetail> UserDetails { get; set; }

//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//         => optionsBuilder.UseSqlServer("Data Source=IRENE\\SQLEXPRESS;Initial Catalog=StudentAttendanceSystem;User ID=irene;Password=Root-123;Encrypt=False;Trust Server Certificate=True;");

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Only configure the connection if it hasn't been configured
        if (!optionsBuilder.IsConfigured)
        {
            //optionsBuilder.UseSqlServer("Data Source=127.0.0.1,1434;Initial Catalog=StudentAttendanceSystem;User ID=sa;Password=yourStrong(!)Password;Encrypt=False;TrustServerCertificate=True");
            optionsBuilder.UseSqlServer("Data Source=127.0.0.1,1434;Initial Catalog=StudentAttendanceSystem;User ID=sa;Password=yourStrong(!)Password;Encrypt=False;TrustServerCertificate=True");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AttendanceRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__attendan__D825197EC0BDBED7");

            entity.ToTable("attendanceRecord");

            entity.Property(e => e.RecordId).HasColumnName("recordID");
            entity.Property(e => e.AttendanceCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("attendanceCode");
            entity.Property(e => e.CourseId).HasColumnName("courseID");
            entity.Property(e => e.TutorialId).HasColumnName("tutorialID");
            entity.Property(e => e.EndTime).HasColumnName("endTime");
            entity.Property(e => e.StartTime).HasColumnName("startTime");
            entity.Property(e => e.IsLecture)
                .HasColumnName("isLecture")
                .HasDefaultValue(true);
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");

            entity.HasOne(d => d.Course).WithMany(p => p.AttendanceRecords)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__attendanc__cours__4E88ABD4");

            entity.HasOne(d => d.Tutorial).WithMany(p => p.AttendanceRecords)
                .HasForeignKey(d => d.TutorialId)
                .HasConstraintName("FK__attendanc__tutor__4E88ABD4");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("PK__course__2AA84FF16AF6CCB1");

            entity.ToTable("course");

            entity.Property(e => e.CourseId).HasColumnName("courseID");
            entity.Property(e => e.AttendanceCodeDuration).HasColumnName("attendanceCodeDuration");
            entity.Property(e => e.AttendanceCodeMode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("attendanceCodeMode");
            entity.Property(e => e.ClassDay)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("classDay");
            entity.Property(e => e.CourseActive).HasColumnName("courseActive");
            entity.Property(e => e.CourseCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("courseCode");
            entity.Property(e => e.CourseName)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("courseName");
            entity.Property(e => e.CourseSession)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("courseSession");
            entity.Property(e => e.LecturerId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("lecturerID");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");
            entity.Property(e => e.ProgrammeId).HasColumnName("programmeID");
            entity.Property(e => e.SemesterId).HasColumnName("semesterID");

            entity.HasOne(d => d.Programme).WithMany(p => p.Courses)
                .HasForeignKey(d => d.ProgrammeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__course__programm__6FE99F9F");

            entity.HasOne(d => d.Semester).WithMany(p => p.Courses)
                .HasForeignKey(d => d.SemesterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__course__semester__440B1D61");
        });

        modelBuilder.Entity<CourseSemester>(entity =>
        {
            entity.HasKey(e => e.SemesterId).HasName("PK__courseSe__F2F37EA7D72E5851");

            entity.ToTable("courseSemester");

            entity.Property(e => e.SemesterId).HasColumnName("semesterID");
            entity.Property(e => e.EndWeek).HasColumnName("endWeek");
            entity.Property(e => e.StartWeek).HasColumnName("startWeek");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");
        });

        modelBuilder.Entity<EnrolledStudent>(entity =>
        {
            entity.HasKey(e => e.EnrolledId).HasName("PK__enrolled__FF4DB9ECBAF09176");

            entity.ToTable("enrolledStudent");

            entity.Property(e => e.EnrolledId).HasColumnName("enrolledID");
            entity.Property(e => e.CourseId).HasColumnName("courseID");
            entity.Property(e => e.TutorialId).HasColumnName("tutorialID");
            entity.Property(e => e.StudentId)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("studentID");
            entity.Property(e => e.StudentName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("studentName");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");

            entity.HasOne(d => d.Course).WithMany(p => p.EnrolledStudents)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__enrolledS__cours__46E78A0C");

            entity.HasOne(d => d.Tutorial).WithMany(p => p.EnrolledStudents)
                .HasForeignKey(d => d.TutorialId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__enrolledS__tutor__46E78A0C");
        });

        modelBuilder.Entity<Programme>(entity =>
        {
            entity.HasKey(e => e.ProgrammeId).HasName("PK__tmp_ms_x__E49167C24EC7D561");

            entity.ToTable("programme");

            entity.Property(e => e.ProgrammeId).HasColumnName("programmeID");
            entity.Property(e => e.ProgrammeName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("programmeName");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");
        });

        modelBuilder.Entity<StudentAttendance>(entity =>
        {
            entity.HasKey(e => e.AttendanceId).HasName("PK__studentA__0F09E0C6A1440102");

            entity.ToTable("studentAttendance");

            entity.HasIndex(e => new { e.RecordId, e.StudentId }, "UQ_attendanceRecord_recordID_student").IsUnique();

            entity.Property(e => e.AttendanceId).HasColumnName("attendanceID");
            entity.Property(e => e.CourseId).HasColumnName("courseID");
            entity.Property(e => e.DateAndTime).HasColumnType("datetime");
            entity.Property(e => e.RecordId).HasColumnName("recordID");
            entity.Property(e => e.IsPresent).HasColumnName("isPresent");
            entity.Property(e => e.Remark)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("remark");
            entity.Property(e => e.StudentId)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("studentID");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");

            entity.HasOne(d => d.Course).WithMany(p => p.StudentAttendances)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("FK__studentAt__cours__49C3F6B7");

            entity.HasOne(d => d.Record).WithMany(p => p.StudentAttendances)
                .HasForeignKey(d => d.RecordId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_studentAttendance_attendanceRecord");
        });

        modelBuilder.Entity<StudentDevice>(entity =>
        {
            entity.HasKey(e => e.DeviceId).HasName("PK__studentD__84BE14B71B8283B5");

            entity.ToTable("studentDevice");
            
            entity.HasOne(d => d.Student)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.DeviceId).HasColumnName("deviceID");
            entity.Property(e => e.UserId).HasColumnName("userId");
            entity.Property(e => e.BindDate).HasColumnName("bindDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive")
                .HasDefaultValue(true);
            entity.Property(e => e.StudentId)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("studentID");
            entity.Property(e => e.FingerprintHash)
                .IsRequired()
                .HasMaxLength(256)
                .HasColumnName("fingerprintHash");
        });

        modelBuilder.Entity<Tutorial>(entity =>
        {
            entity.HasKey(e => e.TutorialId).HasName("PK__tutorial__2613FD240A0EE6B7");

            entity.ToTable("tutorial");

            entity.Property(e => e.TutorialId).HasColumnName("tutorialID");
            entity.Property(e => e.TutorialName).HasColumnName("tutorialName");
            entity.Property(e => e.TutorialClassDay).HasColumnName("tutorialClassDay");
            entity.Property(e => e.CourseId).HasColumnName("courseID");
            entity.Property(e => e.LectureId)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("lecturerID");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");
            entity.HasOne(d => d.Course).WithMany(p => p.Tutorials)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tutorial__course__49C3F6B7");
            
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__userDeta__CB9A1CDF97B60F3A");

            entity.ToTable("userDetail");

            entity.Property(e => e.UserId).HasColumnName("userID");
            entity.Property(e => e.AccRole)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("accRole");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.LecturerId)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("lecturerID");
            entity.Property(e => e.StudentId)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("studentID");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.UserPassword)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("userPassword");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted")
                .HasDefaultValue(false)
                .HasColumnName("isDeleted");
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("refreshToken");
            entity.Property(e => e.RefreshTokenExpiryTime)
                .HasColumnType("datetime")
                .HasColumnName("refreshTokenExpiryTime");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
