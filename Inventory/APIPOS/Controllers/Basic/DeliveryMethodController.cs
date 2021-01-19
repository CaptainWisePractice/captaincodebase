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
    public class DeliveryMethodController : Controller
    {
        #region Declare Object
        private WrapperAddressType _objWrapper = new WrapperAddressType();
        private readonly AddressTypeDAL _objDal = new AddressTypeDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: AddressType
        [AuthorizeActionFilter]
        public ActionResult DeliveryMethod()
        {
            return View();
        }
        #region Get Data 
        public JsonResult GetAlldata()
        {
            _objWrapper = new WrapperAddressType();
            _objWrapper = _objDal.GetAlldata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public JsonResult Save(AddressType obj)
        {
            _objWrapper = new WrapperAddressType();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(AddressType obj)
        {
            _objWrapper = new WrapperAddressType();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}