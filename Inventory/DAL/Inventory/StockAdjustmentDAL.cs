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
    public class StockAdjustmentDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperStockAdjustment _objWrapper = new WrapperStockAdjustment();
        private StockAdjustment _obj = new StockAdjustment();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperStockAdjustment GetDataByItemCode(string itemCode)
        {
            _objWrapper = new WrapperStockAdjustment();
            _dt = new DataTable();
            _obj = new StockAdjustment();
            error = string.Empty;
            try
            {
                _obj.CreatedBy = UserSession.getUserName();
                _obj.ItemId = Convert.ToInt32(itemCode);
                _sqlParameterList = getparam("GetDataByItemId", _obj);
                _dt = _accessManager.GetDataByDataTable("usp_StockAdjustment", _sqlParameterList, DbName.Inventory, _obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.list = _dt.DataTableToList<StockAdjustment>();
                }
                else
                {
                    _objWrapper.Error = "No data Available";
                    return _objWrapper;
                }
                return _objWrapper;
                //_objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperStockAdjustment Save(List<StockAdjustment> obj)
        {

            _objWrapper = new WrapperStockAdjustment();
            _dt = new DataTable();
            try
            {
                foreach (var item in obj)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                    item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList = getparam("SaveData", item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_StockAdjustment", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
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

        private List<SqlParameter> getparam(string operationName, StockAdjustment obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@ItemId", obj.ItemId > 0 ? obj.ItemId : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Qty", obj.CurQty>0 ?  Convert.ToDecimal(obj.CurQty) : SqlDecimal.Null));
            _sqlParameterList.Add(new SqlParameter("@CurStockId", obj.CurStockId> 0 ? Convert.ToInt32(obj.CurStockId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            return _sqlParameterList;
        }
    }
}
