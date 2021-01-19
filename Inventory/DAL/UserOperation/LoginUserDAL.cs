using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.UserOperation
{
  public  class LoginUserDAL
    {
        List<ComboData> lstComboData = new List<ComboData>();
        List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        public WrapperListOfMenus _objWrapperListOfMenus = new WrapperListOfMenus();
        string error = string.Empty;
        private DataTable _dt = new DataTable();
        private DataSet _ds = new DataSet();
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        public DataTable UserLoginCheck(string userName, string password)
        {
                try
                {
                    _sqlParameterList = new List<SqlParameter>();
                    _sqlParameterList.Add(new SqlParameter("@userName", userName));
                    _sqlParameterList.Add(new SqlParameter("@password", password));
                    _dt = _accessManager.GetDataByDataTable("usp_UserInfo", _sqlParameterList, DbName.Inventory);
                }
                catch (Exception ex)
                {
                    throw ex;

                }
                finally
                {
                   // _accessManager.StopConnection();
                }
            return _dt;
        }
        public DataTable getParentMenu(string userName)
        {
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@userName", userName));
                _dt = _accessManager.GetDataByDataTable("usp_MenuOperation", _sqlParameterList, DbName.Inventory, userName, out error);
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                // _accessManager.StopConnection();
            }
            return _dt;
        }
        public WrapperListOfMenus loadFlatmenu( string menu)
        {
            _objWrapperListOfMenus = new WrapperListOfMenus();
            _ds = new DataSet();
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@operationName", menu));
                _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
                _sqlParameterList.Add(new SqlParameter("@OutletId", UserSession.GetBranchId()));
                _ds = _accessManager.GetDataByDataSet("usp_FlatMenuOperation", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
                _objWrapperListOfMenus = setWrapper(_ds.Tables[0]);
                if(_ds.Tables[1].Rows.Count > 0)
                {
                    _objWrapperListOfMenus.LstPreSale = _ds.Tables[1].DataTableToList<HomePopupModal>();
                }
                if (_ds.Tables[2].Rows.Count > 0)
                {
                    _objWrapperListOfMenus.LstLayby = _ds.Tables[2].DataTableToList<HomePopupModal>();
                }
            }
            catch (Exception ex)
            {
                _objWrapperListOfMenus.Error = ex.Message;
            }
            return _objWrapperListOfMenus;
        }
        private WrapperListOfMenus setWrapper(DataTable _dt)
        {
            _objWrapperListOfMenus = new WrapperListOfMenus();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapperListOfMenus.Error = error;
                return _objWrapperListOfMenus;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapperListOfMenus.ListMenu = _dt.DataTableToList<ListOfMenus>();
            }
            return _objWrapperListOfMenus;
        }

    }
}
