using Common;
using DAO.Basic;
using DAO.Reports;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Report
{
    public class ReportDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSalesReports _objWrapper = new WrapperSalesReports();
        private WrapperSales _objWrapperSale = new WrapperSales();
        private WrapperCustomer _CusWrapper = new WrapperCustomer();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private DataTable _dt = new DataTable();
        ReportParam _obj = new ReportParam();
        public List<CustomerReports> lst = new List<CustomerReports>();
        private List<InventoryReport> lstInventory = new List<InventoryReport>();
        public List<AddressType> lstAddress = new List<AddressType>();
        public List<SalesReports> _mlist = new List<SalesReports>();
        string error = string.Empty;

        public List<CustomerReports> CustomerByIDReport()
        {
            _obj = new ReportParam();
            _obj.OperationName = "CustomerByIDReport";
            _sqlParameterList = getBasicReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_BasicReport");
            lst = _dt.DataTableToList<CustomerReports>();
            return lst;
        }

        public List<AddressType> AddressType()
        {
            _obj = new ReportParam();
            _obj.OperationName = "AddressTypeReport";
            _sqlParameterList = getBasicReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_BasicReport");
            lstAddress = _dt.DataTableToList<AddressType>();
            return lstAddress;
        }
        private List<SqlParameter> getBasicReportParam(ReportParam obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", obj.OperationName));
            return _sqlParameterList;
        }
        private DataTable getData(List<SqlParameter> param, string StoreProcedureName)
        {
            _dt = new DataTable();
            _dt = _accessManager.GetDataByDataTable(StoreProcedureName, param, DbName.Inventory);
            return _dt;
        }
        private List<SqlParameter> getInventoryReportParam(ReportParam obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", obj.OperationName));
            _sqlParameterList.Add(new SqlParameter("@ItemHeadId", string.IsNullOrEmpty(obj.ItemHeadId) ? SqlInt32.Null : Convert.ToInt32(obj.ItemHeadId)));
            _sqlParameterList.Add(new SqlParameter("@ItemId", string.IsNullOrEmpty(obj.ItemId) ? SqlInt32.Null : Convert.ToInt32(obj.ItemId)));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(obj.FromDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.FromDate)));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(obj.ToDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.ToDate)));
            return _sqlParameterList;
        }
        public DataTable ItemStockHistory(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemStockHistory";
            _sqlParameterList = getInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_InventoryReport");
            return _dt;
        }
        public DataTable ItemStockAvailableQty(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemStockAvailableQty";
            _sqlParameterList = getInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_InventoryReport");
            return _dt;
        }
        public DataTable DailyInventoryReport(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "DailyInventoryReport";
            _sqlParameterList = getInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_InventoryReport");

            return _dt;
        }

        #region "Mail & Print Invoice"
        public List<List<SalesReports>> GetSaleinvoiceNo(string invoiceNo)
        {
            var _lstData = new List<List<SalesReports>>();
            _sqlParameterList = new List<SqlParameter>
            {
                new SqlParameter("@operationName", "GetSaleInvoiceWise"),
                new SqlParameter("@invoiceNo", invoiceNo)
            };
            var ds = _accessManager.GetDataByDataSet("usp_SalesReports", _sqlParameterList, DbName.Inventory);
            _mlist = ds.Tables[0].DataTableToList<SalesReports>();
            _lstData.Add(_mlist);
            _mlist = ds.Tables[1].DataTableToList<SalesReports>();
            _lstData.Add(_mlist);
            return _lstData;
        }
        public List<List<SalesReports>> SearchSaleinvoiceNo(SalesReports obj)
        {
            var _lstData = new List<List<SalesReports>>();
            _sqlParameterList = new List<SqlParameter>
            {
                new SqlParameter("@operationName", "SearchSaleinvoice"),
                new SqlParameter("@invoiceNo", obj.InvoiceNo),
                new SqlParameter("@DateFrom", obj.DateFrom),
                new SqlParameter("@DateTo", obj.DateTo),
                new SqlParameter("@Name", obj.Name),
                new SqlParameter("@CustomerId", obj.CustomerId == 0 ? SqlInt32.Null : obj.CustomerId)
        };
            var ds = _accessManager.GetDataByDataSet("usp_SalesReports", _sqlParameterList, DbName.Inventory);
            _mlist = ds.Tables[0].DataTableToList<SalesReports>();
            _lstData.Add(_mlist);
            return _lstData;
        }
        public WrapperAutoComplete LoadInvoiceTypeAutoComplete(SalesReports obj)
        {
            _objWrapperauto = new WrapperAutoComplete();
            _dt = new DataTable();
            try
            {
                _sqlParameterList = new List<SqlParameter>
            {
                new SqlParameter("@operationName", "InvoiceTypeAutoComplete"),
                new SqlParameter("@invoiceNo", obj.InvoiceNo),
                new SqlParameter("@Name", obj.Name)
             };

                _dt = _accessManager.GetDataByDataTable("usp_SalesReports", _sqlParameterList, DbName.Inventory);
                _objWrapperauto = setWrapper_auto(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return _objWrapperauto;
        }
        private WrapperAutoComplete setWrapper_auto(DataTable _dt)
        {
            _objWrapperauto = new WrapperAutoComplete();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapperauto.Error = error;
                return _objWrapperauto;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapperauto.ListAutoCpomplete = _dt.DataTableToList<AutoComplete>();
            }
            else
            {
                _objWrapperauto.Error = "No data Available";
                return _objWrapperauto;
            }
            return _objWrapperauto;
        }

        public WrapperSales SendMailFromDB(string saleInvoice, string term, string email, int outletId)
        {
            string user = UserSession.getUserName();
            _objWrapperSale = new WrapperSales();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@invoice", saleInvoice),
                 new SqlParameter("@term", term),
                 new SqlParameter("@email",email),
                 new SqlParameter("@outletId",outletId)
            };
            if (outletId == 1 || outletId == 2 || outletId == 10) {
                _accessManager.ExecuteNonQueryByStoreProcedure("usp_ThreeStoreInvoiceManualMailSend", _sqlParameterList, DbName.Inventory, user, out error);
            }
            else
            {
                if (term == "Prepaid")
                { _accessManager.ExecuteNonQueryByStoreProcedure("usp_PrePaidInvoiceManualMailSend", _sqlParameterList, DbName.Inventory, user, out error); }
                else
                { _accessManager.ExecuteNonQueryByStoreProcedure("usp_PostPaidInvoiceManualMailSend", _sqlParameterList, DbName.Inventory, user, out error); }
            }
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapperSale.Error = error;
                return _objWrapperSale;
            }
            return _objWrapperSale;
        }
        public WrapperSales MailStatusUpdate(string saleInvoice)
        {
            string user = UserSession.getUserName();
            _objWrapperSale = new WrapperSales();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@saleInvoice", saleInvoice),
                 new SqlParameter("@CreateBy",user)
            };
            _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleInvoiceMailStatusUpdate", _sqlParameterList, DbName.Inventory, user, out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapperSale.Error = error;
                return _objWrapperSale;
            }
            return _objWrapperSale;
        }

        #endregion

        #region "Sale Invoice Delete" 
        public WrapperSalesReports Delete(string invoiceNo)
        {
            _objWrapper = new WrapperSalesReports();
            _dt = new DataTable();
            try
            {
                _sqlParameterList = new List<SqlParameter>()
                {
                    new SqlParameter("@invoiceNo", invoiceNo)
                };
                _accessManager.ExecuteNonQueryByStoreProcedure("usp_DeleteSalesDataByinvoiceNo", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);

                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        #endregion

        #region "For Basic Reports"
        private List<SqlParameter> getBasicReport(ReportParam obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", obj.OperationName));
            return _sqlParameterList;
        }
        private DataTable returnData(List<SqlParameter> param, string StoreProcedureName)
        {
            _dt = new DataTable();
            _dt = _accessManager.GetDataByDataTable(StoreProcedureName, param, DbName.Inventory);
            return _dt;
        }
        public DataTable ItemCatagory(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemcategoryReports";
            _sqlParameterList = getBasicReport(_obj);
            _dt = returnData(_sqlParameterList, "usp_AllBasicReport");
            return _dt;
        }

        public DataTable Location(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "LocationReports";
            _sqlParameterList = getBasicReport(_obj);
            _dt = returnData(_sqlParameterList, "usp_AllBasicReport");
            return _dt;
        }

        public DataTable ItemHead(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemHeadReports";
            _sqlParameterList = getBasicReport(_obj);
            _dt = returnData(_sqlParameterList, "usp_AllBasicReport");
            return _dt;
        }

        public DataTable Item(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemReports";
            _sqlParameterList = getBasicReport(_obj);
            _dt = returnData(_sqlParameterList, "usp_AllBasicReport");
            return _dt;
        }

        public DataTable CustomerIfno(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "CustomerIfnoReports";
            _sqlParameterList = getBasicReport(_obj);
            _dt = returnData(_sqlParameterList, "usp_AllBasicReport");
            return _dt;
        }

        public DataTable ManufacturerInfo(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ManufacturerInfoReports";
            _sqlParameterList = getBasicReport(_obj);
            _dt = returnData(_sqlParameterList, "usp_AllBasicReport");
            return _dt;
        }


        #endregion

        #region "Awating Booking Reports"

        public DataTable BookingReports(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "BookingList";
            _sqlParameterList = getBookingReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_BookingListReport");

            return _dt;
        }

        public DataTable BookingStatusReports(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "BookingStatus";
            _sqlParameterList = getBookingReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_BookingListReport");

            return _dt;
        }

        public DataTable DeliveryRunSheetReports(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "DeliveryRunSheet";
            _sqlParameterList = getBookingReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_BookingListReport");

            return _dt;
        }

        public DataTable ItemPickingListReports(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemPickingList";
            _sqlParameterList = getBookingReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_BookingListReport");

            return _dt;
        }

        public DataTable LocalPickingListReports(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "LocalPickingList";
            _sqlParameterList = getBookingReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_BookingListReport");

            return _dt;
        }

        private List<SqlParameter> getBookingReportParam(ReportParam obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", obj.OperationName));
            _sqlParameterList.Add(new SqlParameter("@DeliveryMethodId", string.IsNullOrEmpty(obj.DeliveryMethodId) ? SqlInt32.Null : Convert.ToInt32(obj.DeliveryMethodId)));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(obj.FromDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.FromDate)));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(obj.ToDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.ToDate)));
            return _sqlParameterList;
        }
        #endregion

        #region "Purchase Reports"

        public DataTable PurchaseRegister(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "PurchaseRegister";
            _sqlParameterList = getPurchaseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllPurchaseReports");

            return _dt;
        }

        public DataTable ShippingStatus(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ShippingStatus";
            _sqlParameterList = getPurchaseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllPurchaseReports");

            return _dt;
        }

        public DataTable PurchaseReceiveStatus(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "PurchaseReceiveStatus";
            _sqlParameterList = getPurchaseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllPurchaseReports");

            return _dt;
        }

        public DataTable ItemFOBPrice(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemFOBPrice";
            _sqlParameterList = getPurchaseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllPurchaseReports");

            return _dt;
        }

        private List<SqlParameter> getPurchaseReportParam(ReportParam obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", obj.OperationName));
            _sqlParameterList.Add(new SqlParameter("@ManufacturerId", string.IsNullOrEmpty(obj.ManufacturerId) ? SqlInt32.Null : Convert.ToInt32(obj.ManufacturerId)));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(obj.FromDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.FromDate)));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(obj.ToDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.ToDate)));
            return _sqlParameterList;
        }
        #endregion

        #region "Sales Reports"

        public DataTable SalesCustomerDetails(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "SalesCustomerDetails";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable SalesCustomerSummary(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "SalesCustomerSummary";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable SalesItemDetail(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "SalesItemDetail";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable SalesItemSummary(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "SalesItemSummary";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable SalesRegisterDetailAllSales(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "SalesRegisterDetailAllSales";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable SalesSalespersonDetail(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "SalesSalespersonDetail";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }
        public DataTable SalesSalespersonSummary(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "SalesSalespersonSummary";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }
        public DataTable AgedReceivablesDetail(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "AgedReceivablesDetail";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable AgedReceivablesSummary(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "AgedReceivablesSummary";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable GrossProfitLossStatement(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "GrossProfitLossStatement";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        public DataTable LocationWiseSalesReport(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "LocationWiseSalesReport";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }
        public DataTable TotalSalesandCOGSDetailsIncGST(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "TotalSalesandCOGSDetailsIncGST";
            _sqlParameterList = geSaleseReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllSaleRelatedReports");

            return _dt;
        }

        private List<SqlParameter> geSaleseReportParam(ReportParam obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", obj.OperationName));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", string.IsNullOrEmpty(obj.CustomerId) ? SqlInt32.Null : Convert.ToInt32(obj.CustomerId)));
            _sqlParameterList.Add(new SqlParameter("@ItemHeadId", string.IsNullOrEmpty(obj.ItemHeadId) ? SqlInt32.Null : Convert.ToInt32(obj.ItemHeadId)));
            _sqlParameterList.Add(new SqlParameter("@SalePersonId", string.IsNullOrEmpty(obj.SalePersonId) ? SqlInt32.Null : Convert.ToInt32(obj.SalePersonId)));
            _sqlParameterList.Add(new SqlParameter("@SiteName", string.IsNullOrEmpty(obj.SiteName) ? SqlInt32.Null : Convert.ToInt32(obj.SiteName)));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(obj.FromDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.FromDate)));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(obj.ToDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.ToDate)));
            return _sqlParameterList;
        }

        #endregion

        #region "Inventory Reports"

        public DataTable WarehouseWiseStockList(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "WarehouseWiseStockList";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }
        public DataTable AvailableInventoryLocation(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "AvailableInventoryLocation";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }
        public DataTable LandingWarehouseDetail(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "LandingWarehouseDetail";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }

        public DataTable LandingWarehouseSummary(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "LandingWarehouseSummary";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }
        public DataTable ItemSellingPrice(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemSellingPrice";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }

        public DataTable AvailableInventoryDetails(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "AvailableInventoryDetails";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }

        public DataTable AvailableInventorySummary(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "AvailableInventorySummary";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }

        public DataTable ItemMovingReport(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "ItemMovingReport";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }

        public DataTable PriceAnalysisReport(ReportParam obj)
        {
            _obj = new ReportParam();
            _obj = obj;
            _obj.OperationName = "PriceAnalysisReport";
            _sqlParameterList = geInventoryReportParam(_obj);
            _dt = getData(_sqlParameterList, "usp_AllInventoryReports");

            return _dt;
        }
        private List<SqlParameter> geInventoryReportParam(ReportParam obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", obj.OperationName));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", string.IsNullOrEmpty(obj.CustomerId) ? SqlInt32.Null : Convert.ToInt32(obj.CustomerId)));
            _sqlParameterList.Add(new SqlParameter("@ManufacturerId", string.IsNullOrEmpty(obj.ManufacturerId) ? SqlInt32.Null : Convert.ToInt32(obj.ManufacturerId)));
            _sqlParameterList.Add(new SqlParameter("@ItemHeadId", string.IsNullOrEmpty(obj.ItemHeadId) ? SqlInt32.Null : Convert.ToInt32(obj.ItemHeadId)));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(obj.FromDate) ? null : obj.FromDate));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(obj.ToDate) ? null : obj.ToDate));
            return _sqlParameterList;
        }

       
        #endregion
    }
}
