using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace attendance1.Web.Hubs
{
    public class AttendanceHub : Hub
    {
        public async Task SendAttendedCount(int count)
        {
            await Clients.All.SendAsync("ReceiveAttendedCount", count);
        }
    }
}
