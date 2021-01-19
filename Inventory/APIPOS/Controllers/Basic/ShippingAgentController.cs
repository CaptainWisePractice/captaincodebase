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
    public class ShippingAgentController : Controller
    {
        #region Declare Object
        private WrapperShippingAgent _objWrapper = new WrapperShippingAgent();
        private readonly ShippingAgentDAL _objDal = new ShippingAgentDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ShippingAgent
        [AuthorizeActionFilter]
        public ActionResult ShippingAgent()
        {
            return View();
        }

        #region Get Data 
        public JsonResult Getdata()
        {
            _objWrapper = new WrapperShippingAgent();
            _objWrapper = _objDal.Getdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save and Update
        public JsonResult Save(ShippingAgent obj)
        {
            _objWrapper = new WrapperShippingAgent();
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(ShippingAgent obj)
        {
            _objWrapper = new WrapperShippingAgent();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(ShippingAgent obj)
        {
            _objWrapper = new WrapperShippingAgent();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}