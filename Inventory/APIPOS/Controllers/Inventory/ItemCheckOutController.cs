using APIPOS.App_Start;
using Common;
using DAL;
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
    public class ItemCheckOutController : Controller
    {
        CommonDAL _objCommonDAL = new CommonDAL();
        WrapperItemCheckOut _objWrapperItemCheck = new WrapperItemCheckOut();
        ItemCheckOutDAL _objItemCheckInDAL = new ItemCheckOutDAL();
        ItemCheckOut _objItemCheckIn = new ItemCheckOut();
        string empCode = string.Empty;
        string error = string.Empty;
        // GET: ItemCheckIn
        [AuthorizeActionFilter]
        public ActionResult ItemCheckOut()
        {
            return View();
        }

        public JsonResult loadItemHead()
        {
            _objWrapperItemCheck.listComboData = _objItemCheckInDAL.loadItemHead();
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadLocation()
        {
            _objWrapperItemCheck.listComboData = _objCommonDAL.loadLocationWithSite();
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadItem( string headId)
        {
            _objWrapperItemCheck.listComboData = _objItemCheckInDAL.loadItem(headId);
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadLocationByHeadId(string headId)
        {
            _objWrapperItemCheck.listComboData = _objItemCheckInDAL.loadLocationByHeadId(headId);
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }
        #region Save
        public JsonResult Save(ItemCheckOut obj, List<ItemCheckOut> objList)
        {
            obj.CreatedBy = UserSession.getUserName();
            _objWrapperItemCheck = _objItemCheckInDAL.Save(obj, objList);
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}