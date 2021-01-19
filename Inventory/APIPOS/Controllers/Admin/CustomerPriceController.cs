using APIPOS.App_Start;
using Common;
using DAL.Admin;
using DAO.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class CustomerPriceController : Controller
    {
        #region Declare Object
        private WrapperSellingPrice _objWrapper = new WrapperSellingPrice();
        private readonly SellingPriceSetupDAL _objDal = new SellingPriceSetupDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: CustomerPrice
        [AuthorizeActionFilter]
        public ActionResult CustomerPrice()
        {
            return View();
        }
        public JsonResult loadPostPaidCustomer()
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper.listComboData = _objDal.loadPostPaidCustomer();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Get Data 
        public JsonResult GetAllData()
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.GetCustomerPriceData();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Save
        public JsonResult Save(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.SaveCustomerPrice(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Delete
        public JsonResult Delete(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.DeleteCustomerPrice(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check

        public JsonResult DuplicateCheck(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.DuplicateCheckCustomerPrice(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}