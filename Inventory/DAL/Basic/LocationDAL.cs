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
    public class LocationDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperLocation _objWrapper = new WrapperLocation();
        private Location _obj = new Location();
        private DataTable _dt = new DataTable();
        string error = string.Empty;

        private DataTable getDataByParameter(string operationName, Location obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@LocId", Convert.ToInt32(obj.LocId)));
            _sqlParameterList.Add(new SqlParameter("@WarehouseId", obj.WarehouseId > 0 ? obj.WarehouseId: SqlInt32.Null ));
            _sqlParameterList.Add(new SqlParameter("@LocName", string.IsNullOrEmpty(obj.LocName) ? SqlString.Null : obj.LocName));
            _sqlParameterList.Add(new SqlParameter("@LocType", string.IsNullOrEmpty(obj.LocType) ? SqlString.Null : obj.LocType));
            _sqlParameterList.Add(new SqlParameter("@Description", string.IsNullOrEmpty(obj.Description) ? SqlString.Null : obj.Description));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@IsActive", true));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_Location", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public WrapperLocation loadWarehouse()
        {
            _objWrapper = new WrapperLocation();
            _dt = new DataTable();
            _obj = new Location();
            try
            {
                _dt = getDataByParameter("loadWarehouse", _obj);
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

        public WrapperLocation GetLocationdata()
        {
            _objWrapper = new WrapperLocation();
            _dt = new DataTable();
            try
            {
                _obj = new Location();
                _obj.CreatedBy =UserSession.getUserName();
                _dt = getDataByParameter("GetAllData", _obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private WrapperLocation setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperLocation();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<Location>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperLocation Delete(Location obj)
        {
            _objWrapper = new WrapperLocation();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy =UserSession.getUserName();
                _dt = getDataByParameter("DeleteData", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        public WrapperLocation Save(Location obj)
        {
            _objWrapper = new WrapperLocation();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy =UserSession.getUserName();
                if (obj.LocId > 0)
                {
                    _dt = getDataByParameter("UpdateData", obj);
                }
                else
                {
                    _dt = getDataByParameter("SaveData", obj);
                }
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperLocation DuplicateCheck(Location obj)
        {
            _objWrapper = new WrapperLocation();
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
    }
}
