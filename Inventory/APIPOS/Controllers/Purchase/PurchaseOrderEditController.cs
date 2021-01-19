using APIPOS.App_Start;
using DAL.Purchase;
using DAO.Purchase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Purchase
{
    [NoCache]
    public class PurchaseOrderEditController : Controller
    {
        #region Declare Object
        WrapperPurchaseOrder _objWrapper = new WrapperPurchaseOrder();
        private readonly PurchaseOrderDAL _objDal = new PurchaseOrderDAL();
        string error = string.Empty;
        #endregion
        // GET: PurchaseOrderEdit
        [AuthorizeActionFilter]
        public ActionResult PurchaseOrderEdit()
        {
            return View();
        }

        #region Delete
        public JsonResult Delete(PurchaseOrder obj)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}