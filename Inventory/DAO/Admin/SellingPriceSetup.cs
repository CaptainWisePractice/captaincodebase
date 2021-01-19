using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Admin
{
   public class SellingPriceSetup : CommonModel
    {
        public string SellingPriceId { get; set; }
        public string IHeadId { get; set; }
        public string IHeadCode { get; set; }
        public string IHeadName { get; set; }
        public string ItemName { get; set; }
        public string Wholesale { get; set; }
        public string Offer1{ get; set; }
        public string Offer2 { get; set; }
        public string Offer3 { get; set; }
        public string Retail { get; set; }
        public string Special { get; set; }
        public string CustomerId { get; set; }

        public string SL { get; set; }
        public string ItemCode { get; set; }
        public string Itemtype { get; set; }

        public string PriceId { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

    }

    public class WrapperSellingPrice
    {
        public List<SellingPriceSetup> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string _result { get; set; }
    }

   
}
