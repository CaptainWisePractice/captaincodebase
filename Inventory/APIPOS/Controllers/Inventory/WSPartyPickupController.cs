using APIPOS.App_Start;
using Common;
using DAL.Inventory;
using DAO.Inventory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace APIPOS.Controllers.Inventory
{
    [NoCache]
    public class WSPartyPickupController : Controller
    {
        #region Declare Object
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        private readonly ItemDispatchDAL _objDal = new ItemDispatchDAL();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: FreightDespatch
        [AuthorizeActionFilter]
        // GET: WSPartyPickup
        public ActionResult WSPartyPickup()
        {
            return View();
        }

        public JsonResult GetWSPartyPickupData(string FromDate, string Todate, string type)
        {
            _objWrapper = new WrapperDispatch();
            _objWrapper = _objDal.GetWSPartyPickupData(FromDate, Todate, type);
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
           
        }
        [HttpPost]
        public JsonResult SaveWSPartyPickup(string dataList)
        {
            List<ItemDispatch> objList = JsonConvert.DeserializeObject<List<ItemDispatch>>(dataList);
            Attachment _objAtth = new Attachment();
            string user = UserSession.getUserName();
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
                        string subPath = "/Uploads/WSPartyPickup/";
                        string path = Path.Combine(HostingEnvironment.MapPath("~" + subPath));
                        bool exists = System.IO.Directory.Exists(path);
                        if (!exists)
                        {
                            Directory.CreateDirectory(path);
                        }
                        // Get the complete folder path and store the file inside it.  
                        string fileLocation = Path.Combine(path, saveFileName + extension);
                        file.SaveAs(fileLocation);
                        _objAtth.FileNameUser = fname;
                        _objAtth.FileNameSave = saveFileName + extension;
                        _objAtth.FileLocation = subPath;
                    }

                }
                catch (Exception ex)
                {
                    _objWrapper.Error = "Error occurred : " + ex.Message;
                    return Json(_objWrapper, JsonRequestBehavior.AllowGet);
                }
            }
            _objWrapper = _objDal.SaveAllDespatch(objList, _objAtth, user);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
    }
}