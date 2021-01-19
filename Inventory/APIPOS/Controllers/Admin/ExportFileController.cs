using APIPOS.App_Start;
using Common;
using DAL.Admin;
using DAO.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class ExportFileController : Controller
    {
        #region Declare Object
        private ExportFileWrapper _objWrapper = new ExportFileWrapper();
        private readonly ExportFileDAL _objDal = new ExportFileDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ExportFile
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult ExportFileData(string operation, string FromDate, string Todate)
        {
            _objWrapper = _objDal.ExportFile(operation,FromDate, Todate);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }
    }
}