using APIPOS.App_Start;
using DAL.Inventory;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Sale
{
    [NoCache]
    public class WholeSaleOrderStatusController : Controller
    {
        #region Declare Object
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        private readonly ItemDispatchDAL _objDal = new ItemDispatchDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: WholeSaleOrderStatus
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetWholeSaleOrderStatus(string FromDate, string Todate, string Type)
        {
            _objWrapper = new WrapperDispatch();
            _objWrapper = _objDal.GetWholeSaleOrderStatus(FromDate, Todate, Type);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;

        }
    }
}