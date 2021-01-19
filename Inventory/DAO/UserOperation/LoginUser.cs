using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.UserOperation
{
    public class LoginUser
    {
        public string FullName { get; set; }
        public string UserName { get; set; }
        public int UserId { get; set; }
        public string password { get; set; }
        public string Email { get; set; }
    }

    public class WrapperUser
    {
        public List<LoginUser> list { get; set; }
        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
