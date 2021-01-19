using APIPOS.App_Start;
using Common;
using DAL.Inventory;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Inventory
{
    [NoCache]
    public class StockTransferRegisterController : Controller
    {
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private WrapperStockTransfer _wrapper = new WrapperStockTransfer();
        private StockTransferDAL _objDal = new StockTransferDAL();
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        string empCode = string.Empty;
        string error = string.Empty;
        List<ComboData> lstComboData = new List<ComboData>();
        // GET: StockTransferRegister
        [AuthorizeActionFilter]
        public ActionResult StockTransferRegister()
        {
            return View();
        }

        public JsonResult LoadTransferItem()
        {
            lstComboData = new List<ComboData>();
            lstComboData = _objDal.LoadTransferItem();
            return Json(lstComboData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStockTransferRegisterData(int IheadId,int fromSite,int toSite,string fromDate,string toDate, string type)
        {
            _objWrapper = new WrapperDispatch();
            _objWrapper = _objDal.GetStockTransferRegisterData(IheadId, fromSite, toSite, fromDate, toDate, type);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
          
        }
    }
}