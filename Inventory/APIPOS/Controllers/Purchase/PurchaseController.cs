using APIPOS.App_Start;
using Common;
using DAL.UserOperation;
using DAO.UserOperation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Purchase
{
    [NoCache]
    public class PurchaseController : Controller
    {
        public List<MainMenuOperation> ObjParrentMenus = null;
        public WrapperListOfMenus _objWrapperListOfMenus = new WrapperListOfMenus();
        // GET: Purchase
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult loadFlatmenu()
        {
            string menu = "Purchase";
            LoginUserDAL _ObjLoginUserDAL = new LoginUserDAL();
            _objWrapperListOfMenus = new WrapperListOfMenus();
            _objWrapperListOfMenus = _ObjLoginUserDAL.loadFlatmenu(menu);
            return Json(_objWrapperListOfMenus, JsonRequestBehavior.AllowGet);
        }
    }
}