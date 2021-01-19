using APIPOS.App_Start;
using Common;
using DAL.UserOperation;
using DAO.UserOperation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class AdminController : Controller
    {
        public List<MainMenuOperation> ObjParrentMenus = null;
        public WrapperListOfMenus _objWrapperListOfMenus = new WrapperListOfMenus();
        // GET: Admin
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult loadFlatmenu()
        {
            string menu = "Admin";
            LoginUserDAL _ObjLoginUserDAL = new LoginUserDAL();
            _objWrapperListOfMenus = new WrapperListOfMenus();
            _objWrapperListOfMenus = _ObjLoginUserDAL.loadFlatmenu(menu);
            return Json(_objWrapperListOfMenus, JsonRequestBehavior.AllowGet);
        }
    }
}