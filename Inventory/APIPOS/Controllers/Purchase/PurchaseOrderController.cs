using APIPOS.App_Start;
using Common;
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
    public class PurchaseOrderController : Controller
    {
        #region Declare Object
        WrapperPurchaseOrder _objWrapper = new WrapperPurchaseOrder();
        private readonly PurchaseOrderDAL _objDal = new PurchaseOrderDAL();
        string error = string.Empty;
        #endregion
        // GET: PurchaseOrder
        [AuthorizeActionFilter]
        public ActionResult PurchaseOrder()
        {
            return View();
        }

        public JsonResult loadItemHead( string ManufacturerId)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.loadItemHead(ManufacturerId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadPODocumentList()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.loadPODocumentList();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadProductionPic()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.loadProductionPic();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadPOStatus()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.loadPOStatus();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadPortOfLoading()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.LoadPortOfLoading();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadCFAgency()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.LoadCFAgency();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LoadShipingAgency()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.LoadShipingAgency();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Duplicated Check

        public JsonResult DuplicateCheck(string PINumber)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.DuplicateCheck(PINumber);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public JsonResult Save(PurchaseOrder obj, List<PurchaseOrderDetails> objList)
        {
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.Save(obj, objList);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region "DetailsId Delete "

        public JsonResult PODetailIdDelete(string PODetailId)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.PODetailIdDelete(PODetailId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region " PO Edit"
        public JsonResult GetPurchaseOrderEditData(string FromDate, string Todate, string type)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _objWrapper = _objDal.GetPurchaseOrderEditData(FromDate, Todate, type);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }


        public JsonResult GetPoEditData(string POMasterId)
        {
            _objWrapper = new WrapperPurchaseOrder();
            List<List<PurchaseOrder>> listdata = _objDal.GetPoEditData(POMasterId);
            _objWrapper.listPO = listdata;
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}