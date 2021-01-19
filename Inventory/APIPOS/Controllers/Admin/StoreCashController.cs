using APIPOS.App_Start;
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
    public class StoreCashController : Controller
    {
        #region Declare Object
        private WrapperStoreCash _objWrapper = new WrapperStoreCash();
        private readonly StoreCashDAL _objDal = new StoreCashDAL();
        List<StoreCash> oList = new List<StoreCash>();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: StoreCash
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        #region Get Data 
        public JsonResult GetAllData()
        {
            _objWrapper = new WrapperStoreCash();
            _objWrapper = _objDal.GetAllData();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Save
        public JsonResult Save(StoreCash obj)
        {
            _objWrapper = new WrapperStoreCash();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Delete
        public JsonResult Delete(StoreCash obj)
        {
            _objWrapper = new WrapperStoreCash();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check

        public JsonResult DuplicateCheck(StoreCash obj)
        {
            _objWrapper = new WrapperStoreCash();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}