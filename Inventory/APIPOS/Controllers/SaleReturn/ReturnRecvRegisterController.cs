using APIPOS.App_Start;
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
    public class ReturnRecvRegisterController : Controller
    {
        #region Declare Object
        private WrapperSalesReturnBooking _objWrapper = new WrapperSalesReturnBooking();
        private readonly SalesReturnBookingDAL _objDal = new SalesReturnBookingDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ReturnRecvRegister
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetReturnRecvRegisterData(string FromDate, string Todate, string Status)
        {
            _objWrapper = new WrapperSalesReturnBooking();
            _objWrapper = _objDal.GetReturnRecvRegisterData(FromDate, Todate, Status);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
    }
}