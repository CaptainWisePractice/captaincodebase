using APIPOS.App_Start;
using Common;
using DAL.Report;
using DAO.Basic;
using DAO.Reports;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Report
{
    [NoCache]
    public class BasicReportsController : Controller
    {
        DataTable _dataTable = new DataTable();
        ReportDAL _objDal = new ReportDAL();
        // GET: BasicReports
        [AuthorizeActionFilter]
        public ActionResult BasicReports()
        {
            return View();
        }

        public JsonResult SetReportSessionData(ReportParam obj)
        {
            Session.Remove("reportObj");
            string content = Url.Content("~/Reports/CommonViewer.aspx");
            this.HttpContext.Session["reportObj"] = obj;
            return new JsonResult { Data = content };

        }

        public ActionResult OpenFile(string objParam, string FileType)
        {
            string error = string.Empty;
            _dataTable = new DataTable();
            ReportParam obj = JsonConvert.DeserializeObject<ReportParam>(objParam);
            _dataTable = GetDataByOperationName(obj);
            if (_dataTable.Rows.Count > 0)
            {
                try
                {
                    if (FileType.Equals("Excel"))
                    {
                        string filename = string.Format(@obj.ReportName + ".xlsx", DateTime.Now);
                        byte[] exceldata = SaveExcelData(_dataTable, obj.ReportId);
                        return File(exceldata, "application/vnd.ms-excel", filename);
                    }

                }
                catch (Exception ex)
                {
                    error = ex.Message;
                }
            }
            else
            {
                error = "Data Not Available";
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        private DataTable GetDataByOperationName(ReportParam obj)
        {
            _dataTable = new DataTable();
            if (obj.ReportId.Equals("1"))
            {
                _dataTable = _objDal.ItemCatagory(obj);
            }
            else if (obj.ReportId.Equals("2"))
            {
                // _dataTable = _objDal.ItemStockAvailableQty(obj);
            }
            else if (obj.ReportId.Equals("3"))
            {
                _dataTable = _objDal.Location(obj);
            }
            else if (obj.ReportId.Equals("5"))
            {
                _dataTable = _objDal.CustomerIfno(obj);
            }
            else if (obj.ReportId.Equals("7"))
            {
                _dataTable = _objDal.ItemHead(obj);
            }
            else if (obj.ReportId.Equals("8"))
            {
                _dataTable = _objDal.Item(obj);
            }
            else if (obj.ReportId.Equals("9"))
            {
                _dataTable = _objDal.ManufacturerInfo(obj);
            }

            return _dataTable;
        }

        private dynamic SaveExcelData(DataTable _dataTable, string ReportId)
        {
            DataTable dt = GetNewDataTable(ReportId, _dataTable);
            using (ExcelPackage pck = new ExcelPackage())
            {
                ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Sheet1");
                ws.Cells["A1"].LoadFromDataTable(dt, true);
                ws.TabColor = System.Drawing.Color.Black;
                ws.DefaultRowHeight = 15;
                ws.Row(1).Height = 20;
                ws.Row(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                ws.Row(1).Style.Font.Bold = true;
                ws.Column(1).Width = 5;
                ws.Cells[ws.Dimension.Address].AutoFitColumns();
                return pck.GetAsByteArray();
            }
        }

        private DataTable GetNewDataTable(string ReportId, DataTable dt1)
        {
            DataTable dt = new DataTable();

            if (ReportId.Equals("1"))
            {
                dt = ItemCategory(dt1);
            }
            if (ReportId.Equals("3"))
            {
                dt = Location(dt1);
            }
            if (ReportId.Equals("5"))
            {
                dt = CustomerInfo(dt1);
            }
            if (ReportId.Equals("7"))
            {
                dt = ItemHead(dt1);
            }
            if (ReportId.Equals("8"))
            {
                dt = Item(dt1);
            }
            if (ReportId.Equals("9"))
            {
                dt = ManufacturerInfo(dt1);
            }

            return dt;
        }

        private DataTable ItemCategory(DataTable _dataTable)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("SL");
            dt.Columns.Add("Item Category");
            dt.Columns.Add("Item Code");
            List<ItemCategory> lstObj = _dataTable.DataTableToList<ItemCategory>();

            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = item.CategotyId;
                row[1] = item.ItmCategory;
                row[2] = item.ItemCode;
                dt.Rows.Add(row);
            }
            return dt;
        }

        private DataTable Location(DataTable _dataTable)
        {
            int count = 1;
            DataTable dt = new DataTable();
            dt.Columns.Add("SL");
            dt.Columns.Add("Warehouse Name");
            dt.Columns.Add("Location");
            List<Location> lstObj = _dataTable.DataTableToList<Location>();
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = count++;
                row[1] = item.WarehouseName;
                row[2] = item.LocName;
                dt.Rows.Add(row);
            }
            return dt;
        }
        private DataTable ItemHead(DataTable _dataTable)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("SL");
            dt.Columns.Add("Category");
            dt.Columns.Add("Item Code");
            dt.Columns.Add("Description");
            dt.Columns.Add("CBM");
            dt.Columns.Add("Manufacturer");
            List<ItemHead> lstObj = _dataTable.DataTableToList<ItemHead>();
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = item.IHeadId;
                row[1] = item.Category;
                row[2] = item.IHeadCode;
                row[3] = item.IHeadName;
                row[4] = item.CBM;
                row[5] = item.Manufacturer;
                dt.Rows.Add(row);
            }
            return dt;
        }

        private DataTable Item(DataTable _dataTable)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("SL");
            dt.Columns.Add("Item Code");
            dt.Columns.Add("Item Number");
            dt.Columns.Add("Description");
            dt.Columns.Add("UOM");
            dt.Columns.Add("Length");
            dt.Columns.Add("Width");
            dt.Columns.Add("Height");
            dt.Columns.Add("Weight");
            dt.Columns.Add("CBM");
            dt.Columns.Add("Min Stock Level");
            dt.Columns.Add("max Stock Level");
            List<ItemEntry> lstObj = _dataTable.DataTableToList<ItemEntry>();
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = item.ItemId;
                row[1] = item.IHeadCode;
                row[2] = item.ItemCode;
                row[3] = item.ItemName;
                row[4] = item.UOM;
                row[5] = item.Length;
                row[6] = item.Width;
                row[7] = item.Height;
                row[8] = item.Weight;
                row[9] = item.CBM;
                row[10] = item.MinStockLevel;
                row[11] = item.MaxStockLevel;
                dt.Rows.Add(row);
            }
            return dt;
        }

        private DataTable CustomerInfo(DataTable _dataTable)
        {
            int count = 1;
            DataTable dt = new DataTable();
            dt.Columns.Add("SL");
            dt.Columns.Add("Name");
            dt.Columns.Add("Mobile No");
            dt.Columns.Add("Email");
            dt.Columns.Add("Website");
            dt.Columns.Add("Address");
            dt.Columns.Add("Suburb");
            dt.Columns.Add("Postal Code");
            dt.Columns.Add("State");
            List<CustomerReports> lstObj = _dataTable.DataTableToList<CustomerReports>();
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = count++;
                row[1] = item.FullName;
                row[2] = item.Phone1;
                row[3] = item.Email;
                row[4] = item.Website;
                row[5] = item.Address;
                row[6] = item.City;
                row[7] = item.PostalCode;
                row[8] = item.State;
                dt.Rows.Add(row);
            }
            return dt;
        }

        private DataTable ManufacturerInfo(DataTable _dataTable)
        {
            int count = 1;
            DataTable dt = new DataTable();
            dt.Columns.Add("SL");
            dt.Columns.Add("Manufacturer");
            dt.Columns.Add("Contact No");
            dt.Columns.Add("Email");
            dt.Columns.Add("Notes");
            dt.Columns.Add("Trading Term");
            List<ManufacturerInfo> lstObj = _dataTable.DataTableToList<ManufacturerInfo>();
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = count++;
                row[1] = item.Name;
                row[2] = item.ContractNo;
                row[3] = item.Email;
                row[4] = item.Notes;
                row[5] = item.Description;
                dt.Rows.Add(row);
            }
            return dt;
        }

    }
}