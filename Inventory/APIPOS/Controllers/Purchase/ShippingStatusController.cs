using APIPOS.App_Start;
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
    public class ShippingStatusController : Controller
    {
        #region Declare Object
        WrapperPurchaseOrder _objWrapper = new WrapperPurchaseOrder();
        private readonly PurchaseOrderDAL _objDal = new PurchaseOrderDAL();
        string error = string.Empty;
        #endregion
        // GET: ShippingStatus
        [AuthorizeActionFilter]
        public ActionResult ShippingStatus()
        {
            return View();
        }

        public JsonResult GetShippingStatus()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.GetShippingStatus();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
    }
}