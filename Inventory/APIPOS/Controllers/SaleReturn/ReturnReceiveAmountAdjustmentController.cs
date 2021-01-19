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

namespace APIPOS.Controllers.SaleReturn
{
    [NoCache]
    public class ReturnReceiveAmountAdjustmentController : Controller
    {
        #region Declare Object

        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private readonly SalesReturnReceiveDAL _objDal = new SalesReturnReceiveDAL();
        private CommonDAL _objCommonDAL = new CommonDAL();
        private WrapperSaleReturnReceive _objWrappRec = new WrapperSaleReturnReceive();
        List<ComboData> lstComboData = new List<ComboData>();

        #endregion
        // GET: ReturnReceiveAmountAdjustment
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult loadReturnInvoiceNo()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _objDal.loadReturnInvoiceNo();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRetrunRecvInvoiceData(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _objWrappRec = _objDal.GetRetrunRecvInvoiceAdjustmentData(InvoiceNo);
            return Json(_objWrappRec, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Save(SaleReturnReceive obj)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _objWrappRec = _objDal.AdjustmentSave(obj);
            return Json(_objWrappRec, JsonRequestBehavior.AllowGet);
        }
    }
}