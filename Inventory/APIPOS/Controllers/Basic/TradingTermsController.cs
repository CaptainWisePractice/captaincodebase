using APIPOS.App_Start;
using DAL.Basic;
using DAO.Basic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Basic
{
    [NoCache]
    public class TradingTermsController : Controller
    {
          #region Declare Object
        private WrapperTradingTerm _objWrapper = new WrapperTradingTerm();
        private readonly TradingTermDAL _objDal = new TradingTermDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: TradingTerm
        [AuthorizeActionFilter]
        public ActionResult TradingTerms()
        {
            return View();
        }
       
        #region Get Data 
        public JsonResult GetTradingTermdata()
        {
            _objWrapper = new WrapperTradingTerm();
            _objWrapper = _objDal.GetTradingTermdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public JsonResult Save(TradingTerm obj)
        {
            _objWrapper = new WrapperTradingTerm();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(TradingTerm obj)
        {
            _objWrapper = new WrapperTradingTerm();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(TradingTerm obj)
        {
            _objWrapper = new WrapperTradingTerm();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion


    }
}