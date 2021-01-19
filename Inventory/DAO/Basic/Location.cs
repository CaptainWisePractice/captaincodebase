using Common;
using System.Collections.Generic;

namespace DAO.Basic
{
    public class Location : CommonModel
    {
        public int LocId { get; set; }        
        public string LocNo { get; set; }
        public int WarehouseId { get; set; }
        public string WarehouseName { get; set; }
        public string LocName { get; set; }
        public string LocType { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
    }
    public class WrapperLocation
    {
        public List<Location> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
