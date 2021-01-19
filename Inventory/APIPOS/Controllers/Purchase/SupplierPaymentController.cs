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
    public class SupplierPaymentController : Controller
    {
        #region Declare Object
        WrapperPurchaseOrder _objWrapper = new WrapperPurchaseOrder();
        private readonly PurchaseOrderDAL _objDal = new PurchaseOrderDAL();
        string error = string.Empty;
        #endregion
        // GET: SupplierPayment
        [AuthorizeActionFilter]
        public ActionResult SupplierPayment()
        {
            return View();
        }

        public JsonResult loadPOSupplier()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.loadPOSupplier();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadPINumber()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.loadPINumber();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetManufactureandPiWiseData( string POMasterId)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.GetManufactureandPiWiseData(POMasterId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SupplierPaySave(PurchaseOrder obj)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.SupplierPaySave(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

    }
}