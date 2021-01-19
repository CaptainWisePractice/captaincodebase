using APIPOS.App_Start;
using Common;
using DAL.Purchase;
using DAO.Basic;
using DAO.Purchase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Purchase
{
    [NoCache]
    public class POConsumptionController : Controller
    {
        #region Declare Object
        WrapperIHead _objWrapper = new WrapperIHead();
        private readonly PurchaseOrderDAL _objDal = new PurchaseOrderDAL();
        WrapperPurchaseOrder _wrapper = new WrapperPurchaseOrder();
        string error = string.Empty;
        #endregion
        // GET: POConsumption
        [AuthorizeActionFilter]
        public ActionResult POConsumption()
        {
            return View();
        }

        [AuthorizeActionFilter]
        public ActionResult NewOrderEstimate()
        {
            return View();
        }

        public JsonResult GetPOConstionByManufacturer(string ManufacturerId, string MasterId)
        {
            _objWrapper = new WrapperIHead();
            _objWrapper = _objDal.GetPOConstionByManufacturer(ManufacturerId, MasterId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Save
        public JsonResult Save(ItemHead obj, List<ItemHead> objList)
        {
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.Save(obj, objList);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        public JsonResult GetNewOrderEstimateData(string FromDate, string Todate)
        {
            _objWrapper = new WrapperIHead();
            _objWrapper = _objDal.GetNewOrderEstimateData(FromDate, Todate);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Delete
        public JsonResult Delete(ItemHead obj)
        {
            _objWrapper = new WrapperIHead();
            _objWrapper = _objDal.DeleteNewOrderEstimate(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}