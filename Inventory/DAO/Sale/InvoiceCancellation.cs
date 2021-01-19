using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Purchase
{
    public class InvoiceCancellation : CommonModel
    {
        public int SaleCancelId { get; set; }
        public int SaleId { get; set; }
        public int IHeadId { get; set; }
        public int PaymentMethodId { get; set; }
        public string CancelDate { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string InvoiceNo { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Reason { get; set; }
        public decimal TSaleQty { get; set; }
        public string CancelType { get; set; }
        public string Notes { get; set; }
        public decimal RefundAmount { get; set; }
        public decimal Percentage { get; set; }
        public decimal InvoiceAmount { get; set; }
        public List<InvoiceCancellationDetails> lstDetails { get; set; }
    }
    public class InvoiceCancellationDetails
    {
        public int SRReceiveDetailsId { get; set; }
        public int SRReceiveId { get; set; }
        public int SaleDetailId { get; set; }       
        public string ItemCode { get; set; }
        public int ItemId { get; set; }
        public int IHeadId { get; set; }
        public string IHeadCode { get; set; }
        public string IHeadName { get; set; }
        public decimal SaleQuantity { get; set; }
        public decimal ReceiveQty { get; set; }
        public decimal NewPrice { get; set; }
        public string CreatedBy { get; set; }
    }
    public class WrapperInvoiceCancellation
    {
        //public List<PurchaseOrder> listPurchaseOrder { get; set; }
        public List<InvoiceCancellation> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
