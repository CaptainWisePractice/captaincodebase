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
    public class FOBPriceSetController : Controller
    {
        private WrapperFOBPriceSet _objWrapper = new WrapperFOBPriceSet();
        private FOBPriceSetDAL _objDal = new FOBPriceSetDAL();
        string error = string.Empty;
        // GET: FOBPriceSet
        [AuthorizeActionFilter]
        public ActionResult FOBPriceSet()
        {
            return View();
        }

        public JsonResult loadItemHead()
        {
            _objWrapper = new WrapperFOBPriceSet();
            _objWrapper.ldata = _objDal.getItemHead();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Save
        public JsonResult Save(FOBPriceSet obj)
        {
            _objWrapper = new WrapperFOBPriceSet();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}