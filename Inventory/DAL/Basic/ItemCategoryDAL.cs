using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;
using DAO.Basic;
using System.Data;

namespace DAL.Basic
{
   public class ItemCategoryDAL
    {
        DbAccessManager accessManager = new DbAccessManager();
        CategoryWapper wrapper = new CategoryWapper();
        public string error;
        public bool SaveData(ItemCategory obj, string user, out string error)
        {
            List<SqlParameter> sqlParameterlist = new List<SqlParameter>
            {
                new SqlParameter("@CategotyId", obj.CategotyId),
                new SqlParameter("@ItmCategory", obj.ItmCategory),
                new SqlParameter("@ItemCode", obj.ItemCode),
                new SqlParameter("@IsActive", true),
                new SqlParameter("@CreateBy", user)
            };
            return accessManager.ExecuteNonQueryByStoreProcedure("usp_Insert_tbl_ItemCategory", sqlParameterlist,
                DbName.Inventory, user, out error);
        }

        public DataTable GetAllGridData(string User, out String error)
        {
            List<SqlParameter> sqlParameterlist = new List<SqlParameter>();
            try
            {
                return accessManager.GetDataByDataTable("usp_Select_tbl_ItemCategory", DbName.Inventory, User, out error);
            }
            catch (Exception objException)
            {
                throw objException;
            }

        }

        public bool Delete(int Id, string user, out string error)
        {
            List<SqlParameter> sqlParameterlist = new List<SqlParameter>
            {
                new SqlParameter("@CategotyId", Id),
                new SqlParameter("@CreateBy", user)
            };
            return accessManager.ExecuteNonQueryByStoreProcedure("usp_Delete_tbl_ItemCategory", sqlParameterlist,
                DbName.Inventory, user, out error);
        }

        public CategoryWapper DuplicateCheck(ItemCategory obj)
        {
            wrapper = new CategoryWapper();
            DataTable _dt = new DataTable();
            List<SqlParameter> sqlParameterlist = new List<SqlParameter>();
            try
            {
                sqlParameterlist.Add(new SqlParameter("@Name", obj.ItmCategory));
                sqlParameterlist.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
                _dt = accessManager.GetDataByDataTable("usp_DuplicateCheck_ItemCategory", sqlParameterlist, DbName.Inventory, UserSession.getUserName(), out error);
                wrapper.Save_error = _dt.Rows.Count > 0 ? "True" : "False";
            }
            catch (Exception ex)
            {
                wrapper.Error = ex.Message;
            }
            return wrapper;
        }
    }
}
