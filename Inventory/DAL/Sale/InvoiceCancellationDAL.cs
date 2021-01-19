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
   public class InvoiceCancellationDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperInvoiceCancellation _objWrappCancel = new WrapperInvoiceCancellation();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private DataTable _dt = new DataTable();
        private SalesDAO _obj = new SalesDAO();
        string error = string.Empty;

        public WrapperRegistrationSaleCustomer GetInvoiceCancellationData(SalesDAO obj)
        {
            WrapperRegistrationSaleCustomer objCustomerGetData = new WrapperRegistrationSaleCustomer();
            objCustomerGetData = new WrapperRegistrationSaleCustomer();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetInvoiceCancellationData", obj);
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
            _dt = _accessManager.GetDataByDataTable("usp_InvoiceCancellation", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
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

        public WrapperInvoiceCancellation GetSaleInvoiceData(string InvoiceNo)
        {
            _objWrappCancel = new WrapperInvoiceCancellation();
            DataSet ds = new DataSet();
            _objWrappCancel.list = new List<InvoiceCancellation>();
            error = string.Empty;
            try
            {
                string user = UserSession.getUserName();
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", "GetSaleInvoiceData"));
                _sqlParameterList.Add(new SqlParameter("@InvoiceNo", InvoiceNo));
                _sqlParameterList.Add(new SqlParameter("@CreateBy", user));
                ds = _accessManager.GetDataByDataSet("usp_InvoiceCancellation", _sqlParameterList, DbName.Inventory, user, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappCancel.Error = error;
                    return _objWrappCancel;
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        _objWrappCancel.list = ds.Tables[0].DataTableToList<InvoiceCancellation>();
                    }

                    //if (ds.Tables[2].Rows.Count > 0)
                    //{
                    //    _objWrappCancel.listComboData = ds.Tables[2].DataTableToList<ComboData>();
                    //}
                    List<InvoiceCancellationDetails> lstDtl = ds.Tables[1].DataTableToList<InvoiceCancellationDetails>();
                    _objWrappCancel.list[0].lstDetails = lstDtl;
                }

            }
            catch (Exception ex)
            {
                _objWrappCancel.Error = ex.Message;
            }
            return _objWrappCancel;
        }

        public WrapperInvoiceCancellation Save(InvoiceCancellation obj)
        {
            _objWrappCancel = new WrapperInvoiceCancellation();
            _dt = new DataTable();
            error = string.Empty;
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = getparam("SaveData", obj);
                _dt = _accessManager.GetDataByDataTable("usp_InvoiceCancellation", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrappCancel.Error = error;
                    return _objWrappCancel;
                }

            }
            catch (Exception ex)
            {
                _objWrappCancel.Error = ex.Message;
            }
            return _objWrappCancel;
        }
        private List<SqlParameter> getparam(string operationName, InvoiceCancellation obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            //_sqlParameterList.Add(new SqlParameter("@SaleCancelId", obj.SaleCancelId > 0 ? Convert.ToInt32(obj.SaleCancelId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@SaleId", obj.SaleId > 0 ? Convert.ToInt32(obj.SaleId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId > 0 ? Convert.ToInt32(obj.CustomerId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@PaymentMethodId", obj.PaymentMethodId > 0 ? Convert.ToInt32(obj.PaymentMethodId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@RefundAmount", obj.RefundAmount));
            _sqlParameterList.Add(new SqlParameter("@TSaleQty", obj.TSaleQty));
            _sqlParameterList.Add(new SqlParameter("@InvoiceAmount", obj.InvoiceAmount));
            _sqlParameterList.Add(new SqlParameter("@Percentage", obj.Percentage));
            _sqlParameterList.Add(new SqlParameter("@CancelType", obj.CancelType));
            _sqlParameterList.Add(new SqlParameter("@InvoiceNo", obj.InvoiceNo));
            _sqlParameterList.Add(new SqlParameter("@CancelDate", string.IsNullOrEmpty(obj.CancelDate) ? SqlString.Null : obj.CancelDate));
            _sqlParameterList.Add(new SqlParameter("@Reason", string.IsNullOrEmpty(obj.Reason) ? SqlString.Null : obj.Reason));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            return _sqlParameterList;
        }
      

    }
}
