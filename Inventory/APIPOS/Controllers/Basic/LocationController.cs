using APIPOS.App_Start;
using DAL.Basic;
using DAO.Basic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Basic
{
    [NoCache]
    public class LocationController : Controller
    {
        #region Declare Object
        private WrapperLocation _objWrapper = new WrapperLocation();
        private readonly LocationDAL _objDal = new LocationDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: Location
        [AuthorizeActionFilter]
        public ActionResult Location()
        {
            return View();
        }
        #region Get Data 
        public JsonResult getLocation()
        {
            _objWrapper = new WrapperLocation();
            _objWrapper = _objDal.GetLocationdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadWarehouse()
        {
            _objWrapper = new WrapperLocation();
            _objWrapper = _objDal.loadWarehouse();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Save
        public JsonResult Save(Location obj)
        {
            _objWrapper = new WrapperLocation();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(Location obj)
        {
            _objWrapper = new WrapperLocation();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check

        public JsonResult DuplicateCheck(Location obj)
        {
            _objWrapper = new WrapperLocation();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}