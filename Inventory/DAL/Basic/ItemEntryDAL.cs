using Common;
using DAO.Basic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Basic
{
   public class ItemEntryDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperItemInfo _objWrapper = new WrapperItemInfo();
        private ItemEntry _obj = new ItemEntry();
        private DataTable _dt = new DataTable();
        string error = string.Empty;

        private DataTable getDataByParameter(string operationName, ItemEntry obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@ItemId", string.IsNullOrEmpty(obj.ItemId) ? 0 : Convert.ToInt32(obj.ItemId)));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(obj.IHeadId) ? 0 : Convert.ToInt32(obj.IHeadId)));
           // _sqlParameterList.Add(new SqlParameter("@ManufacturerId", string.IsNullOrEmpty(obj.ManufacturerId) ? 0 : Convert.ToInt32(obj.ManufacturerId)));
            _sqlParameterList.Add(new SqlParameter("@ItemCode", string.IsNullOrEmpty(obj.ItemCode) ? SqlString.Null : obj.ItemCode));
            _sqlParameterList.Add(new SqlParameter("@ItemName", string.IsNullOrEmpty(obj.ItemName) ? SqlString.Null : obj.ItemName));
            _sqlParameterList.Add(new SqlParameter("@UOM", string.IsNullOrEmpty(obj.UOM) ? SqlString.Null : obj.UOM));
            _sqlParameterList.Add(new SqlParameter("@Width", string.IsNullOrEmpty(obj.Width) ? 0 : Convert.ToDecimal(obj.Width)));
            _sqlParameterList.Add(new SqlParameter("@Height", string.IsNullOrEmpty(obj.Height) ? 0 : Convert.ToDecimal(obj.Height)));
            _sqlParameterList.Add(new SqlParameter("@Length", string.IsNullOrEmpty(obj.Length) ? 0 : Convert.ToDecimal(obj.Length)));
            _sqlParameterList.Add(new SqlParameter("@Weight", string.IsNullOrEmpty(obj.Weight) ? 0 : Convert.ToDecimal(obj.Weight)));
            _sqlParameterList.Add(new SqlParameter("@CBM", string.IsNullOrEmpty(obj.CBM) ? 0 : Convert.ToDecimal(obj.CBM)));
            _sqlParameterList.Add(new SqlParameter("@MinStockLevel", string.IsNullOrEmpty(obj.MinStockLevel) ? 0 : Convert.ToInt32(obj.MinStockLevel)));
            _sqlParameterList.Add(new SqlParameter("@MaxStockLevel", string.IsNullOrEmpty(obj.MaxStockLevel) ? 0 : Convert.ToInt32(obj.MaxStockLevel)));
            _sqlParameterList.Add(new SqlParameter("@IsActive", true));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_itemInfo", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public WrapperItemInfo loadItemHead()
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            _obj = new ItemEntry();
            try
            {
                _dt = getDataByParameter("loadItemHead", _obj);
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

        public WrapperItemInfo loadManufacturer()
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            _obj = new ItemEntry();
            try
            {
                _dt = getDataByParameter("loadManufact", _obj);
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

        public WrapperItemInfo getAutoItemNumber(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            try
            {
                _dt = getDataByParameter("GetAutoItemNumber", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperItemInfo getItemInfo()
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            try
            {
                _obj = new ItemEntry();
                _obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetAllData", _obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private WrapperItemInfo setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperItemInfo();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemEntry>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperItemInfo Delete(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("DeleteData", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperItemInfo DuplicateCheck(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("DuplicateCheck", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperItemInfo LoadById(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("LoadById", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        public WrapperItemInfo Save(ItemEntry obj)
        {
            _objWrapper = new WrapperItemInfo();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("SaveUpdateData", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
    }
}
