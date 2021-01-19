using APIPOS.App_Start;
using DAL.Basic;
using DAO.Basic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;

namespace APIPOS.Controllers.Basic
{
    [NoCache]
    public class CFAgentController : Controller
    {

        #region Declare Object
        private WrapperCFAgent _objWrapper = new WrapperCFAgent();
        private readonly CFAgentDAL _objDal = new CFAgentDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: CFAgent
        [AuthorizeActionFilter]
        public ActionResult CFAgent()
        {
            return View();
        }

        #region Get Data 
        public JsonResult Getdata()
        {
            _objWrapper = new WrapperCFAgent();
            _objWrapper = _objDal.GetCFAgentdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public JsonResult Save(CFAgent obj)
        {
            _objWrapper = new WrapperCFAgent();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(CFAgent obj)
        {
            _objWrapper = new WrapperCFAgent();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(CFAgent obj)
        {
            _objWrapper = new WrapperCFAgent();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}