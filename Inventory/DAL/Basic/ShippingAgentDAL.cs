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
  public  class ShippingAgentDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperShippingAgent _objWrapper = new WrapperShippingAgent();
        private ShippingAgent _obj = new ShippingAgent();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperShippingAgent Getdata()
        {
            _objWrapper = new WrapperShippingAgent();
            _dt = new DataTable();
            try
            {
                _obj = new ShippingAgent();
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

        private WrapperShippingAgent setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperShippingAgent();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ShippingAgent>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperShippingAgent Delete(ShippingAgent obj)
        {
            _objWrapper = new WrapperShippingAgent();
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

        public WrapperShippingAgent Save(ShippingAgent obj)
        {
            _objWrapper = new WrapperShippingAgent();
            _dt = new DataTable();
            try
            {
                _dt = getDataByParameter("SaveUpdateData", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperShippingAgent DuplicateCheck(ShippingAgent obj)
        {
            _objWrapper = new WrapperShippingAgent();
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

        private DataTable getDataByParameter(string operationName, ShippingAgent obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@Id", string.IsNullOrEmpty(obj.Id) ? 0 : Convert.ToInt32(obj.Id)));
            _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
            _sqlParameterList.Add(new SqlParameter("@ContactNo", string.IsNullOrEmpty(obj.ContactNo) ? SqlString.Null : obj.ContactNo));
            _sqlParameterList.Add(new SqlParameter("@Email", string.IsNullOrEmpty(obj.Email) ? SqlString.Null : obj.Email));
            _sqlParameterList.Add(new SqlParameter("@CountryId", string.IsNullOrEmpty(obj.CountryId) ? 0 : Convert.ToInt32(obj.CountryId)));
            _sqlParameterList.Add(new SqlParameter("@ContactPerson", string.IsNullOrEmpty(obj.ContactPerson) ? SqlString.Null : obj.ContactPerson));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_ShippingAgent", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
    }
}
