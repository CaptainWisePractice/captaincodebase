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
    public class WareHouseController : Controller
    {
        #region Declare Object
        private WrapperWareHouse _objWrapper = new WrapperWareHouse();
        private readonly WareHouseDAL _objDal = new WareHouseDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: WareHouse
        [AuthorizeActionFilter]
        public ActionResult WareHouse()
        {
            return View();
        }
     
        #region Get Data 
        public JsonResult GetWarehousedata()
        {
            _objWrapper = new WrapperWareHouse();
            _objWrapper = _objDal.GetWarehousedata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public JsonResult Save(WareHouse obj)
        {
            _objWrapper = new WrapperWareHouse();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(WareHouse obj)
        {
            _objWrapper = new WrapperWareHouse();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(WareHouse obj)
        {
            _objWrapper = new WrapperWareHouse();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}