using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/posts?page=1&pageSize=12
        // Trả về { items, totalCount } để Frontend dựng phân trang (PostGrid/Blog).
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 12;

            var query = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            return Ok(new { items, totalCount, page, pageSize });
        }

        // GET: api/posts/category/1?page=1&pageSize=12
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(
            int categoryId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 12;

            var query = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.Id);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToListAsync();

            return Ok(new { items, totalCount, page, pageSize });
        }

        // GET: api/posts/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefaultAsync();

            if (post == null)
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });

            return Ok(post);
        }

        // GET: api/posts/latest?count=3
        // Phục vụ khu vực Blog/Tin tức tại trang chủ và slide HeroBanner.
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest([FromQuery] int count = 3)
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .Take(count)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            return Ok(posts);
        }
    }
}
