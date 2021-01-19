using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Common
{
  public  class UserSession
    {
        public static void SetUserData(DataTable user)
        {
            HttpContext.Current.Session[SessionData.UserData] = user;
        }
        public static string getUserName()
        {
           return ((DataTable)HttpContext.Current.Session[SessionData.UserData]).Rows[0]["UserName"].ToString();
        }

      
        public static string GetUserId()
        {
            return ((DataTable)HttpContext.Current.Session[SessionData.UserData]).Rows[0]["ID"].ToString();
        }

        public static string GetBranchId()
        {
            return ((DataTable)HttpContext.Current.Session[SessionData.UserData]).Rows[0]["BranchId"].ToString();
        }

        public static string GetCurrentPassword()
        {
            return ((DataTable)HttpContext.Current.Session[SessionData.UserData]).Rows[0]["Password"].ToString();
        }
        public static bool IsSessionActive()
        {
            if (HttpContext.Current.Session["UserName"] == null)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public static string getclientIP()
        {
            var HostIP = HttpContext.Current != null ? HttpContext.Current.Request.UserHostAddress : "";
            return HostIP;
        }

    }
}
