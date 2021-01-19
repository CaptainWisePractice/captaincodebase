using Common;
using DAL.Report;
using DAO.Basic;
using DAO.Reports;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Reflection;

namespace APIPOS.Reports
{
    public partial class CommonViewer : System.Web.UI.Page
    {
        List<ReportParameter> parameters = new List<ReportParameter>();
        ReportDAL _reportDAL = new ReportDAL();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.IsPostBack)
            {
                lblMsg.Text = "";
                ReportParam obj = (ReportParam)Session["reportObj"];

                if (obj != null)
                {
                    LoadReport(obj);
                }
                else
                {
                    lblMsg.Text = "No Data Found!!!";
                }
            }
        }
        private void LoadReport(ReportParam obj)
        {
            ReportParameter[] param = new ReportParameter[20];
            List<CustomerReports> lstCustomerReport = new List<CustomerReports>();
            List<InventoryReport> lstInventoryReport = new List<InventoryReport>();
            List<AddressType> lstAddress = new List<AddressType>();
            DataTable datatable = new DataTable();
            parameters = new List<ReportParameter>();
            switch (obj.ReportName)
            {

                case "4":
                    lstAddress = _reportDAL.AddressType();
                    datatable = ToDataTable(lstAddress);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[1];
                        param[0] = new ReportParameter("ReportName", obj.ReportName);
                        ShowReport(datatable, obj, param);

                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;


                case "Customer":
                    lstCustomerReport = _reportDAL.CustomerByIDReport();
                    datatable = ToDataTable(lstCustomerReport);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[1];
                        param[0] = new ReportParameter("ReportName", obj.ReportName);
                        ShowReport(datatable, obj, param);

                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;
                case "Item Stock History":
                    // lstInventoryReport = _reportDAL.ItemStockHistory(obj);
                    datatable = _reportDAL.ItemStockHistory(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[3];
                        param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[1] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[2] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : " To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;
                case "Item Stock Available Quantity":
                    //lstInventoryReport = _reportDAL.ItemStockAvailableQty(obj);
                    datatable = ToDataTable(lstInventoryReport);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[3];
                        param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[1] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[2] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : " To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Daily Inventory Report":
                    //lstInventoryReport = _reportDAL.DailyInventoryReport(obj);
                    datatable = ToDataTable(lstInventoryReport);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[3];
                        param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[1] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[2] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : " To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                #region " Awating Despatch Reports"

                case "Booking List":
                    datatable = _reportDAL.BookingReports(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Booking Status":
                    datatable = _reportDAL.BookingStatusReports(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Freight Pickup List":
                    datatable = _reportDAL.ItemPickingListReports(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Local Item List":
                    datatable = _reportDAL.LocalPickingListReports(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;
                case "Delivery Run Sheet":
                    datatable = _reportDAL.DeliveryRunSheetReports(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                #endregion

                #region " Purchase Reports"

                case "Purchase Register":
                    datatable = _reportDAL.PurchaseRegister(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Shipping Status":
                    datatable = _reportDAL.ShippingStatus(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Purchase Receive Status":
                    datatable = _reportDAL.PurchaseReceiveStatus(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Item FOB Price":
                    datatable = _reportDAL.ItemFOBPrice(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                #endregion

                #region "Sale Reports"

                case "Sales Customer Detail":
                    datatable = _reportDAL.SalesCustomerDetails(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Sales Customer Summary":
                    datatable = _reportDAL.SalesCustomerSummary(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Sales Item Detail":
                    datatable = _reportDAL.SalesItemDetail(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Sales Item Summary":
                    datatable = _reportDAL.SalesItemSummary(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Sales Register Detail [All Sales]":
                    datatable = _reportDAL.SalesRegisterDetailAllSales(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Sales Salesperson Detail":
                    datatable = _reportDAL.SalesSalespersonDetail(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Sales Salesperson Summary":
                    datatable = _reportDAL.SalesSalespersonSummary(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Aged Receivables Detail":
                    datatable = _reportDAL.AgedReceivablesDetail(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Aged Receivables Summary":
                    datatable = _reportDAL.AgedReceivablesSummary(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Gross Profit & Loss Statement":
                    datatable = _reportDAL.GrossProfitLossStatement(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Location Wise Sales Report":
                    datatable = _reportDAL.LocationWiseSalesReport(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;
                case "Total Sales & Total COGS Details Ex GST":
                    datatable = _reportDAL.TotalSalesandCOGSDetailsIncGST(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[2];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                #endregion

                #region "Inventory Reports"

                case "Available Inventory":
                    datatable = _reportDAL.WarehouseWiseStockList(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[1];
                        //  param[0] = new ReportParameter("ReportName", obj.ReportName);
                        //param[0] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        //param[1] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        param[0] = new ReportParameter("SiteName", obj.SiteName);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Available Inventory Location":
                    datatable = _reportDAL.AvailableInventoryLocation(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[1];
                        param[0] = new ReportParameter("SiteName", obj.SiteName);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Landing Warehouse Summary":
                    datatable = _reportDAL.LandingWarehouseSummary(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Landing Warehouse Detail":
                    datatable = _reportDAL.LandingWarehouseDetail(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Item Selling Price":
                    datatable = _reportDAL.ItemSellingPrice(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Available Inventory Details":
                    datatable = _reportDAL.AvailableInventoryDetails(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[1];
                        param[0] = new ReportParameter("SiteName", obj.SiteName);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Available Inventory Summary":
                    datatable = _reportDAL.AvailableInventorySummary(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[1];
                        param[0] = new ReportParameter("SiteName", obj.SiteName);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Item Moving Report":
                    datatable = _reportDAL.ItemMovingReport(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[3];
                        param[0] = new ReportParameter("Param", obj.SiteName);
                        param[1] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        param[2] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                case "Price Analysis Report":
                    datatable = _reportDAL.PriceAnalysisReport(obj);
                    if (datatable.Rows.Count > 0)
                    {
                        param = new ReportParameter[1];
                        param[0] = new ReportParameter("Param", obj.SiteName);
                        //param[1] = new ReportParameter("FromDate", string.IsNullOrEmpty(obj.FromDate) ? "" : "From Date - " + obj.FromDate);
                        //param[2] = new ReportParameter("ToDate", string.IsNullOrEmpty(obj.ToDate) ? "" : "To - " + obj.ToDate);
                        ShowReport(datatable, obj, param);
                    }
                    else
                    {
                        lblMsg.Text = "No Data Found!!!";
                    }
                    break;

                    #endregion

            }

        }

        private void ShowReport(DataTable dtTable, ReportParam obj, ReportParameter[] param)
        {
            try
            {
                string ReportDllPath = "~/bin/RDLCReport.dll";
                string AssemblyPath = "RDLCReport." + obj.ReportFileName + ".rdlc";
                var td = dtTable;
                ReportViewer1.ProcessingMode = ProcessingMode.Local;
                LocalReport rt = ReportViewer1.LocalReport;
                Assembly assembly1 = Assembly.LoadFrom(Server.MapPath(ReportDllPath));
                Stream stream1 = assembly1.GetManifestResourceStream(AssemblyPath);
                rt.LoadReportDefinition(stream1);
                rt.DataSources.Clear();
                if (param[0] != null)
                {
                    for (int i = 0; i < param.Length; i++)
                    {
                        rt.SetParameters(new ReportParameter(param[i].Name, param[i].Values[0]));
                    }
                }
                ReportDataSource ds = new ReportDataSource("DataSet1", td);
                rt.DataSources.Add(ds);
                if (obj.PrintType.Equals("PDF") || obj.PrintType.Equals("EXCEL"))
                {
                    Warning[] warnings;
                    string[] streamIds;
                    string mimeType = string.Empty;
                    string encoding = string.Empty;
                    string extension = string.Empty;
                    byte[] bytes = ReportViewer1.LocalReport.Render(obj.PrintType, null, out mimeType, out encoding, out extension, out streamIds, out warnings);
                    // Now that you have all the bytes representing the PDF report, buffer it and send it to the client.    
                    Response.Buffer = true;
                    Response.Clear();
                    Response.AddHeader("content-disposition", "attachment; filename=" + obj.ReportFileName + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + obj.FileExtention);//for Excel=.xls
                    Response.BinaryWrite(bytes); // create the file    
                    Response.Flush();
                    Response.Close();
                    Response.End();
                }
            }
            catch (Exception e)
            {
                throw e;
            }


        }
        private DataTable ToDataTable<T>(List<T> iList)
        {
            DataTable dataTable = new DataTable();
            PropertyDescriptorCollection propertyDescriptorCollection =
                TypeDescriptor.GetProperties(typeof(T));
            for (int i = 0; i < propertyDescriptorCollection.Count; i++)
            {
                PropertyDescriptor propertyDescriptor = propertyDescriptorCollection[i];
                Type type = propertyDescriptor.PropertyType;

                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                    type = Nullable.GetUnderlyingType(type);


                dataTable.Columns.Add(propertyDescriptor.Name, type);
            }
            object[] values = new object[propertyDescriptorCollection.Count];
            foreach (T iListItem in iList)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = propertyDescriptorCollection[i].GetValue(iListItem);

                }
                dataTable.Rows.Add(values);
            }
            return dataTable;
        }

    }
}