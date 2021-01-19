using APIPOS.App_Start;
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
    public class StockInController : Controller
    {
        #region Declare Object
        private WrapperStockIn _objWrapper = new WrapperStockIn();
        private readonly StockInDAL _objDal = new StockInDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: StockIn
        [AuthorizeActionFilter]
        public ActionResult StockIn()
        {
            return View();
        }
        public JsonResult GetDataByItemHead(StockIn obj)
        {
            _objWrapper = new WrapperStockIn();
            _objWrapper = _objDal.GetDataByItemHead(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #region Save
        public JsonResult Save(List<StockIn> obj)
        {
            _objWrapper = new WrapperStockIn();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}