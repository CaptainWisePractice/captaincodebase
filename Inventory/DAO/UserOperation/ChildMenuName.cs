using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.UserOperation
{
   public class ChildMenuName
    {
        public int MenuIdChild { get; set; }
        public string ManuName_Child { get; set; }
        public string ControllerName { get; set; }
        public string ViewName { get; set; }
        public string PageURL { get; set; }
        public int ParantMenuId { get; set; }
        public string ChildIconClass { get; set; }
    }
}
