using APIPOS.App_Start;
using DAL;
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
    public class CountakingPrepaidOrdersController : Controller
    {
        #region Declare Object

        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperTakeCount _objTakeWrapper = new WrapperTakeCount();
        private readonly CountakingPrepaidOrderDAL _objDal = new CountakingPrepaidOrderDAL();
        private CommonDAL _objCommonDAL = new CommonDAL();
        List<List<SalesDAO>> SalesLstList = new List<List<SalesDAO>>();

        #endregion
        // GET: CountakingPrepaidOrders
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCountakingPrepaidOrder(int OutletId,string FromDate, string Todate)
        {
            _objWrapper = new WrapperSales();
            _objWrapper = _objDal.GetCountakingPrepaidOrder(OutletId,FromDate, Todate);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDateWiseDetailsInvoice(string PayDate, int OutletId)
        {
            _objWrapper = new WrapperSales();
            List<List<SalesDAO>> listdata = _objDal.GetDateWiseDetailsInvoice(PayDate, OutletId);
            _objWrapper.SalesLstList = listdata;
            return Json(_objWrapper.SalesLstList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPrepaidOrderDateWiseCountAndCollData(string PayDate, int OutletId,string Operation, string FromDate, string Todate)
        {
            _objWrapper = new WrapperSales();
            _objWrapper = _objDal.GetPrepaidOrderDateWiseCountAndCollData(PayDate, OutletId, Operation, FromDate, Todate);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }


        #region Save
        public JsonResult SaveCountaken(TakeCount obj)
        {
            _objTakeWrapper = new WrapperTakeCount();
            _objTakeWrapper = _objDal.SaveCountaken(obj);
            return Json(_objTakeWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveMoneyCollection(List<SalesDAO> lstDetails)
        {
            _objWrapper = new WrapperSales();
            _objWrapper = _objDal.SaveMoneyCollection(lstDetails);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}