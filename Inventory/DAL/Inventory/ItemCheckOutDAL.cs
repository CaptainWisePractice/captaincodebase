using Common;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Inventory
{
   
    public class ItemCheckOutDAL
    {
        List<ComboData> lstComboData = new List<ComboData>();
        List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private DataTable _dt = new DataTable();
        private CommonParameter _obj = new CommonParameter();
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        ItemCheckOut _objItemCheckIn = new ItemCheckOut();
        WrapperItemCheckOut _objWrapperItemCheck = new WrapperItemCheckOut();
        string operationName = "", error ="";



        public List<ComboData> loadItemHead()
        {
            lstComboData = new List<ComboData>();
            operationName = "LoadItemHeadByStock";
            _dt = getDataByParameter(operationName, "");
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadItem(string headId)
        {
            lstComboData = new List<ComboData>();
            operationName = "LoadItem";
            _dt = getDataByParameter(operationName, headId);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadLocationByHeadId(string headId)
        {
            lstComboData = new List<ComboData>();
            operationName = "LoadLocationandQtyByHeadId";
            _dt = getDataByParameter(operationName, headId);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        private DataTable getDataByParameter(string operationName, string Id)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@Id", string.IsNullOrEmpty(Id) ? "0" : Id));
            _dt = _accessManager.GetDataByDataTable("usp_LoadLocationandStockQtyByHeadId", _sqlParameterList, DbName.Inventory);
            return _dt;
        }

        public WrapperItemCheckOut Save(ItemCheckOut obj ,List<ItemCheckOut> objList)
        {
            _dt = new DataTable();
            try
            {
                var _sqlParamList = new List<SqlParameter>()
                {
                    new SqlParameter("@operationName", "CustomerInfo"),
                    new SqlParameter("@CustomerName", obj.CustomerName),
                    new SqlParameter("@ContractNo", obj.ContractNo),
                    new SqlParameter("@CustomerInfo", obj.CustomerInfo),
                    new SqlParameter("@DueDate", string.IsNullOrEmpty( obj.DueDate) ? "" : obj.DueDate),
                    new SqlParameter("@Note", string.IsNullOrEmpty(obj.Note) ? "" : obj.Note),
                    new SqlParameter("@Email", string.IsNullOrEmpty(obj.Email) ? "" : obj.Email),
                    new SqlParameter("@CreateBy", obj.CreatedBy)
                };
                _dt = _accessManager.GetDataByDataTable("usp_ItemCheckOut", _sqlParamList, DbName.Inventory);

                string customerId = _dt.Rows[0]["CustomerId"].ToString();
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                     item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList = getparam("SaveData", customerId, item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_ItemCheckOut", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapperItemCheck.Error = error;
                        return _objWrapperItemCheck;
                    }
                }
            }
            catch (Exception ex)
            {
                _objWrapperItemCheck.Error = ex.Message;
            }
            return _objWrapperItemCheck;
        }
        private List<SqlParameter> getparam(string operationName, string customerId, ItemCheckOut obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@customerId", string.IsNullOrEmpty(customerId) ? "" : customerId));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(obj.IHeadId) ? "" : obj.IHeadId));
            _sqlParameterList.Add(new SqlParameter("@LocId", string.IsNullOrEmpty(obj.LocId) ? "" : obj.LocId));
            _sqlParameterList.Add(new SqlParameter("@CheckInQty", string.IsNullOrEmpty(obj.CheckInQty) ? "" : obj.CheckInQty));
            _sqlParameterList.Add(new SqlParameter("@Item", string.IsNullOrEmpty(obj.Item) ? "" : obj.Item));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? "" : obj.CreatedBy));
            return _sqlParameterList;
        }


        #region "For Item CheckIn"
        public WrapperItemCheckOut GetCheckOutDataByCustomerId(ItemCheckOut obj)
        {
            _objWrapperItemCheck = new WrapperItemCheckOut();
            _dt = new DataTable();
            try
            {
                var _sqlParamList = new List<SqlParameter>()
                {
                    new SqlParameter("@operationName", "CheckOutDataByCustomerId"),
                    new SqlParameter("@customerId", obj.CustomerId),
                    new SqlParameter("@CreateBy", obj.CreatedBy)
                };
                _dt = _accessManager.GetDataByDataTable("usp_ItemCheckOut", _sqlParamList, DbName.Inventory);
                _objWrapperItemCheck = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperItemCheck.Error = ex.Message;
            }
            return _objWrapperItemCheck;
        }

        private WrapperItemCheckOut setWrapper(DataTable _dt)
        {
            _objWrapperItemCheck = new WrapperItemCheckOut();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapperItemCheck.Error = error;
                return _objWrapperItemCheck;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapperItemCheck.listItemCheckIn = _dt.DataTableToList<ItemCheckOut>();
            }
            else
            {
                _objWrapperItemCheck.Error = "No data Available";
                return _objWrapperItemCheck;
            }
            return _objWrapperItemCheck;
        }

        public WrapperItemCheckOut CheckInSave(List<ItemCheckOut> objList,string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                     item.CreatedBy = user;
                    _sqlParameterList = getparam("SaveDataCheckIn",item.CustomerId, item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_ItemCheckOut", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapperItemCheck.Error = error;
                        return _objWrapperItemCheck;
                    }
                }
            }
            catch (Exception ex)
            {
                _objWrapperItemCheck.Error = ex.Message;
            }
            return _objWrapperItemCheck;
        }

        #endregion

    }
}
