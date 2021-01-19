using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAL.Basic;
using DAO.Basic;
using Common;
using APIPOS.App_Start;

namespace APIPOS.Controllers.Basic
{
    [NoCache]
    public class ItemCategoryController : Controller
    {
        // GET: ItemCategory
        ItemCategoryDAL _objItemCategoryDal = new ItemCategoryDAL();
        CategoryWapper wrapper = new CategoryWapper();
        public string error;
        [AuthorizeActionFilter]
        public ActionResult ItemCategory()
        {
            return View();
        }

        public ActionResult SaveData(ItemCategory obj)
        {
           
            string user = UserSession.getUserName();

            bool status = _objItemCategoryDal.SaveData(obj, user, out error);
            if (!String.IsNullOrEmpty(error))
            {
                wrapper.Error = error;
            }
            else
            {
                if (status)
                {
                    wrapper.ICategories = LoadGridData();
                    wrapper.Status = status;
                }
                else
                {
                    wrapper.Error = "No Data Inserted, Check Data Validity";
                    wrapper.ICategories = LoadGridData();
                }
            }
            return Json(wrapper);
            //if (user == null)
            //{
            //    wrapper.IsSessionOut = "-1";
            //}
            //if (!string.IsNullOrEmpty(error))
            //{
            //    wrapper.Error = error;
            //}
            //else
            //{
            //    wrapper.Status = status;
            //  //  wrapper.lArea = reviseAreaList();
            //}
            //return new JsonResult { Data = wrapper };
        }


        public ActionResult LoadCategory()
        {

            List<ItemCategory> _LstItemCategory = new List<ItemCategory>();
            _LstItemCategory = LoadGridData();
            return Json(_LstItemCategory);


        }


        private List<ItemCategory> LoadGridData()
        {
            List<ItemCategory> oLstItemCategory = new List<ItemCategory>();

            foreach (System.Data.DataRow item in _objItemCategoryDal.GetAllGridData("Admin", out error).Rows)
            {
                ItemCategory _objItemCategory = new ItemCategory();
                _objItemCategory.CategotyId = item["CategoryId"].ToString();
                _objItemCategory.ItmCategory = item["Name"].ToString();
                _objItemCategory.ItemCode = item["Code"].ToString();
                _objItemCategory.IsActive = item["IsActive"].ToString();
                oLstItemCategory.Add(_objItemCategory);
            }
            return oLstItemCategory;
        }

        #region Delete
        public JsonResult Delete(int id)
        {
            //{
            //    wrapper.isSessionOut = "-1";
            //    return Json(wrapper);
            //}
            bool result = _objItemCategoryDal.Delete(id,"Admin", out error);

            if (!String.IsNullOrEmpty(error))
            {
                wrapper.Error = error;
            }
            else
            {
                if (result)
                {
                    wrapper.ICategories = LoadGridData();
                }
                else
                {
                    wrapper.Error = "No Data Inserted, Check Data Validity";
                    wrapper.ICategories = LoadGridData();
                }
            }
            return Json(wrapper);
           

        }

        #endregion

        #region Duplicated Check
        public JsonResult DuplicateCheck(ItemCategory obj)
        {
            wrapper = new CategoryWapper();
            wrapper = _objItemCategoryDal.DuplicateCheck(obj);
            return Json(wrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion


    }
}