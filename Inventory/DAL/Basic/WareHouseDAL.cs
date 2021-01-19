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
    public class WareHouseDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperWareHouse _objWrapper = new WrapperWareHouse();
        private WareHouse _obj = new WareHouse();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperWareHouse GetWarehousedata()
        {
            _objWrapper = new WrapperWareHouse();
            _dt = new DataTable();
            try
            {
                _obj = new WareHouse();
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

        private WrapperWareHouse setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperWareHouse();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<WareHouse>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperWareHouse Delete(WareHouse obj)
        {
            _objWrapper = new WrapperWareHouse();
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

        public WrapperWareHouse Save(WareHouse obj)
        {
            _objWrapper = new WrapperWareHouse();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy =UserSession.getUserName();
                if (obj.WarehouseId > 0)
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

        private DataTable getDataByParameter(string operationName, WareHouse obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@WarehouseId", Convert.ToInt32(obj.WarehouseId)));
            _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
            _sqlParameterList.Add(new SqlParameter("@Description", string.IsNullOrEmpty(obj.Description) ? SqlString.Null : obj.Description));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null :obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@Address", string.IsNullOrEmpty(obj.Address) ? SqlString.Null : obj.Address));
            _sqlParameterList.Add(new SqlParameter("@City", string.IsNullOrEmpty(obj.City) ? SqlString.Null : obj.City));
            _sqlParameterList.Add(new SqlParameter("@PostCode", string.IsNullOrEmpty(obj.PostCode) ? SqlString.Null : obj.PostCode));
            _sqlParameterList.Add(new SqlParameter("@MobileNo", string.IsNullOrEmpty(obj.MobileNo) ? SqlString.Null : obj.MobileNo));

            _sqlParameterList.Add(new SqlParameter("@IsActive", true));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_Warehouse", _sqlParameterList,DbName.Inventory, obj.CreatedBy, out error);            
            return _dt;
        }

        public WrapperWareHouse DuplicateCheck(WareHouse obj)
        {
            _objWrapper = new WrapperWareHouse();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("DuplicateCheck", obj);
                _objWrapper.Save_error =_dt.Rows.Count > 0 ? "True" : "False";
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
    }

}
