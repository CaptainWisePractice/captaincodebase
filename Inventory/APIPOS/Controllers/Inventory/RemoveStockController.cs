using APIPOS.App_Start;
using DAL.Inventory;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;

namespace APIPOS.Controllers.Inventory
{
    [NoCache]
    public class RemoveStockController : Controller
    {
        #region Declare Object
        private WrapperRemoveStock _objWrapper = new WrapperRemoveStock();
        private readonly RemoveStockDAL _objDal = new RemoveStockDAL();
        List<RemoveStock> oList = new List<RemoveStock>();
        string empCode = string.Empty;
        string error = string.Empty;
        #endregion
        // GET: RemoveStock
        [AuthorizeActionFilter]
        public ActionResult RemoveStock()
        {
            return View();
        }
        #region Load dropdown Data
        public JsonResult loadItemNumber()
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper = _objDal.loadItemNumber();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        public JsonResult loadLocationByItem(string ItemId)
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper = _objDal.loadLocationByItem(ItemId);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Save Data
        public JsonResult Save(RemoveStock obj)
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper = _objDal.Save(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Get Pending Transaction Data
        public JsonResult GetPendingTransactionData()
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper = _objDal.GetPendingTransactionData();
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Update Data
        public JsonResult UpdateData(List<RemoveStock> obj)
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper = _objDal.UpdateData(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Remove Item
        public JsonResult RemovePendingTransaction(List<RemoveStock> obj)
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper = _objDal.RemovePendingTransaction(obj);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }
        #endregion

        [HttpPost]
        public JsonResult ExcelUpload(List<RemoveStock> objLst)
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper = _objDal.ExcelFileSave(objLst);
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }


        //public ActionResult ExcelUpload(string Excelfile)
        //{

        //      DataSet ds = new DataSet();
        //    _objWrapper = new WrapperRemoveStock();
        //    //  Get all files from Request object  

        //    HttpFileCollectionBase files = Request.Files;
        //    for (int i = 0; i < files.Count; i++)
        //    {

        //        HttpPostedFileBase file = files[i];

        //        string fileExtension = System.IO.Path.GetExtension(file.FileName);
        //        string subPath = "/Uploads/RemoveStock/";
        //        if (fileExtension == ".xls" || fileExtension == ".xlsx")
        //        {
        //            string fileLocation = Server.MapPath("~"+ subPath);
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
        //                excelConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + fileLocation + fileName + fileExtension + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
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
        //        //if (fileExtension.ToString().ToLower().Equals(".xml"))
        //        //{
        //        //    string fileLocation = Server.MapPath("~/Content/") + Request.Files["FileUpload"].FileName;
        //        //    if (System.IO.File.Exists(fileLocation))
        //        //    {
        //        //        System.IO.File.Delete(fileLocation);
        //        //    }

        //        //    Request.Files["FileUpload"].SaveAs(fileLocation);
        //        //    XmlTextReader xmlreader = new XmlTextReader(fileLocation);
        //        //    // DataSet ds = new DataSet();
        //        //    ds.ReadXml(xmlreader);
        //        //    xmlreader.Close();
        //        //}

        //        for (int j = 0; j < ds.Tables[0].Rows.Count; j++)
        //        {
        //            RemoveStock _objRemove = new RemoveStock();
        //            _objRemove.ItemNumber = ds.Tables[0].Rows[j][0].ToString().Trim();
        //            _objRemove.Location = ds.Tables[0].Rows[j][1].ToString().Trim();
        //            _objRemove.Qty = string.IsNullOrEmpty(ds.Tables[0].Rows[j][2].ToString()) ? 0: Convert.ToDecimal(ds.Tables[0].Rows[j][2].ToString());
        //            oList.Add(_objRemove);
        //        }
        //        _objWrapper = _objDal.ExcelFileSave(oList);
        //    }

        //    return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        //}

    }
}