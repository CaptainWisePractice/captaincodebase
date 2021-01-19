using Common;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
    public class ItemDispatch: SaleApproval
    {
        public string IHeadId { get; set; }
        public string LocId { get; set; }
        public string CustomerId { get; set; }
        public string InvoiceNo { get; set; }
        public string RefNo { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Box { get; set; }
        public string DayName { get; set; }
        public string TrakingNumber { get; set; }
        public string DeliveryMethod { get; set; }
        public string RequiedDate { get; set; }
        public decimal ManifestPrice { get; set; }
        public string ImageLink { get; set; }
        public string SpecialInstruction { get; set; }
        public List<Attachment> listAttachment { get; set; }

        public decimal Wholesale { get; set; }
        public decimal Offer1 { get; set; }
        public decimal Offer2 { get; set; }
        public decimal Offer3 { get; set; }
        public decimal Retail { get; set; }
        public decimal Special { get; set; }
        public decimal FOBPrice { get; set; }
        public int ProdQuantity { get; set; }
        public int IncQuantity { get; set; }
        public decimal AvgPrice { get; set; }
        public int SaleStock { get; set; }
        public int WareHouseStock { get; set; }

    }
    public class WrapperDispatch
    {
        public List<ItemDispatch> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<List<ItemDispatch>> LstlistData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
