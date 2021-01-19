using Common;
using DAO.Admin;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Admin
{
   public class StoreCashDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        List<ComboData> lstComboData = new List<ComboData>();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperStoreCash _objWrapper = new WrapperStoreCash();
        private StoreCash _obj = new StoreCash();
        private DataTable _dt = new DataTable();
        string error = string.Empty;


        public WrapperStoreCash GetAllData()
        {
            _objWrapper = new WrapperStoreCash();
            _dt = new DataTable();
            _obj = new StoreCash();
            try
            {
                _dt = getDataByParameter("GetAllData", _obj);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.list = _dt.DataTableToList<StoreCash>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperStoreCash Save(StoreCash obj)
        {
            _objWrapper = new WrapperStoreCash();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("SaveUpdate", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperStoreCash Delete(StoreCash obj)
        {
            _objWrapper = new WrapperStoreCash();
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

        public WrapperStoreCash DuplicateCheck(StoreCash obj)
        {
            _objWrapper = new WrapperStoreCash();
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

        private DataTable getDataByParameter(string operationName, StoreCash obj)
        {
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@Id", obj.Id));
            _sqlParameterList.Add(new SqlParameter("@OutletId", obj.OutletId));
            _sqlParameterList.Add(new SqlParameter("@CashAmount", Convert.ToDecimal(obj.CashAmount)));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_StoreCash", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        private WrapperStoreCash setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperStoreCash();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<StoreCash>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
    }
}
