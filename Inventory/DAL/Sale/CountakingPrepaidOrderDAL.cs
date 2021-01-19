using Common;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Sale
{
    public class CountakingPrepaidOrderDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperTakeCount _objTakeWrapper = new WrapperTakeCount();
        private DataTable _dt = new DataTable();
        private DataSet _ds = new DataSet();
        private SalesDAO _obj = new SalesDAO();
        string error = string.Empty;


        public WrapperSales GetCountakingPrepaidOrder(int OutletId, string FromDate, string Todate)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetCountakingPrepaidOrderData"),
                 new SqlParameter("@OutletId", OutletId),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate)

            };
            _dt = _accessManager.GetDataByDataTable("usp_CountakingPrepaidOrder", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
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

        public List<List<SalesDAO>> GetDateWiseDetailsInvoice(string PayDate, int OutletId)
        {
           var olstList = new List<List<SalesDAO>>();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetDateWiseDetailsInvoice"),
                 new SqlParameter("@FromDate", PayDate),
                 new SqlParameter("@OutletId", OutletId)
            };
            _ds = _accessManager.GetDataByDataSet("usp_CountakingPrepaidOrder", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (_ds.Tables[0].Rows.Count > 0)
            {
                _objWrapper.SalesList = _ds.Tables[0].DataTableToList<SalesDAO>();
                olstList.Add(_objWrapper.SalesList);
            }
            if (_ds.Tables[1].Rows.Count > 0)
            {
                _objWrapper.SalesList = _ds.Tables[1].DataTableToList<SalesDAO>();
                olstList.Add(_objWrapper.SalesList);
            }
            if (_ds.Tables[2].Rows.Count > 0)
            {
                _objWrapper.SalesList = _ds.Tables[2].DataTableToList<SalesDAO>();
                olstList.Add(_objWrapper.SalesList);
            }

            return olstList;
        }

        public WrapperSales GetPrepaidOrderDateWiseCountAndCollData(string PayDate, int OutletId, string Operation, string FromDate, string Todate)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", Operation),
                 new SqlParameter("@PayDate", PayDate),
                 new SqlParameter("@OutletId", OutletId),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate)

            };
            _dt = _accessManager.GetDataByDataTable("usp_CountakingPrepaidOrderDateWiseCountAndColData", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
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

        public WrapperTakeCount SaveCountaken(TakeCount obj)
        {
            _objTakeWrapper = new WrapperTakeCount();
            obj.CreatedBy = UserSession.getUserName();
            _dt = new DataTable();
            try
            {
                _sqlParameterList = new List<SqlParameter>
                {
                     new SqlParameter("@operationName", "SaveCountaken"),
                     new SqlParameter("@ClosingDate", obj.ClosingDate),
                     new SqlParameter("@ClosingEFTPOSAmt", obj.ClosingEFTPOSAmt),
                     new SqlParameter("@ClosingModEFTPOSAmt", obj.ClosingModEFTPOSAmt),
                     new SqlParameter("@ClosingCashAmt", obj.ClosingCashAmt),
                     new SqlParameter("@ClosingModCashAmt", obj.ClosingModCashAmt),
                     new SqlParameter("@ClosingChequeAmt", obj.ClosingChequeAmt),
                     new SqlParameter("@ClosingModChequeAmt", obj.ClosingModChequeAmt),
                     new SqlParameter("@ClosingPaypalAmt", obj.ClosingPaypalAmt),
                     new SqlParameter("@ClosingModPaypalAmt", obj.ClosingModPaypalAmt),
                     new SqlParameter("@ClosingTransferAmt", obj.ClosingTransferAmt),
                     new SqlParameter("@ClosingModTransferAmt", obj.ClosingModTransferAmt),
                     new SqlParameter("@ClosingOtherAmt", obj.ClosingOtherAmt),
                     new SqlParameter("@ClosingModOtherAmt", obj.ClosingModOtherAmt),

                     new SqlParameter("@ClosingAfterPayAmt", obj.ClosingAfterPayAmt),
                     new SqlParameter("@ClosingModAfterPayAmt", obj.ClosingModAfterPayAmt),
                     new SqlParameter("@ClosingHummAmt", obj.ClosingHummAmt),
                     new SqlParameter("@ClosingModHummAmt", obj.ClosingModHummAmt),
                     new SqlParameter("@SaleOutletId", obj.SaleOutletId),
                     new SqlParameter("@Notes", obj.Notes),
                     new SqlParameter("@CreatedBy", obj.CreatedBy)
                };
                _dt = _accessManager.GetDataByDataTable("usp_SaveTakeCount", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objTakeWrapper.Error = error;
                    return _objTakeWrapper;
                }

                if (_dt.Rows.Count > 0)
                {
                    _objTakeWrapper.SalesList = _dt.DataTableToList<TakeCount>();
                }
                else
                {
                    _objTakeWrapper.Error = "No data Available";
                    return _objTakeWrapper;
                }
            }
            catch (Exception ex)
            {
                _objTakeWrapper.Error = ex.Message;
            }
            return _objTakeWrapper;
        }

        public WrapperSales SaveMoneyCollection(List<SalesDAO> lstDetails)
        {
            _objWrapper = new WrapperSales();
            _dt = new DataTable();
            try
            {
                foreach (var item in lstDetails)
               {
                     _sqlParameterList = new List<SqlParameter>
                    {
                         new SqlParameter("@operationName", "SaveCollection"),
                         new SqlParameter("@InvoiceDate", item.InvoiceDate),
                         new SqlParameter("@TotalAmount", item.TotalAmount),
                         new SqlParameter("@PaidToday", item.PaidToday),
                         new SqlParameter("@SaleOutletId", item.SaleOutletId),
                         new SqlParameter("@Comments", item.Comments),
                         new SqlParameter("@MoneyCollDate", item.PrepaidDueDate),
                         new SqlParameter("@EmpName", item.CreatedBy),
                         new SqlParameter("@CreatedBy", UserSession.getUserName())
                    };
                    _dt = _accessManager.GetDataByDataTable("usp_SaveTakeCountMoneyCollection", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapper.Error = error;
                        return _objWrapper;
                    }
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
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }


        #region "Take Count Edit"

        public WrapperSales GetTakeCountEditData(int OutletId, string FromDate, string Todate)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetTakeCountEditData"),
                 new SqlParameter("@OutletId", OutletId),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate)

            };
            _dt = _accessManager.GetDataByDataTable("usp_TakeCountEditData", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
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

        public WrapperSales GetTakeCountEditDateWiseData(int OutletId, string FromDate, string Todate, string PayDate)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetTakeCountEditDateWiseData"),
                 new SqlParameter("@OutletId", OutletId),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@PayDate", PayDate)

            };
            _dt = _accessManager.GetDataByDataTable("usp_TakeCountEditData", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
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

        #endregion

    }
}
