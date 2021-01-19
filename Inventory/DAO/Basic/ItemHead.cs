using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Basic
{
    public class ItemHead : CommonModel
    {
        public string IHeadId { get; set; }
        public string CategoryId { get; set; }
        public string IHeadCode { get; set; }
        public string IHeadName { get; set; }
        public string Description { get; set; }
        public string Category {get;set;}
        public string CostingPrice { get;set;}
        public string NewPrice { get; set; }
        public string ManufacturerId { get; set; }
        public string Manufacturer { get; set; }
        public string CBM { get; set; }
        public string ColorId { get; set; }
        public string Color { get; set; }
        public string SizeId { get; set; }
        public string Size { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string WareStock { get; set; }
        public string SaleStock { get; set; }
        public string OrderQty { get; set; }
        public string ProQty { get; set; }
        public string IncomQty { get; set; }
        public string TotCBM { get; set; }
        public bool IsStock { get; set; }
        public bool ListingStatus { get; set; }
        public bool DeliveryStatus { get; set; }


        public List<Attachment> listAttachment { get; set; }
    }

    public class WrapperIHead
    {
        public List<ItemHead> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string _result { get; set; }
    }
}
