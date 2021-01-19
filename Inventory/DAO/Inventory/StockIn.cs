using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
    public class StockIn : CommonModel
    {
        public int StockId { get; set; }
        public int IHeadId { get; set; }
        public int ItemId { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string InHandQty { get; set; }
        public string Qty { get; set; }
        public string LocId { get; set; }
        public string SupplierID { get; set; }
        public string LotNo { get; set; }
        public string OldPrice { get; set; }
        public string NewPrice { get; set; }
        public string AvgPrice { get; set; }
        public string Notes { get; set; }

    }
    public class WrapperStockIn
    {
        public List<StockIn> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
