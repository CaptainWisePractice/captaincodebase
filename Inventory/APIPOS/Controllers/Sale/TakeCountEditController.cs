using APIPOS.App_Start;
using DAL;
using DAL.Sale;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Sale
{
    [NoCache]
    public class TakeCountEditController : Controller
    {
        #region Declare Object

        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperTakeCount _objTakeWrapper = new WrapperTakeCount();
        private readonly CountakingPrepaidOrderDAL _objDal = new CountakingPrepaidOrderDAL();
        private CommonDAL _objCommonDAL = new CommonDAL();

        #endregion
        // GET: TakeCountEdit
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetTakeCountEditData(int OutletId, string FromDate, string Todate)
        {
            _objWrapper = new WrapperSales();
            _objWrapper = _objDal.GetTakeCountEditData(OutletId, FromDate, Todate);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTakeCountEditDateWiseData(int OutletId ,string FromDate, string Todate, string PayDate)
        {
            _objWrapper = new WrapperSales();
            _objWrapper = _objDal.GetTakeCountEditDateWiseData( OutletId, FromDate, Todate, PayDate);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

    }
}