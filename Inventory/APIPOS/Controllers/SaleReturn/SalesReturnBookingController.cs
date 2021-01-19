using APIPOS.App_Start;
using Common;
using DAL.Inventory;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.SaleReturn
{
    [NoCache]
    public class SalesReturnBookingController : Controller
    {
        #region Declare Object
        private WrapperSalesReturnBooking _objWrapper = new WrapperSalesReturnBooking();
        private readonly SalesReturnBookingDAL _objDal = new SalesReturnBookingDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: SalesReturnBooking
        [AuthorizeActionFilter]
        public ActionResult SalesReturnBooking()
        {
            return View();
        }

        public JsonResult GetReturnBookingData(string FromDate, string Todate)
        {
            _objWrapper = new WrapperSalesReturnBooking();
            _objWrapper = _objDal.GetReturnBookingData(FromDate, Todate);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SaveReturnAwating(List<SalesReturnBooking> objList)
        {
            string user = UserSession.getUserName();
            _objWrapper = _objDal.SaveReturnAwating(objList, user);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
    }
}