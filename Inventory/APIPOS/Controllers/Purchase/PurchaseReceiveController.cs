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
    public class PurchaseReceiveController : Controller
    {
        #region Declare Object
        private WrapperPurchaseReceive _objWrapper = new WrapperPurchaseReceive();
        private readonly PurchaseReceiveDAL _objDal = new PurchaseReceiveDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: PurchaseReceive
        [AuthorizeActionFilter]
        public ActionResult PurchaseReceive()
        {
            return View();
        }
        public ActionResult PurchaseReceiveInformation(string Id)
        {
            return View();
        }
        public JsonResult ShowOrder(PurchaseReceive obj)
        {
            _objWrapper = new WrapperPurchaseReceive();
            _objWrapper = _objDal.GetPurchaseOrderData(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPurchaseOrderDataByPOMasterId(PurchaseReceive obj)
        {
            _objWrapper = new WrapperPurchaseReceive();
            _objWrapper = _objDal.GetPurchaseOrderDataByPOMasterId(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Save(PurchaseReceive obj)
        {
            _objWrapper = new WrapperPurchaseReceive();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
    }
}