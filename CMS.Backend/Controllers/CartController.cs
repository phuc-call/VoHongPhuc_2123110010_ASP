using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/cart/customer/3
        // Lấy giỏ hàng hiện tại của khách hàng (kèm danh sách sản phẩm + tổng tiền)
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCart(int customerId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null)
            {
                // Chưa có giỏ hàng -> trả về giỏ trống, không tạo record mới
                return Ok(new
                {
                    CartId = (int?)null,
                    CustomerId = customerId,
                    Items = new List<object>(),
                    TotalAmount = 0m
                });
            }

            var items = cart.CartItems!.Select(ci => new
            {
                ci.Id,
                ci.ProductId,
                ProductName = ci.Product != null ? ci.Product.Name : null,
                ProductImage = ci.Product != null ? ci.Product.ImageUrl : null,
                UnitPrice = ci.Product != null ? ci.Product.Price : 0,
                ci.Quantity,
                LineTotal = (ci.Product != null ? ci.Product.Price : 0) * ci.Quantity
            }).ToList();

            return Ok(new
            {
                CartId = cart.Id,
                cart.CustomerId,
                Items = items,
                TotalAmount = items.Sum(i => i.LineTotal)
            });
        }

        // POST: api/cart/add
        // Thêm sản phẩm vào giỏ -> trừ tồn kho ở Product ngay lúc thêm
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            if (request.Quantity <= 0)
                return BadRequest(new { message = "Số lượng phải lớn hơn 0" });

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });

            if (product.StockQuantity < request.Quantity)
                return BadRequest(new { message = $"Sản phẩm chỉ còn {product.StockQuantity} trong kho, không đủ số lượng yêu cầu" });

            // Tìm giỏ hàng hiện có của khách, chưa có thì tạo mới
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId);

            if (cart == null)
            {
                cart = new Cart
                {
                    CustomerId = request.CustomerId,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
                // ✅ Save trước để DB sinh ra cart.Id (PK auto-increment)
                // Nếu không, CartItem sẽ bị gán CartId = 0 → lỗi FK constraint
                await _context.SaveChangesAsync();
            }

            var existingItem = cart.CartItems?.FirstOrDefault(ci => ci.ProductId == request.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                // ✅ Set CartId tường minh thay vì chỉ dựa vào navigation property
                _context.CartItems.Add(new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                });
            }

            // Trừ tồn kho sản phẩm
            product.StockQuantity -= request.Quantity;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã thêm vào giỏ hàng", remainingStock = product.StockQuantity });
        }

        // PUT: api/cart/item/5
        // Sửa số lượng sản phẩm trong giỏ -> tự động cộng/trừ lại tồn kho theo phần chênh lệch
        [HttpPut("item/{cartItemId}")]
        public async Task<IActionResult> UpdateQuantity(int cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            if (request.Quantity <= 0)
                return BadRequest(new { message = "Số lượng phải lớn hơn 0, muốn xóa hãy gọi API xóa sản phẩm khỏi giỏ" });

            var item = await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId);

            if (item == null || item.Product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong giỏ hàng" });

            int diff = request.Quantity - item.Quantity; // > 0: mua thêm, < 0: trả lại kho

            if (diff > 0 && item.Product.StockQuantity < diff)
                return BadRequest(new { message = $"Sản phẩm chỉ còn {item.Product.StockQuantity} trong kho, không thể tăng thêm {diff}" });

            item.Product.StockQuantity -= diff; // diff âm sẽ tự cộng lại tồn kho
            item.Quantity = request.Quantity;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                item.Id,
                item.Quantity,
                remainingStock = item.Product.StockQuantity
            });
        }

        // DELETE: api/cart/item/5
        // Xóa 1 sản phẩm khỏi giỏ -> hoàn lại số lượng đã trừ về Product
        [HttpDelete("item/{cartItemId}")]
        public async Task<IActionResult> RemoveItem(int cartItemId)
        {
            var item = await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId);

            if (item == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong giỏ hàng" });

            if (item.Product != null)
                item.Product.StockQuantity += item.Quantity;

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/cart/customer/3/clear
        // Xóa toàn bộ giỏ hàng của khách -> hoàn lại tồn kho cho tất cả sản phẩm trong giỏ
        [HttpDelete("customer/{customerId}/clear")]
        public async Task<IActionResult> ClearCart(int customerId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
                return Ok(new { message = "Giỏ hàng đang trống" });

            foreach (var item in cart.CartItems)
            {
                if (item.Product != null)
                    item.Product.StockQuantity += item.Quantity;
            }

            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa toàn bộ giỏ hàng" });
        }
    }

    // DTO cho request thêm vào giỏ
    public class AddToCartRequest
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    // DTO cho request sửa số lượng
    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }
}