using Common;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Inventory
{
    public class SalesReturnBookingDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSalesReturnBooking _objWrapper = new WrapperSalesReturnBooking();
        List<SalesReturnBooking> _list = new List<SalesReturnBooking>();
        private DataTable _dt = new DataTable();
        private SalesReturnBooking _obj = new SalesReturnBooking();
        string error = string.Empty;

        #region "Awating Sale Return Booking"
        public WrapperSalesReturnBooking SaveReturnAwating(List<SalesReturnBooking> objList, string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>
                    {
                         new SqlParameter("@operationName", "AwatingReturnBooking"),
                         new SqlParameter("@InvoiceNo", item.InvoiceNo),
                         new SqlParameter("@SRReceiveId", item.SRReceiveId),
                         new SqlParameter("@SRReceiveDetailsId", item.SRReceiveDetailsId),
                         new SqlParameter("@CustomerId", item.CustomerId),
                         new SqlParameter("@IHeadId", item.IHeadId),
                         new SqlParameter("@ItemId", item.ItemId),
                         new SqlParameter("@ReturnQty", item.SaleQty),
                         new SqlParameter("@DeliveryMethod", item.DeliveryMethod),
                         new SqlParameter("@ItemWarehouseId", item.WarehouseId),
                         new SqlParameter("@RequiedDate", item.RequiedDate),
                         new SqlParameter("@TrakingNumber", item.TrakingNumber),
                         new SqlParameter("@Notes", item.Notes),
                         new SqlParameter("@ReturnBy", item.ReturnBy),
                         new SqlParameter("@CreateBy", user)
                     };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleReturnBooking", _sqlParameterList, DbName.Inventory, user, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapper.Error = error;
                        return _objWrapper;
                    }
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperSalesReturnBooking GetReturnBookingData(string FromDate, string Todate)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetReturnBookingData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate)

            };
            ds = _accessManager.GetDataByDataSet("usp_SaleReturnBooking", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }

            if (ds.Tables[0].Rows.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    _objWrapper.list = ds.Tables[0].DataTableToList<SalesReturnBooking>();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    _objWrapper.listComboData = ds.Tables[1].DataTableToList<ComboData>();
                }
                if (ds.Tables[2].Rows.Count > 0)
                {
                    _objWrapper.LstComboData = ds.Tables[2].DataTableToList<ComboData>();
                }

            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }

            return _objWrapper;
        }

        #endregion


        #region "Sales Return Receive Section"
        public WrapperSalesReturnBooking GetReturnReceiveData(string FromDate, string Todate, string Status)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetReturnReceiveData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@type", Status)

            };
            ds = _accessManager.GetDataByDataSet("usp_SaleReturnBooking", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }

            if (ds.Tables[0].Rows.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    _objWrapper.list = ds.Tables[0].DataTableToList<SalesReturnBooking>();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    _objWrapper.listComboData = ds.Tables[1].DataTableToList<ComboData>();
                }

            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }

            return _objWrapper;
        }

        public WrapperSalesReturnBooking SaveReturnReceive(List<SalesReturnBooking> objList, string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>
                    {
                         new SqlParameter("@operationName", "SaveReturnReceive"),
                         new SqlParameter("@InvoiceNo", item.InvoiceNo),
                         new SqlParameter("@ReturnAwatingBookId", item.ReturnAwatingBookId),
                         new SqlParameter("@SRReceiveId", item.SRReceiveId),
                         new SqlParameter("@SRReceiveDetailsId", item.SRReceiveDetailsId),
                         new SqlParameter("@CustomerId", item.CustomerId),
                         new SqlParameter("@IHeadId", item.IHeadId),
                         new SqlParameter("@ItemId", item.ItemId),
                         new SqlParameter("@ReturnQty", item.SaleQty),
                         new SqlParameter("@Status", item.Status),
                         new SqlParameter("@RequiedDate", item.RequiedDate),
                         new SqlParameter("@LocId", Convert.ToInt32(item.LocId)),
                         new SqlParameter("@CreateBy", user)
                     };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleReturnBooking", _sqlParameterList, DbName.Inventory, user, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapper.Error = error;
                        return _objWrapper;
                    }
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperSalesReturnBooking GetReturnRecvRegisterData(string FromDate, string Todate, string Status)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetReturnRecvRegisterData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@type", Status)

            };
            _dt = _accessManager.GetDataByDataTable("usp_ReturnRecvRegisterData", _sqlParameterList, DbName.Inventory, _obj.CreatedBy, out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<SalesReturnBooking>();
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
