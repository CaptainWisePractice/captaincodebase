using APIPOS.App_Start;
using Common;
using DAL;
using DAL.Sale;
using DAO.Sale;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.SaleReturn
{
    [NoCache]
    public class SalesReturnController : Controller
    {
        #region Declare Object

        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private readonly SalesDAL _objDal = new SalesDAL();
        private readonly SalesReturnDAL _objReturnDal = new SalesReturnDAL();
        private CommonDAL _objCommonDAL = new CommonDAL();

        #endregion
        // GET: SalesReturn
        [AuthorizeActionFilter]
        public ActionResult SalesReturn(string invNo)
        {
            ViewData.Model = HttpUtility.UrlEncode(JsonConvert.SerializeObject(_objDal.GetInvoice()));

            if (!string.IsNullOrEmpty(invNo))
            {
                var SalesEditData = _objDal.GetSalesDataByInvNo(invNo);
                ViewData["SalesEdit"] = HttpUtility.UrlEncode(JsonConvert.SerializeObject(SalesEditData));
            }
            else
            {
                var obj = _objDal.getPaymentMethod();
                // -hear my obj object contain BuyerId,JobId,TrackingId,ReferenceId,StyleId,FabBookSampleId,FabricBookingAutoGenId, pageId
                ViewData["PaymentMethod"] = HttpUtility.UrlEncode(JsonConvert.SerializeObject(obj));
            }
            //TempData.GetInvoice = _objDal.GetInvoice();//
            return View();
        }

        public JsonResult LoadReturnInvoice(string invoice)
        {
            List<Invoice> list = _objReturnDal.GetReturnInvoice(invoice);
            var lstdeliveryStatus = list[0].InvoiceNo;
            return Json(lstdeliveryStatus, JsonRequestBehavior.AllowGet);
        }

        #region Save

        public JsonResult Save(SalesDAO obj, List<SalesDetails> lstOfChildData)
        {
            wrappersalesReturnObj objInvoice = new wrappersalesReturnObj();
            objInvoice = _objReturnDal.Save(obj, lstOfChildData);

            return Json(objInvoice, JsonRequestBehavior.AllowGet);
        }


        #endregion

        public ActionResult loadSaleDataInvoiceWise(SalesDAO obj)
        {
            var SalesEditData = _objReturnDal.loadSaleDataInvoiceWise(obj.InvoiceNo);
            return Json(SalesEditData, JsonRequestBehavior.AllowGet);
        }
    }
}