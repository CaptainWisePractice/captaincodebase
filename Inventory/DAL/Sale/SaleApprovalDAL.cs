using Common;
using DAO.Sale;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Sale
{
   public class SaleApprovalDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSaleApproval _objWrapper = new WrapperSaleApproval();
        List<SaleApproval> _list = new List<SaleApproval>();
        private DataTable _dt = new DataTable();
        private SaleApproval _obj = new SaleApproval();
        string error = string.Empty;



        public WrapperSaleApproval loadSaleInvoice(SaleApproval _obj)
        {
            try
            {
                _dt = getDataByParameter("loadSaleInvoice", _obj);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listComboData = _dt.DataTableToList<ComboData>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;

        }

        public WrapperSaleApproval Save(SaleApproval _obj)
        {
            try
            {
                _dt = getDataByParameter("SaleApproval", _obj);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listComboData = _dt.DataTableToList<ComboData>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;

        }

        private DataTable getDataByParameter(string operationName, SaleApproval obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SaleId", string.IsNullOrEmpty(obj.SaleId) ? 0 : Convert.ToInt32(obj.SaleId)));
            _sqlParameterList.Add(new SqlParameter("@PaidAmount", string.IsNullOrEmpty(obj.PaidAmount) ? 0 : Convert.ToDecimal(obj.PaidAmount)));
            _sqlParameterList.Add(new SqlParameter("@PrevAmount", string.IsNullOrEmpty(obj.PrevAmount) ? 0 : Convert.ToDecimal(obj.PrevAmount)));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_SaleApproval", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }


        public List<List<SaleApproval>> GetDataBySaleId(string saleId)
        {
            var _lstData = new List<List<SaleApproval>>();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetDataBySaleId"),
                 new SqlParameter("@SaleId", Convert.ToInt32(saleId))
            };
            var ds = _accessManager.GetDataByDataSet("usp_SaleApproval", _sqlParameterList, DbName.Inventory);
            _list = ds.Tables[0].DataTableToList<SaleApproval>();
            _lstData.Add(_list);
            _list = ds.Tables[1].DataTableToList<SaleApproval>();
            _lstData.Add(_list);
            return _lstData;
        }



    }

}
