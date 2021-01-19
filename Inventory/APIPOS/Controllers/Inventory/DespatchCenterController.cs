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
    public class DespatchCenterController : Controller
    {
        #region Declare Object
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        private readonly ItemDispatchDAL _objDal = new ItemDispatchDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ItemDispatchFind
        [AuthorizeActionFilter]
        public ActionResult DespatchCenter()
        {
            return View();
        }
        public JsonResult GetDespatchData(string FromDate,string Todate)
        {
            _objWrapper = new WrapperDispatch();
            _objWrapper = _objDal.GetDespatchData(FromDate, Todate);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }
        public JsonResult LoadDeliveryMethod(ItemDispatch obj)
        {
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.LoadDeliveryMethod(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult SaveAwating(ItemDispatch obj)
        //{
        //    string user = UserSession.getUserName();
        //    _objWrapper = _objDal.SaveAwating(obj, user);
        //    return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult SaveAwating(List<ItemDispatch> objList)
        {
            string user = UserSession.getUserName();
            _objWrapper = _objDal.SaveAwating(objList, user);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

    }
}