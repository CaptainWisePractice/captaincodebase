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
    public class EmployeeDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperEmployee _objWrapper = new WrapperEmployee();
        private Employee _obj = new Employee();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperEmployee GetEmployeedata()
        {
            _objWrapper = new WrapperEmployee();
            _dt = new DataTable();
            try
            {
                _obj = new Employee();
                _dt = getDataByParameter("GetAllData", _obj);
                _objWrapper = setWrapper(_dt);
                
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        public WrapperEmployee GetEmployeeNo()
        {
            _objWrapper = new WrapperEmployee();
            _dt = new DataTable();
            try
            {
                _obj = new Employee();
                _dt = getDataByParameter("GetEmployeeCode", _obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        private WrapperEmployee setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperEmployee();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<Employee>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperEmployee Delete(Employee obj)
        {
            _objWrapper = new WrapperEmployee();
            _dt = new DataTable();
            try
            {
                if (obj.EmployeeId>0)
                {
                    _dt = getDataByParameter("DeleteData", obj);
                    _objWrapper = setWrapper(_dt);
                }
                else
                {
                    _objWrapper.Error = "Delete Fail";
                }
                
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperEmployee Save(Employee obj)
        {
            _objWrapper = new WrapperEmployee();
            _dt = new DataTable();
            try
            {
                if (obj.EmployeeId > 0)
                {
                    _dt = getDataByParameter("UpdateData", obj);
                    if (obj.listAttachment.Count > 0)
                    {
                        foreach (var item in obj.listAttachment)
                        {
                            item.Id = obj.EmployeeId;
                            item.CreateBy = obj.CreatedBy;
                            bool saveCheck = saveAttachment(item);
                        }
                    }

                }
                else
                {
                    _dt = getDataByParameter("SaveData", obj);
                    if (obj.listAttachment.Count > 0)
                    {
                        foreach (var item in obj.listAttachment)
                        {
                            item.Id = Convert.ToInt32(_dt.Rows[0]["EmployeeId"].ToString());
                            item.CreateBy = obj.CreatedBy;
                            bool saveCheck = saveAttachment(item);
                        }
                    }
                }
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private bool saveAttachment(Attachment item)
        {
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@Id", item.Id));
            _sqlParameterList.Add(new SqlParameter("@FileLocation", item.FileLocation));
            _sqlParameterList.Add(new SqlParameter("@FileNameSave", item.FileNameSave));
            _sqlParameterList.Add(new SqlParameter("@FileNameUser", item.FileNameUser));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", item.CreateBy));
            _sqlParameterList.Add(new SqlParameter("@GateWay", item.GateWay));
            bool saveOrNot = _accessManager.ExecuteNonQueryByStoreProcedure("usp_Attachment", _sqlParameterList, DbName.Inventory, item.CreateBy, out error);
            if (string.IsNullOrEmpty(error))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private DataTable getDataByParameter(string operationName, Employee obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@EmployeeId", obj.EmployeeId));
            _sqlParameterList.Add(new SqlParameter("@EmployeeCode", string.IsNullOrEmpty(obj.EmployeeCode) ? SqlString.Null : obj.EmployeeCode));
            _sqlParameterList.Add(new SqlParameter("@LastName", string.IsNullOrEmpty(obj.LastName) ? SqlString.Null : obj.LastName));
            _sqlParameterList.Add(new SqlParameter("@FirstName", string.IsNullOrEmpty(obj.FirstName) ? SqlString.Null : obj.FirstName));
            _sqlParameterList.Add(new SqlParameter("@CardId", string.IsNullOrEmpty(obj.CardId) ? SqlString.Null : obj.CardId));
            _sqlParameterList.Add(new SqlParameter("@Address", string.IsNullOrEmpty(obj.Address) ? SqlString.Null : obj.Address));
            _sqlParameterList.Add(new SqlParameter("@Phone1", string.IsNullOrEmpty(obj.Phone1) ? SqlString.Null : obj.Phone1));
            _sqlParameterList.Add(new SqlParameter("@Phone2", string.IsNullOrEmpty(obj.Phone2) ? SqlString.Null : obj.Phone2));
            _sqlParameterList.Add(new SqlParameter("@Phone3", string.IsNullOrEmpty(obj.Phone3) ? SqlString.Null : obj.Phone3));
            _sqlParameterList.Add(new SqlParameter("@City", string.IsNullOrEmpty(obj.City) ? SqlString.Null : obj.City));
            _sqlParameterList.Add(new SqlParameter("@State", string.IsNullOrEmpty(obj.State) ? SqlString.Null : obj.State));
            _sqlParameterList.Add(new SqlParameter("@PostalCode", string.IsNullOrEmpty(obj.PostalCode) ? SqlString.Null : obj.PostalCode));
            _sqlParameterList.Add(new SqlParameter("@CountryID", obj.CountryID > 0 ? Convert.ToInt32(obj.CountryID) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@DesignationId", obj.DesignationId > 0 ? Convert.ToInt32(obj.DesignationId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Website", string.IsNullOrEmpty(obj.Website) ? SqlString.Null : obj.Website));
            _sqlParameterList.Add(new SqlParameter("@Fax", string.IsNullOrEmpty(obj.Fax) ? SqlString.Null : obj.Fax));
            _sqlParameterList.Add(new SqlParameter("@Email", string.IsNullOrEmpty(obj.Email) ? SqlString.Null : obj.Email));
            _sqlParameterList.Add(new SqlParameter("@Salutation", string.IsNullOrEmpty(obj.Salutation) ? SqlString.Null : obj.Salutation));
            _sqlParameterList.Add(new SqlParameter("@IsActive", obj.IsActive));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_Employee", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
    }
}
