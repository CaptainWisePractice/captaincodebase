using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAO.Inventory;
using Common;
using System.Data.SqlClient;
using System.Data;
using System.Data.SqlTypes;

namespace DAL.Inventory
{
    public class ReceivePaymentsDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperReceivePayments _objWrapper = new WrapperReceivePayments();
        private ReceivePayments _obj = new ReceivePayments();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperReceivePayments loadCustomer()
        {
            _objWrapper = new WrapperReceivePayments();
            _dt = new DataTable();
            _obj = new ReceivePayments();
            error = string.Empty;
            try
            {
                _obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = getparam("GetCustomer", _obj);
                _dt = _accessManager.GetDataByDataTable("usp_ReceivePayments", _sqlParameterList, DbName.Inventory, _obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listComboData = _dt.DataTableToList<ComboData>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperReceivePayments Save(ReceivePayments obj)
        {
            _objWrapper = new WrapperReceivePayments();
            _dt = new DataTable();
            error = string.Empty;
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = getparam("SaveData", obj);
                _dt= _accessManager.GetDataByDataTable("usp_ReceivePayments", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count>0)
                {
                    List<ReceivePaymentsDetails> list = _dt.DataTableToList<ReceivePaymentsDetails>();
                    foreach (var item in obj.lstDetails)
                    {
                        item.MRId = list[0].MRId;
                        item.MRNo = list[0].MRNo;
                        _sqlParameterList = getparamDetails(item);
                        _accessManager.ExecuteNonQueryByStoreProcedure("usp_ReceivePaymentsDetails", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                        if (!string.IsNullOrEmpty(error))
                        {
                            obj.MRId = list[0].MRId;
                            DeleteData(obj);
                            _objWrapper.Error = error;
                            return _objWrapper;
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private List<SqlParameter> getparamDetails(ReceivePaymentsDetails item)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@MRId", item.MRId ));
            _sqlParameterList.Add(new SqlParameter("@MRNo", string.IsNullOrEmpty(item.MRNo) ? SqlString.Null : item.MRNo));
            _sqlParameterList.Add(new SqlParameter("@InvoiceNo", string.IsNullOrEmpty(item.InvoiceNo) ? SqlString.Null : item.InvoiceNo));
            _sqlParameterList.Add(new SqlParameter("@InvoiceDate", string.IsNullOrEmpty(item.InvoiceDate) ? SqlDateTime.Null : Convert.ToDateTime(item.InvoiceDate)));
            _sqlParameterList.Add(new SqlParameter("@InvoiceAmount", string.IsNullOrEmpty(item.InvoiceAmount) ? SqlDecimal.Null : Convert.ToDecimal(item.InvoiceAmount)));
            _sqlParameterList.Add(new SqlParameter("@Discount", string.IsNullOrEmpty(item.Discount) ? SqlDecimal.Null : Convert.ToDecimal(item.Discount)));
            _sqlParameterList.Add(new SqlParameter("@TotalDue", string.IsNullOrEmpty(item.TotalDue) ? SqlDecimal.Null : Convert.ToDecimal(item.TotalDue)));
            _sqlParameterList.Add(new SqlParameter("@AmountApplied", string.IsNullOrEmpty(item.AmountApplied) ? SqlDecimal.Null : Convert.ToDecimal(item.AmountApplied)));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", item.InvoiceCustomerId));
            _sqlParameterList.Add(new SqlParameter("@PaymentMethodId", item.PaymentMethodId));

            return _sqlParameterList;
        }

        private void DeleteData(ReceivePayments obj)
        {
            _sqlParameterList = getparam("DeleteData", obj);
            _accessManager.ExecuteNonQueryByStoreProcedure("usp_ReceivePayments", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
        }

        public WrapperReceivePayments GetDataByCustomerId(string customerId)
        {
            _objWrapper = new WrapperReceivePayments();
            _dt = new DataTable();
            _obj = new ReceivePayments();
            _objWrapper.list = new List<ReceivePayments>();
            error = string.Empty;
            try
            {
                _obj.CreatedBy = UserSession.getUserName();
                _obj.CustomerId = Convert.ToInt32(customerId);
                _sqlParameterList = getparam("GetDataByCustomer", _obj);
                _dt = _accessManager.GetDataByDataTable("usp_ReceivePayments", _sqlParameterList, DbName.Inventory, _obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count > 0)
                {
                    List<ReceivePaymentsDetails> list= _dt.DataTableToList<ReceivePaymentsDetails>();                   
                    _objWrapper.list.Add(new ReceivePayments()
                    {
                        AdvanceAmount= Convert.ToDecimal(_dt.Rows[0]["AdvanceAmount"].ToString()),
                        PaymentMethodId = _dt.Rows[0]["PaymentMethodId"].ToString(),
                        lstDetails = list
                    });
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        private List<SqlParameter> getparam(string operationName, ReceivePayments obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId > 0 ? Convert.ToInt32(obj.CustomerId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@MRId", obj.MRId > 0 ? Convert.ToInt32(obj.MRId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@AmountReceive", string.IsNullOrEmpty(obj.AmountReceive) ? SqlDecimal.Null : Convert.ToDecimal(obj.AmountReceive)));
            _sqlParameterList.Add(new SqlParameter("@TotalApplied", string.IsNullOrEmpty(obj.TotalApplied) ? SqlDecimal.Null : Convert.ToDecimal(obj.TotalApplied)));
            _sqlParameterList.Add(new SqlParameter("@FinanceCharge", string.IsNullOrEmpty(obj.FinanceCharge) ? SqlDecimal.Null : Convert.ToDecimal(obj.FinanceCharge)));
            _sqlParameterList.Add(new SqlParameter("@PaymentMethodId", string.IsNullOrEmpty(obj.PaymentMethodId) ? SqlInt32.Null : Convert.ToInt32(obj.PaymentMethodId)));
            _sqlParameterList.Add(new SqlParameter("@PaymentMemo", string.IsNullOrEmpty(obj.PaymentMemo) ? SqlString.Null : obj.PaymentMemo));
            _sqlParameterList.Add(new SqlParameter("@PaymentDate", string.IsNullOrEmpty(obj.PaymentDate) ? SqlString.Null : obj.PaymentDate));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            return _sqlParameterList;
        }
    }
}
