using APIPOS.App_Start;
using Common;
using DAL.Basic;
using DAO.Basic;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace APIPOS.Controllers.Basic
{
    [NoCache]
    public class CustomerController : Controller
    {
        #region Declare Object
        private WrapperCustomer _objWrapper = new WrapperCustomer();
        private readonly CustomerDAL _objDal = new CustomerDAL();
        #endregion
        // GET: Customer
        [AuthorizeActionFilter]
        public ActionResult Customer()
        {
            return View();
        }
        public ActionResult PartialViewExample()
        {
            return PartialView("~/Views/Customer/_CustomerInformation.cshtml");
        }
        #region Get Data 
        public JsonResult GetCustomerdata()
        {
            _objWrapper = new WrapperCustomer();
            _objWrapper = _objDal.GetCustomerdata();
            JsonResult json = Json(_objWrapper, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }
        public JsonResult GetCustomerNo()
        {
            _objWrapper = new WrapperCustomer();
            _objWrapper = _objDal.GetCustomerNo();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save
        public ActionResult Save(string data)
        {
            _objWrapper = new WrapperCustomer();
            Customer obj = JsonConvert.DeserializeObject<Customer>(data);
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
                        string subPath = "/Uploads/Customer/";
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
                            FileLocation = subPath,
                            GateWay = "Customer"
                        });
                        if (obj.PreviousImage != "undefined")
                        {
                            if (System.IO.File.Exists(HostingEnvironment.MapPath("~" + obj.PreviousImage)))
                            {
                                System.IO.File.Delete(HostingEnvironment.MapPath("~" + obj.PreviousImage));
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    _objWrapper.Error = "Error occurred. Error details: " + ex.Message;
                    return Json(_objWrapper, JsonRequestBehavior.AllowGet);
                }
            }
            _objWrapper = _objDal.Save(obj);
            // 
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(Customer obj)
        {
            _objWrapper = new WrapperCustomer();
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}