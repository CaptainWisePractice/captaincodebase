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
    public class SellingPriceSetupDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        List<ComboData> lstComboData = new List<ComboData>();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSellingPrice _objWrapper = new WrapperSellingPrice();
        private SellingPriceSetup _obj = new SellingPriceSetup();
        private DataTable _dt = new DataTable();
        string error = string.Empty;


        public WrapperSellingPrice loadItemHead()
        {
            _objWrapper = new WrapperSellingPrice();
            _dt = new DataTable();
            try
            {
                _dt = getDataByParameter("loadItemHead", _obj);
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
        public WrapperSellingPrice GetAllData()
        {
            _objWrapper = new WrapperSellingPrice();
            _dt = new DataTable();
            _obj = new SellingPriceSetup();
            try
            {
                _dt = getDataByParameter("GetAllData", _obj);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.list = _dt.DataTableToList<SellingPriceSetup>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperSellingPrice Save(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("SaveUpdate", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperSellingPrice Delete(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
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

        public WrapperSellingPrice DuplicateCheck(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
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

        private DataTable getDataByParameter(string operationName, SellingPriceSetup obj)
        {
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SellingPriceId", Convert.ToInt32(obj.SellingPriceId)));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", Convert.ToInt32(obj.IHeadId)));
            _sqlParameterList.Add(new SqlParameter("@Wholesale", string.IsNullOrEmpty(obj.Wholesale) ? 0 : Convert.ToDecimal(obj.Wholesale)));
            _sqlParameterList.Add(new SqlParameter("@Wholesale1", string.IsNullOrEmpty(obj.Offer1) ? 0 : Convert.ToDecimal(obj.Offer1)));
            _sqlParameterList.Add(new SqlParameter("@Wholesale2", string.IsNullOrEmpty(obj.Offer2) ? 0 : Convert.ToDecimal(obj.Offer2)));
            _sqlParameterList.Add(new SqlParameter("@Wholesale3", string.IsNullOrEmpty(obj.Offer3) ? 0 : Convert.ToDecimal(obj.Offer3)));
            _sqlParameterList.Add(new SqlParameter("@Retail", string.IsNullOrEmpty(obj.Retail) ? 0 : Convert.ToDecimal(obj.Retail)));
            _sqlParameterList.Add(new SqlParameter("@Special", string.IsNullOrEmpty(obj.Special) ? 0 : Convert.ToDecimal(obj.Special)));
            _sqlParameterList.Add(new SqlParameter("@Itemtype", string.IsNullOrEmpty(obj.Itemtype) ? SqlString.Null : obj.Itemtype));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_SellingPriceSetup", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        private WrapperSellingPrice setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperSellingPrice();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<SellingPriceSetup>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        #region
        public List<ComboData> loadPostPaidCustomer()
        {
            _objWrapper = new WrapperSellingPrice();
            _obj = new SellingPriceSetup();
            _obj.CreatedBy = UserSession.getUserName();
            _dt = getDataByParam("loadPostPaidCustomer", _obj);
            try
            {
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listComboData = _dt.DataTableToList<ComboData>();
                }

            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }

            return _objWrapper.listComboData;
        }

        public WrapperSellingPrice GetCustomerPriceData()
        {
            _objWrapper = new WrapperSellingPrice();
            _dt = new DataTable();
            _obj = new SellingPriceSetup();
            try
            {
                _dt = getDataByParam("GetAllData", _obj);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.list = _dt.DataTableToList<SellingPriceSetup>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperSellingPrice SaveCustomerPrice(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParam("SaveUpdate", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperSellingPrice DeleteCustomerPrice(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParam("DeleteData", obj);
                _objWrapper = setWrapper(_dt);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperSellingPrice DuplicateCheckCustomerPrice(SellingPriceSetup obj)
        {
            _objWrapper = new WrapperSellingPrice();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParam("DuplicateCheck", obj);
                _objWrapper.Save_error = _dt.Rows.Count > 0 ? "True" : "False";
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }


        private DataTable getDataByParam(string operationName, SellingPriceSetup _obj)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SellingPriceId", Convert.ToInt32(_obj.SellingPriceId)));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", string.IsNullOrEmpty(_obj.CustomerId) ? "0" : _obj.CustomerId));
            _sqlParameterList.Add(new SqlParameter("@PriceId", string.IsNullOrEmpty(_obj.PriceId) ? SqlString.Null : _obj.PriceId));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(_obj.FromDate) ? SqlString.Null : _obj.FromDate));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(_obj.ToDate) ? SqlString.Null : _obj.ToDate));
            _sqlParameterList.Add(new SqlParameter("@CreatedBy", string.IsNullOrEmpty(_obj.CreatedBy) ? SqlString.Null : _obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_CustomerPriceSet", _sqlParameterList, DbName.Inventory, _obj.CreatedBy, out error);
            return _dt;
        }

        #endregion

        public WrapperSellingPrice ExcelFileSave(List<SellingPriceSetup> obj)
        {
            _objWrapper = new WrapperSellingPrice();
            error = string.Empty;
            try
            {
                foreach (var itm in obj)
                {
                    if (!string.IsNullOrEmpty(itm.SellingPriceId))
                    {
                        _sqlParameterList = new List<SqlParameter>();
                        _sqlParameterList.Add(new SqlParameter("@operationName", "UpdateSellingPricefromExcel"));
                        _sqlParameterList.Add(new SqlParameter("@SellingPriceId", Convert.ToInt32(itm.SellingPriceId)));
                        _sqlParameterList.Add(new SqlParameter("@Wholesale", itm.Wholesale));
                        _sqlParameterList.Add(new SqlParameter("@Wholesale1", itm.Offer1));
                        _sqlParameterList.Add(new SqlParameter("@Wholesale2", itm.Offer2));
                        _sqlParameterList.Add(new SqlParameter("@Wholesale3", itm.Offer3));
                        _sqlParameterList.Add(new SqlParameter("@Special", itm.Special));
                        _sqlParameterList.Add(new SqlParameter("@Retail", itm.Retail));
                        _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
                        _accessManager.ExecuteNonQueryByStoreProcedure("usp_SellingPriceSetup", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
                        if (!string.IsNullOrEmpty(error))
                        {
                            _objWrapper.Error = error;
                            return _objWrapper;
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
    }
}
