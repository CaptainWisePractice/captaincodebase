using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Inventory
{
   public class ItemCheckOut :CommonModel
    {
       public string IHeadId { get; set; }
       public string LocId { get; set; }
       public string CheckInQty { get; set; }
        public string CustomerName { get; set; }
        public string ContractNo { get; set; }
        public string CustomerInfo { get; set; }
        public string DueDate { get; set; }
        public string Note { get; set; }
        public string CustomerId { get; set; }
        public string IHeadCode { get; set; }
        public string IHeadName { get; set; }
        public string LocName { get; set; }
        public string Item { get; set; }
        public string Email { get; set; }

    }

    public class WrapperItemCheckOut
    {
        public List<ItemCheckOut> listItemCheckIn { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string _Result { get; set; }
        public string Id { get; set; }

    }
}
