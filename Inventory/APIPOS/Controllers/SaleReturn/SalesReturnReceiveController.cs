using APIPOS.App_Start;
using Common;
using DAL;
using DAL.Sale;
using DAL.SaleReturn;
using DAO.Purchase;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.SaleReturn
{
    [NoCache]
    public class SalesReturnReceiveController : Controller
    {
        #region Declare Object

        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private readonly SalesReturnReceiveDAL _objDal = new SalesReturnReceiveDAL();
        private CommonDAL _objCommonDAL = new CommonDAL();
        private WrapperSaleReturnReceive _objWrappRec = new WrapperSaleReturnReceive();

        #endregion
        // GET: SalesReturnReceive
        [AuthorizeActionFilter]
        public ActionResult SalesReturnReceive()
        {
            return View();
        }
        public ActionResult SalesReturnReceivedInfo()
        {
            return View();
        }
        public ActionResult ReturnRecPrintInvoice(string InvoiceNo)
        {
            return View();
        }
        public ActionResult GetSaleDestatchData(SalesDAO obj)
        {
            var lstRegistrationData = _objDal.GetSaleDestatchData(obj);
            return Json(lstRegistrationData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSaleInvoiceData(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _objWrappRec = _objDal.GetSaleInvoiceData(InvoiceNo);
            return Json(_objWrappRec, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRetrunRecvInvoiceData(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _objWrappRec = _objDal.GetRetrunRecvInvoiceData(InvoiceNo);
            return Json(_objWrappRec, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Save(SaleReturnReceive obj)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _objWrappRec = _objDal.Save(obj);
            return Json(_objWrappRec, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRetrunRecvInvoicePrint(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _objWrappRec = _objDal.GetRetrunRecvInvoicePrint(InvoiceNo);
            return Json(_objWrappRec, JsonRequestBehavior.AllowGet);
        }

    }
}