using APIPOS.App_Start;
using DAL.Purchase;
using DAO.Purchase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Purchase
{
    [NoCache]
    public class IncomingProductionStockListController : Controller
    {
        #region Declare Object
        WrapperPurchaseOrder _objWrapper = new WrapperPurchaseOrder();
        private readonly PurchaseOrderDAL _objDal = new PurchaseOrderDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: IncomingProductionStockList
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult IndexPackingList(string PINumber)
        {
            return View();
        }

        public JsonResult GetIncomingProductionList(string FromDate, string Todate, string Type)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.GetIncomingProductionList(FromDate, Todate, Type);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;

        }

        public JsonResult GetPackingListByPINumber(string PINumber)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.GetPackingListByPINumber(PINumber);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;

        }
    }
}