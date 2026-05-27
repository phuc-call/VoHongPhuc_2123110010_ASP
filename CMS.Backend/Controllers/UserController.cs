using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var posts = _context.Users.ToList();
            return View(posts);
        }
    }
}
