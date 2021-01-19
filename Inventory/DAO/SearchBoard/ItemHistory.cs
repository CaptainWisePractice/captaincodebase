using Common;
using DAO.Basic;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.SearchBoard
{
   public class ItemHistory: ItemEntry
    {
        public string CustomerName { get; set; }
        public string Manufacturer { get; set; }
        public string LocName { get; set; }
        public string FromLoc { get; set; }
        public string AddDate { get; set; }
        public string TransectionType { get; set; }
        public string TStock { get; set; }
        public string TCheckOut { get; set; }
        public string TAvailable { get; set; }
        public string WareStock { get; set; }
        public string InComing { get; set; }
        public string InProduction { get; set; }
        public string SaleQty { get; set; }
        public string SiteName { get; set; }
        public string TransectionName { get; set; }
        public string ETADate { get; set; }
        public string ProductionEndDate { get; set; }
        public string InvoiceNo { get; set; }
        public string ChkOutInvoiceNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Notes { get; set; }


    }
    public class WrapperItemHistory
    {
        public List<ItemHistory> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
