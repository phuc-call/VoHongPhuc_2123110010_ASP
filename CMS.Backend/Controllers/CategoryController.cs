/*
 * Võ Hồng Phúc
 * 2123110010
 * 14/05/2026
 * vesion 1
 * **/
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            var list = new List<Category> {
                new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
                new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
            };
            return View(list);
        }
    }
}