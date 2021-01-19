using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Reports
{
   public class SalesReports
    {
        public string Name { get; set; }
        public string BillTo { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ShipTo { get; set; }
        public string MobileNo { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string SalesType { get; set; }
        public string RefNo { get; set; }
        public string CustomerName { get; set; }
        public int CustomerId { get; set; }
        public string SalesPersonName { get; set; }
        public int SalesPersonId { get; set; }
        public string Comments { get; set; }
        public int ShipVia { get; set; }
        public string SubTotal { get; set; }
        public string PrevDue { get; set; }
        public string NetBill { get; set; }
        public string Freight { get; set; }
        public string ManagerDiscount { get; set; }
        public string Tax { get; set; }
        public string TotalAmount { get; set; }
        public string discount { get; set; }
        public string PaidToday { get; set; }
        public string ReferenceNo { get; set; }
        public string DeliveryMethod { get; set; }
        public string IHeadCode { get; set; }
        public string IHeadName { get; set; }
        public string SaleDate { get; set; }
        public int SaleQty { get; set; }
        public string SalePrice { get; set; }
        public string Due { get; set; }
        public string WithDiscount { get; set; }
        public string Website { get; set; }
        public string CountryName { get; set; }
        public string Email { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string SearchText { get; set; }
        public string SaleOutlateName { get; set; }
        public string ReceiverName { get; set; }
        public string DeliveryAddress { get; set; }
        public string DeliveryCity { get; set; }
        public string ReceiverMobile { get; set; }
        public string DeliveryPostal { get; set; }
        public string InvoiceType { get; set; }
        public string TaxType { get; set; }
        public string MailStatus { get; set; }
        public string SendBy { get; set; }

        public string PostalCode { get; set; }
        public string DueDate { get; set; }
        public string LocName { get; set; }
        public string OutletFullName { get; set; }
        public string AccountNumber { get; set; }
        public string ABNNo { get; set; }
        public string OutletEmail { get; set; }
        public string OutletWebsite { get; set; }
        public string BSBNumber { get; set; }
        public string Itemtype { get; set; }


    }
   public class WrapperSalesReports
    {
        public List<List<SalesReports>> listSalesReports { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string result { get; set; }
    }

    public class ExportFileWrapper
    {
        public List<SalesReports> listExportFile { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string result { get; set; }
    }

    public class ReportThreadContainerMail
    {
        public byte[] SaleReport { get; set; }
    }
}
