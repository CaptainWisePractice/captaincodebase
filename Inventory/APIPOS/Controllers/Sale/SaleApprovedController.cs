using APIPOS.App_Start;
using DAL.Sale;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Sale
{
    [NoCache]
    public class SaleApprovedController : Controller
    {
        #region Declare Object
        private WrapperSaleApproval _objWrapper = new WrapperSaleApproval();
        private readonly SaleApprovalDAL _objDal = new SaleApprovalDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: SaleApproved
        [AuthorizeActionFilter]
        public ActionResult SaleApproved()
        {
            return View();
        }
        public JsonResult loadSaleInvoice(SaleApproval obj)
        {
             obj.CreatedBy= Session["UserName"].ToString();
            _objWrapper = _objDal.loadSaleInvoice(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDataBySaleId(string SaleId)
        {
            List<List<SaleApproval>> listdata = _objDal.GetDataBySaleId(SaleId);
            _objWrapper.LstlistData = listdata;
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #region Save
        public JsonResult Save(SaleApproval obj)
        {
             obj.CreatedBy = Session["UserName"].ToString();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}