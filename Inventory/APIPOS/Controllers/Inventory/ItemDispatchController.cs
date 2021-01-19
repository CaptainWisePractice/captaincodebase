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
    public class ItemDispatchController : Controller
    {
        #region Declare Object
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        private readonly ItemDispatchDAL _objDal = new ItemDispatchDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ItemDispatch
        [AuthorizeActionFilter]
        public ActionResult ItemDispatch()
        {
            return View();
        }

        public JsonResult loadSaleInvoice(ItemDispatch obj)
        {
            obj.CreatedBy = Session["UserName"].ToString();
            _objWrapper = _objDal.loadSaleInvoice(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDataBySaleId(string SaleId)
        {
            List<List<ItemDispatch>> listdata = _objDal.GetDataBySaleId(SaleId);
            _objWrapper.LstlistData = listdata;
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Save
        public JsonResult Save(List<ItemDispatch> objList)
        {
            string user = UserSession.getUserName();
            _objWrapper = _objDal.Save(objList, user);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
     

        #endregion
    }
}