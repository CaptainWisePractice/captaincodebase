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
   public class CFAgentDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperCFAgent _objWrapper = new WrapperCFAgent();
        private CFAgent _obj = new CFAgent();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperCFAgent GetCFAgentdata()
        {
            _objWrapper = new WrapperCFAgent();
            _dt = new DataTable();
            try
            {
                _obj = new CFAgent();
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

        private WrapperCFAgent setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperCFAgent();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<CFAgent>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperCFAgent Delete(CFAgent obj)
        {
            _objWrapper = new WrapperCFAgent();
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

        public WrapperCFAgent Save(CFAgent obj)
        {
            _objWrapper = new WrapperCFAgent();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                if (obj.Id > 0)
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

        private DataTable getDataByParameter(string operationName, CFAgent obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@Id", Convert.ToInt32(obj.Id)));
            _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
            _sqlParameterList.Add(new SqlParameter("@Description", string.IsNullOrEmpty(obj.Description) ? SqlString.Null : obj.Description));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_CFAgent", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }


        public WrapperCFAgent DuplicateCheck(CFAgent obj)
        {
            _objWrapper = new WrapperCFAgent();
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
