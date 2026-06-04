using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.Orders
                .Include(o => o.Customer)
                .ToList();
            return View(list);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CustomerList = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Order model)
        {
            _context.Orders.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Orders.Find(id);
            if (item == null) return NotFound();
            ViewBag.CustomerList = new SelectList(_context.Customers, "Id", "FullName", item.CustomerId);
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(Order model)
        {
            _context.Orders.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var item = _context.Orders.Find(id);
            if (item != null)
            {
                _context.Orders.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}