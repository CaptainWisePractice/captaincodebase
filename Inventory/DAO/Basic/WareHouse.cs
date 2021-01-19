using Common;
using System.Collections.Generic;

namespace DAO.Basic
{
    public class WareHouse: CommonModel
    {
        public int WarehouseId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string MobileNo { get; set; }
    }
    public class WrapperWareHouse
    {
        public List<WareHouse> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
