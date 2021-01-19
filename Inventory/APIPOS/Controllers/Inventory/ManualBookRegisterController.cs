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
    public class ManualBookRegisterController : Controller
    {
        #region Declare Object
        private WrapperAutoComplete _wrapperAutoComplete = new WrapperAutoComplete();
        private WrapperManualBooing _wrapper = new WrapperManualBooing();
        private ManualBooingDAL _objDal = new ManualBooingDAL();
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ManualBookRegister
        [AuthorizeActionFilter]
        public ActionResult ManualBookRegister()
        {
            return View();
        }

        public JsonResult GetManualBookRegisterData()
        {
            _objWrapper = new WrapperDispatch();
            _objWrapper = _objDal.GetManualBookRegisterData();
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
          
        }
    }
}