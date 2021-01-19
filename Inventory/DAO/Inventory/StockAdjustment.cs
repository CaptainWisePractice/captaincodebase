using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
    public class StockAdjustment: CommonModel
    {
        public int CurStockId { get; set; }
        public decimal CurQty { get; set; }
        public string LocName { get; set; }
        public string ManufactureName { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string Notes { get; set; }
    }
    public class WrapperStockAdjustment
    {
        public List<StockAdjustment> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
