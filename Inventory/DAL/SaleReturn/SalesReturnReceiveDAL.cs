using Common;
using DAO.Purchase;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.SaleReturn
{
   public class SalesReturnReceiveDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperSaleReturnReceive _objWrappRec = new WrapperSaleReturnReceive();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private DataTable _dt = new DataTable();
        private SalesDAO _obj = new SalesDAO();
        List<ComboData> lstComboData = new List<ComboData>();
        string error = string.Empty;

        public WrapperRegistrationSaleCustomer GetSaleDestatchData(SalesDAO obj)
        {
            WrapperRegistrationSaleCustomer objCustomerGetData = new WrapperRegistrationSaleCustomer();
            objCustomerGetData = new WrapperRegistrationSaleCustomer();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetDespatchSalesList", obj);
                objCustomerGetData = setWrapper_auto_RegistrationCust(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return objCustomerGetData;
        }
        private DataTable getDataByParameter(string operationName, SalesDAO obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@DateFrom", string.IsNullOrEmpty(obj.DateFrom) ? SqlString.Null : obj.DateFrom));
            _sqlParameterList.Add(new SqlParameter("@DateTo", string.IsNullOrEmpty(obj.DateTo) ? SqlString.Null : obj.DateTo));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId == 0 ? SqlInt32.Null : obj.CustomerId));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_SalesReturn", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
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

        public WrapperSaleReturnReceive GetSaleInvoiceData(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            DataSet ds = new DataSet();
            _objWrappRec.list = new List<SaleReturnReceive>();
            error = string.Empty;
            try
            {
                string user = UserSession.getUserName();
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", "GetSaleInvoiceData"));
                _sqlParameterList.Add(new SqlParameter("@InvoiceNo", InvoiceNo));
                _sqlParameterList.Add(new SqlParameter("@CreateBy", user));
                ds = _accessManager.GetDataByDataSet("usp_SalesReturn", _sqlParameterList, DbName.Inventory, user, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappRec.Error = error;
                    return _objWrappRec;
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        _objWrappRec.list = ds.Tables[0].DataTableToList<SaleReturnReceive>();
                    }

                    if (ds.Tables[2].Rows.Count > 0)
                    {
                        _objWrappRec.listComboData = ds.Tables[2].DataTableToList<ComboData>();
                    }
                    List<SaleReturnReceiveDetails> lstDtl = ds.Tables[1].DataTableToList<SaleReturnReceiveDetails>();
                    _objWrappRec.list[0].lstDetails = lstDtl;
                }

            }
            catch (Exception ex)
            {
                _objWrappRec.Error = ex.Message;
            }
            return _objWrappRec;
        }

        public WrapperSaleReturnReceive GetRetrunRecvInvoiceData(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            DataSet ds = new DataSet();
            _objWrappRec.list = new List<SaleReturnReceive>();
            error = string.Empty;
            try
            {
                string user = UserSession.getUserName();
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", "GetRetrunRecvInvoiceData"));
                _sqlParameterList.Add(new SqlParameter("@InvoiceNo", InvoiceNo));
                _sqlParameterList.Add(new SqlParameter("@CreateBy", user));
                ds = _accessManager.GetDataByDataSet("usp_SalesReturn", _sqlParameterList, DbName.Inventory, user, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappRec.Error = error;
                    return _objWrappRec;
                }
                
                if (ds.Tables[0].Rows.Count > 0)
                {
                   _objWrappRec.list = ds.Tables[0].DataTableToList<SaleReturnReceive>();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    List<SaleReturnReceiveDetails> lstDtl = ds.Tables[1].DataTableToList<SaleReturnReceiveDetails>();
                    _objWrappRec.list[0].lstDetails = lstDtl;
                }

            }
            catch (Exception ex)
            {
                _objWrappRec.Error = ex.Message;
            }
            return _objWrappRec;
        }

        public WrapperSaleReturnReceive GetRetrunRecvInvoicePrint(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            DataSet ds = new DataSet();
            _objWrappRec.list = new List<SaleReturnReceive>();
            error = string.Empty;
            try
            {
                string user = UserSession.getUserName();
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", "GetRetrunRecvInvoicePrint"));
                _sqlParameterList.Add(new SqlParameter("@InvoiceNo", InvoiceNo));
                ds = _accessManager.GetDataByDataSet("usp_ReturnRecvRegisterData", _sqlParameterList, DbName.Inventory, user, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappRec.Error = error;
                    return _objWrappRec;
                }

                if (ds.Tables[0].Rows.Count > 0)
                {
                    _objWrappRec.list = ds.Tables[0].DataTableToList<SaleReturnReceive>();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    List<SaleReturnReceiveDetails> lstDtl = ds.Tables[1].DataTableToList<SaleReturnReceiveDetails>();
                    _objWrappRec.list[0].lstDetails = lstDtl;
                }

            }
            catch (Exception ex)
            {
                _objWrappRec.Error = ex.Message;
            }
            return _objWrappRec;
        }

        public WrapperSaleReturnReceive Save(SaleReturnReceive obj)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _dt = new DataTable();
            error = string.Empty;
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = getparam("SaveData", obj);
                _dt = _accessManager.GetDataByDataTable("usp_SaleReturnReceive", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappRec.Error = error;
                    return _objWrappRec;
                }
                if (obj.DeductionType != "NoItemReturn")
                {
                    if (_dt.Rows.Count > 0)
                    {
                        int SRReceiveId = Convert.ToInt32(_dt.Rows[0]["SRReceiveId"].ToString());
                        foreach (var item in obj.lstDetails)
                        {
                            item.SRReceiveId = SRReceiveId;
                            item.CreatedBy = obj.CreatedBy;
                            _sqlParameterList = getparamDetails(item, obj.CustomerId, obj.PaymentMethodId);
                            _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleReturnReceiveDetails", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                            if (!string.IsNullOrEmpty(error))
                            {
                                _objWrapper.Error = error;
                                obj.SRReceiveId = SRReceiveId;
                                DeleteData(obj);
                                return _objWrappRec;
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                _objWrappRec.Error = ex.Message;
            }
            return _objWrappRec;
        }

        private void DeleteData(SaleReturnReceive obj)
        {
            _sqlParameterList = getparam("DeleteData", obj);
            _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleReturnReceive", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);

        }

        private List<SqlParameter> getparam(string operationName, SaleReturnReceive obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SRReceiveId", obj.SRReceiveId > 0 ? Convert.ToInt32(obj.SRReceiveId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@SaleId", obj.SaleId > 0 ? Convert.ToInt32(obj.SaleId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId > 0 ? Convert.ToInt32(obj.CustomerId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@PaymentMethodId", obj.PaymentMethodId > 0 ? Convert.ToInt32(obj.PaymentMethodId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@TotalDeductionAmount", obj.TotalDeductionAmount));
            _sqlParameterList.Add(new SqlParameter("@TSaleQty", obj.TSaleQty));
            _sqlParameterList.Add(new SqlParameter("@TotalInvoiceAmount", obj.TotalInvoiceAmount));
            _sqlParameterList.Add(new SqlParameter("@TotalPaymentAmount", obj.TotalPaymentAmount));
            _sqlParameterList.Add(new SqlParameter("@NoItemReturnAmt", obj.NoItemReturnAmt > 0 ? Convert.ToDecimal(obj.NoItemReturnAmt) : SqlDecimal.Null));
            _sqlParameterList.Add(new SqlParameter("@InvoiceNo", obj.InvoiceNo));
            _sqlParameterList.Add(new SqlParameter("@SRReceiveNo", string.IsNullOrEmpty(obj.SRReceiveNo) ? SqlString.Null : obj.SRReceiveNo));
            _sqlParameterList.Add(new SqlParameter("@SRReceiveDate", string.IsNullOrEmpty(obj.SRReceiveDate) ? SqlString.Null : obj.SRReceiveDate));
            _sqlParameterList.Add(new SqlParameter("@Reason", string.IsNullOrEmpty(obj.Reason) ? SqlString.Null : obj.Reason));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@DeductionType", string.IsNullOrEmpty(obj.DeductionType) ? SqlString.Null : obj.DeductionType));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _sqlParameterList.Add(new SqlParameter("@StoreCredit", obj.StoreCredit));
            return _sqlParameterList;
        }
        private List<SqlParameter> getparamDetails(SaleReturnReceiveDetails item, int CustomerId, int PaymentMethodId)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@SRReceiveDetailsId", item.SRReceiveDetailsId > 0 ? Convert.ToInt32(item.SRReceiveDetailsId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@SRReceiveId", item.SRReceiveId > 0 ? Convert.ToInt32(item.SRReceiveId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@SaleDetailId", item.SaleDetailId > 0 ? Convert.ToInt32(item.SaleDetailId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@ItemId", item.ItemId > 0 ? Convert.ToInt32(item.ItemId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", item.IHeadId > 0 ? Convert.ToInt32(item.IHeadId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@DeductionAmount", item.DeductionAmount == null ? SqlDecimal.Null : item.DeductionAmount));
            _sqlParameterList.Add(new SqlParameter("@SaleQuantity", item.SaleQuantity));
            _sqlParameterList.Add(new SqlParameter("@ReceiveQty", item.ReceiveQty));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", CustomerId > 0 ? Convert.ToInt32(CustomerId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@PaymentMethodId", PaymentMethodId > 0 ? Convert.ToInt32(PaymentMethodId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(item.CreatedBy) ? SqlString.Null : item.CreatedBy));
            return _sqlParameterList;
        }

        #region "Return Recveive Adjustment"

        public List<ComboData> loadReturnInvoiceNo()
        {
            lstComboData = new List<ComboData>();
            _dt = _accessManager.GetDataByDataTable("usp_LoadReturnReceiveInvoiceNo", _sqlParameterList, DbName.Inventory);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public WrapperSaleReturnReceive GetRetrunRecvInvoiceAdjustmentData(string InvoiceNo)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            DataSet ds = new DataSet();
            _objWrappRec.list = new List<SaleReturnReceive>();
            error = string.Empty;
            try
            {
                string user = UserSession.getUserName();
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@InvoiceNo", InvoiceNo));
                ds = _accessManager.GetDataByDataSet("usp_ReturnReceiveAdjustmentData", _sqlParameterList, DbName.Inventory, user, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappRec.Error = error;
                    return _objWrappRec;
                }

                if (ds.Tables[0].Rows.Count > 0)
                {
                    _objWrappRec.list = ds.Tables[0].DataTableToList<SaleReturnReceive>();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    List<SaleReturnReceiveDetails> lstDtl = ds.Tables[1].DataTableToList<SaleReturnReceiveDetails>();
                    _objWrappRec.list[0].lstDetails = lstDtl;
                }

            }
            catch (Exception ex)
            {
                _objWrappRec.Error = ex.Message;
            }
            return _objWrappRec;
        }

        public WrapperSaleReturnReceive AdjustmentSave(SaleReturnReceive obj)
        {
            _objWrappRec = new WrapperSaleReturnReceive();
            _dt = new DataTable();
            error = string.Empty;
            try
            {
                 obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@InvoiceNo", obj.InvoiceNo));
                _sqlParameterList.Add(new SqlParameter("@SRReceiveId", obj.SRReceiveId));
                _sqlParameterList.Add(new SqlParameter("@MRNo", obj.WhouseName));
                _sqlParameterList.Add(new SqlParameter("@TotalInvoiceAmount", obj.TotalInvoiceAmount));
                _sqlParameterList.Add(new SqlParameter("@TotalPaymentAmount", obj.TotalPaymentAmount));
                _sqlParameterList.Add(new SqlParameter("@AdjustAmount", obj.TotalDeductionAmount));
                _sqlParameterList.Add(new SqlParameter("@Notes", obj.Notes));
                _sqlParameterList.Add(new SqlParameter("@CreatedBy", obj.CreatedBy));
                _dt = _accessManager.GetDataByDataTable("usp_ReturnReceiveAdjustmentSaveUpdate", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappRec.Error = error;
                    return _objWrappRec;
                }
               
            }
            catch (Exception ex)
            {
                _objWrappRec.Error = ex.Message;
            }
            return _objWrappRec;
        }


        #endregion

    }
}
