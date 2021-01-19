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
    public class FOBPriceSetDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperFOBPriceSet _objWrapper = new WrapperFOBPriceSet();
        List<ComboData> lstComboData = new List<ComboData>();
        private FOBPriceSet _obj = new FOBPriceSet();
        private DataTable _dt = new DataTable();
        string error = string.Empty;

        public List<ComboData> getItemHead()
        {
            lstComboData = new List<ComboData>();
            _obj = new FOBPriceSet();
            _dt = getDataByParameter("loadItemHead", _obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public WrapperFOBPriceSet Save(FOBPriceSet obj)
        {
                _objWrapper = new WrapperFOBPriceSet();
                _dt = new DataTable();
                obj.CreatedBy = UserSession.getUserName();
               _dt = getDataByParameter("SaveData", obj);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.list = _dt.DataTableToList<FOBPriceSet>();
                }
                else
                {
                    _objWrapper.Error = "No data Available";
                    return _objWrapper;
                }
                return _objWrapper;
            }

        private DataTable getDataByParameter(string operation,FOBPriceSet obj)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", operation),
                 new SqlParameter("@IHeadId", obj.IHeadId),
                 new SqlParameter("@InitialPrice", obj.InitialPrice),
                 new SqlParameter("@Price", obj.Price),
                 new SqlParameter("@CreateBy",obj.CreatedBy)
            };
            _dt = _accessManager.GetDataByDataTable("usp_FOBPriceSet", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
    }
}
