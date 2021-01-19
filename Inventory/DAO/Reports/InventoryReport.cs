using System;

namespace DAO.Reports
{    
    public class InventoryReport
    {
        public string IHeadCode { get; set; }
        public string ItemCode { get; set; }
        public string ItemDescription { get; set; }
        public decimal Qty { get; set; }
        public string TransDate { get; set; }
        public string LotNo { get; set; }
        public string SiteName { get; set; }
        public string LocName { get; set; }
        public string SupplierName { get; set; }
        public string TransectionType { get; set; }
        public decimal CheckInQty { get; set; }
        public string Manufacturer { get; set; }
        public int MinStockLevel { get; set; }
        public int MaxStockLevel { get; set; }
    }
}
