using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Purchase
{
    public class SaleReturnReceive : CommonModel
    {
        public int SRReceiveId { get; set; }
        public int SaleId { get; set; }
        public int IHeadId { get; set; }
        public int PaymentMethodId { get; set; }
        public string SRReceiveNo { get; set; }
        public string SRReceiveDate { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string InvoiceNo { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Reason { get; set; }
        public decimal TSaleQty { get; set; }
        public string SRecvStatus { get; set; }
        public string Notes { get; set; }
        public decimal TotalDeductionAmount { get; set; }
        public decimal TotalPaymentAmount { get; set; }
        public decimal TotalInvoiceAmount { get; set; }
        public string DeductionType { get; set; }
        public decimal NoItemReturnAmt { get; set; }
        public string WhouseName { get; set; }
        public string WhouseAddress { get; set; }
        public string WhouseMobile { get; set; }
        public decimal StoreCredit { get; set; }
        public List<SaleReturnReceiveDetails> lstDetails { get; set; }
    }
    public class SaleReturnReceiveDetails
    {
        public int SRReceiveDetailsId { get; set; }
        public int SRReceiveId { get; set; }
        public int SaleDetailId { get; set; }       
        public string ItemCode { get; set; }
        public int ItemId { get; set; }
        public int IHeadId { get; set; }
        public string IHeadCode { get; set; }
        public decimal SaleQuantity { get; set; }
        public decimal ReceiveQty { get; set; }
        public decimal DeductionAmount { get; set; }
        public int LocId { get; set; }
        public decimal NewPrice { get; set; }
        public string LotNo { get; set; }
        public string CreatedBy { get; set; }
    }
    public class WrapperSaleReturnReceive
    {
        //public List<PurchaseOrder> listPurchaseOrder { get; set; }
        public List<SaleReturnReceive> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
