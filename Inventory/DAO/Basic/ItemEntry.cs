using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Basic
{
   public class ItemEntry: CommonModel
    {
        public string ItemId { get; set; }
        public string IHeadId { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string IHeadCode { get; set; }
        public string MinStockLevel { get; set; }
        public string MaxStockLevel { get; set; }
        public string UOM { get; set; }
        public string ItemType { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
        public string Length { get; set; }
        public string Weight { get; set; }
        public string ImageUrl { get; set; }
        public string CBM { get; set; }
        public string ManufacturerId { get; set; }

    }

    public class WrapperItemInfo
    {
        public List<ItemEntry> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
