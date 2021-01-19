using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Basic
{
  public  class ItemCategory
    {
        public string CategotyId { get; set; }
        public  string ItmCategory { get; set; }
        public  string ItemCode { get; set; }
        public string IsActive { get; set; }
    }

    public class CategoryWapper
    {
        public List<ItemCategory> ICategories { get; set; }
        public string Error { get; set; }
        public string IsSessionOut { get; set; }
        public bool Status { get; set; }
        public string Save_error { get; set; }
    }
}
