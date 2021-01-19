using APIPOS.App_Start;
using Common;
using DAL.Report;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Report
{
    [NoCache]
    public class DespatchReportsController : Controller
    {
        DataTable _dataTable = new DataTable();
        ReportDAL _objDal = new ReportDAL();
        // GET: DespatchReports
        [AuthorizeActionFilter]
        public ActionResult DespatchReports()
        {
            return View();
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