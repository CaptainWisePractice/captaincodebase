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
    public class RemoveStockDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperRemoveStock _objWrapper = new WrapperRemoveStock();
        private RemoveStock _obj = new RemoveStock();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperRemoveStock loadItemNumber()
        {
            _objWrapper = new WrapperRemoveStock();
            _dt = new DataTable();
            _obj = new RemoveStock();
            error = string.Empty;
            try
            {
                _obj.CreateBy = UserSession.getUserName();
                _sqlParameterList = getParam("loadItemNumber", _obj);
                _dt = _accessManager.GetDataByDataTable("usp_RemoveStock", _sqlParameterList, DbName.Inventory, _obj.CreateBy, out error);
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
        public WrapperRemoveStock loadLocationByItem(string ItemId)
        {
            _objWrapper = new WrapperRemoveStock();
            _dt = new DataTable();
            _obj = new RemoveStock();
            error = string.Empty;
            try
            {
                _obj.CreateBy = UserSession.getUserName();
                _obj.ItemId = Convert.ToInt32(ItemId);
                _sqlParameterList = getParam("loadLocationByItem", _obj);
                _dt = _accessManager.GetDataByDataTable("usp_RemoveStock", _sqlParameterList, DbName.Inventory, _obj.CreateBy, out error);
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

        public WrapperRemoveStock RemovePendingTransaction(List<RemoveStock> obj)
        {
            _objWrapper = new WrapperRemoveStock();
            error = string.Empty;
            try
            {
                foreach (var item in obj)
                {
                    item.CreateBy = UserSession.getUserName();
                    _sqlParameterList = getParam("RemovePendingTransaction", item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_RemoveStock", _sqlParameterList, DbName.Inventory, item.CreateBy, out error);
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

        public WrapperRemoveStock Save(RemoveStock obj)
        {
            _objWrapper = new WrapperRemoveStock();
            error = string.Empty;
            try
            {
                obj.CreateBy = UserSession.getUserName();
                _sqlParameterList = getParam("SaveData", obj);
                _accessManager.ExecuteNonQueryByStoreProcedure("usp_RemoveStock", _sqlParameterList, DbName.Inventory, obj.CreateBy, out error);
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
        public WrapperRemoveStock GetPendingTransactionData()
        {
            _objWrapper = new WrapperRemoveStock();
            _objWrapper.list = new List<RemoveStock>();
            _obj = new RemoveStock();
            _dt = new DataTable();
            error = string.Empty;
            try
            {
                _obj.CreateBy = UserSession.getUserName();
                _sqlParameterList = getParam("GetPendingTransactionData", _obj);
                _dt = _accessManager.GetDataByDataTable("usp_RemoveStock", _sqlParameterList, DbName.Inventory, _obj.CreateBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count>0)
                {
                    _objWrapper.list = _dt.DataTableToList<RemoveStock>();
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
        public WrapperRemoveStock UpdateData(List<RemoveStock> obj)
        {
            _objWrapper = new WrapperRemoveStock();
            error = string.Empty;
            try
            {
                foreach (var item in obj)
                {
                    _sqlParameterList = new List<SqlParameter>();
                   // _sqlParameterList.Add(new SqlParameter("@operationName", "UpdateData"));
                    _sqlParameterList.Add(new SqlParameter("@Id", item.Id > 0 ? item.Id : SqlInt32.Null));
                    _sqlParameterList.Add(new SqlParameter("@ItemId", item.ItemId > 0 ? item.ItemId : SqlInt32.Null));
                    _sqlParameterList.Add(new SqlParameter("@Qty", item.Qty > 0 ? Convert.ToDecimal(item.Qty) : SqlDecimal.Null));
                    _sqlParameterList.Add(new SqlParameter("@LocId", item.LocId > 0 ? Convert.ToInt32(item.LocId) : SqlInt32.Null));
                    _sqlParameterList.Add(new SqlParameter("@Note", string.IsNullOrEmpty(item.Note) ? SqlString.Null : item.Note));
                    _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
                    _sqlParameterList.Add(new SqlParameter("@RemoveDate", string.IsNullOrEmpty(item.RemoveDate) ? SqlString.Null : item.RemoveDate));
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_UpdateManualStockRemove", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
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
        private List<SqlParameter> getParam(string operationName, RemoveStock obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@Id", obj.Id > 0 ? obj.Id : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@ItemId", obj.ItemId > 0 ? obj.ItemId : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Qty", obj.Qty > 0 ? Convert.ToDecimal(obj.Qty) : SqlDecimal.Null));
            _sqlParameterList.Add(new SqlParameter("@LocId", obj.LocId > 0 ? Convert.ToInt32(obj.LocId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Note", string.IsNullOrEmpty(obj.Note) ? SqlString.Null : obj.Note));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreateBy) ? SqlString.Null : obj.CreateBy));
            _sqlParameterList.Add(new SqlParameter("@RemoveDate", string.IsNullOrEmpty(obj.RemoveDate) ? SqlString.Null : obj.RemoveDate));
            return _sqlParameterList;
        }

        public WrapperRemoveStock ExcelFileSave(List<RemoveStock> obj)
        {
            _objWrapper = new WrapperRemoveStock();
            error = string.Empty;
            try
            {
                foreach (var itm in obj)
                {
                    if (!string.IsNullOrEmpty(itm.ItemNumber))
                    {
                        itm.CreateBy = UserSession.getUserName();
                        _sqlParameterList = new List<SqlParameter>();
                        _sqlParameterList.Add(new SqlParameter("@ItemNumber", itm.ItemNumber));
                        _sqlParameterList.Add(new SqlParameter("@Location", itm.Location));
                        _sqlParameterList.Add(new SqlParameter("@Qty", itm.Qty));
                        _sqlParameterList.Add(new SqlParameter("@CreateBy", itm.CreateBy));
                        _accessManager.ExecuteNonQueryByStoreProcedure("usp_RemoveStockFromExcelFile", _sqlParameterList, DbName.Inventory, itm.CreateBy, out error);
                        if (!string.IsNullOrEmpty(error))
                        {
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

    }
}
