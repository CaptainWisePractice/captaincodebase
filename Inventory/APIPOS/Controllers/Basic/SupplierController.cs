using APIPOS.App_Start;
using DAL.Basic;
using DAO.Basic;
using System.Web.Mvc;

namespace APIPOS.Controllers.Basic
{
    [NoCache]
    public class SupplierController : Controller
    {
        #region Declare Object
        private WrapperSupplier _objWrapper = new WrapperSupplier();
        private readonly SupplierDAL _objDal = new SupplierDAL();
        #endregion
        // GET: Supplier
        [AuthorizeActionFilter]
        public ActionResult Supplier()
        {
            return View();
        }
        #region Get Data 
        public JsonResult GetSupplierdata()
        {
            _objWrapper = new WrapperSupplier();
            _objWrapper = _objDal.GetSupplierdata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public JsonResult Save(Supplier obj)
        {
            _objWrapper = new WrapperSupplier();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(Supplier obj)
        {
            _objWrapper = new WrapperSupplier();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}