using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Purchase
{
    public class PurchaseReceive : CommonModel
    {
        public int POReceiveId { get; set; }
        public string POMasterId { get; set; }
        public int IHeadId { get; set; }
        public string POReceiveNo { get; set; }
        public string POReceiveDate { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string PONumber { get; set; }
        public string PINumber { get; set; }
        public string PODate { get; set; }
        public int ManufacturerId { get; set; }
        public string ManufacturerName { get; set; }
        public string OrderStatusId { get; set; }
        public decimal POQuantity { get; set; }
        public string PORecvStatus { get; set; }
        public List<PurchaseReceiveDetails> lstDetails { get; set; }
    }
    public class PurchaseReceiveDetails
    {
        public int POReceiveDetailsId { get; set; }
        public int POReceiveId { get; set; }

        public int POMasterId { get; set; }
        public Int64 PODetailId { get; set; }       
        public string ItemCode { get; set; }
        public int ItemId { get; set; }
        public int IHeadId { get; set; }
        public string IHeadCode { get; set; }
        public decimal POQuantity { get; set; }
        public decimal AvailableQty { get; set; }
        public decimal POReceiveQty { get; set; }
        public int LocId { get; set; }
        public decimal NewPrice { get; set; }
        public string LotNo { get; set; }
        public string CreatedBy { get; set; }
    }
    public class WrapperPurchaseReceive
    {
        //public List<PurchaseOrder> listPurchaseOrder { get; set; }
        public List<PurchaseReceive> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
