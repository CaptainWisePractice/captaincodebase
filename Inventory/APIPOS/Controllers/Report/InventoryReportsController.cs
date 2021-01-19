using APIPOS.App_Start;
using Common;
using DAL.Report;
using DAO.Reports;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Web.Hosting;
using System.Web.Mvc;

namespace APIPOS.Controllers.Report
{
    [NoCache]
    public class InventoryReportsController : Controller
    {
        DataTable _dataTable = new DataTable();
        ReportDAL _objDal = new ReportDAL();
        // GET: InventoryReport
        [AuthorizeActionFilter]
        public ActionResult InventoryReports()
        {
            return View();
        }
        public ActionResult OpenFile(string objParam, string FileType)//string OperationName, string FromDate, string ToDate
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
                        string filename = string.Format(@obj.ReportName + "_{0:dd-MM-yyyy_hh-mm-ss}.xlsx", DateTime.Now);
                        byte[] exceldata = SaveExcelData(_dataTable, obj.ReportId);
                        return File(exceldata, "application/vnd.ms-excel", filename);
                    }
                    else if (FileType.Equals("Pdf"))
                    {
                        ExportToPdf(_dataTable, obj.ReportId,obj.ReportName);
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
        #region Excel And Pdf Method
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
                ws.Cells[ws.Dimension.Address].AutoFitColumns();
                return pck.GetAsByteArray();
            }
        }
        public void ExportToPdf(DataTable dt1, string ReportId,string ReportName)
        {
            DataTable dt = GetNewDataTable(ReportId, dt1);
            string filename = string.Format(@ReportName + "_{0:dd-MM-yyyy_hh-mm-ss}", DateTime.Now);
            string filepath = HostingEnvironment.MapPath("~/DownloadPdf")  + "" + filename + ".pdf";
           // CreatePdf(ReportName, filepath, dt);
            DownloadPdf(filename, filepath);
        }

        //private void CreatePdf(string ReportName, string filepath, DataTable dt)
        //{
        //    Document document = new Document(PageSize.A4.Rotate(), 5f, 5f, 10f, 10f);
        //    FileStream fs = new FileStream(filepath, FileMode.Create);
        //    PdfWriter writer = PdfWriter.GetInstance(document, fs);
        //    document.Open();
        //    System.Drawing.Font font1 = System.Drawing.Font.FromHdc((IntPtr)10);
        //    System.Drawing.Font font2 = System.Drawing.Font.FromHdc((IntPtr)10);
        //    Paragraph paragraph1 = new Paragraph();
        //    Paragraph paragraph2 = new Paragraph();
        //    var boldFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
        //    var phrase = new Phrase();
        //    phrase.Add(new Chunk(ReportName, boldFont));
        //    paragraph1.Add(phrase);
        //    paragraph1.Alignment = Element.ALIGN_CENTER;
        //    document.Add(paragraph1);
        //    paragraph2.Add(" ");
        //    paragraph2.Alignment = Element.ALIGN_CENTER;
        //    document.Add(paragraph2);
        //    PdfPTable table = new PdfPTable(dt.Columns.Count);
        //    table.WidthPercentage = 100;
        //    foreach (DataColumn c in dt.Columns)
        //    {
        //        PdfPCell cell = new PdfPCell();
        //        cell.HorizontalAlignment = Element.ALIGN_CENTER;
        //        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //        cell.Phrase = new Phrase(c.ColumnName, font1);
        //        //cell.BackgroundColor = new BaseColor(85, 107, 47);
        //        //cell.BorderColor = new BaseColor(255, 0, 0);
        //        //cell.BorderColor = new BaseColor(244, 164, 96);
        //        table.AddCell(cell);
        //    }
        //    foreach (DataRow r in dt.Rows)
        //    {
        //        if (dt.Rows.Count > 0)
        //        {
        //            for (int i = 0; i < r.ItemArray.Length; i++)
        //            {
        //                table.AddCell(new Phrase(r[i].ToString(), font2));
        //            }
        //        }
        //    }
        //    document.Add(table);
        //    document.Close();
        //    document.CloseDocument();
        //    document.Dispose();
        //    writer.Close();
        //    writer.Dispose();
        //    fs.Close();
        //    fs.Dispose();
        //}

        private void DownloadPdf(string filename, string filepath)
        {
            FileStream sourceFile = new FileStream(filepath, FileMode.Open);
            float fileSize = 0;
            fileSize = sourceFile.Length;
            byte[] getContent = new byte[Convert.ToInt32(Math.Truncate(fileSize))];
            sourceFile.Read(getContent, 0, Convert.ToInt32(sourceFile.Length));
            sourceFile.Close();
            Response.ClearContent();
            Response.ClearHeaders();
            Response.Buffer = true;
            Response.ContentType = "application/pdf";
            Response.AddHeader("Content-Length", getContent.Length.ToString());
            Response.AddHeader("Content-Disposition", "attachment; filename=" + filename + ".pdf;");
            Response.BinaryWrite(getContent);
            Response.Flush();
            System.IO.File.Delete(filepath);
            Response.End();
        }

        private DataTable GetNewDataTable(string ReportId, DataTable dt1)
        {
            DataTable dt = new DataTable();

            if (ReportId.Equals("10"))
            {
                dt = ItemStockHistory(dt1);
            }
            else if (ReportId.Equals("11"))
            {
                dt = ItemStockAvailableQty(dt1);
            }
            else if (ReportId.Equals("12"))
            {
                dt = DailyInventoryReport(dt1);
            }
            return dt;
        }
        #endregion

        #region Set DataTable For Excel And Pdf


        private DataTable DailyInventoryReport(DataTable _dataTable)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Sl.");
            dt.Columns.Add("Item Number");
            dt.Columns.Add("Description");
            dt.Columns.Add("Total Available");
            dt.Columns.Add("Total Check-Out");
            dt.Columns.Add("Total In-House");
            dt.Columns.Add("Min Stock Level");
            dt.Columns.Add("Max Stock Level");
            dt.Columns.Add("Manufacturer");
            List<InventoryReport> lstObj = _dataTable.DataTableToList<InventoryReport>();
            int count = 1;
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = count++;
                row[1] = item.ItemCode;
                row[2] = item.ItemDescription;
                row[3] = item.Qty;
                row[4] = item.CheckInQty;
                row[5] = item.Qty - item.CheckInQty;
                row[6] = item.MinStockLevel;
                row[7] = item.MaxStockLevel;
                row[8] = item.Manufacturer;
                dt.Rows.Add(row);
            }
            return dt;
        }
        private DataTable ItemStockAvailableQty(DataTable _dataTable)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("SL.");
            dt.Columns.Add("Item Number");
            dt.Columns.Add("Description");
            dt.Columns.Add("Quantity");
            dt.Columns.Add("Site");
            dt.Columns.Add("Location");
            dt.Columns.Add("Manufacturer");
            dt.Columns.Add("Trans Date");
            dt.Columns.Add("Lot");
            List<InventoryReport> lstObj = _dataTable.DataTableToList<InventoryReport>();
            int count = 1;
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = count++;
                row[1] = item.ItemCode;
                row[2] = item.ItemDescription;
                row[3] = item.Qty;
                row[4] = item.SiteName;
                row[5] = item.LocName;
                row[6] = item.SupplierName;
                row[7] = item.TransDate;
                row[8] = item.LotNo;
                dt.Rows.Add(row);
            }
            return dt;
        }
        private DataTable ItemStockHistory(DataTable _dataTable)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("SL.");
            dt.Columns.Add("Item Number");
            dt.Columns.Add("Description");
            dt.Columns.Add("Quantity");
            dt.Columns.Add("Site");
            dt.Columns.Add("Location");
            dt.Columns.Add("Manufacturer");
            dt.Columns.Add("Trans Date");
            dt.Columns.Add("Lot");
            dt.Columns.Add("Trans Type");
            List<InventoryReport> lstObj = _dataTable.DataTableToList<InventoryReport>();
            int count = 1;
            foreach (var item in lstObj)
            {
                DataRow row = dt.NewRow();
                row[0] = count++;
                row[1] = item.ItemCode;
                row[2] = item.ItemDescription;
                row[3] = item.Qty;
                row[4] = item.SiteName;
                row[5] = item.LocName;
                row[6] = item.SupplierName;
                row[7] = item.TransDate;
                row[8] = item.LotNo;
                row[9] = item.TransectionType;
                dt.Rows.Add(row);
            }
            return dt;
        }

        #endregion

        private DataTable GetDataByOperationName(ReportParam obj)
        {
            _dataTable = new DataTable();
            if (obj.ReportId.Equals("10"))
            {
                _dataTable = _objDal.ItemStockHistory(obj);
            }
            else if (obj.ReportId.Equals("11"))
            {
                _dataTable = _objDal.ItemStockAvailableQty(obj);
            }
            else if (obj.ReportId.Equals("12"))
            {
                _dataTable = _objDal.DailyInventoryReport(obj);
            }
            return _dataTable;
        }

        public JsonResult SetReportSessionData(ReportParam obj)
        {
            Session.Remove("reportObj");
            string content = Url.Content("~/Reports/CommonViewer.aspx");
            this.HttpContext.Session["reportObj"] = obj;
            return new JsonResult { Data = content };

        }
    }
}