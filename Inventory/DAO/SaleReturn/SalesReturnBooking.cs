using Common;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
    public class SalesReturnBooking : SaleApproval
    {
        public string IHeadId { get; set; }
        public string ItemId { get; set; }
        public string LocId { get; set; }
        public string CustomerId { get; set; }
        public string InvoiceNo { get; set; }
        public string RefNo { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string ItemNumber { get; set; }
        public string DayName { get; set; }
        public string TrakingNumber { get; set; }
        public string DeliveryMethod { get; set; }
        public string RequiedDate { get; set; }
        public decimal ManifestPrice { get; set; }
        public string Status { get; set; }
        public int SRReceiveId { get; set; }
        public int SRReceiveDetailsId { get; set; }
        public int ReturnAwatingBookId { get; set; }
        public string ReturnBy { get; set; }
        public string Notes { get; set; }
        public string WarehouseId { get; set; }
        public List<Attachment> listAttachment { get; set; }

    }
    public class WrapperSalesReturnBooking
    {
        public List<SalesReturnBooking> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<ComboData> LstComboData { get; set; }
        public List<List<SalesReturnBooking>> LstlistData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
