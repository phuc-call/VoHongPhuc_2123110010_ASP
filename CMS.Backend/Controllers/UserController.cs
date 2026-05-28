using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Xem danh sách
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // GET: Hiện form thêm mới
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Lưu user mới
        [HttpPost]
        public IActionResult Create(User model)
        {
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // GET: Hiện form sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // POST: Lưu thay đổi
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            var existingUser = _context.Users.AsNoTracking()
                               .FirstOrDefault(u => u.Id == model.Id);

            if (existingUser == null) return NotFound();

            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // Xóa user
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}