using APIPOS.App_Start;
using DAL;
using DAL.Inventory;
using DAO.Basic;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Inventory
{
    [NoCache]
    public class ItemMoveController : Controller
    {
        CommonDAL _objCommonDAL = new CommonDAL();
        ItemMove _objItemMove = new ItemMove();
        WrapperItemMove _objWrapperItmMove = new WrapperItemMove();
        ItemMoveDAL _objItemMoveDAL = new ItemMoveDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        // GET: ItemMove
        [AuthorizeActionFilter]
        public ActionResult ItemMove()
        {
            return View();
        }

        public JsonResult loadItemHead()
        {
            _objWrapperItmMove.listComboData = _objCommonDAL.loadItemHead();
            return Json(_objWrapperItmMove, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadItemByHead( string headId)
        {

            _objWrapperItmMove = new WrapperItemMove();
            _objWrapperItmMove = _objItemMoveDAL.loadItemByHead(headId);
            return Json(_objWrapperItmMove, JsonRequestBehavior.AllowGet);

            //_objWrapperItmMove.listComboData = _objItemMoveDAL.loadItemByHead(headId);
            //return Json(_objWrapperItmMove, JsonRequestBehavior.AllowGet);
        }
        #region Save
        public JsonResult Save(List<ItemMove> Lstobj)
        {
            _objWrapperItmMove = new WrapperItemMove();
            _objWrapperItmMove = _objItemMoveDAL.Save(Lstobj);
            return Json(_objWrapperItmMove, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}