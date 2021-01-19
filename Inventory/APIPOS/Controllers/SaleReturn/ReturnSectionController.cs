using APIPOS.App_Start;
using Common;
using DAL.UserOperation;
using DAO.UserOperation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.SaleReturn
{
    [NoCache]
    public class ReturnSectionController : Controller
    {
        public List<MainMenuOperation> ObjParrentMenus = null;
        public WrapperListOfMenus _objWrapperListOfMenus = new WrapperListOfMenus();
        // GET: ReturnSection
        [AuthorizeActionFilter]
        public ActionResult ReturnSection()
        {
            return View();
        }

        public JsonResult loadFlatmenu()
        {
            string menu = "ReturnSection";
            LoginUserDAL _ObjLoginUserDAL = new LoginUserDAL();
            _objWrapperListOfMenus = new WrapperListOfMenus();
            _objWrapperListOfMenus = _ObjLoginUserDAL.loadFlatmenu(menu);
            return Json(_objWrapperListOfMenus, JsonRequestBehavior.AllowGet);
        }
    }
}