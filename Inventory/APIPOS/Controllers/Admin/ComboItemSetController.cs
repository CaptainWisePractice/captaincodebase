using APIPOS.App_Start;
using Common;
using DAL.Admin;
using DAL.Basic;
using DAO.Admin;
using DAO.Basic;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class ComboItemSetController : Controller
    {
        #region Declare Object
        private ComboSetWrapper _objWrapper = new ComboSetWrapper();
        private readonly ComboSetDAL _objDal = new ComboSetDAL();
        WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ComboItemSet
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }


        #region Get Data 
        public JsonResult GetComboSetdata()
        {
            _objWrapper = new ComboSetWrapper();
            _objWrapper = _objDal.GetComboSetdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetItemHeadAutoComplete(ComboSet aObj)
        {
            _objWrapperauto = new WrapperAutoComplete();
            _objWrapperauto = _objDal.GetItemHeadAutoComplete(aObj);
            return Json(_objWrapperauto, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetComboSetdataById(ComboSet _obj)
        {
            List<ComboSetDetails> LstComboSetDetails = new List<ComboSetDetails>();
            LstComboSetDetails = _objDal.GetComboSetdataById(_obj);
            return Json(LstComboSetDetails, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Save
        public JsonResult Save(ComboSet obj)
        {
            _objWrapper = new ComboSetWrapper();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(ComboSet obj)
        {
            _objWrapper = new ComboSetWrapper();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ComboItemDetailIdDelete(int DetsItemId)
        {
            _objWrapper = new ComboSetWrapper();
            _objWrapper = _objDal.ComboItemDetailIdDelete(DetsItemId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(ComboSet obj)
        {
            _objWrapper = new ComboSetWrapper();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}