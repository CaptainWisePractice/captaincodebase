using Common;
using DAL;
using System.Collections.Generic;
using System.Web.Mvc;

namespace APIPOS.Controllers
{
    public class CommonController : Controller
    {
        private readonly CommonDAL _CommonDAL = new CommonDAL();
        List<ComboData> lstComboData = new List<ComboData>();
        // GET: Common
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public JsonResult loadAddressType()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadAddressType();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTaxCode()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.GetTaxCode();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPaymentTerms()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.GetPaymentTerms();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadCountry()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadCountry();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadDesignation()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadDesignation();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadPaymentMethod()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadPaymentMethod();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadReport(int ReportParentId)
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadReport(ReportParentId);
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadItemHead()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadItemHead();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadItemByIHeadId(string IHeadId)
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadItemByIHeadId(IHeadId);
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadSupplier()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadSupplier();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadSupplierWithCode()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadSupplierWithCode();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadManufacturer()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadManufacturer();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadLocation()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadLocation();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadLocationWithCode()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadLocationWithCode();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadLocationWithSite()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadLocationWithSite();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadTradingTerms()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadTradingTerms();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadAllEmployee()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _CommonDAL.loadAllEmployee();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }
    }
}