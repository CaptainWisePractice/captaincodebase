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
    public class ItemTransHistoryController : Controller
    {
        #region Declare Object
        private WrapperItemHistory _objWrapper = new WrapperItemHistory();
        private readonly ItemHistoryDAL _objDal = new ItemHistoryDAL();
        private UserSession objUserSession = new UserSession();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion

        // GET: ItemTransHistory
        [AuthorizeActionFilter]
        public ActionResult ItemHistory()
        {
            return View();
        }

        // GET: ItemTransaction
        [AuthorizeActionFilter]
        public ActionResult ItemTransaction()
        {
            return View();
        }

        public JsonResult GetAllItemHistory(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.GetAllItemHistory(obj);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
         
        }

        public JsonResult GetAllItemTransaction(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            _objWrapper = _objDal.GetAllItemTransaction(obj);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
           
        }

    }
}