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
   public class ItemHeadDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperIHead _objWrapper = new WrapperIHead();
        public WrapperAutoComplete _wapper = new WrapperAutoComplete();
        private ItemHead _obj = new ItemHead();
        private DataTable _dt = new DataTable();
        string error = string.Empty;

        private DataTable getDataByParameter(string operationName, ItemHead obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(obj.IHeadId) ? 0: Convert.ToInt32(obj.IHeadId)));
            _sqlParameterList.Add(new SqlParameter("@CategoryId", string.IsNullOrEmpty(obj.CategoryId) ? 0 : Convert.ToInt32(obj.CategoryId)));
            _sqlParameterList.Add(new SqlParameter("@ManufacturerId", string.IsNullOrEmpty(obj.ManufacturerId) ? 0 : Convert.ToInt32(obj.ManufacturerId)));
            _sqlParameterList.Add(new SqlParameter("@CostingPrice", string.IsNullOrEmpty(obj.CostingPrice) ? 0 : Convert.ToDecimal(obj.CostingPrice)));
            _sqlParameterList.Add(new SqlParameter("@NewPrice", string.IsNullOrEmpty(obj.NewPrice) ? 0 : Convert.ToDecimal(obj.NewPrice)));
            _sqlParameterList.Add(new SqlParameter("@IHeadCode", string.IsNullOrEmpty(obj.IHeadCode) ? SqlString.Null : obj.IHeadCode));
            _sqlParameterList.Add(new SqlParameter("@CBM", string.IsNullOrEmpty(obj.CBM) ? 0 : Convert.ToDecimal(obj.CBM)));
            _sqlParameterList.Add(new SqlParameter("@IHeadName", string.IsNullOrEmpty(obj.IHeadName) ? SqlString.Null : obj.IHeadName));
            _sqlParameterList.Add(new SqlParameter("@ColorId", string.IsNullOrEmpty(obj.ColorId) ? 0 : Convert.ToDecimal(obj.ColorId)));
            _sqlParameterList.Add(new SqlParameter("@Color", string.IsNullOrEmpty(obj.Color) ? SqlString.Null : obj.Color));
            _sqlParameterList.Add(new SqlParameter("@SizeId", string.IsNullOrEmpty(obj.SizeId) ? 0 : Convert.ToDecimal(obj.SizeId)));
            _sqlParameterList.Add(new SqlParameter("@Size", string.IsNullOrEmpty(obj.Size) ? SqlString.Null : obj.Size));
            _sqlParameterList.Add(new SqlParameter("@IsActive",obj.IsActive));
            _sqlParameterList.Add(new SqlParameter("@IsStock", obj.IsStock));
            _sqlParameterList.Add(new SqlParameter("@ListingStatus", obj.ListingStatus));
            _sqlParameterList.Add(new SqlParameter("@DeliveryStatus", obj.DeliveryStatus));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_ItemHead", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public WrapperIHead loadCategory()
        {
            _objWrapper = new WrapperIHead();
            _dt = new DataTable();
            _obj = new ItemHead();
            try
            {
                _dt = getDataByParameter("loadCategory", _obj);
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

        public WrapperIHead getItemHead()
        {
            _objWrapper = new WrapperIHead();
            _dt = new DataTable();
            try
            {
                _obj = new ItemHead();
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

        private WrapperIHead setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperIHead();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemHead>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperIHead Delete(ItemHead obj)
        {
            _objWrapper = new WrapperIHead();
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
        public WrapperIHead Save(ItemHead obj)
        {
            _objWrapper = new WrapperIHead();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("SaveUpdateData", obj);
                if (obj.listAttachment.Count > 0)
                {
                    foreach (var item in obj.listAttachment)
                    {
                        _sqlParameterList = new List<SqlParameter>();
                        _sqlParameterList.Add(new SqlParameter("@IHeadId", _dt.Rows[0]["IHeadId"].ToString()));
                        _sqlParameterList.Add(new SqlParameter("@FileNameUser", item.FileNameUser));
                        _sqlParameterList.Add(new SqlParameter("@FileNameSave", item.FileNameSave));
                        _sqlParameterList.Add(new SqlParameter("@FileLocation", item.FileLocation));
                        _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
                        _accessManager.SaveDataByStoreProcedure("usp_ItemHead_Attachment", _sqlParameterList, DbName.Inventory);
                    }
                }
                _objWrapper._result = _dt.Rows[0]["IHeadId"].ToString();
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperIHead DuplicateCheck(ItemHead obj)
        {
            _objWrapper = new WrapperIHead();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("DuplicateCheck", obj);
                _objWrapper.Save_error = _dt.Rows.Count > 0 ? "True" : "False";
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperAutoComplete getColorAutoCompleted( string color)
        {
            _wapper = new WrapperAutoComplete();
            _dt = new DataTable();
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", "AutoCompletedColor"));
                _sqlParameterList.Add(new SqlParameter("@Color", color));
                _dt = _accessManager.GetDataByDataTable("usp_ItemHead", _sqlParameterList, DbName.Inventory);
                _wapper = setWrapper_auto(_dt);
            }
            catch (Exception ex)
            {
                _wapper.Error = ex.Message;
            }
            return _wapper;
        }

        public WrapperAutoComplete getSizeAutoCompleted(string size)
        {
            _wapper = new WrapperAutoComplete();
            _dt = new DataTable();
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", "AutoCompletedBox"));
                _sqlParameterList.Add(new SqlParameter("@Size", size));
                _dt = _accessManager.GetDataByDataTable("usp_ItemHead", _sqlParameterList, DbName.Inventory);
                _wapper = setWrapper_auto(_dt);
            }
            catch (Exception ex)
            {
                _wapper.Error = ex.Message;
            }
            return _wapper;
        }

        private WrapperAutoComplete setWrapper_auto(DataTable _dt)
        {
            _wapper = new WrapperAutoComplete();
            if (!string.IsNullOrEmpty(error))
            {
                _wapper.Error = error;
                return _wapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _wapper.ListAutoCpomplete = _dt.DataTableToList<AutoComplete>();
            }
            else
            {
                _wapper.Error = "No data match";
                return _wapper;
            }
            return _wapper;
        }

    }
}
