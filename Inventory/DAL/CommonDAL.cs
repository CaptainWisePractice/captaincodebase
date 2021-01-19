using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class CommonDAL
    {
        List<ComboData> lstComboData = new List<ComboData>();
        List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private DataTable _dt = new DataTable();
        private CommonParameter _obj = new CommonParameter();
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        string error = string.Empty;
        public List<ComboData> loadAddressType()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadAddressType";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> GetTaxCode()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "GetTaxCode";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> GetPaymentTerms()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "GetPaymentTerms";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadPaymentMethod()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadPaymentMethod";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        private DataTable getDataByParameter(CommonParameter _obj)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", _obj.operationName));
            _sqlParameterList.Add(new SqlParameter("@ReportParentId", _obj.ReportParentId > 0 ? _obj.ReportParentId : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(_obj.IHeadId) ? SqlInt32.Null: Convert.ToInt32(_obj.IHeadId)));
            _sqlParameterList.Add(new SqlParameter("@SearchText", string.IsNullOrEmpty(_obj.SearchText) ? SqlString.Null : _obj.SearchText));
            _dt = _accessManager.GetDataByDataTable("usp_Common",_sqlParameterList, DbName.Inventory);
            return _dt;
        }

        public List<ComboData> loadReport(int reportParentId)
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadReport";
            _obj.ReportParentId = reportParentId;
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadSupplier()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadSupplier";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadSupplierWithCode()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadSupplierWithCode";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadManufacturer()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadManufacturer";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadLocation()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadLocation";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> loadLocationWithCode()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadLocationWithCode";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> loadLocationWithSite()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadLocationWithSite";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> loadCountry()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadCountry";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> loadItemHead()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadItemHead";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
       
        public List<ComboData> loadDesignation()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadDesignation";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> loadItemByIHeadId(string IHeadId)
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadItemByIHeadId";
            _obj.IHeadId = IHeadId;
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> loadTradingTerms()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadTradingTerms";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> loadSaleOutlet()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadSaleOutlet";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadWareHouse()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "LoadWareHouse";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }


        public List<ComboData> loadCheckOutCustomer()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadCheckOutCustomer";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public List<ComboData> loadAllCustomer()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadAllCustomer";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public List<ComboData> LoadWareHouseByHeadId(CommonParameter _obj)
        {
            lstComboData = new List<ComboData>();
            _obj.operationName = "LoadWareHouseByHeadId";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public WrapperAutoComplete GetItemHeadAutoComplete(CommonParameter obj)
        {
            _objWrapperauto = new WrapperAutoComplete();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.operationName = "GetItemHeadAutoComplete";
                _dt = getDataByParameter(obj);
                _objWrapperauto = setWrapper_auto(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return _objWrapperauto;
        }

        public List<ComboData> loadAllEmployee()
        {
            lstComboData = new List<ComboData>();
            _obj = new CommonParameter();
            _obj.operationName = "loadAllEmployee";
            _dt = getDataByParameter(_obj);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        private WrapperAutoComplete setWrapper_auto(DataTable _dt)
        {
            _objWrapperauto = new WrapperAutoComplete();
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


       
    }
}
