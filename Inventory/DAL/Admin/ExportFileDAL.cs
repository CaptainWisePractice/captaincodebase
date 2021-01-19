using Common;
using DAO.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Admin
{
   public class ExportFileDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private ExportFileWrapper _objWrapper = new ExportFileWrapper();
        private DataTable _dt = new DataTable();
        string error = string.Empty;


        #region "Export File Data" 
        public ExportFileWrapper ExportFile(string operation, string FromDate, string Todate)
        {
            _objWrapper = new ExportFileWrapper();
            _dt = new DataTable();
            try
            {
                _sqlParameterList = new List<SqlParameter>()
                {
                    new SqlParameter("@operation", operation),
                    new SqlParameter("@FromDate", FromDate),
                    new SqlParameter("@Todate", Todate)
                };
              _dt =  _accessManager.GetDataByDataTable("usp_ExportFileData", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);

                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listExportFile = _dt.DataTableToList<SalesReports>();
                }
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
