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
    public class ComboStockListController : Controller
    {
        #region Declare Object
        private WrapperItemHistory _objWrapper = new WrapperItemHistory();
        private readonly ItemHistoryDAL _objDal = new ItemHistoryDAL();
        private UserSession objUserSession = new UserSession();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ComboStockList
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetStockComboItem(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            obj.CreatedBy = Session["UserName"].ToString();
            _objWrapper = _objDal.GetComboStocklist(obj);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }
    }
}