using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Common;
using DAO;
using DAO.Basic;
using DAO.Sale;

namespace DAL.Sale
{
    public class SalesDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private DataTable _dt = new DataTable();
        private SalesDAO _obj = new SalesDAO();
        string error = string.Empty;
        List<ComboData> lstComboData = new List<ComboData>();
        public WrapperCustomerGetData GetCustomerAutoComplete(SalesDAO obj)
        {
            WrapperCustomerGetData objCustomerGetData = new WrapperCustomerGetData();
            objCustomerGetData = new WrapperCustomerGetData();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetCustomerAutoComplete", obj);
                objCustomerGetData = setWrapper_auto_Cust(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return objCustomerGetData;
        }

        public WrapperCustomerGetData LoadInvoiceCustomerAutoComplete(SalesDAO obj)
        {
            WrapperCustomerGetData objCustomerGetData = new WrapperCustomerGetData();
            objCustomerGetData = new WrapperCustomerGetData();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("InvoiceCustomerAutoComplete", obj);
                objCustomerGetData = setWrapper_auto_Cust(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return objCustomerGetData;
        }
        private WrapperCustomerGetData setWrapper_auto_Cust(DataTable _dt)
        {
            WrapperCustomerGetData _objWrapper = new WrapperCustomerGetData();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.CustomerLoadAutoComplete = _dt.DataTableToList<CustomerGetData>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
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
        private WrapperAutoCompleteMultipleValue setWrapper_auto_WrapperAutoCompleteMultipleValue(DataTable _dt)
        {
            WrapperAutoCompleteMultipleValue _objWrapperauto = new WrapperAutoCompleteMultipleValue();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapperauto.Error = error;
                return _objWrapperauto;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapperauto.ListAutoCpomplete = _dt.DataTableToList<AutoCompleteMultipleValue>();
            }
            else
            {
                _objWrapperauto.Error = "No data Available";
                return _objWrapperauto;
            }
            return _objWrapperauto;
        }
        public WrapperAddress GetCustomerAddress(SalesDAO obj)
        {
            WrapperAddress _objAddress = new WrapperAddress();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetCustomerListOfAddress", obj);
                if (!string.IsNullOrEmpty(error))
                {
                    _objAddress.Error = error;
                    return _objAddress;
                }
                if (_dt.Rows.Count > 0)
                {
                    _objAddress.CustomerAddresses = _dt.DataTableToList<CustomerAddress>();
                }
                else
                {
                    _objAddress.Error = "No data Available";
                    return _objAddress;
                }
                // _objAddress.CustomerAddresses = _dt.DataTableToList<CustomerAddress>();
            }
            catch (Exception ex)
            {

                _objAddress.Error = ex.Message;
            }
            return _objAddress;
        }
        private WrapperSales setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperSales();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.SalesList = _dt.DataTableToList<SalesDAO>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public List<Invoice> GetInvoice()
        {
            List<Invoice> _objInvoice = new List<Invoice>();
            SalesDAO obj = new SalesDAO();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetInvoiceNo", obj);

                if (_dt.Rows.Count > 0)
                {
                    _objInvoice = _dt.DataTableToList<Invoice>();
                }

                // _objAddress.CustomerAddresses = _dt.DataTableToList<CustomerAddress>();
            }
            catch (Exception ex)
            {

                return _objInvoice;
            }
            return _objInvoice;
        }

        public SaleEditPerandState LoadUserandManagerPercentange()
        {
            SaleEditPerandState objLst = new SaleEditPerandState();
            DataSet _ds = new DataSet();
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@UserName", UserSession.getUserName()));
                _ds = _accessManager.GetDataByDataSet("usp_LoadUserandManagerPercentange", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
                if (_ds.Tables[0].Rows.Count > 0)
                {
                    objLst.SaleEditPermissionLst = _ds.Tables[0].DataTableToList<SaleEditPermission>();
                }
                if (_ds.Tables[1].Rows.Count > 0)
                {
                    objLst.ComboDataLst = _ds.Tables[1].DataTableToList<ComboData>();
                }
            }
            catch (Exception ex)
            {

            }
            return objLst;
        }

        public List<CustomerDue> GetCustomerDue(SalesDAO obj)
        {
            List<CustomerDue> _objCustomerDue = new List<CustomerDue>();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetCustomerDue", obj);

                if (_dt.Rows.Count > 0)
                {
                    _objCustomerDue = _dt.DataTableToList<CustomerDue>();
                }

                // _objAddress.CustomerAddresses = _dt.DataTableToList<CustomerAddress>();
            }
            catch (Exception ex)
            {

                return _objCustomerDue;
            }
            return _objCustomerDue;
        }
        public wrapperCustomer InsertNewCustomerAndGetit(SalesDAO obj)
        {
            wrapperCustomer _objcustomer = new wrapperCustomer();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetInsertedCustomer", obj);
                if (!string.IsNullOrEmpty(error))
                {
                    _objcustomer.Error = error;
                    return _objcustomer;
                }
                if (_dt.Rows.Count > 0)
                {
                    _objcustomer.objCustomer = _dt.DataTableToList<NewCustomer>();
                }
                else
                {
                    _objcustomer.Error = "No data Available";
                    return _objcustomer;
                    // _objAddress.CustomerAddresses = _dt.DataTableToList<CustomerAddress>();
                }
            }
            catch (Exception ex)
            {

                _objcustomer.Error = ex.Message;
            }
            return _objcustomer;
        }

      
        public WrapperAutoCompleteMultipleValue GetItemHeadAutoComplete(SalesDAO obj)
        {
            WrapperAutoCompleteMultipleValue _objWrapperauto = new WrapperAutoCompleteMultipleValue();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetItemHeadAutoComplete", obj);
                _objWrapperauto = setWrapper_auto_WrapperAutoCompleteMultipleValue(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return _objWrapperauto;
        }
        public WrapperAutoCompleteMultipleValue GetInialAutoComplete(SalesDAO obj)
        {
            WrapperAutoCompleteMultipleValue _objWrapperauto = new WrapperAutoCompleteMultipleValue();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetInialAutoComplete", obj);
                _objWrapperauto = setWrapper_auto_WrapperAutoCompleteMultipleValue(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return _objWrapperauto;
        }
        public List<PaymentMethod> GetTax()
        {
            List<PaymentMethod> objPaymentMethod = new List<PaymentMethod>();
            _dt = new DataTable();
            try
            {
                SalesDAO obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetTax", obj);
                objPaymentMethod = _dt.DataTableToList<PaymentMethod>();
            }
            catch (Exception ex)
            {
                //_objWrapperauto.Error = ex.Message;
            }
            return objPaymentMethod;
        }
        public List<ComboData> GetSalesPerason()
        {
            lstComboData = new List<ComboData>();
            SalesDAO obj = new SalesDAO();
            obj.CreatedBy = UserSession.getUserName();
            _dt = getDataByParameter("GetSalesPerson", obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> GetSalesPerasonInvoieEdit()
        {
            lstComboData = new List<ComboData>();
            SalesDAO obj = new SalesDAO();
            obj.CreatedBy = UserSession.getUserName();
            _dt = _accessManager.GetDataByDataTable("usp_GetSalesPerasonInvoieEdit", DbName.Inventory, obj.CreatedBy, out error);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> GetShippingMethod()
        {
            lstComboData = new List<ComboData>();
            SalesDAO obj = new SalesDAO();
            obj.CreatedBy = UserSession.getUserName();
            _dt = getDataByParameter("GetShippingMethod", obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> GetInvDeliveryStatus()
        {
            lstComboData = new List<ComboData>();
            SalesDAO obj = new SalesDAO();
            obj.CreatedBy = UserSession.getUserName();
            _dt = getDataByParameter("GetInvoiceStatus", obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> GetLoadReferralSource()
        {
            lstComboData = new List<ComboData>();
            SalesDAO obj = new SalesDAO();
            obj.CreatedBy = UserSession.getUserName();
            _dt = getDataByParameter("GetLoadReferalSource", obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> GetPaymentMethod()
        {
            lstComboData = new List<ComboData>();
            SalesDAO obj = new SalesDAO();
            obj.CreatedBy = UserSession.getUserName();
            _dt = getDataByParameter("GetPaymentMethod", obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public wrappersalesReturnObj Save(SalesDAO obj, List<SalesDetails> lstOfChildData)
        {
            wrappersalesReturnObj _invoice = new wrappersalesReturnObj();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                var _sqlParameterList = new List<SqlParameter>()
                {
                    new SqlParameter("@SalesType", obj.SalesType),//
                    new SqlParameter("@PaymentTearmsId", obj.PaymentTearmsId),
                    new SqlParameter("@CustomerName",  obj.CustomerName),
                    new SqlParameter("@CustomerId",  obj.CustomerId),
                    new SqlParameter("@SaleId",  obj.SalesId),
                    new SqlParameter("@isTaxInclusive",  obj.isTaxInclusive),
                    new SqlParameter("@InvoiceNo",  string.IsNullOrEmpty(obj.InvoiceNo) ? "" : obj.InvoiceNo),
                    new SqlParameter("@InvoiceDate", obj.InvoiceDate),
                    new SqlParameter("@SalesPersonId",  obj.SalesPersonId),
                    new SqlParameter("@Comments", string.IsNullOrEmpty(obj.Comments) ? SqlString.Null : obj.Comments),
                    new SqlParameter("@ShipVia",  obj.ShipVia),
                    new SqlParameter("@DueDate",  obj.DueDate),
                    new SqlParameter("@SubTotal", obj.SubTotal),
                    new SqlParameter("@Freight", obj.Freight.ToString() == "" ? SqlDecimal.Null : obj.Freight),
                    new SqlParameter("@Tax", obj.Tax.ToString() == "" ? SqlDecimal.Null : obj.Tax),
                    new SqlParameter("@TotalAmount",  obj.TotalAmount),
                    new SqlParameter("@TaxType",  string.IsNullOrEmpty(obj.TaxType) ? SqlString.Null : obj.TaxType),
                    new SqlParameter("@JournalMemo", string.IsNullOrEmpty(obj.JournalMemo) ? SqlString.Null : obj.JournalMemo),
                    new SqlParameter("@ReferralSource", string.IsNullOrEmpty(obj.ReferralSource) ? SqlString.Null : obj.ReferralSource),
                    new SqlParameter("@DeliveryStatus", obj.DeliveryStatus),
                    new SqlParameter("@PaidToday", obj.PaidToday.ToString() == "" ? SqlDecimal.Null : obj.PaidToday),//@discount
                    new SqlParameter("@PaymentMethod", obj.PaymentMethod ),//@discount                  
                    new SqlParameter("@Due", obj.Due),
                    new SqlParameter("@CreateBy", obj.CreatedBy),
                    new SqlParameter("@PaymentTermsText", obj.PaymentTermsText),
                    new SqlParameter("@ReferenceNo", string.IsNullOrEmpty(obj.ReferenceNo) ? SqlString.Null : obj.ReferenceNo),
                    new SqlParameter("@SaleOutletId", obj.SaleOutletId),
                    new SqlParameter("@Name", obj.Name),
                    new SqlParameter("@Address",  obj.Address),
                    new SqlParameter("@MobileNo", obj.MobileNo),
                    new SqlParameter("@City", obj.City),
                    new SqlParameter("@PostalCode", obj.PostalCode),
                    new SqlParameter("@State", obj.State),
                    new SqlParameter("@ManagerDiscount", obj.ManagerDiscount),
                    new SqlParameter("@PrepaidDueDate", string.IsNullOrEmpty(obj.PrepaidDueDate) ? SqlString.Null : obj.PrepaidDueDate)
                    //@PaymentTermsText
            };
                _dt = _accessManager.GetDataByDataTable("usp_InsertSalesMasterData", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
        
                string SalesId = _dt.Rows[0]["salesId"].ToString();

                foreach (var item in lstOfChildData)
                {
                    error = string.Empty;
                    item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList = new List<SqlParameter>()
                {
                    new SqlParameter("@SalesId", SalesId),
                    new SqlParameter("@SaleDetsId", item.SaleDetsId),
                    new SqlParameter("@IHeadId",  item.IHeadId),
                    new SqlParameter("@LocId",  item.LocId),
                    new SqlParameter("@StockQty", item.StockQty == null ? SqlInt32.Null : item.StockQty),
                    new SqlParameter("@SaleQty", item.SaleQty),
                    new SqlParameter("@SalePrice", item.SalePrice == null ? SqlDecimal.Null : item.SalePrice),
                    new SqlParameter("@discount", item.discount == null ? SqlDecimal.Null : Math.Floor(item.discount*100) / 100),
                    new SqlParameter("@discountPrice", item.discountPrice == null ? SqlDecimal.Null : item.discountPrice),
                    new SqlParameter("@ItemDescription", item.ItemDescription == null ? SqlString.Null : item.ItemDescription),
                    new SqlParameter("@PreSale", item.PreSale == null ? SqlString.Null : item.PreSale),
                    new SqlParameter("@Itemtype", item.Itemtype == null ? SqlString.Null : item.Itemtype),
                    new SqlParameter("@CreateBy", item.CreatedBy),
                };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_insertSalesDetailsData", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _invoice.Error = error;
                        return _invoice;
                    }
                }
            }
            catch (Exception ex)
            {
                _invoice.Error = ex.Message;
            }
            _invoice.lstsalesReturnObj = _dt.DataTableToList<salesReturnObj>();
            return _invoice;
        }

        public WrapperSales SaleDetailIdDelete(string saleDetsId)
        {
            string user = UserSession.getUserName();
            _objWrapper = new WrapperSales();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@SaleDetailId", Convert.ToInt32(saleDetsId))
                // new SqlParameter("@CreateBy",user)
            };
            _accessManager.ExecuteNonQueryByStoreProcedure("DeleteSalesDetailsDataBySalesId", _sqlParameterList, DbName.Inventory, user, out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperRegistrationSaleCustomer GetRegistrationData(SalesDAO obj)
        {
            WrapperRegistrationSaleCustomer objCustomerGetData = new WrapperRegistrationSaleCustomer();
            objCustomerGetData = new WrapperRegistrationSaleCustomer();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName(); 
                _dt = getDataByParameter("GetRegistrationSalesList", obj);
                objCustomerGetData = setWrapper_auto_RegistrationCust(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return objCustomerGetData;
        }
        private WrapperRegistrationSaleCustomer setWrapper_auto_RegistrationCust(DataTable _dt)
        {
            WrapperRegistrationSaleCustomer _objWrapper = new WrapperRegistrationSaleCustomer();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.RegistrationSaleCustomer = _dt.DataTableToList<RegistrationSaleCustomer>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public SalesEdit GetSalesDataByInvNo(string inv)
        {
            SalesDAO obj = new SalesDAO();
            SalesEdit objSaleEditData = new SalesEdit();
            DataSet ds = new DataSet();
            try
            {
                obj.SearchText = inv;
                obj.CreatedBy = UserSession.getUserName();
              
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", "SaleEditDataByInvoiceNo"));
                _sqlParameterList.Add(new SqlParameter("@SearchText", string.IsNullOrEmpty(obj.SearchText) ? SqlString.Null : obj.SearchText));
                _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
                _sqlParameterList.Add(new SqlParameter("@BillTo", string.IsNullOrEmpty(obj.BillTo) ? SqlString.Null : obj.BillTo));
                _sqlParameterList.Add(new SqlParameter("@ShipTo", string.IsNullOrEmpty(obj.ShipTo) ? SqlString.Null : obj.ShipTo));
                _sqlParameterList.Add(new SqlParameter("@Phone2", string.IsNullOrEmpty(obj.Phone2) ? SqlString.Null : obj.Phone2));
                _sqlParameterList.Add(new SqlParameter("@City", string.IsNullOrEmpty(obj.City) ? SqlString.Null : obj.City));
                _sqlParameterList.Add(new SqlParameter("@State", string.IsNullOrEmpty(obj.State) ? SqlString.Null : obj.State));
                _sqlParameterList.Add(new SqlParameter("@DateFrom", string.IsNullOrEmpty(obj.DateFrom) ? SqlString.Null : obj.DateFrom));
                _sqlParameterList.Add(new SqlParameter("@DateTo", string.IsNullOrEmpty(obj.DateTo) ? SqlString.Null : obj.DateTo));
                _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId == 0 ? SqlInt32.Null : obj.CustomerId));
                _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
                
                ds = _accessManager.GetDataByDataSet("usp_Sales", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
               
                if (ds.Tables[0].Rows.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        objSaleEditData.SalesDaoMasterEdit = ds.Tables[0].DataTableToList<SalesDaoMasterEdit>().FirstOrDefault();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        objSaleEditData.SalesDaoChildEdit = ds.Tables[1].DataTableToList<SalesDaoChildEdit>().ToList();
                    }
                    if (ds.Tables[2].Rows.Count > 0)
                    {
                        objSaleEditData.SaleEditPermissionLst = ds.Tables[2].DataTableToList<SaleEditPermission>().ToList();
                    }

                }
                
                #region"Old Code"
                //obj.SearchText = inv;
                //obj.CreatedBy = UserSession.getUserName();
                // _dt = getDataByParameter("GetAllSaleDataBySaleInvoiceNo", obj);
                //var salesDaoMasterEdit = _dt.DataTableToList<SalesDaoMasterEdit>().FirstOrDefault();
                //_dt = new DataTable();
                //obj = new SalesDAO();
                //obj.SearchText = inv;
                //obj.CreatedBy = UserSession.getUserName();
                //_dt = getDataByParameter("GetAllSaleChildDataBySaleInvoiceNo", obj);
                //var salesDaoChildEdit = _dt.DataTableToList<SalesDaoChildEdit>().ToList();

                //objSaleEditData.SalesDaoMasterEdit = salesDaoMasterEdit;
                //objSaleEditData.SalesDaoChildEdit = salesDaoChildEdit;
                #endregion
            }
            catch (Exception ex)
            {
                
            }
            return objSaleEditData;
        }

        public SalesPaymentHistoryList GetPaymentHistoryByInvNo(string inv)
        {
            SalesDAO obj = new SalesDAO();

            SalesPaymentHistoryList PaymentHistoryList = new SalesPaymentHistoryList();
            _dt = new DataTable();
            try
            {
                
                obj.SearchText = inv;
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetPaymentHistoryBySaleInvoiceNo", obj);
                PaymentHistoryList.SalesPaymentHisList = _dt.DataTableToList<SalesPaymentHistory>().ToList();
            }
            catch (Exception ex)
            {

            }
            return PaymentHistoryList;
        }
        private DataTable getDataByParameter(string operationName, SalesDAO obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SearchText", string.IsNullOrEmpty(obj.SearchText) ? SqlString.Null : obj.SearchText));
            _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
            _sqlParameterList.Add(new SqlParameter("@BillTo", string.IsNullOrEmpty(obj.BillTo) ? SqlString.Null : obj.BillTo));
            _sqlParameterList.Add(new SqlParameter("@ShipTo", string.IsNullOrEmpty(obj.ShipTo) ? SqlString.Null : obj.ShipTo));
            _sqlParameterList.Add(new SqlParameter("@Phone2", string.IsNullOrEmpty(obj.Phone2) ? SqlString.Null : obj.Phone2));
            _sqlParameterList.Add(new SqlParameter("@City", string.IsNullOrEmpty(obj.City) ? SqlString.Null : obj.City));
            _sqlParameterList.Add(new SqlParameter("@State", string.IsNullOrEmpty(obj.State) ? SqlString.Null : obj.State));
            _sqlParameterList.Add(new SqlParameter("@DateFrom", string.IsNullOrEmpty(obj.DateFrom) ? SqlString.Null : obj.DateFrom));
            _sqlParameterList.Add(new SqlParameter("@DateTo", string.IsNullOrEmpty(obj.DateTo) ? SqlString.Null : obj.DateTo));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId == 0 ? SqlInt32.Null : obj.CustomerId));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_Sales", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public List<PaymentMethod> getPaymentMethod()
        {
            var PaymentMethod = new List<PaymentMethod>
            {
                new PaymentMethod
                {
                    value = "ABN",
                    description = "No Abn WhittHolding",
                    text = "-49%"
                },
                 new PaymentMethod
                {
                    value = "GST",
                    description = "Goods & Service Text",
                    text = "10%"
                },
                new PaymentMethod
                {
                    value = "Fre",
                    description = "GST Free",
                    text = "0%"
                },
                   new PaymentMethod
                {
                    value = "IMP",
                    description = "Import Duty",
                    text = "5%"
                },
                new PaymentMethod
                {
                    value = "CAP",
                    description = "Capital",
                    text = "10%"
                },
                new PaymentMethod
                {
                    value = "GA",
                    description = "GA",
                    text = "12%"
                },
                new PaymentMethod
                {
                    value = "ff",
                    description = "df",
                    text = "14%"
                }
            };

            return PaymentMethod;


        }


        public WrapperCustomerGetData LoadPopupCustomer(SalesDAO obj)
        {
            WrapperCustomerGetData objCustomerGetData = new WrapperCustomerGetData();
            objCustomerGetData = new WrapperCustomerGetData();
            _dt = new DataTable();
            try
            {
                 obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
                _sqlParameterList.Add(new SqlParameter("@MobileNo", string.IsNullOrEmpty(obj.MobileNo) ? SqlString.Null : obj.MobileNo));
                _dt = _accessManager.GetDataByDataTable("usp_LoadPopupCustomer", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                objCustomerGetData = setWrapper_auto_Cust(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return objCustomerGetData;
        }

        public WrapperSales GetComboSetDetailsById(int headId)
        {
            string user = UserSession.getUserName();
            _objWrapper = new WrapperSales();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@headId", headId)
            };
            _dt =  _accessManager.GetDataByDataTable("usp_GetComboSetDetailsById", _sqlParameterList, DbName.Inventory, user, out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if(_dt.Rows.Count > 0)
            {
                _objWrapper.SalesList = _dt.DataTableToList<SalesDAO>().ToList();
            }
            return _objWrapper;
        }



    }

}
