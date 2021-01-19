using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Admin
{
    public class StoreCash : CommonModel
    {
       public int Id { get; set; }
       public int OutletId { get; set; }
       public string OutletName { get; set; }
       public string CashAmount { get; set; }
       public string Notes { get; set; }

    }

    public class WrapperStoreCash
    {
        public List<StoreCash> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string _result { get; set; }
    }
}
