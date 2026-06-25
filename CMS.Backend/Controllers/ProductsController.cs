using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ĐÃ SỬA: thêm các tham số phân trang + lọc giá + danh mục + từ khoá + sắp xếp.
        // Trước đây action này lấy HẾT sản phẩm trong DB, không phân trang -> nếu có
        // hàng trăm sản phẩm thì trang Shop sẽ load rất nặng và không lọc được gì cả.
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? categoryProductId = null,
            [FromQuery] string? keyword = null,
            [FromQuery] string? sortBy = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 12;

            var query = _context.Products.AsQueryable();

            if (categoryProductId.HasValue)
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(p => p.Name.Contains(keyword));

            query = sortBy switch
            {
                "priceAsc" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderByDescending(p => p.Id),
            };

            // ĐÃ THÊM: đếm tổng số sản phẩm THOẢ điều kiện lọc (trước khi Skip/Take)
            // để Frontend tính được tổng số trang.
            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.Description,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToListAsync();

            // ĐÃ SỬA: trả về object { items, totalCount } thay vì mảng thẳng,
            // vì Frontend cần totalCount để dựng component Pagination.
            return Ok(new { items = products, totalCount, page, pageSize });
        }

        // ĐÃ SỬA: thêm phân trang (giữ nguyên logic lọc theo category cũ).
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(
            int categoryProductId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 12;

            var query = _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .OrderByDescending(p => p.Id);

            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToListAsync();

            return Ok(new { items = products, totalCount, page, pageSize });
        }

        // ĐÃ SỬA LỖI: bản cũ KHÔNG có .Include(p => p.CategoryProduct) nên khi trả
        // FirstOrDefaultAsync(p => p.Id == id), object Product trả thẳng sẽ không
        // có thông tin CategoryName, và còn lộ ra cả navigation property rườm rà.
        // Đã sửa lại để Select đúng các field cần, đồng bộ với GetAll().
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.Description,
                    CategoryName = p.CategoryProduct.Name
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });

            return Ok(product);
        }

        // ĐÃ THÊM MỚI: lấy N sản phẩm mới nhất, phục vụ khu vực "Sản phẩm mới" ở trang chủ.
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest([FromQuery] int count = 3)
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(count)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.Description,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToListAsync();

            return Ok(products);
        }

        // ĐÃ THÊM MỚI: lấy N sản phẩm bán chạy nhất, phục vụ khu vực "Sản phẩm Hot/Bán chạy".
        // Tính bằng tổng Quantity trong bảng OrderDetails. Nếu DB chưa có đơn hàng nào
        // (mới khởi tạo, chưa demo) -> fallback trả về sản phẩm mới nhất để không bị trống.
        [HttpGet("bestsellers")]
        public async Task<IActionResult> GetBestSellers([FromQuery] int count = 3)
        {
            var bestSellers = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new { ProductId = g.Key, TotalSold = g.Sum(x => x.Quantity) })
                .OrderByDescending(x => x.TotalSold)
                .Take(count)
                .Join(_context.Products, x => x.ProductId, p => p.Id, (x, p) => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.Description,
                    CategoryName = p.CategoryProduct.Name,
                    x.TotalSold
                })
                .ToListAsync();

            if (bestSellers.Count == 0)
            {
                var fallback = await _context.Products
                    .OrderByDescending(p => p.Id)
                    .Take(count)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.StockQuantity,
                        p.ImageUrl,
                        p.Description,
                        CategoryName = p.CategoryProduct.Name,
                        TotalSold = 0
                    })
                    .ToListAsync();
                return Ok(fallback);
            }

            return Ok(bestSellers);
        }

        // ĐÃ THÊM MỚI: tìm kiếm sản phẩm theo từ khoá, phục vụ ô search ở Header.
        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 12;

            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(p => p.Name.Contains(keyword));

            query = query.OrderByDescending(p => p.Id);

            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToListAsync();

            return Ok(new { items = products, totalCount, page, pageSize });
        }
    }
}