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
    public class StockAdjustmentController : Controller
    {
        #region Declare Object
        private WrapperStockAdjustment _objWrapper = new WrapperStockAdjustment();
        private readonly StockAdjustmentDAL _objDal = new StockAdjustmentDAL();
        #endregion
        // GET: StockAdjustment
        [AuthorizeActionFilter]
        public ActionResult StockAdjustment()
        {
            return View();
        }
        public JsonResult GetDataByItemCode(string ItemCode)
        {
            _objWrapper = new WrapperStockAdjustment();
            _objWrapper = _objDal.GetDataByItemCode(ItemCode);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #region Save
        public JsonResult Save(List<StockAdjustment> obj)
        {
            _objWrapper = new WrapperStockAdjustment();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}