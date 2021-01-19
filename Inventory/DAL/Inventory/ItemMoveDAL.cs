using Common;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Inventory
{
  public  class ItemMoveDAL
    {
        List<ComboData> lstComboData = new List<ComboData>();
        List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private DataTable _dt = new DataTable();
        private CommonParameter _obj = new CommonParameter();
        WrapperItemMove _objWrapper = new WrapperItemMove();
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        string operationName = "";
        string error = string.Empty;

        //public List<ComboData> loadItemByHead(string headId)
        //{
        //    lstComboData = new List<ComboData>();
        //   operationName = "LoadItemByHeadId";
        //    _dt = getDataByParameter(operationName , headId,"");
        //    if (_dt.Rows.Count > 0)
        //    {
        //        lstComboData = _dt.DataTableToList<ComboData>();
        //    }
        //    return lstComboData;
        //}

        public WrapperItemMove loadItemByHead(string headId)
        {
            _objWrapper = new WrapperItemMove();
            DataSet ds = new DataSet();
            _objWrapper.list = new List<ItemMove>();
            error = string.Empty;
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@IHeadId", headId));
                ds = _accessManager.GetDataByDataSet("usp_ItemLocationMove", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
                if (!string.IsNullOrEmpty(error))
                {
                    _objWrapper.Error = error;
                    return _objWrapper;
                }
                if (ds.Tables[0].Rows.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        _objWrapper.list = ds.Tables[0].DataTableToList<ItemMove>();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        _objWrapper.listComboData = ds.Tables[1].DataTableToList<ComboData>();
                    }
                    if (ds.Tables[2].Rows.Count > 0)
                    {
                        _objWrapper.listToLocation = ds.Tables[2].DataTableToList<ComboData>();
                    }
                    if (ds.Tables[3].Rows.Count > 0)
                    {
                        _objWrapper.listLocationStock = ds.Tables[3].DataTableToList<ComboData>();
                    }
                }

            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public List<ComboData> loadLocationByItemId(string itemId)
        {
            lstComboData = new List<ComboData>();
            operationName = "loadLocationByItemId";
            _dt = getDataByParameter(operationName, itemId,"");
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }
        public DataTable ItemandLocationWiseStock(string itemId, string locId)
        {
            lstComboData = new List<ComboData>();
            operationName = "ItemandLocationWiseStock";
            _dt = getDataByParameter(operationName, itemId, locId);
            return _dt;
        }

        private DataTable getDataByParameter(string operationName, string Id, string locId)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@Id", string.IsNullOrEmpty(Id) ? "0" : Id));
            _sqlParameterList.Add(new SqlParameter("@locId", string.IsNullOrEmpty(locId) ? "0" : locId));
            _dt = _accessManager.GetDataByDataTable("usp_LoadItemByHeadIdOnlyStock", _sqlParameterList, DbName.Inventory);
            return _dt;
        }

        public WrapperItemMove Save(List<ItemMove> Lstobj)
        {
            WrapperItemMove _objWrapper = new WrapperItemMove();
            _dt = new DataTable();
            try
            {
                foreach (var item in Lstobj)
                {
                    item.CreatedBy = UserSession.getUserName();
                    _dt = getSaveDataByParameter(item);
                }
                _objWrapper._Result = _dt.Rows.Count.ToString();

            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private DataTable getSaveDataByParameter(ItemMove obj)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@IHeadId", obj.IHeadId));
            _sqlParameterList.Add(new SqlParameter("@ItemId", obj.ItemId));
            _sqlParameterList.Add(new SqlParameter("@FromLocationId", obj.FromLocationId));
            _sqlParameterList.Add(new SqlParameter("@ToLocationId", obj.ToLocationId));
            _sqlParameterList.Add(new SqlParameter("@MoveQty", obj.MoveQty));
            _sqlParameterList.Add(new SqlParameter("@CurStockId", obj.CurStockId));
            _sqlParameterList.Add(new SqlParameter("@Note", string.IsNullOrEmpty(obj.Note) ? "" : obj.Note));
            _sqlParameterList.Add(new SqlParameter("@CreatedBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_ItemLocationChange", _sqlParameterList, DbName.Inventory);
            return _dt;
        }

    }
}
