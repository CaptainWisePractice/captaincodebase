using Common;
using DAO.Admin;
using DAO.Basic;
using DAO.Sale;
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
   public class ComboSetDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private ComboSetWrapper _objWrapper = new ComboSetWrapper();
        WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private ComboSet _obj = new ComboSet();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public ComboSetWrapper GetComboSetdata()
        {
            _objWrapper = new ComboSetWrapper();
            _dt = new DataTable();
            try
            {
                _obj = new ComboSet();
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

        public List<ComboSetDetails> GetComboSetdataById(ComboSet _obj)
        {
            List<ComboSetDetails> LstComboSetDetails = new List<ComboSetDetails>();
            _objWrapper = new ComboSetWrapper();
            _dt = new DataTable();
            try
            {
                _obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetComboSetdataById", _obj);
                var olist = _dt.DataTableToList<ComboSetDetails>();
                LstComboSetDetails = olist;
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return LstComboSetDetails;
        }

        public WrapperAutoComplete GetItemHeadAutoComplete(ComboSet _obj)
        {
            WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
            _dt = new DataTable();
            try
            {
                _obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetItemHeadAutoComplete", _obj);
                _objWrapperauto = setWrapper_auto_WrapperAutoComplete(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return _objWrapperauto;
        }

        private WrapperAutoComplete setWrapper_auto_WrapperAutoComplete(DataTable _dt)
        {
            WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapperauto.Error = error;
                return _objWrapperauto;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapperauto.ListAutoCpomplete = _dt.DataTableToList<AutoComplete>();
            }
            else
            {
                _objWrapperauto.Error = "No data Available";
                return _objWrapperauto;
            }
            return _objWrapperauto;
        }

        private ComboSetWrapper setWrapper(DataTable _dt)
        {
            _objWrapper = new ComboSetWrapper();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ComboSet>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public ComboSetWrapper Delete(ComboSet obj)
        {
            _objWrapper = new ComboSetWrapper();
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

        public ComboSetWrapper ComboItemDetailIdDelete(int DetsItemId)
        {
            string user = UserSession.getUserName();
            _objWrapper = new ComboSetWrapper();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@DetsItemId", DetsItemId),
                 new SqlParameter("@CreateBy",user)
            };
            _accessManager.ExecuteNonQueryByStoreProcedure("usp_ComboItemDetail_DeletebyId", _sqlParameterList, DbName.Inventory, user, out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            return _objWrapper;
        }

        public ComboSetWrapper Save(ComboSet obj)
        {
            _objWrapper = new ComboSetWrapper();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                error = string.Empty;

                DataTable dt = new DataTable();
                dt.Columns.Add("ComboSetDelailsId", typeof(Int32));
                dt.Columns.Add("IHeadId", typeof(Int32));
                dt.Columns.Add("Qty", typeof(Int32));
                dt.Columns.Add("ItemPrice", typeof(decimal));
                DataRow dtRow;
                foreach (var olist in obj.LstComboSetDetails)
                {
                    dtRow = dt.NewRow();
                    dtRow["ComboSetDelailsId"] = olist.ComboSetDelailsId;
                    dtRow["IHeadId"] = olist.IHeadId;
                    dtRow["Qty"] = olist.Qty;
                    dtRow["ItemPrice"] = olist.ItemPrice;
                    dt.Rows.Add(dtRow);
                }
                SqlParameter dataT = new SqlParameter("@dt", dt);
                dataT.SqlDbType = SqlDbType.Structured;
              
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@ComboSetId", Convert.ToInt32(obj.ComboSetId)));
                _sqlParameterList.Add(new SqlParameter("@ComboName", string.IsNullOrEmpty(obj.ComboName) ? SqlString.Null : obj.ComboName));
                _sqlParameterList.Add(new SqlParameter("@Description", string.IsNullOrEmpty(obj.Description) ? SqlString.Null : obj.Description));
                _sqlParameterList.Add(new SqlParameter("@IsActive", obj.IsActive));
                _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
                _sqlParameterList.Add(dataT);
                _dt = _accessManager.GetDataByDataTable("usp_ComboItemSet_InsertUpdate", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private DataTable InsertUpdateDataByParameter(string operationName, ComboSet obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@ComboSetId", Convert.ToInt32(obj.ComboSetId)));
            _sqlParameterList.Add(new SqlParameter("@ComboName", string.IsNullOrEmpty(obj.ComboName) ? SqlString.Null : obj.ComboName));
            _sqlParameterList.Add(new SqlParameter("@Description", string.IsNullOrEmpty(obj.Description) ? SqlString.Null : obj.Description));
            _sqlParameterList.Add(new SqlParameter("@IsActive", obj.IsActive));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_ComboItemSet", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        private DataTable getDataByParameter(string operationName, ComboSet obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@ComboSetId", Convert.ToInt32(obj.ComboSetId)));
            _sqlParameterList.Add(new SqlParameter("@ComboName", string.IsNullOrEmpty(obj.ComboName) ? SqlString.Null : obj.ComboName));
            _sqlParameterList.Add(new SqlParameter("@Description", string.IsNullOrEmpty(obj.Description) ? SqlString.Null : obj.Description));
            _sqlParameterList.Add(new SqlParameter("@IsActive", obj.IsActive));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_ComboItemSet", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public ComboSetWrapper DuplicateCheck(ComboSet obj)
        {
            _objWrapper = new ComboSetWrapper();
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
