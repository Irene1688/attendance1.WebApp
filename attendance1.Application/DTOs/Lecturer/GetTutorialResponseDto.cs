using attendance1.Application.DTOs.CommonDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace attendance1.Application.DTOs.Lecturer
{
    public class GetTutorialDetailsResponseDto
    {
        public int TutorialId { get; set; }
        public string TutorialName { get; set; } = string.Empty;
        public string TutorialClassDay { get; set; } = string.Empty;
        public List<ClassWeekModel> TutorialWeekOfClass { get; set; } = [];
        public List<GetStudentWithAttendanceDataResponseDto> EnrolledStudentsWithAttendance { get; set; } = new List<GetStudentWithAttendanceDataResponseDto>();
    }
}
