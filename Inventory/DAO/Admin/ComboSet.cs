using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Admin
{
   public class ComboSet : CommonModel
    {
        public int ComboSetId { get; set; }
        public string ComboName { get; set; }
        public string Description { get; set; }
        public List<ComboSetDetails> LstComboSetDetails { get; set; }


    }

    public class ComboSetDetails{

        public int ComboSetDelailsId { get; set; }
        public int IHeadId { get; set; }
        public int Qty { get; set; }
        public string IHeadCode { get; set; }
        public decimal ItemPrice { get; set; }
    }

   public class ComboSetWrapper
    {
        public List<ComboSet> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
