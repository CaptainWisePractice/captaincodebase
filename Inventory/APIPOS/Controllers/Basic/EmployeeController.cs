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
    public class EmployeeController : Controller
    {
        #region Declare Object
        private WrapperEmployee _objWrapper = new WrapperEmployee();
        private readonly EmployeeDAL _objDal = new EmployeeDAL();
        #endregion
        // GET: Employee
        [AuthorizeActionFilter]
        public ActionResult Employee()
        {
            return View();
        }
        #region Get Data 
        public JsonResult GetEmployeedata()
        {
            _objWrapper = new WrapperEmployee();
            _objWrapper = _objDal.GetEmployeedata();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetEmployeeNo()
        {
            _objWrapper = new WrapperEmployee();
            _objWrapper = _objDal.GetEmployeeNo();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Save
        public ActionResult Save(string data)
        {
            _objWrapper = new WrapperEmployee();
            Employee obj = JsonConvert.DeserializeObject<Employee>(data);
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
                        string subPath = "/Uploads/Employee/";
                        string path = Path.Combine(HostingEnvironment.MapPath("~" + subPath));
                        bool exists = System.IO.Directory.Exists(path);
                        if (!exists)
                        {
                            Directory.CreateDirectory(path);
                        }
                        // Get the complete folder path and store the file inside it.  
                        string fileLocation = Path.Combine(path, saveFileName + extension);
                        file.SaveAs(fileLocation);
                        obj.listAttachment.Add(new Attachment()
                        {
                            FileNameUser = fname,
                            FileNameSave = saveFileName + extension,
                            FileLocation = subPath,
                            GateWay = "Employee"
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
            // 
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Delete
        public JsonResult Delete(Employee obj)
        {
            _objWrapper = new WrapperEmployee();
            obj.CreatedBy = UserSession.getUserName();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}