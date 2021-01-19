using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Sale
{
    public class SaleApproval: CommonModel
    {
        public string SaleId { get; set; }
        public string PaidAmount { get; set; }
        public string PrevAmount { get; set; }
        public string IHeadName { get; set; }
        public string IHeadCode { get; set; }
        public string SaleAmount { get; set; }
        public string SaleQty { get; set; }
        public string SalePrice { get; set; }
        public string Discount { get; set; }
        public string Total { get; set; }
        public string SalePerson { get; set; }
        public string Comment { get; set; }
        public string TotalAmount { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string SaleType { get; set; }
        public string PaymentMode { get; set; }
        public string ShipVia { get; set; }
        public string DueDate { get; set; }
        public string SaleDetId { get; set; }

    }
    public class WrapperSaleApproval
    {
        public List<SaleApproval> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<List<SaleApproval>> LstlistData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
