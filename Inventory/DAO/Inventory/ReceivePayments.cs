using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
    public class ReceivePayments : CommonModel
    {
        public int MRId { get; set; }
        public string MRNo { get; set; }
        public int CustomerId { get; set; }
        public string AmountReceive { get; set; }
        public string PaymentDate { get; set; }
        public string PaymentMethodId { get; set; }
        public string PaymentMemo { get; set; }
        public string TotalApplied { get; set; }
        public string FinanceCharge { get; set; }
        public string TotalReceived { get; set; }
        public decimal AdvanceAmount { get; set; }
        public bool ChkAdvance { get; set; }
        public List<ReceivePaymentsDetails> lstDetails { get; set; }
    }
    public class ReceivePaymentsDetails
    {
        public int MRDetailsId { get; set; }
        public int MRId { get; set; }
        public string MRNo { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string InvoiceAmount { get; set; }
        public string Discount { get; set; }
        public string TotalDue { get; set; }
        public string AmountApplied { get; set; }
        public int InvoiceCustomerId { get; set; }
        public int PaymentMethodId { get; set; }
    }
    public class WrapperReceivePayments
    {
        public List<ReceivePayments> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
