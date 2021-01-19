using APIPOS.App_Start;
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
    public class ReceivePaymentsController : Controller
    {
        #region Declare Object
        private WrapperReceivePayments _objWrapper = new WrapperReceivePayments();
        private readonly ReceivePaymentsDAL _objDal = new ReceivePaymentsDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ReceivePayments
        [AuthorizeActionFilter]
        public ActionResult ReceivePayments()
        {
            return View();
        }
        public JsonResult loadCustomer()
        {
            _objWrapper = new WrapperReceivePayments();
            _objWrapper = _objDal.loadCustomer();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDataByCustomerId(string CustomerId)
        {
            _objWrapper = new WrapperReceivePayments();
            _objWrapper = _objDal.GetDataByCustomerId(CustomerId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Save
        public JsonResult Save(ReceivePayments obj)
        {
            _objWrapper = new WrapperReceivePayments();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}