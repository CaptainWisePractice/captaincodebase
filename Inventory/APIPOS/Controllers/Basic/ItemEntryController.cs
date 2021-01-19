using APIPOS.App_Start;
using Common;
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
    public class ItemEntryController : Controller
    {

        #region Declare Object
        private WrapperItemInfo _objWrapper = new WrapperItemInfo();
        private readonly ItemEntryDAL _objDal = new ItemEntryDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ItemEntry
        [AuthorizeActionFilter]
        public ActionResult ItemEntry()
        {
            return View();
        }

        public JsonResult loadItemHead()
        {
            _objWrapper = new WrapperItemInfo();
            _objWrapper = _objDal.loadItemHead();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadManufacturer()
        {
            _objWrapper = new WrapperItemInfo();
            _objWrapper = _objDal.loadManufacturer();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }


        #region Get Data 

       
        public JsonResult getAutoItemNumber(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.getAutoItemNumber(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getItemInfo()
        {
            _objWrapper = new WrapperItemInfo();
            _objWrapper = _objDal.getItemInfo();
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }

        #endregion

        #region Save Update
        public JsonResult Save(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Delete
        public JsonResult Delete(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Load BY Id
        public JsonResult LoadById(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _objWrapper = _objDal.LoadById(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion


        #region Duplicate
        public JsonResult DuplicateCheck(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion


    }
}