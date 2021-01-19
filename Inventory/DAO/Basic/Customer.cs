using Common;
using System.Collections.Generic;

namespace DAO.Basic
{
    //
    //public class Customer:Person
    //{
    //    public int CustomerId { get; set; }
    //    public string CustCode { get; set; }
    //    public string Extension { get; set; }
    //    public string Notes { get; set; }
    //    public string MailStop { get; set; }
    //    public string Department { get; set; }
    //    public string CompanyName { get; set; }
    //    public string Website { get; set; }
    //    public string HomeNo { get; set; }
    //    public string BillingAddress { get; set; }
    //    public string AddedDate { get; set; }
    //    public List<Attachment> listAttachment { get; set; }

    //}
    public class CustAddress:AddressType
    {
        public int CustomerId { get; set; }
        public string CustCode { get; set; }
        public int AddrsId { get; set; }
        public int CountryID { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
    }
    public class Customer : Person
    {
        public int CustomerId { get; set; }
        public string CustCode { get; set; }
        public string Designation { get; set; }
        public string Name { get; set; }
        public string CardId { get; set; }
        public string BillTo { get; set; }
        public string ShipTo { get; set; }
        public string Salutation { get; set; }
        public string Contact { get; set; }
        public int PayMethodId { get; set; }
        public int CardNo { get; set; }
        public string NameofCard { get; set; }
        public string Notes { get; set; }
        public int CustomerPaymentDetailsId { get; set; }
        public string PrintedForm { get; set; }
        public string InvoiceDelivery { get; set; }
        public string ABNNo { get; set; }
        public int ABNBranchNo { get; set; }
        public string TaxIdNo { get; set; }
        public string GSTType { get; set; }
        public int TxtId { get; set; }
        public int FreightTaxCode { get; set; }
        public int PayTermId { get; set; }
        public int DiscountDays { get; set; }
        public int BalanceDueDays { get; set; }
        public decimal DiscountEarlyPayment { get; set; }
        public decimal MonthChargeLatePayment { get; set; }
        public decimal VolumeDiscount { get; set; }
        public int CustomerSellDetilsId { get; set; }
        public List<Attachment> listAttachment { get; set; }
        public List<CustAddress> lstCustAddress { get; set; }
        public string FilePath { get; set; }
        public string FileUserName { get; set; }
        public string PreviousImage { get; set; }
        public bool InactiveCard { get; set; }
        public bool ShippingAddressSame { get; set; }

    }
    public class WrapperCustomer
    {
        public List<Customer> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public List<ComboData> listComboData { get; set; }
    }
    public class PaymentMethod
    {
        public string value { get; set; }
        public string description { get; set; }
        public string text { get; set; }
    }
}
