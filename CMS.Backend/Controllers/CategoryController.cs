/*
 * Võ Hồng Phúc
 * 2123110010
 * 14/05/2026
 * vesion 1
 * **/
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Categories trong SQL
            var data = _context.Categories.ToList();
            return View(data);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Lưu danh mục mới
        [HttpPost]
        public IActionResult Create(Category model)
        {
            _context.Categories.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // Xóa danh mục
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // GET: Hiện form sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        // POST: Lưu thay đổi
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            _context.Categories.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}