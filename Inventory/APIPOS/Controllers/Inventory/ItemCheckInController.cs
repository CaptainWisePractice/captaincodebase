using APIPOS.App_Start;
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
    public class ItemCheckInController : Controller
    {
        CommonDAL _objCommonDAL = new CommonDAL();
        WrapperItemCheckOut _objWrapperItemCheck = new WrapperItemCheckOut();
        ItemCheckOutDAL _objItemCheckInDAL = new ItemCheckOutDAL();
        ItemCheckOut _objItemCheckIn = new ItemCheckOut();
        string empCode = string.Empty;
        string error = string.Empty;
        // GET: ItemCheckIn
        [AuthorizeActionFilter]
        public ActionResult ItemCheckIn()
        {
            return View();
        }

        public JsonResult loadCustomer()
        {
            _objWrapperItemCheck.listComboData = _objCommonDAL.loadCheckOutCustomer();
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCheckOutDataByCustomerId(ItemCheckOut obj)
        {
            _objWrapperItemCheck = new WrapperItemCheckOut();
            _objWrapperItemCheck = _objItemCheckInDAL.GetCheckOutDataByCustomerId(obj);
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }

        #region Save
        public JsonResult CheckInSave(List<ItemCheckOut> objList)
        {
            string user = Session["UserName"].ToString();
            _objWrapperItemCheck = _objItemCheckInDAL.CheckInSave( objList, user);
            return Json(_objWrapperItemCheck, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}