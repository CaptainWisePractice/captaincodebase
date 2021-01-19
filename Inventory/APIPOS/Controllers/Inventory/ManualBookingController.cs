using APIPOS.App_Start;
using Common;
using DAL.Inventory;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Inventory
{
    [NoCache]
    public class ManualBookingController : Controller
    {
        #region Declare Object

       private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
       private WrapperManualBooing _wrapper = new WrapperManualBooing();
       private ManualBooingDAL _objDal = new ManualBooingDAL();

        #endregion

        // GET: ManualBooking
        [AuthorizeActionFilter]
        public ActionResult ManualBooking()
        {
            return View();
        }

        public JsonResult GetItemHeadAutoComplete(ManualBooing aObj)
        {
            _wrapperAutoComplete = _objDal.GetCustomerAutoComplete(aObj);
            return Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInialAutoComplete(ManualBooing aObj)
        {
            _wrapperAutoComplete = _objDal.GetInialAutoComplete(aObj);
            return Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LoadDeliveryMethod()
        {
            _wrapper = _objDal.LoadDeliveryMethod();
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }


        #region Save
        public JsonResult Save(ManualBooing obj, List<ManualBooingDetails> lstOfChildData)
        {
            WrapperManualBooing _wrapper = new WrapperManualBooing();
            _wrapper = _objDal.Save(obj, lstOfChildData);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }


        #endregion

        public ActionResult GetSalesDataByInvNo(ManualBooing obj)
        {
            _wrapper = _objDal.GetSalesDataByInvNo(obj.InvoiceNo);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }

    }
}