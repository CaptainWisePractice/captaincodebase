using Common;
using System.Collections.Generic;

namespace DAO.Basic
{
    public class AddressType : CommonModel
    {
        public int AddrTypeID { get; set; }
        public string Name { get; set; }
    }
    public class WrapperAddressType
    {
        public List<AddressType> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
