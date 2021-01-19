using APIPOS.App_Start;
using Common;
using DAL;
using DAL.SaleReturn;
using DAO.Purchase;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Sale
{
    [NoCache]
    public class InvoiceCancellationController : Controller
    {
        #region Declare Object

        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private readonly InvoiceCancellationDAL _objDal = new InvoiceCancellationDAL();
        private CommonDAL _objCommonDAL = new CommonDAL();
        private WrapperInvoiceCancellation _objWrappCancel = new WrapperInvoiceCancellation();

        #endregion
        // GET: InvoiceCancellation
        [AuthorizeActionFilter]
        public ActionResult InvoiceCancellation()
        {
            return View();
        }
        public ActionResult InvoiceCancel()
        {
            return View();
        }

        public ActionResult GetInvoiceCancellationData(SalesDAO obj)
        {
            var lstRegistrationData = _objDal.GetInvoiceCancellationData(obj);
            return Json(lstRegistrationData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSaleInvoiceData(string InvoiceNo)
        {
            _objWrappCancel = new WrapperInvoiceCancellation();
            _objWrappCancel = _objDal.GetSaleInvoiceData(InvoiceNo);
            return Json(_objWrappCancel, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Save(InvoiceCancellation obj)
        {
            _objWrappCancel = new WrapperInvoiceCancellation();
            _objWrappCancel = _objDal.Save(obj);
            return Json(_objWrappCancel, JsonRequestBehavior.AllowGet);
        }
    }
}