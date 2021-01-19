using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Common;
using DAL;
using DAL.Basic;
using DAL.Sale;
using DAO.Basic;
using DAO.Sale;
using Newtonsoft.Json;
using DAL.HelpingData;
using APIPOS.App_Start;

namespace APIPOS.Controllers.Sale
{
    [NoCache]
    public class SalesController : Controller
    {
        // GET: Sales

        #region Declare Object

        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private readonly SalesDAL _objDal = new SalesDAL();
        private CommonDAL _objCommonDAL = new CommonDAL();
        SalesDaoMasterEdit _obj = new SalesDaoMasterEdit();

        #endregion
        [AuthorizeActionFilter]
        public ActionResult Sales(string invNo)
        {
            ViewData.Model = HttpUtility.UrlEncode(JsonConvert.SerializeObject(_objDal.GetInvoice()));

            if (!string.IsNullOrEmpty(invNo))
            {
                _obj.InvoiceNo = invNo;
                string SalesEditData = _obj.InvoiceNo;//_objDal.GetSalesDataByInvNo(invNo);
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

        #region Get Data 

        //public JsonResult GetCustomerdata()
        //{
        //    _objWrapper = new WrapperCustomer();
        //    _objWrapper = _objDal.GetCustomerdata();
        //    return Json(_objWrapper, JsonRequestBehavior.AllowGet);GetPaymentMethod
        public JsonResult LoadInvoice()
        {
            List<Invoice> list = _objDal.GetInvoice();
            var lstdeliveryStatus = list[0].InvoiceNo;
            return Json(lstdeliveryStatus, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LoadUserandManagerPercentange()
        {
            SaleEditPerandState list = _objDal.LoadUserandManagerPercentange();
            var lstPercentState = list;
            return Json(lstPercentState, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadPaymentMethod()
        {
            var lstdeliveryStatus = _objDal.GetPaymentMethod();
            return Json(lstdeliveryStatus, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadInvDeliveryStatus()
        {
            var lstdeliveryStatus = _objDal.GetInvDeliveryStatus();
            return Json(lstdeliveryStatus, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoadReferralSource()
        {
            var lstdeliveryStatus = _objDal.GetLoadReferralSource();
            return Json(lstdeliveryStatus, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadTax()
        {
            var lstTax = _objDal.GetTax();
            return Json(lstTax, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadCustomerAutoComplete(SalesDAO aObj)
        {
            WrapperCustomerGetData _wrapperAutoComplete = new WrapperCustomerGetData();
            _wrapperAutoComplete = _objDal.GetCustomerAutoComplete(aObj);
            return Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadPopupCustomer(SalesDAO aObj)
        {
            WrapperCustomerGetData _wrapperAutoComplete = new WrapperCustomerGetData();
            _wrapperAutoComplete = _objDal.LoadPopupCustomer(aObj);
            return Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerAddress(SalesDAO aObj)
        {
            var listofCustomerAddress = new WrapperAddress();
            listofCustomerAddress = _objDal.GetCustomerAddress(aObj);
            return Json(listofCustomerAddress, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCustomerDue(SalesDAO aObj)
        {
            var customerpaymentdue = _objDal.GetCustomerDue(aObj);
            return Json(customerpaymentdue, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWareHouse()
        {
            var warehouse = _objCommonDAL.loadWareHouse();
            return Json(warehouse, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadSaleOutlet()
        {
            var warehouse = _objCommonDAL.loadSaleOutlet();
            return Json(warehouse, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadWareHouseByHeadId(CommonParameter aObj)
        {
            var warehouse = _objCommonDAL.LoadWareHouseByHeadId(aObj);
            return Json(warehouse, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetItemHeadAutoComplete(SalesDAO aObj)
        {

            var lstOfHeadIt = _objDal.GetItemHeadAutoComplete(aObj);
            return Json(lstOfHeadIt, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInialAutoComplete(SalesDAO aObj)
        {
           var lstOfHeadIt = _objDal.GetInialAutoComplete(aObj);
            return Json(lstOfHeadIt, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSalesPerason()
        {
            var lstOfHeadIt = _objDal.GetSalesPerason();
            return Json(lstOfHeadIt, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSalesPerasonInvoieEdit()
        {
            var lstOfHeadIt = _objDal.GetSalesPerasonInvoieEdit();
            return Json(lstOfHeadIt, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetShippingMethod()
        {
            var lstOfHeadIt = _objDal.GetShippingMethod();
            return Json(lstOfHeadIt, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Save

        public JsonResult SaveCustomer(SalesDAO userObj)
        {
            wrapperCustomer obj = new wrapperCustomer();
            if (userObj != null)
            {
                obj = _objDal.InsertNewCustomerAndGetit(userObj);
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Save(SalesDAO obj, List<SalesDetails> lstOfChildData)
        {
            wrappersalesReturnObj objInvoice = new wrappersalesReturnObj();
            objInvoice = _objDal.Save(obj, lstOfChildData);

            return Json(objInvoice, JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region "DetailsId Delete "

        public JsonResult SaleDetailIdDelete(string saleDetsId)
        {
            _objWrapper = new WrapperSales();
            _objWrapper = _objDal.SaleDetailIdDelete(saleDetsId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region"Get data"
        public ActionResult GetCustomerSaleData(SalesDAO obj)
        {

            var lstRegistrationData = _objDal.GetRegistrationData(obj);
            JsonResult json = Json(lstRegistrationData, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
           // return Json(lstRegistrationData, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAllSale(SalesDAO obj)
        {
            var SalesEditData = _objDal.GetSalesDataByInvNo(obj.SearchText);
            return Json(SalesEditData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadInvoiceCustomerAutoComplete(SalesDAO aObj)
        {
            WrapperCustomerGetData _wrapperAutoComplete = new WrapperCustomerGetData();
            _wrapperAutoComplete = _objDal.LoadInvoiceCustomerAutoComplete(aObj);
            return Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
        }

        public ActionResult InvoiceWisePaymentHistory(SalesDAO obj)
        {
            SalesPaymentHistoryList objSaleEditData = new SalesPaymentHistoryList();
            objSaleEditData = _objDal.GetPaymentHistoryByInvNo(obj.InvoiceNo);
            return Json(objSaleEditData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetComboSetDetailsById(int IHeadId)
        {
            _objWrapper = new WrapperSales();
            _objWrapper = _objDal.GetComboSetDetailsById(IHeadId);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}