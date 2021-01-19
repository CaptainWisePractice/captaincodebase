using APIPOS.App_Start;
using Common;
using DAL.SearchBoard;
using DAO.SearchBoard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.SearchBoard
{
    [NoCache]
    public class StockItemCodeWiseController : Controller
    {
        #region Declare Object
        private WrapperItemHistory _objWrapper = new WrapperItemHistory();
        private readonly ItemHistoryDAL _objDal = new ItemHistoryDAL();
        private UserSession objUserSession = new UserSession();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: StockItemCodeWise
        [AuthorizeActionFilter]
        public ActionResult StockItemCodeWise()
        {
            return View();
        }

        public JsonResult GetStockItemCode(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            obj.CreatedBy = Session["UserName"].ToString();
            _objWrapper = _objDal.GetStockItemCode(obj);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
           // return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetStockByItemCode(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            obj.CreatedBy = Session["UserName"].ToString();
            _objWrapper = _objDal.GetStockByItemCode(obj);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
          //  return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

    }
}