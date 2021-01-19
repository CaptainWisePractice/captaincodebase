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
   public class AddUserDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperAddUser _objWrapper = new WrapperAddUser();
        List<ComboData> lstComboData = new List<ComboData>();
        private AddUser _obj = new AddUser();
        private DataTable _dt = new DataTable();
        List<AddUser> lstlist = new List<AddUser>();
        string error = string.Empty;

        #region "User Entry"
        private DataTable getDataByParameter(string operationName, AddUser obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@Id", Convert.ToInt32(obj.Id)));
            _sqlParameterList.Add(new SqlParameter("@WarehouseId", obj.WarehouseId > 0 ? obj.WarehouseId : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@FullName", string.IsNullOrEmpty(obj.FullName) ? SqlString.Null : obj.FullName));
            _sqlParameterList.Add(new SqlParameter("@UserName", string.IsNullOrEmpty(obj.UserName) ? SqlString.Null : obj.UserName));
            _sqlParameterList.Add(new SqlParameter("@Password", string.IsNullOrEmpty(obj.Password) ? SqlString.Null : obj.Password));
            _sqlParameterList.Add(new SqlParameter("@ConfirmPassword", string.IsNullOrEmpty(obj.ConfirmPassword) ? SqlString.Null : obj.ConfirmPassword));
            _sqlParameterList.Add(new SqlParameter("@Email", string.IsNullOrEmpty(obj.Email) ? SqlString.Null : obj.Email));
            _sqlParameterList.Add(new SqlParameter("@UserType", string.IsNullOrEmpty(obj.UserType) ? SqlString.Null : obj.UserType));
            _sqlParameterList.Add(new SqlParameter("@IsActive", obj.IsActive));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_User", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
        public WrapperAddUser Getdata()
        {
            _objWrapper = new WrapperAddUser();
            _dt = new DataTable();
            try
            {
                _obj = new AddUser();
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

        private WrapperAddUser setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperAddUser();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<AddUser>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperAddUser Delete(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
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
        public WrapperAddUser Save(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
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

        public WrapperAddUser DuplicateCheck(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
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

        public WrapperAddUser ChangePassword(AddUser obj)
        {
            _objWrapper = new WrapperAddUser();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                obj.Id = Convert.ToInt32(UserSession.GetUserId());
                obj.WarehouseId = 0;
                _dt = getDataByParameter("ChangePassword", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        #endregion

        #region "Menu Operation"
        public List<ComboData> LoadUserName()
        {
             lstComboData = new List<ComboData>();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", "LoadAllUser"));
            _dt = _accessManager.GetDataByDataTable("usp_UserPermission", _sqlParameterList, DbName.Inventory);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }


        public List<List<AddUser>> GetMenudata(int Id)
        {
            var _lstData = new List<List<AddUser>>();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", "LoadAllMenu"));
            _sqlParameterList.Add(new SqlParameter("@Id", Id));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
            var ds = _accessManager.GetDataByDataSet("usp_UserPermission", _sqlParameterList, DbName.Inventory);
            lstlist = ds.Tables[0].DataTableToList<AddUser>();
            _lstData.Add(lstlist);
            lstlist = ds.Tables[1].DataTableToList<AddUser>();
            _lstData.Add(lstlist);
            return _lstData;
        }

        public WrapperAddUser SaveMenuIdByUser(List<AddUser> obj, int userId)
        {
            _objWrapper = new WrapperAddUser();
            _dt = new DataTable();
            try
            {
                var sqlParalist = new List<SqlParameter>
                    {
                     new SqlParameter("@operationName","UserWiseDeleteMenu" ),
                     new SqlParameter("@Id",userId),
                     new SqlParameter("@CreateBy",UserSession.getUserName())
                    };
                _accessManager.SaveDataByStoreProcedure("usp_UserPermission", sqlParalist,
                     DbName.Inventory);

                foreach (var item in obj)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                     item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList.Add(new SqlParameter("@operationName", "SaveMenu"));
                    _sqlParameterList.Add(new SqlParameter("@Id", item.Id));
                    _sqlParameterList.Add(new SqlParameter("@MenuId", item.MenuId));
                    _sqlParameterList.Add(new SqlParameter("@CreateBy", item.CreatedBy));
                    _dt = _accessManager.GetDataByDataTable("usp_UserPermission", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    _objWrapper = setWrapper(_dt);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapper.Error = error;
                        return _objWrapper;
                    }
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        #endregion

        #region "Sale Edit Permission"

        public List<AddUser> LoadSaleFiledList(int userId)
        {
            lstlist = new List<AddUser>();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", "LoadSaleFiledList"));
            _sqlParameterList.Add(new SqlParameter("@userId", userId));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
            _dt = _accessManager.GetDataByDataTable("usp_SaleFiledUserPermission", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (_dt.Rows.Count > 0)
            {
                lstlist = _dt.DataTableToList<AddUser>();
            }
            return lstlist;
        }


        public WrapperAddUser SaveSaleFieldByUser(List<AddUser> obj, int userId)
        {
            _objWrapper = new WrapperAddUser();
            _dt = new DataTable();
            try
            {
                var sqlParalist = new List<SqlParameter>
                    {
                     new SqlParameter("@operationName","UserWiseDeleteList" ),
                     new SqlParameter("@userId",userId),
                     new SqlParameter("@CreateBy",UserSession.getUserName())
                    };
                _accessManager.SaveDataByStoreProcedure("usp_SaleFiledUserPermission", sqlParalist,DbName.Inventory);

                foreach (var item in obj)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                    item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList.Add(new SqlParameter("@operationName", "SaveSaleField"));
                    _sqlParameterList.Add(new SqlParameter("@userId", item.Id));
                    _sqlParameterList.Add(new SqlParameter("@SaleEditFieldId", item.MenuId));
                    _sqlParameterList.Add(new SqlParameter("@UserDeposit", item.UserDeposit));
                    _sqlParameterList.Add(new SqlParameter("@ManagerDiscount", item.ManagerDiscount));
                    _sqlParameterList.Add(new SqlParameter("@IsSpecialPrice", item.IsSpecialPrice));
                    _sqlParameterList.Add(new SqlParameter("@CreateBy", item.CreatedBy));
                    _dt = _accessManager.GetDataByDataTable("usp_SaleFiledUserPermission", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapper.Error = error;
                        return _objWrapper;
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

        #endregion

    }
}
