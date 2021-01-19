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
    public class StockTransferController : Controller
    {
        #region Declare Object
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private WrapperStockTransfer _wrapper = new WrapperStockTransfer();
        private StockTransferDAL _objDal = new StockTransferDAL();

        #endregion
        // GET: StockTransfer
        [AuthorizeActionFilter]
        public ActionResult StockTransfer()
        {
            return View();
        }

        public ActionResult PrintInvoice(string InvoiceNo)
        {
            return View();
        }

        public JsonResult LoadDeliveryMethod()
        {
            _wrapper = _objDal.LoadDeliveryMethod();
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadUserPerson()
        {
            _wrapper = _objDal.LoadUserPerson();
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LoadFromSite()
        {
            _wrapper = _objDal.LoadFromSite();
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LoadToSite( int FromSiteId)
        {
            _wrapper = _objDal.LoadToSite(FromSiteId);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadToSiteLocation( int SiteId)
        {
            _wrapper = _objDal.loadToSiteLocation(SiteId);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetItemHeadAutoComplete(StockTransfer aObj)
        {
            _wrapperAutoComplete = _objDal.GetCustomerAutoComplete(aObj);
            //JsonResult json = Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
            //json.MaxJsonLength = 2147483644;
            //return json;
            return Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInialAutoComplete(StockTransfer aObj)
        {
            _wrapperAutoComplete = _objDal.GetInialAutoComplete(aObj);
            //JsonResult json = Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
            //json.MaxJsonLength = 2147483644;
            //return json;
             return Json(_wrapperAutoComplete, JsonRequestBehavior.AllowGet);
        }

        #region Save
        public JsonResult Save(StockTransfer obj, List<StockTransferDetails> lstOfChildData)
        {
            WrapperStockTransfer _wrapper = new WrapperStockTransfer();
            _wrapper = _objDal.Save(obj, lstOfChildData);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check

        public JsonResult DuplicateCheck(string orderNo)
        {
            WrapperStockTransfer _wrapper = new WrapperStockTransfer();
            _wrapper = _objDal.DuplicateCheck(orderNo);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        public ActionResult GetTranferDataByInvNo(StockTransfer obj)
        {
            _wrapper = _objDal.GetTranferDataByInvNo(obj.InvoiceNo);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTranferDataByInvNoPrint(StockTransfer obj)
        {
            _wrapper = _objDal.GetTranferDataByInvNoPrint(obj.InvoiceNo);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }

        #region "DetailsId Delete "

        public JsonResult DetailIdDelete(string STransferDetsId)
        {
            _wrapper = new WrapperStockTransfer();
            _wrapper = _objDal.DetailIdDelete(STransferDetsId);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeletedById(string STransferId)
        {
            _wrapper = new WrapperStockTransfer();
            _wrapper = _objDal.DeletedById(STransferId);
            return Json(_wrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}