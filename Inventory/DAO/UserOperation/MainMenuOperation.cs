using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.UserOperation
{
   public class MainMenuOperation : ListOfMenus
    {
        public int MenuId { get; set; }
        //public string ManuName { get; set; }
        public byte[] ImgFile { get; set; }
        public List<ChildMenuName> ChildMenuNameList { get; set; }
    }
}
