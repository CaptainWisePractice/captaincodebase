using Common;
using DAO.SearchBoard;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.SearchBoard
{
   public class ItemHistoryDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperItemHistory _objWrapper = new WrapperItemHistory();
        private ItemHistory _obj = new ItemHistory();
        private DataTable _dt = new DataTable();
        string error = string.Empty;

        public WrapperItemHistory GetAllItemHistory(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = obj.CreatedBy;
                _dt = getDataByParameter("LoadItemHistory", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperItemHistory GetAllItemTransaction(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("LoadItemTransaction", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }


        public WrapperItemHistory GetStockItemCode(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = obj.CreatedBy;
                _dt = getDataByParameter("LoadStockItemCode", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private DataTable getDataByParameter(string operationName, ItemHistory obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList = getparam(operationName, obj);
            _dt = _accessManager.GetDataByDataTable("usp_ItemHistory", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        private WrapperItemHistory setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperItemHistory();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemHistory>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        private List<SqlParameter> getparam(string operationName, ItemHistory obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(obj.IHeadId) ? "0" : obj.IHeadId));
            _sqlParameterList.Add(new SqlParameter("@ItemId", string.IsNullOrEmpty(obj.ItemId) ? "0" : obj.ItemId));
            _sqlParameterList.Add(new SqlParameter("@SupplierID", string.IsNullOrEmpty(obj.ManufacturerId) ? SqlString.Null : obj.ManufacturerId));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(obj.FromDate) ? SqlString.Null : obj.FromDate));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(obj.ToDate) ? SqlString.Null : obj.ToDate));
            return _sqlParameterList;
        }


        public WrapperItemHistory GetStockByItemCode(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = obj.CreatedBy;
                _dt = getDataByParameter("LoadStockQtybyItemCode", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }


        public WrapperItemHistory GetStocklistLocationwise(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            _dt = new DataTable();
            try
            {
                _dt = new DataTable();
                error = string.Empty;
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(obj.IHeadId) ? "0" : obj.IHeadId));
                _dt = _accessManager.GetDataByDataTable("usp_StocklistLocationwise", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        #region "Combo Stock List" 
        public WrapperItemHistory GetComboStocklist(ItemHistory obj)
        {
            _objWrapper = new WrapperItemHistory();
            _dt = new DataTable();
            try
            {
                _dt = new DataTable();
                error = string.Empty;
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(obj.IHeadId) ? "0" : obj.IHeadId));
                _dt = _accessManager.GetDataByDataTable("usp_ComboStocklist", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        #endregion
    }
}
