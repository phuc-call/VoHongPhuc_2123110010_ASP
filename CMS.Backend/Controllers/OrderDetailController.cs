using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .ToList();
            return View(list);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id");
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            _context.OrderDetails.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.OrderDetails.Find(id);
            if (item == null) return NotFound();
            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id", item.OrderId);
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name", item.ProductId);
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            _context.OrderDetails.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var item = _context.OrderDetails.Find(id);
            if (item != null)
            {
                _context.OrderDetails.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}