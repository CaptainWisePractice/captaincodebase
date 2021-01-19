using APIPOS.App_Start;
using DAL.Basic;
using DAL.Purchase;
using DAO.Purchase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Purchase
{
    [NoCache]
    public class PortofLoadingController : Controller
    {
        #region Declare Object
        private WrapperPortofLoading _objWrapper = new WrapperPortofLoading();
        private readonly PortofLoadingDAL _objDal = new PortofLoadingDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: PortofLoading
        [AuthorizeActionFilter]
        public ActionResult PortofLoading()
        {
            return View();
        }

        #region Get Data 
        public JsonResult Getdata()
        {
            _objWrapper = new WrapperPortofLoading();
            _objWrapper = _objDal.GetPortofLoadingdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public JsonResult Save(PortofLoading obj)
        {
            _objWrapper = new WrapperPortofLoading();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(PortofLoading obj)
        {
            _objWrapper = new WrapperPortofLoading();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(PortofLoading obj)
        {
            _objWrapper = new WrapperPortofLoading();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}