using APIPOS.App_Start;
using Common;
using DAL;
using DAL.Report;
using DAO.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Sale
{
    [NoCache]
    public class SearchInvoiceController : Controller
    {
        private WrapperSalesReports _objWrapper = new WrapperSalesReports();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private CommonDAL _objCommonDAL = new CommonDAL();
        private ReportDAL _objDal = new ReportDAL();
        // GET: SearchInvoice
        [AuthorizeActionFilter]
        public ActionResult SearchInvoice()
        {
            return View();
        }
        public JsonResult SearchSaleinvoiceNo(SalesReports obj)
        {
            _objWrapper = new WrapperSalesReports();
            List<List<SalesReports>> listdata = _objDal.SearchSaleinvoiceNo(obj);
            _objWrapper.listSalesReports = listdata;
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }

        public JsonResult LoadInvoiceTypeAutoComplete(SalesReports obj)
        {
            _objWrapperauto = new WrapperAutoComplete();
            _objWrapperauto = _objDal.LoadInvoiceTypeAutoComplete(obj);
            return Json(_objWrapperauto, JsonRequestBehavior.AllowGet);
        }

        #region Delete
        public JsonResult Delete(string invoiceNo)
        {
            _objWrapper = new WrapperSalesReports();
            _objWrapper = _objDal.Delete(invoiceNo);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}