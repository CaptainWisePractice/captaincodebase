using APIPOS.App_Start;
using Common;
using DAL.Basic;
using DAO.Basic;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace APIPOS.Controllers.Basic
{
    [NoCache]
    public class ItemHeadController : Controller
    {
        #region Declare Object
        private WrapperIHead _objWrapper = new WrapperIHead();
        public WrapperAutoComplete _wapper = new WrapperAutoComplete();
        private readonly ItemHeadDAL _objDal = new ItemHeadDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: ItemHead
        [AuthorizeActionFilter]
        public ActionResult ItemHead()
        {
            return View();
        }

        #region Get Data 

        public JsonResult loadCategory()
        {
            _objWrapper = new WrapperIHead();
            _objWrapper = _objDal.loadCategory();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getItemHead()
        {
            _objWrapper = new WrapperIHead();
            _objWrapper = _objDal.getItemHead();
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }

        public JsonResult ColorAutoCompleted( string color)
        {
            _wapper = new WrapperAutoComplete();
            _wapper = _objDal.getColorAutoCompleted(color);
            return Json(_wapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SizeAutoCompleted(string size)
        {
            _wapper = new WrapperAutoComplete();
            _wapper = _objDal.getSizeAutoCompleted(size);
            return Json(_wapper, JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region Save Update
        [HttpPost]
        public ActionResult Save(string dataList)
        {
            _objWrapper = new WrapperIHead();
            ItemHead obj = JsonConvert.DeserializeObject<ItemHead>(dataList);
            obj.listAttachment = new System.Collections.Generic.List<Common.Attachment>();
            obj.CreatedBy = UserSession.getUserName();
            if (Request.Files.Count > 0)
            {
                try
                {
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        //string path = AppDomain.CurrentDomain.BaseDirectory + "Uploads/";  
                        //string filename = Path.GetFileName(Request.Files[i].FileName);  

                        HttpPostedFileBase file = files[i];
                        string fname = string.Empty;
                        string saveFileName = Guid.NewGuid().ToString();
                        string extension = string.Empty;
                        // Checking for Internet Explorer  
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = file.FileName;
                            extension = Path.GetExtension(file.FileName);
                        }
                        string subPath = "/Uploads/ItemHead/";
                        string path = Path.Combine(HostingEnvironment.MapPath("~" + subPath));
                        bool exists = System.IO.Directory.Exists(path);
                        if (!exists)
                        {
                            Directory.CreateDirectory(path);
                        }
                        // Get the complete folder path and store the file inside it.  
                        string fileLocation = Path.Combine(path, saveFileName + extension);
                        file.SaveAs(fileLocation);
                        obj.listAttachment.Add(new Common.Attachment()
                        {
                            FileNameUser = fname,
                            FileNameSave = saveFileName + extension,
                            FileLocation = subPath
                        });
                    }

                }
                catch (Exception ex)
                {
                    _objWrapper.Error = "Error occurred. Error details: " + ex.Message;
                    return Json(_objWrapper, JsonRequestBehavior.AllowGet);
                }
            }
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }



        #endregion

        #region Delete
        public JsonResult Delete(ItemHead obj)
        {
            _objWrapper = new WrapperIHead();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check

        public JsonResult DuplicateCheck(ItemHead obj)
        {
            _objWrapper = new WrapperIHead();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}