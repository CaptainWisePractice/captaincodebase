using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Basic
{
  public  class FOBPriceSet : CommonModel
    {
        public string IHeadId { get; set; }
        public string InitialPrice { get; set; }
        public string Price { get; set; }
    }

    public class WrapperFOBPriceSet
    {
        public List<FOBPriceSet> list { get; set; }
        public List<ComboData> ldata { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
