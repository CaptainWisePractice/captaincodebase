using Common;
using System.Collections.Generic;

namespace DAO.Inventory
{
    public class RemoveStock
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemNumber { get; set; }
        public string ItemDescription { get; set; }
        public int LocId { get; set; }
        public string Site { get; set; }
        public string Location { get; set; }
        public string Note { get; set; }
        public string CreateBy { get; set; }
        public string RemoveDate { get; set; }
        public decimal Qty { get; set; }
    }
    public class WrapperRemoveStock
    {
        public List<RemoveStock> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
