using APIPOS.App_Start;
using Common;
using DAL.Admin;
using DAO.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class SaleEditPermissionController : Controller
    {
        #region Declare Object
        private WrapperAddUser _objWrapper = new WrapperAddUser();
        private readonly AddUserDAL _objDal = new AddUserDAL();
        List<ComboData> lstComboData = new List<ComboData>();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: SaleEditPermission
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult LoadUserName()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _objDal.LoadUserName();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        #region Get Data 
        public JsonResult LoadSaleFiledList(int userId)
        {
            _objWrapper = new WrapperAddUser();
            List<AddUser> listdata = _objDal.LoadSaleFiledList(userId);
            _objWrapper.list = listdata;
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save 
        public JsonResult Save(List<AddUser> obj, int userId)
        {
            _objWrapper = new WrapperAddUser();
            _objWrapper = _objDal.SaveSaleFieldByUser(obj, userId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}