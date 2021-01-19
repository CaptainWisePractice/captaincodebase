using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAO.Basic;
using Common;
using System.Data.SqlClient;
using System.Data;
using System.Data.SqlTypes;

namespace DAL.Basic
{
    public class SupplierDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSupplier _objWrapper = new WrapperSupplier();
        private Supplier _obj = new Supplier();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperSupplier GetSupplierdata()
        {
            _objWrapper = new WrapperSupplier();
            _dt = new DataTable();
            try
            {
                _obj = new Supplier();
                _obj.CreatedBy = "Admin";
                _dt = getDataByParameter("GetAllData", _obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        public WrapperSupplier Save(Supplier obj)
        {
            _objWrapper = new WrapperSupplier();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = "Admin";
                if (obj.SupplierID > 0)
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

        public WrapperSupplier Delete(Supplier obj)
        {
            _objWrapper = new WrapperSupplier();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = "Admin";
                _dt = getDataByParameter("DeleteData", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        private WrapperSupplier setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperSupplier();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<Supplier>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        private DataTable getDataByParameter(string operationName, Supplier obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SupplierID", obj.SupplierID));
            //_sqlParameterList.Add(new SqlParameter("@SupCode", string.IsNullOrEmpty(obj.SupCode) ? SqlString.Null : obj.SupCode));
            _sqlParameterList.Add(new SqlParameter("@FirstName", string.IsNullOrEmpty(obj.FirstName) ? SqlString.Null : obj.FirstName));
            _sqlParameterList.Add(new SqlParameter("@LastName", string.IsNullOrEmpty(obj.LastName) ? SqlString.Null : obj.LastName));
            //_sqlParameterList.Add(new SqlParameter("@Addr1", string.IsNullOrEmpty(obj.Addr1) ? SqlString.Null : obj.Addr1));
            //_sqlParameterList.Add(new SqlParameter("@Addr2", string.IsNullOrEmpty(obj.Addr2) ? SqlString.Null : obj.Addr2));
            _sqlParameterList.Add(new SqlParameter("@MailStop", string.IsNullOrEmpty(obj.MailStop) ? SqlString.Null : obj.MailStop));
            _sqlParameterList.Add(new SqlParameter("@City", string.IsNullOrEmpty(obj.City) ? SqlString.Null : obj.City));
            _sqlParameterList.Add(new SqlParameter("@State", string.IsNullOrEmpty(obj.State) ? SqlString.Null : obj.State));
            _sqlParameterList.Add(new SqlParameter("@PostalCode", string.IsNullOrEmpty(obj.PostalCode) ? SqlString.Null : obj.PostalCode));
            _sqlParameterList.Add(new SqlParameter("@CountryID", obj.CountryID > 0 ? Convert.ToInt32(obj.CountryID) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Tel", string.IsNullOrEmpty(obj.Tel) ? SqlString.Null : obj.Tel));
            _sqlParameterList.Add(new SqlParameter("@Fax", string.IsNullOrEmpty(obj.Fax) ? SqlString.Null : obj.Fax));          
            _sqlParameterList.Add(new SqlParameter("@Email", string.IsNullOrEmpty(obj.Email) ? SqlString.Null : obj.Email));
            _sqlParameterList.Add(new SqlParameter("@Website", string.IsNullOrEmpty(obj.Website) ? SqlString.Null : obj.Website));
            //_sqlParameterList.Add(new SqlParameter("@AddrTypeID", Convert.ToInt32(obj.AddrTypeID)));
            _sqlParameterList.Add(new SqlParameter("@ContPerName", string.IsNullOrEmpty(obj.ContPerName) ? SqlString.Null : obj.ContPerName));
            _sqlParameterList.Add(new SqlParameter("@ContPerExtension", string.IsNullOrEmpty(obj.ContPerExtension) ? SqlString.Null : obj.ContPerExtension));
            _sqlParameterList.Add(new SqlParameter("@ContPerPhone", string.IsNullOrEmpty(obj.ContPerPhone) ? SqlString.Null : obj.ContPerPhone));
            _sqlParameterList.Add(new SqlParameter("@ContPerMobile", string.IsNullOrEmpty(obj.ContPerMobile) ? SqlString.Null : obj.ContPerMobile));
            _sqlParameterList.Add(new SqlParameter("@ContPerFax", string.IsNullOrEmpty(obj.ContPerFax) ? SqlString.Null : obj.ContPerFax));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@IsActive", obj.IsActive));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_Supplier", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
    }
}
