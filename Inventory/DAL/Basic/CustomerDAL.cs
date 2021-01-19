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
    public class CustomerDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperCustomer _objWrapper = new WrapperCustomer();
        private Customer _obj = new Customer();
        private DataSet _ds = new DataSet();
        string error = string.Empty;
        public WrapperCustomer GetCustomerdata()
        {
            _objWrapper = new WrapperCustomer();
            _ds = new DataSet();
            try
            {
                _obj = new Customer();
                _ds = getDataByParameter("GetAllData", _obj);
                _objWrapper = setWrapper(_ds);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        public WrapperCustomer GetCustomerNo()
        {
            _objWrapper = new WrapperCustomer();
            _ds = new DataSet();
            try
            {
                _obj = new Customer();
                _ds = getDataByParameter("GetCustomerCode", _obj);
                _objWrapper = setWrapper(_ds);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }
        private WrapperCustomer setWrapper(DataSet ds)
        {
            _objWrapper = new WrapperCustomer();
            _objWrapper.list = new List<Customer>();
            List<Customer> lst = new List<Customer>();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (ds.Tables[0].Rows.Count > 0)
            {
                lst = ds.Tables[0].DataTableToList<Customer>();
                _objWrapper.list = lst;
                if (ds.Tables.Count > 1)
                {
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        _objWrapper.list = new List<Customer>();
                        List<CustAddress> lstAddr = ds.Tables[1].DataTableToList<CustAddress>();
                        foreach (var item in lst)
                        {
							item.lstCustAddress = new List<CustAddress>();
                            foreach (var item2 in lstAddr)
                            {
                                if (item.CustomerId.Equals(item2.CustomerId))
                                {                                    
                                    item.lstCustAddress.Add(item2);                                    
                                }
                            }
							_objWrapper.list.Add(item);

                        }
                    }
                }
                
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperCustomer Delete(Customer obj)
        {
            _objWrapper = new WrapperCustomer();
            _ds = new DataSet();
            try
            {
                _ds = getDataByParameter("DeleteData", obj);
                _objWrapper = setWrapper(_ds);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperCustomer Save(Customer obj)
        {
            _objWrapper = new WrapperCustomer();
            _ds = new DataSet();
            try
            {
                if (obj.CustomerId > 0)
                {
                    _ds = getDataByParameter("UpdateData", obj);
                    if (obj.lstCustAddress.Count > 0)
                    {
                        foreach (var item in obj.lstCustAddress)
                        {
                            if (!string.IsNullOrEmpty(item.Address) || !string.IsNullOrEmpty(item.City) ||
                               !string.IsNullOrEmpty(item.PostalCode) || !string.IsNullOrEmpty(item.State))
                            {
                                item.CustomerId = obj.CustomerId;
                                item.CustCode = obj.CustCode;
                                bool saveCheck = saveCustAddress(item, obj.CreatedBy);
                            }
                        }
                    }
                    if (obj.listAttachment.Count>0)
                    {
                        foreach (var item in obj.listAttachment)
                        {
                            item.Id = obj.CustomerId;
                            item.CreateBy = obj.CreatedBy;
                            bool saveCheck = saveAttachment(item);
                        }
                    }
                    
                }
                else
                {
                    _ds = getDataByParameter("SaveData", obj);
                    if (obj.lstCustAddress.Count > 0)
                    {
                        foreach (var item in obj.lstCustAddress)
                        {
                            if (!string.IsNullOrEmpty(item.Address) || !string.IsNullOrEmpty(item.City) ||
                                !string.IsNullOrEmpty(item.PostalCode) || !string.IsNullOrEmpty(item.State) )
                            {
                                item.CustomerId = Convert.ToInt32(_ds.Tables[0].Rows[0]["CustomerId"].ToString());
                                item.CustCode = obj.CustCode;
                                bool saveCheck = saveCustAddress(item, obj.CreatedBy);
                            }
                            
                        }
                    }
                    if (obj.listAttachment.Count > 0)
                    {
                        foreach (var item in obj.listAttachment)
                        {
                            item.Id = Convert.ToInt32(_ds.Tables[0].Rows[0]["CustomerId"].ToString());
                            item.CreateBy = obj.CreatedBy;
                            bool saveCheck = saveAttachment(item);
                        }
                    }
                }
                _objWrapper = setWrapper(_ds);
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private bool saveCustAddress(CustAddress item,string User)
        {
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@CustomerId", item.CustomerId));
            _sqlParameterList.Add(new SqlParameter("@CustCode", item.CustCode));
            _sqlParameterList.Add(new SqlParameter("@AddrTypeID", item.AddrTypeID));
            _sqlParameterList.Add(new SqlParameter("@Address", item.Address));
            _sqlParameterList.Add(new SqlParameter("@City", item.City));
            _sqlParameterList.Add(new SqlParameter("@State", item.State));
            _sqlParameterList.Add(new SqlParameter("@PostalCode", item.PostalCode));
            _sqlParameterList.Add(new SqlParameter("@CountryID", item.CountryID));
            return _accessManager.ExecuteNonQueryByStoreProcedure("usp_CustomerAddress", _sqlParameterList, DbName.Inventory, User, out error);
        }

        private bool saveAttachment(Attachment item)
        {
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@Id", item.Id));
            _sqlParameterList.Add(new SqlParameter("@FileLocation", item.FileLocation));
            _sqlParameterList.Add(new SqlParameter("@FileNameSave", item.FileNameSave));
            _sqlParameterList.Add(new SqlParameter("@FileNameUser", item.FileNameUser));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", item.CreateBy));
            _sqlParameterList.Add(new SqlParameter("@GateWay", item.GateWay));
            return _accessManager.ExecuteNonQueryByStoreProcedure("usp_Attachment", _sqlParameterList, DbName.Inventory, item.CreateBy, out error);
        }

        //private DataTable getDataByParameter(string operationName, Customer obj)
        //{
        //    _dt = new DataTable();
        //    error = string.Empty;
        //    _sqlParameterList = new List<SqlParameter>();
        //    _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
        //    _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId));
        //    //_sqlParameterList.Add(new SqlParameter("@CustCode", string.IsNullOrEmpty(obj.CustCode) ? SqlString.Null : obj.CustCode));
        //    _sqlParameterList.Add(new SqlParameter("@FirstName", string.IsNullOrEmpty(obj.FirstName) ? SqlString.Null : obj.FirstName));
        //    _sqlParameterList.Add(new SqlParameter("@LastName", string.IsNullOrEmpty(obj.LastName) ? SqlString.Null : obj.LastName));
        //    _sqlParameterList.Add(new SqlParameter("@CompanyName", string.IsNullOrEmpty(obj.CompanyName) ? SqlString.Null : obj.CompanyName));
        //    _sqlParameterList.Add(new SqlParameter("@Department", string.IsNullOrEmpty(obj.Department) ? SqlString.Null : obj.Department));
        //    //_sqlParameterList.Add(new SqlParameter("@Addr1", string.IsNullOrEmpty(obj.Addr1) ? SqlString.Null : obj.Addr1));
        //    //_sqlParameterList.Add(new SqlParameter("@Addr2", string.IsNullOrEmpty(obj.Addr2) ? SqlString.Null : obj.Addr2));
        //    _sqlParameterList.Add(new SqlParameter("@MailStop", string.IsNullOrEmpty(obj.MailStop) ? SqlString.Null : obj.MailStop));
        //    _sqlParameterList.Add(new SqlParameter("@City", string.IsNullOrEmpty(obj.City) ? SqlString.Null : obj.City));
        //    _sqlParameterList.Add(new SqlParameter("@State", string.IsNullOrEmpty(obj.State) ? SqlString.Null : obj.State));
        //    _sqlParameterList.Add(new SqlParameter("@PostalCode", string.IsNullOrEmpty(obj.PostalCode) ? SqlString.Null : obj.PostalCode));
        //    _sqlParameterList.Add(new SqlParameter("@CountryID", obj.CountryID >0 ? Convert.ToInt32(obj.CountryID): SqlInt32.Null ));
        //    _sqlParameterList.Add(new SqlParameter("@Tel", string.IsNullOrEmpty(obj.Tel) ? SqlString.Null : obj.Tel));
        //    _sqlParameterList.Add(new SqlParameter("@Extension", string.IsNullOrEmpty(obj.Extension) ? SqlString.Null : obj.Extension));
        //    _sqlParameterList.Add(new SqlParameter("@Fax", string.IsNullOrEmpty(obj.Fax) ? SqlString.Null : obj.Fax));
        //    //_sqlParameterList.Add(new SqlParameter("@Mobile", string.IsNullOrEmpty(obj.Mobile) ? SqlString.Null : obj.Mobile));
        //    _sqlParameterList.Add(new SqlParameter("@HomeNo", string.IsNullOrEmpty(obj.HomeNo) ? SqlString.Null : obj.HomeNo));
        //    _sqlParameterList.Add(new SqlParameter("@Email", string.IsNullOrEmpty(obj.Email) ? SqlString.Null : obj.Email));
        //    //_sqlParameterList.Add(new SqlParameter("@AddrTypeID", obj.AddrTypeID > 0 ? Convert.ToInt32(obj.AddrTypeID):SqlInt32.Null));
        //    _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));            
        //    _sqlParameterList.Add(new SqlParameter("@IsActive", obj.IsActive));
        //    _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
        //    _dt = _accessManager.GetDataByDataTable("usp_Customer", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
        //    return _dt;
        //}

        private DataSet getDataByParameter(string operationName, Customer obj)
        {
            _ds = new DataSet();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@CustomerId", obj.CustomerId));
            _sqlParameterList.Add(new SqlParameter("@CustCode", string.IsNullOrEmpty(obj.CustCode) ? SqlString.Null : obj.CustCode));
            _sqlParameterList.Add(new SqlParameter("@Name", string.IsNullOrEmpty(obj.Name) ? SqlString.Null : obj.Name));
            _sqlParameterList.Add(new SqlParameter("@CardId", string.IsNullOrEmpty(obj.CardId) ? SqlString.Null : obj.CardId));
            _sqlParameterList.Add(new SqlParameter("@LastName", string.IsNullOrEmpty(obj.LastName) ? SqlString.Null : obj.LastName));
           // _sqlParameterList.Add(new SqlParameter("@ShipTo", string.IsNullOrEmpty(obj.ShipTo) ? SqlString.Null : obj.ShipTo));
            _sqlParameterList.Add(new SqlParameter("@Phone1", string.IsNullOrEmpty(obj.Phone1) ? SqlString.Null : obj.Phone1));
            _sqlParameterList.Add(new SqlParameter("@Phone2", string.IsNullOrEmpty(obj.Phone2) ? SqlString.Null : obj.Phone2));
            _sqlParameterList.Add(new SqlParameter("@Phone3", string.IsNullOrEmpty(obj.Phone3) ? SqlString.Null : obj.Phone3));
            _sqlParameterList.Add(new SqlParameter("@Designation", string.IsNullOrEmpty(obj.Designation) ? SqlString.Null : obj.Designation));
            //_sqlParameterList.Add(new SqlParameter("@State", string.IsNullOrEmpty(obj.State) ? SqlString.Null : obj.State));
            //_sqlParameterList.Add(new SqlParameter("@PostalCode", string.IsNullOrEmpty(obj.PostalCode) ? SqlString.Null : obj.PostalCode));
            //_sqlParameterList.Add(new SqlParameter("@CountryID", obj.CountryID > 0 ? Convert.ToInt32(obj.CountryID) : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@Website", string.IsNullOrEmpty(obj.Website) ? SqlString.Null : obj.Website));
            _sqlParameterList.Add(new SqlParameter("@Fax", string.IsNullOrEmpty(obj.Fax) ? SqlString.Null : obj.Fax));
            _sqlParameterList.Add(new SqlParameter("@Email", string.IsNullOrEmpty(obj.Email) ? SqlString.Null : obj.Email));
            _sqlParameterList.Add(new SqlParameter("@Contact", string.IsNullOrEmpty(obj.Contact) ? SqlString.Null : obj.Contact));
            _sqlParameterList.Add(new SqlParameter("@Salutation", string.IsNullOrEmpty(obj.Salutation) ? SqlString.Null : obj.Salutation));
            _sqlParameterList.Add(new SqlParameter("@InactiveCard", obj.InactiveCard));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _sqlParameterList.Add(new SqlParameter("@PrintedForm", string.IsNullOrEmpty(obj.PrintedForm) ? SqlString.Null : obj.PrintedForm));
            _sqlParameterList.Add(new SqlParameter("@InvoiceDelivery", string.IsNullOrEmpty(obj.InvoiceDelivery) ? SqlString.Null : obj.InvoiceDelivery));
            _sqlParameterList.Add(new SqlParameter("@ABNNo", string.IsNullOrEmpty(obj.ABNNo ) ? SqlString.Null : obj.ABNNo));
            _sqlParameterList.Add(new SqlParameter("@ABNBranchNo", obj.ABNBranchNo>0 ? obj.ABNBranchNo : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@TaxIdNo", string.IsNullOrEmpty(obj.TaxIdNo) ? SqlString.Null : obj.TaxIdNo));
            _sqlParameterList.Add(new SqlParameter("@GSTType", string.IsNullOrEmpty(obj.GSTType) ? SqlString.Null : obj.GSTType));
            _sqlParameterList.Add(new SqlParameter("@TxtId", obj.TxtId>0 ? obj.TxtId : SqlInt32.Null ));
            _sqlParameterList.Add(new SqlParameter("@FreightTaxCode", obj.FreightTaxCode>0 ? obj.FreightTaxCode : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@PayTermId", obj.PayTermId>0 ? obj.PayTermId : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@DiscountDays", obj.DiscountDays>0 ?  obj.DiscountDays : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@BalanceDueDays", obj.BalanceDueDays>0 ? obj.BalanceDueDays : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@DiscountEarlyPayment", obj.DiscountEarlyPayment>0 ?obj.DiscountEarlyPayment : SqlDecimal.Null));
            _sqlParameterList.Add(new SqlParameter("@MonthChargeLatePayment", obj.MonthChargeLatePayment>0 ?  obj.MonthChargeLatePayment : SqlDecimal.Null));
            _sqlParameterList.Add(new SqlParameter("@VolumeDiscount", obj.VolumeDiscount>0 ? obj.VolumeDiscount : SqlDecimal.Null));
            _sqlParameterList.Add(new SqlParameter("@PayMethodId", obj.PayMethodId>0 ?  obj.PayMethodId : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@CardNo", obj.CardNo>0 ? obj.CardNo : SqlInt32.Null));
            _sqlParameterList.Add(new SqlParameter("@NameofCard", string.IsNullOrEmpty(obj.NameofCard) ? SqlString.Null : obj.NameofCard));
            _sqlParameterList.Add(new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes));
            _sqlParameterList.Add(new SqlParameter("@ShippingAddressSame", obj.ShippingAddressSame));
            _ds = _accessManager.GetDataByDataSet("usp_Customer", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _ds;
        }
    }
}
