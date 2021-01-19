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
    public class UserPermissionController : Controller
    {
        #region Declare Object
        private WrapperAddUser _objWrapper = new WrapperAddUser();
        private readonly AddUserDAL _objDal = new AddUserDAL();
        List<ComboData> lstComboData = new List<ComboData>();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: UserPermission
        [AuthorizeActionFilter]
        public ActionResult UserPermission()
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
        public JsonResult GetMenudata( int Id)
        {
            _objWrapper = new WrapperAddUser();
            List<List<AddUser>> listdata = _objDal.GetMenudata(Id);
            _objWrapper.lstlist = listdata;
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save 
        public JsonResult Save(List<AddUser> obj, int userId)
        {
            _objWrapper = new WrapperAddUser();
            _objWrapper = _objDal.SaveMenuIdByUser(obj, userId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}