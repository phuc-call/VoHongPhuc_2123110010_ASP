using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }

        public virtual ICollection<CartItem>? CartItems { get; set; }
    }
}