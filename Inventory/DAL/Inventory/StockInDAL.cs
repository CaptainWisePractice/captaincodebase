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
    public class StockInDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperStockIn _objWrapper = new WrapperStockIn();
        private StockIn _obj = new StockIn();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperStockIn GetDataByItemHead(StockIn obj)
        {
            _objWrapper = new WrapperStockIn();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetDataByItemHead", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }        

        public WrapperStockIn Save(List<StockIn> obj)
        {
            _objWrapper = new WrapperStockIn();
            _dt = new DataTable();
            try
            {
                foreach (var item in obj)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                    item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList = getparam("SaveData", item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_StockIn", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
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
        
        private WrapperStockIn setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperStockIn();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<StockIn>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        private DataTable getDataByParameter(string operationName, StockIn obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList = getparam(operationName, obj);
            _dt = _accessManager.GetDataByDataTable("usp_StockIn", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        private List<SqlParameter> getparam(string operationName, StockIn obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", obj.IHeadId > 0 ? Convert.ToInt32(obj.IHeadId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@ItemId", obj.ItemId > 0 ? obj.ItemId : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Qty", string.IsNullOrEmpty(obj.Qty) ? SqlDecimal.Null : Convert.ToDecimal(obj.Qty)));
            _sqlParameterList.Add(new SqlParameter("@NewPrice", string.IsNullOrEmpty(obj.NewPrice) ? SqlDecimal.Null : Convert.ToDecimal(obj.NewPrice)));
            _sqlParameterList.Add(new SqlParameter("@OldPrice", string.IsNullOrEmpty(obj.OldPrice) ? SqlDecimal.Null : Convert.ToDecimal(obj.OldPrice)));
            _sqlParameterList.Add(new SqlParameter("@LocId", string.IsNullOrEmpty(obj.LocId) ? SqlInt32.Null : Convert.ToInt32(obj.LocId)));
            _sqlParameterList.Add(new SqlParameter("@SupplierID", string.IsNullOrEmpty(obj.SupplierID) ? SqlInt32.Null : Convert.ToInt32(obj.SupplierID)));
            _sqlParameterList.Add(new SqlParameter("@LotNo", string.IsNullOrEmpty(obj.LotNo) ? SqlString.Null : obj.LotNo));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            return _sqlParameterList;
        }
    }
}
