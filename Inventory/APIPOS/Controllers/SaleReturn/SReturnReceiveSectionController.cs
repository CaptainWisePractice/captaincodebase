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
    public class SReturnReceiveSectionController : Controller
    {
        #region Declare Object
        private WrapperSalesReturnBooking _objWrapper = new WrapperSalesReturnBooking();
        private readonly SalesReturnBookingDAL _objDal = new SalesReturnBookingDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: SReturnReceiveSection
        [AuthorizeActionFilter]
        public ActionResult SReturnReceiveSection()
        {
            return View();
        }
        public JsonResult GetReturnReceiveData(string FromDate, string Todate, string Status)
        {
            _objWrapper = new WrapperSalesReturnBooking();
            _objWrapper = _objDal.GetReturnReceiveData(FromDate, Todate, Status);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SaveReturnReceive(List<SalesReturnBooking> objList)
        {
            string user = UserSession.getUserName();
            _objWrapper = _objDal.SaveReturnReceive(objList, user);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
    }
}