using APIPOS.App_Start;
using DAL.Admin;
using DAO.Admin;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class AddUserController : Controller
    {
        // GET: AddUser
        #region Declare Object
        private WrapperAddUser _objWrapper = new WrapperAddUser();
        private readonly AddUserDAL _objDal = new AddUserDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        [AuthorizeActionFilter]
        public ActionResult AddUser()
        {
            return View();
        }
        public ActionResult ChangePassword()
        {
            return View();
        }


        #region Get Data 
        public JsonResult LoadAllUser()
        {
            _objWrapper = new WrapperAddUser();
            _objWrapper = _objDal.Getdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Save
        public JsonResult Save(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check

        public JsonResult DuplicateCheck(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region ChangePassword
        public JsonResult UserChangePassword(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
            _objWrapper = _objDal.ChangePassword(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}