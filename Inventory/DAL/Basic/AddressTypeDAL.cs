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
    public class AddressTypeDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperAddressType _objWrapper = new WrapperAddressType();
        private AddressType _obj = new AddressType();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperAddressType GetAlldata()
        {
            _objWrapper = new WrapperAddressType();
            _dt = new DataTable();
            try
            {
                _obj = new AddressType();
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

        private WrapperAddressType setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperAddressType();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<AddressType>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperAddressType Delete(AddressType obj)
        {
            _objWrapper = new WrapperAddressType();
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

        public WrapperAddressType Save(AddressType obj)
        {
            _objWrapper = new WrapperAddressType();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                if (obj.AddrTypeID > 0)
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

        private DataTable getDataByParameter(string operationName, AddressType obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@ID", Convert.ToInt32(obj.AddrTypeID)));
            _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_DeliveryMethod", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
    }
}
