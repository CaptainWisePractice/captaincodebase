using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
   public class ItemMove : CommonModel
    {
        public string ItemId { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string IHeadId { get; set; }
        public string FromLocationId { get; set; }
        public string ToLocationId { get; set; }
        public string MoveQty { get; set; }
        public string Note { get; set; }
        public string CurStockId { get; set; }
    }

    public class WrapperItemMove
    {
        public List<ItemMove> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<ComboData> listToLocation { get; set; }
        public List<ComboData> listLocationStock { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string _Result { get; set; }

        public string Id { get; set; }

    }
}
