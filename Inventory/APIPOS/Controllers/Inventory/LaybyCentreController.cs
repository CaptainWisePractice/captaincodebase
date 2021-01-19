using APIPOS.App_Start;
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
    public class LaybyCentreController : Controller
    {
        #region Declare Object
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        private readonly ItemDispatchDAL _objDal = new ItemDispatchDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: LaybyCentre
        [AuthorizeActionFilter]
        public ActionResult LaybyCentre()
        {
            return View();
        }

        public JsonResult GetLaybyData()
        {
            _objWrapper = new WrapperDispatch();
            _objWrapper = _objDal.GetLaybyData();
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
          
        }
    }
}