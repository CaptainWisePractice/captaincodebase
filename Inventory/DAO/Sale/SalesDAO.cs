using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;

namespace DAO.Sale
{
  public  class SalesDAO
    {
        public int SalesId { get; set; }
        public string SearchText { get; set; }
        public string CreatedBy { get; set; }
        public  string Name { get; set; }
        public string BillTo { get; set; }
        public string Phone2 { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ShipTo { get; set; }
        public string MobileNo { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public string SalesType { get; set; }
        public string RefNo { get; set; }
        public DateTime RefDate { get; set; }
        public string CustomerName { get; set; }
        public int CustomerId { get; set; }
        public bool IsNewAddress { get; set; }
        public string Address { get; set; }
        public int PaymentMethod { get; set; }
        public string SalesPersonName { get; set; }
        public int SalesPersonId { get; set; }
        public string Comments { get; set; }
        public int ShipVia { get; set; }
        public decimal SubTotal { get; set; }
        public decimal PrevDue { get; set; }
        public decimal NetBill { get; set; }
        public decimal Freight { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ManagerDiscount { get; set; }
        public string TaxType { get; set; }
        public decimal discount { get; set; }
        public string JournalMemo { get; set; }
        public string ReferralSource { get; set; }
        public string DeliveryStatus { get; set; }
        public decimal PaidToday { get; set; }
        public decimal Due { get; set; }
        public bool isTaxInclusive { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public int PaymentTearmsId { get; set; }
        public int SaleOutletId { get; set; }
        public string PaymentTermsText { get; set; }
        public string ReferenceNo { get; set; }
        public string PrepaidDueDate { get; set; }


    }

    public class SalesDetails
    {
        public int SaleDetsId { get; set; }
        public int IHeadId { get; set; }
        public int LocId { get; set; }
        public  int SaleQty { get; set; }
        public  decimal SalePrice { get; set; }
        public  decimal discount { get; set; }
        public  decimal discountPrice { get; set; }
        public string CreatedBy { get; set; }
        public string ItemDescription { get; set; }
        public int StockQty { get; set; }
        public string PreSale { get; set; }
        public string StockIn { get; set; }
        public string Itemtype { get; set; }
    }
    public class WrapperSales: Wrapper
    {
        public List<SalesDAO> SalesList { get; set; }
        public List<List<SalesDAO>> SalesLstList { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<AutoComplete> ListAutoCompletes { get; set; }
    }

    public class Wrapper
    {
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }

    public class CustomerAddress
    {
        public int CustomerId { get; set; }
        public string Address { get; set; }
        public string addressColumnName { get; set; }
    }

    public class WrapperAddress: Wrapper
    {
        public List<CustomerAddress> CustomerAddresses { get; set; } 
    }

    public class Invoice
    {
        public string InvoiceNo { get; set; }
    }
    public class CustomerDue
    {
        public decimal CustomerDueAmount { get; set; }
    }
    public class NewCustomer
    {
        public string CustomerName { get; set; }
        public int CustomerId { get; set; }
        public string Address { get; set; }
    }
    public class wrapperCustomer :Wrapper
    {
        public List<NewCustomer> objCustomer { get; set; }
    }

    public class wrapperInvoice : Wrapper
    {
        public  List<Invoice> Invoices { get; set; } 
    }

    public class salesReturnObj
    {
        public string InvoiceNo { get; set; }
        public  int salesId { get; set; }
        public int SaleOutletId { get; set; }
    }
    public class wrappersalesReturnObj : Wrapper
    {
        public List<salesReturnObj> lstsalesReturnObj { get; set; }
    }
    public class AutoCompleteMultipleValue
    {
        public int id { get; set; }
        public string value { get; set; }
        public string Data { get; set; }
        public string text { get; set; }
        public string value1 { get; set; }
        public string value2 { get; set; }
        public string Itemtype { get; set; }
    }
    public class WrapperAutoCompleteMultipleValue
    {
        public List<AutoCompleteMultipleValue> ListAutoCpomplete { get; set; }
        public string Error { get; set; }
        public string IsSessionOut { get; set; }
    }
	 public class WrapperCustomerGetData : Wrapper
    {
        public List<CustomerGetData>  CustomerLoadAutoComplete { get; set; }
    }

    public class CustomerGetData
    {
        public int id { get; set; }
        public string label { get; set; }
        public string BillAddress { get; set; }
        public string InvoiceDelivery { get; set; }
        public int PayMethodId { get; set; }
        public int PayTermId { get; set; }
        public string DeliveryStatus { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string MobileNo { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string ReceiverName { get; set; }
        public string TaxType { get; set; }
        public string State { get; set; }
        public string BalanceDueDays { get; set; }
    }
    public class WrapperRegistrationSaleCustomer : Wrapper
    {
        public List<RegistrationSaleCustomer> RegistrationSaleCustomer { get; set; }
    }

    public class RegistrationSaleCustomer
    {
        public string InvoiceDate { get; set; }
        public string InvoiceNo { get; set; }
        public string customerPONo { get; set; }
        public string Customer { get; set; }
        public decimal Amount { get; set; }
        public decimal AmuntDue { get; set; }
        public string Status { get; set; }
        public string Promised { get; set; }
        public string DateClosed { get; set; }
        public string SaleOutlateName { get; set; }
        public decimal TotalAmout { get; set; }
        public decimal TotalDue { get; set; }
    }

    public class SalesDaoMasterEdit
    {
        public string SalesType { get; set; }
        public string Name { get; set; }
        public int CustomerId { get; set; }
        public int SalesId { get; set; }
        public string PaymentTermsText { get; set; }
        public int PaymentTearmsId { get; set; }
        public bool isTaxInclusive { get; set; }
        public string Address { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public int SalesPersonId { get; set; }
        public string Comments { get; set; }
        public string ShipVia { get; set; }
        public string PromisedDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal FreightCharge { get; set; }
        public decimal tax { get; set; }
        public decimal ManagerDiscount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AppliedToDate { get; set; }
        public decimal BalanceDue { get; set; }
        public string ReferralSource { get; set; }
        public string JournalMemo { get; set; }
        public string InvoiceDeliveryStatus { get; set; }
        public int PaymentMethod { get; set; }
        public string ReferenceNo { get; set; }
        public int SaleOutletId { get; set; }
        public string PrepaidDueDate { get; set; }
        public string MobileNo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string ReceiverName { get; set; }
        public string CustomerMail { get; set; }
        public string DispatchStatus { get; set; }
        public string ReturnStatus { get; set; }
        public string TaxType { get; set; }



    }

    public class SalesDaoChildEdit
    {
        public int SaleDetsId { get; set; }
        public int ItemHeadId { get; set; }
        public string ItemCode { get; set; }
        public string ItemDescription { get; set; }
        public int LocationId { get; set; }
        public int SalesQty { get; set; }
        public decimal SalesPrice { get; set; }
        public decimal Discount { get; set; }
        public string CurrentStockQty { get; set; }
        public decimal DueAmount { get; set; }
        public string DespatchDate { get; set; }
        public decimal discountPrice { get; set; }
        public string AwBookingStatus { get; set; }
        public string DispatchStatus { get; set; }
        public string Itemtype { get; set; }

    }

    public class SaleEditPermission{
        public string UserName { get; set; }
        public string FieldName { get; set; }
        public decimal UserDeposit { get; set; }
        public decimal ManagerDiscount { get; set; }
        public bool IsSpecialPrice { get; set; }
    }

    public class SaleEditPerandState
    {
        public List<SaleEditPermission> SaleEditPermissionLst { get; set; }
        public List<ComboData> ComboDataLst { get; set; }
    }

    public class SalesEdit
    {
        public SalesDaoMasterEdit SalesDaoMasterEdit { get; set; }
        public List<SalesDaoChildEdit> SalesDaoChildEdit { get; set; }
        public List<SaleEditPermission> SaleEditPermissionLst { get; set; }
    }

    public class SalesPaymentHistory
    {
        public int ItemHeadId { get; set; }
        public string InvoiceNo { get; set; }
        public string PaymentDate { get; set; }
        public string ItemDescription { get; set; }
        public int SalesQty { get; set; }
        public decimal SalesPrice { get; set; }
        public decimal Discount { get; set; }
        public string PayMemo { get; set; }
        public decimal DueAmount { get; set; }
        public decimal RefundAmount { get; set; }
        public string DespatchDate { get; set; }
        public string Comments { get; set; }
        public string PayMethod { get; set; }

    }

    public class SalesPaymentHistoryList
    {
        public List<SalesPaymentHistory> SalesPaymentHisList { get; set; }
    }


}
