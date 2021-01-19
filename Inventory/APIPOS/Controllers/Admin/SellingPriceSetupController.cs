using APIPOS.App_Start;
using DAL.Admin;
using DAO.Admin;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class SellingPriceSetupController : Controller
    {
        #region Declare Object
        private WrapperSellingPrice _objWrapper = new WrapperSellingPrice();
        private readonly SellingPriceSetupDAL _objDal = new SellingPriceSetupDAL();
        List<SellingPriceSetup> oList = new List<SellingPriceSetup>();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: SellingPriceSetup
        [AuthorizeActionFilter]
        public ActionResult SellingPriceSetup()
        {
            return View();
        }

        public ActionResult SellingPriceSetupFromAdmin()
        {
            ViewBag.from = "Retail";
            return View();
        }
        public ActionResult SellingWholesalePriceSetup()
        {
            ViewBag.from = "WholeSale";
            return View();
        }

        #region Get Data 

        public JsonResult loadItemHead()
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.loadItemHead();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllData()
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.GetAllData();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Save
        public JsonResult Save(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Delete
        public JsonResult Delete(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.Delete(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Duplicated Check

        public JsonResult DuplicateCheck(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.DuplicateCheck(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region "Upload Excel"

        [HttpPost]

        public JsonResult ExcelUpload(List<SellingPriceSetup> objLst)
        {
            _objWrapper = new WrapperSellingPrice();
            _objWrapper = _objDal.ExcelFileSave(objLst);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        //public ActionResult ExcelUpload(string Excelfile)
        //{

        //    DataSet ds = new DataSet();
        //    _objWrapper = new WrapperSellingPrice();
        //    //  Get all files from Request object  

        //    HttpFileCollectionBase files = Request.Files;
        //    for (int i = 0; i < files.Count; i++)
        //    {

        //        HttpPostedFileBase file = files[i];

        //        string fileExtension = System.IO.Path.GetExtension(file.FileName);
        //        string subPath = "/Uploads/SellingPrice/";
        //        if (fileExtension == ".xls" || fileExtension == ".xlsx")
        //        {
        //            string fileLocation = Server.MapPath("~" + subPath);
        //            string fileName = string.Format("{0:dd-MM-yyyy_hh-mm-ss}", DateTime.Now);
        //            bool exists = System.IO.Directory.Exists(fileLocation);
        //            if (!exists)
        //            {
        //                Directory.CreateDirectory(fileLocation);
        //            }
        //            //if (System.IO.File.Exists(fileLocation))
        //            //{
        //            //    System.IO.File.Delete(fileLocation);
        //            //}
        //            file.SaveAs(fileLocation + fileName + fileExtension);
        //            string excelConnectionString = string.Empty;

        //            //connection String for xls file format.
        //            if (fileExtension == ".xls")
        //            {
        //                excelConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + fileLocation + fileName + fileExtension + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=1\"";
        //            }
        //            //connection String for xlsx file format.
        //            else if (fileExtension == ".xlsx")
        //            {

        //                excelConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileLocation + fileName + fileExtension + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
        //            }
        //            //Create Connection to Excel work book and add oledb namespace
        //            OleDbConnection excelConnection = new OleDbConnection(excelConnectionString);
        //            excelConnection.Open();
        //            DataTable dt = new DataTable();

        //            dt = excelConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
        //            if (dt == null)
        //            {
        //                return null;
        //            }

        //            String[] excelSheets = new String[dt.Rows.Count];
        //            int t = 0;
        //            //excel data saves in temp file here.
        //            foreach (DataRow row in dt.Rows)
        //            {
        //                excelSheets[t] = row["TABLE_NAME"].ToString();
        //                t++;
        //            }
        //            OleDbConnection excelConnection1 = new OleDbConnection(excelConnectionString);


        //            string query = string.Format("Select * from [{0}]", excelSheets[0]);
        //            using (OleDbDataAdapter dataAdapter = new OleDbDataAdapter(query, excelConnection1))
        //            {
        //                dataAdapter.Fill(ds);
        //            }
        //        }

        //        for (int j = 0; j < ds.Tables[0].Rows.Count; j++)
        //        {
        //            SellingPriceSetup _objupdate = new SellingPriceSetup();
        //            _objupdate.SellingPriceId = ds.Tables[0].Rows[j][8].ToString().Trim();
        //            _objupdate.Wholesale = string.IsNullOrEmpty(ds.Tables[0].Rows[j][5].ToString()) ? "0" : ds.Tables[0].Rows[j][5].ToString();
        //            _objupdate.Wholesale1 = string.IsNullOrEmpty(ds.Tables[0].Rows[j][2].ToString()) ? "0" : ds.Tables[0].Rows[j][2].ToString();
        //            _objupdate.Wholesale2 = string.IsNullOrEmpty(ds.Tables[0].Rows[j][3].ToString()) ? "0" : ds.Tables[0].Rows[j][3].ToString();
        //            _objupdate.Wholesale3 = string.IsNullOrEmpty(ds.Tables[0].Rows[j][4].ToString()) ? "0" : ds.Tables[0].Rows[j][4].ToString();
        //            _objupdate.Special = string.IsNullOrEmpty(ds.Tables[0].Rows[j][7].ToString()) ? "0" : ds.Tables[0].Rows[j][7].ToString();
        //            _objupdate.Retail = string.IsNullOrEmpty(ds.Tables[0].Rows[j][6].ToString()) ? "0" : ds.Tables[0].Rows[j][6].ToString();
        //            oList.Add(_objupdate);
        //        }
        //        _objWrapper = _objDal.ExcelFileSave(oList);
        //    }

        //    return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        //}

        #endregion

    }
}