using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
    public class ManualBooing : CommonModel
    {
        public string SearchText { get; set; }
        public int ManualBooingId { get; set; }
        public string BookingType { get; set; }
        public string CustomerName { get; set; }
        public string MobileNo { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string InvoiceNo { get; set; }
        public string CustomerAddress { get; set; }
        public string InvoiceDate { get; set; }
        public string BookingDate { get; set; }
        public string SaleOutlet { get; set; }
        public string ReferenceNo { get; set; }
        public string SpecialInstruction { get; set; }
        public string Notes { get; set; }
        public int DespatchViaId { get; set; }
        public int DespatchMethodId { get; set; }
    }

    public class ManualBooingDetails
    {
        public string MBookingId { get; set; }
        public int ManualBooingDetsId { get; set; }
        public string InvoiceNo { get; set; }
        public int IHeadId { get; set; }
        public string ItemCode { get; set; }
        public string IHeadDescription { get; set; }
        public int DeliveryMethodId { get; set; }
        public int SaleQty { get; set; }
        public int Box { get; set; }
        public string RequiredDate { get; set; }
        public string DeliveryDate { get; set; }
        public string TrakingNo { get; set; }
        public string SalePoint { get; set; }
        public decimal DeliveryCost { get; set; }
        public string CreatedBy { get; set; }
    }

    public class WrapperManualBooing
    {
        public List<ManualBooing> masterList { get; set; }
        public List<ManualBooingDetails> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<List<ManualBooingDetails>> LstlistData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
