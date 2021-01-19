using Common;
using DAO.Purchase;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Purchase
{
    public class PurchaseReceiveDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperPurchaseReceive _objWrapper = new WrapperPurchaseReceive();
        private PurchaseReceive _obj = new PurchaseReceive();
        private DataTable _dt = new DataTable();
        string error = string.Empty;
        public WrapperPurchaseReceive GetPurchaseOrderData(PurchaseReceive obj)
        {
            _objWrapper = new WrapperPurchaseReceive();
            _dt = new DataTable();           
            _objWrapper.list = new List<PurchaseReceive>();
            error = string.Empty;
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = getparam("GetPurchaseOrderData", obj);
                _dt = _accessManager.GetDataByDataTable("usp_PurchaseReceive", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.list = _dt.DataTableToList<PurchaseReceive>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        public WrapperPurchaseReceive GetPurchaseOrderDataByPOMasterId(PurchaseReceive obj)
        {
            _objWrapper = new WrapperPurchaseReceive();
            DataSet ds = new DataSet();
            _objWrapper.list = new List<PurchaseReceive>();
            error = string.Empty;
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = getparam("GetPurchaseOrderDataByPOMasterId", obj);
                ds = _accessManager.GetDataByDataSet("usp_PurchaseReceive", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        _objWrapper.list = ds.Tables[0].DataTableToList<PurchaseReceive>();
                    }

                    if (ds.Tables[2].Rows.Count > 0)
                    {
                        _objWrapper.listComboData = ds.Tables[2].DataTableToList<ComboData>();
                    }
                    List<PurchaseReceiveDetails> lstDtl = ds.Tables[1].DataTableToList<PurchaseReceiveDetails>();
                    _objWrapper.list[0].lstDetails = lstDtl;
                }
                
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperPurchaseReceive Save(PurchaseReceive obj)
        {
            string POMasterId;
            _objWrapper = new WrapperPurchaseReceive();
            _dt = new DataTable();
            error = string.Empty;
            try
            {
                POMasterId = obj.POMasterId;
                obj.CreatedBy = UserSession.getUserName();
                _sqlParameterList = getparam("SaveData", obj);
                _dt = _accessManager.GetDataByDataTable("usp_PurchaseReceive", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (_dt.Rows.Count > 0)
                {
                    int POReceiveId =  Convert.ToInt32(_dt.Rows[0]["POReceiveId"].ToString());
                    foreach (var item in obj.lstDetails)
                    {
                        item.POReceiveId = POReceiveId;
                        item.CreatedBy = obj.CreatedBy;
                        item.POMasterId = Convert.ToInt32(POMasterId);
                        _sqlParameterList = getparamDetails(item,obj.ManufacturerId);
                        _accessManager.ExecuteNonQueryByStoreProcedure("usp_PurchaseReceiveDetails", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                        if (!string.IsNullOrEmpty(error))
                        {
                            _objWrapper.Error = error;
                            obj.POReceiveId = POReceiveId;
                            DeleteData(obj);
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

        private void DeleteData(PurchaseReceive obj)
        {
            _sqlParameterList = getparam("DeleteData", obj);
            _accessManager.ExecuteNonQueryByStoreProcedure("usp_PurchaseReceive", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);

        }

        private List<SqlParameter> getparam(string operationName, PurchaseReceive obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@POReceiveId", obj.POReceiveId > 0 ? Convert.ToInt32(obj.POReceiveId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@POMasterId", string.IsNullOrEmpty(obj.POMasterId) ? SqlInt32.Null : Convert.ToInt32(obj.POMasterId)));
            _sqlParameterList.Add(new SqlParameter("@ManufacturerId", obj.ManufacturerId > 0 ? Convert.ToInt32(obj.ManufacturerId) : SqlInt32.Null));
            
            _sqlParameterList.Add(new SqlParameter("@POQuantity", obj.POQuantity));
            _sqlParameterList.Add(new SqlParameter("@POReceiveNo", string.IsNullOrEmpty(obj.POReceiveNo) ? SqlString.Null : obj.POReceiveNo));
            _sqlParameterList.Add(new SqlParameter("@POReceiveDate", string.IsNullOrEmpty(obj.POReceiveDate) ? SqlString.Null : obj.POReceiveDate));
            _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(obj.FromDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.FromDate)));
            _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(obj.ToDate) ? SqlDateTime.Null : Convert.ToDateTime(obj.ToDate)));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            return _sqlParameterList;
        }
        private List<SqlParameter> getparamDetails(PurchaseReceiveDetails item,int ManufacturerId)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@POReceiveDetailsId", item.POReceiveDetailsId > 0 ? Convert.ToInt32(item.POReceiveDetailsId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@POReceiveId", item.POReceiveId > 0 ? Convert.ToInt32(item.POReceiveId) : SqlInt32.Null));            
            _sqlParameterList.Add(new SqlParameter("@PODetailId", item.PODetailId > 0 ? Convert.ToInt32(item.PODetailId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@POMasterId", item.POMasterId > 0 ? Convert.ToInt32(item.POMasterId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@ItemId", item.ItemId >0 ? Convert.ToInt32(item.ItemId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", item.IHeadId > 0 ? Convert.ToInt32(item.IHeadId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@POQuantity", item.POQuantity));
            _sqlParameterList.Add(new SqlParameter("@POReceiveQty", item.POReceiveQty));
            _sqlParameterList.Add(new SqlParameter("@LocId", item.LocId > 0 ? Convert.ToInt32(item.LocId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@LotNo", string.IsNullOrEmpty(item.LotNo) ? SqlString.Null : item.LotNo));
            _sqlParameterList.Add(new SqlParameter("@NewPrice", item.NewPrice));
            _sqlParameterList.Add(new SqlParameter("@ManufacturerId", ManufacturerId > 0 ? Convert.ToInt32(ManufacturerId) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(item.CreatedBy) ? SqlString.Null : item.CreatedBy));
            return _sqlParameterList;
        }
    }
}
