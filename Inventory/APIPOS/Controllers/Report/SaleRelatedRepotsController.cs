using APIPOS.App_Start;
using Common;
using DAL;
using DAL.Report;
using DAO.Basic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Report
{
    [NoCache]
    public class SaleRelatedRepotsController : Controller
    {
        DataTable _dataTable = new DataTable();
        ReportDAL _objDal = new ReportDAL();
        CommonDAL objCommonDAL = new CommonDAL();
        private WrapperCustomer _CusWrapper = new WrapperCustomer();

        [AuthorizeActionFilter]
        // GET: SaleRelatedRepots
        public ActionResult SaleRelatedRepots()
        {
            return View();
        }
        public JsonResult loadAllCustomer()
        {
            _CusWrapper.listComboData = objCommonDAL.loadAllCustomer();
            return Json(_CusWrapper, JsonRequestBehavior.AllowGet);
        }
      public JsonResult loadItemHead()
            {
                _CusWrapper.listComboData = objCommonDAL.loadItemHead();
                return Json(_CusWrapper, JsonRequestBehavior.AllowGet);
            }

        public JsonResult loadWareHouse()
        {
            _CusWrapper.listComboData = objCommonDAL.loadWareHouse();
            return Json(_CusWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SetReportSessionData(ReportParam obj)
        {
            Session.Remove("reportObj");
            string content = Url.Content("~/Reports/CommonViewer.aspx");
            this.HttpContext.Session["reportObj"] = obj;
            return new JsonResult { Data = content };

        }
    }
}