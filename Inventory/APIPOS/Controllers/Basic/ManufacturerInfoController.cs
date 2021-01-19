using APIPOS.App_Start;
using Common;
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
    public class ManufacturerInfoController : Controller
    {
        #region Declare Object
        private WrapperManufacturer _objWrapper = new WrapperManufacturer();
        private readonly ManufacturerInfoDAL _objDal = new ManufacturerInfoDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ManufacturerInfo
        [AuthorizeActionFilter]
        public ActionResult ManufacturerInfo()
        {
            return View();
        }


        #region Get Data 
        public JsonResult Getdata()
        {
            _objWrapper = new WrapperManufacturer();
            _objWrapper = _objDal.Getdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save and Update
        public JsonResult Save(ManufacturerInfo obj)
        {
            _objWrapper = new WrapperManufacturer();
            obj.CreatedBy= UserSession.getUserName();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(ManufacturerInfo obj)
        {
            _objWrapper = new WrapperManufacturer();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(ManufacturerInfo obj)
        {
            _objWrapper = new WrapperManufacturer();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}