using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Common
{
    public class DbAccessManager
    {

        DbTransaction _dbTransaction;
        Database _db;
        DbCommand _dbCommand;
        System.Data.Common.DbConnection _conn;
        IDataReader _dataReader;

        public DataTable GetDataByDataTableByTransection(string storeProcedure, List<SqlParameter> sqlParameterlist)
        {
            try
            {
                DataTable dataContain;
                _dbCommand = _db.GetStoredProcCommand(storeProcedure);
                _dbCommand.CommandTimeout = 120;
                _dbCommand.Parameters.Clear();
                _dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
                dataContain = _db.ExecuteDataSet(_dbCommand, _dbTransaction).Tables[0];
                _dbCommand.Parameters.Clear();
                _dbCommand.Dispose();
                return dataContain;
            }
            catch (Exception ex)
            {
                _dbTransaction.Dispose();
                _conn.Close();
                if (_dbCommand != null)
                {
                    _dbCommand.Dispose();
                }
                throw ex;
            }

        }

        public DataTable GetDataByDataTable(string v, object mEr)
        {
            throw new NotImplementedException();
        }

        public bool SaveDataByStoreProcedure(string storeProcedure, List<SqlParameter> sqlParameterlist, string dataBaseName)
        {
            try
            {
                return ExecuteNonQueryByStoreProcedure(storeProcedure, sqlParameterlist, dataBaseName);
            }
            catch (Exception ex)
            {
                return false;
                throw ex;
            }
        }

        public bool UpdateDataByStoreProcedure(string storeProcedure, List<SqlParameter> sqlParameterlist,
            string dataBaseName)
        {
            try
            {
                return ExecuteNonQueryByStoreProcedure(storeProcedure, sqlParameterlist, dataBaseName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool DeleteDataByStoreProcedure(string storeProcedure, List<SqlParameter> sqlParameterlist,
            string dataBaseName)
        {
            try
            {

                return ExecuteNonQueryByStoreProcedure(storeProcedure, sqlParameterlist, dataBaseName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private bool ExecuteNonQueryByStoreProcedure(string storeProcedure, List<SqlParameter> sqlParameterlist, string dataBaseName)
        {
            try
            {
                Database db = new Microsoft.Practices.
                     EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());

                if (db.ExecuteNonQuery(dbCommand) > 0)
                {
                    dbCommand.Parameters.Clear();
                    return true;
                }
                else
                {
                    dbCommand.Parameters.Clear();
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void StartConnection(string dataBaseName)
        {

            _db = new Microsoft.Practices.
                   EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
            _conn = _db.CreateConnection();
            if (_conn.State != ConnectionState.Open)
            {
                _conn.Open();
                _dbTransaction = _conn.BeginTransaction();
            }

        }
        public void StopConnection()
        {
            if (_conn.State == ConnectionState.Open)
            {
                if (_dbTransaction != null)
                {
                    _dbTransaction.Commit();
                    _dbTransaction.Dispose();
                }
                _dbCommand.Dispose();
                _conn.Close();
            }
        }

        public int SaveDataByStoreProcedureByTransection(string procedureName, List<SqlParameter> sqlParameterlist, string primaryKeyParameter)
        {
            try
            {
                return ExecuteNonQueryByStoreProcedureByTransection(procedureName, sqlParameterlist, primaryKeyParameter);
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public int SaveDataByStoreProcedure(string procedureName, List<SqlParameter> aSqlParameterlist, string primaryKeyParameter, string dataBaseName)
        {
            int pk = 0;
            try
            {
                StartConnection(dataBaseName);
                pk = SaveDataByStoreProcedureByTransection(procedureName, aSqlParameterlist, primaryKeyParameter);
                StopConnection();
            }
            catch (Exception ex)
            {
                StopConnection();
                pk = 0;

            }
            return pk;
        }
        public int SaveDataByStoreProcedureDetails(string procedureName, List<SqlParameter> aSqlParameterlist, string primaryKeyParameter, string dataBaseName)
        {
            int pk = 0;
            try
            {
                // StartConnection(DataBaseName);
                pk = SaveDataByStoreProcedureByTransection(procedureName, aSqlParameterlist, primaryKeyParameter);
                // StopConnection();
            }
            catch (Exception ex)
            {
                pk = 0;

            }
            return pk;
        }
        private int ExecuteNonQueryByStoreProcedureByTransection(string procedureName, List<SqlParameter> aSqlParameterlist, string primaryKeyParameter)
        {
            int pk = 0;
            try
            {

                _dbCommand = _db.GetStoredProcCommand(procedureName);
                _dbCommand.CommandTimeout = 1200;
                _dbCommand.Parameters.Clear();
                _dbCommand.Parameters.AddRange(aSqlParameterlist.ToArray());
                _db.AddOutParameter(_dbCommand, primaryKeyParameter, DbType.Int32, 20);
                if (_db.ExecuteNonQuery(_dbCommand, _dbTransaction) > 0)
                {
                    pk = int.Parse(_dbCommand.Parameters[primaryKeyParameter].Value.ToString());
                    _dbCommand.Parameters.Clear();

                }
                else
                {
                    _dbCommand.Parameters.Clear();

                }

                return pk;

            }
            catch (Exception ex)
            {
                _dbCommand.Parameters.Clear();
                _dbCommand.Dispose();
                if (_dbTransaction != null)
                {
                    _dbTransaction.Rollback();
                    _dbTransaction.Dispose();
                }
                _conn.Close();
                return pk;
            }
        }

        public int ExecuteNonQueryByStoreProcedureByTransection(string procedureName, List<SqlParameter> aSqlParameterlist, string dataBaseName, string primaryKeyParameter, string user, out string error)
        {
            int pk = 0;
            try
            {
                error = String.Empty;
                Database db = new Microsoft.Practices.
                    EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(procedureName);
                dbCommand.CommandTimeout = 1200;
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(aSqlParameterlist.ToArray());
                db.AddOutParameter(dbCommand, primaryKeyParameter, DbType.Int32, 20);
                if (db.ExecuteNonQuery(dbCommand, _dbTransaction) > 0)
                {
                    pk = int.Parse(dbCommand.Parameters[primaryKeyParameter].Value.ToString());
                    dbCommand.Parameters.Clear();
                    //pk = (int)dbCommand.ExecuteScalar();

                }
                else
                {
                    dbCommand.Parameters.Clear();

                }

                return pk;

            }
            catch (Exception ex)
            {
                string log = AddErrorLog(procedureName, aSqlParameterlist, ex.Message, user);
                try
                {
                    int logNum = Int32.Parse(log);
                    error = "Error occured, error log no=" + log;
                }
                catch (Exception e)
                {
                    error = log;
                }
                _dbCommand.Parameters.Clear();
                _dbCommand.Dispose();
                if (_dbTransaction != null)
                {
                    _dbTransaction.Rollback();
                    _dbTransaction.Dispose();
                }
                _conn.Close();
                return pk;
            }
        }
        public DataTable GetDataByDataTable(string storeProcedure, List<SqlParameter> sqlParameterlist, string dataBaseName)
        {
            try
            {
                DataTable dataContain = new DataTable();
                Database db = new Microsoft.Practices.
                                   EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dbCommand.CommandTimeout = 1200;
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
                dataContain = db.ExecuteDataSet(dbCommand).Tables[0];
                dbCommand.Parameters.Clear();
                return dataContain;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string AddErrorLog(string procedureName, List<SqlParameter> Params, string errorMsg, string user)
        {
            List<SqlParameter> sqlParameterlist = new List<SqlParameter>();
            string jsonParam = String.Empty;
            List<JsonObj> lJosn = new List<JsonObj>();
            if (Params != null)
            {
                foreach (SqlParameter sql in Params)
                {
                    JsonObj json = new JsonObj();
                    json.Name = sql.ParameterName;
                    if (sql.SqlValue == null)
                    {
                        json.Value = "NULL";
                    }
                    else
                    {
                        json.Value = sql.SqlValue.ToString();
                    }
                    lJosn.Add(json);
                }
                jsonParam = JsonConvert.SerializeObject(lJosn);
            }

            sqlParameterlist.Add(new SqlParameter("@SpName", procedureName));
            sqlParameterlist.Add(new SqlParameter("@ErrorMessage", errorMsg));
            sqlParameterlist.Add(new SqlParameter("@Parameters", jsonParam));
            sqlParameterlist.Add(new SqlParameter("@InsertBy", user));
            sqlParameterlist.Add(new SqlParameter("@ModuleName", "Inventory"));
            try
            {
                Database db = new Microsoft.Practices.EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(DbName.Inventory));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand("sp_InsertErrorLog");
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
                var dataContain = db.ExecuteDataSet(dbCommand).Tables[0];
                dbCommand.Parameters.Clear();
                if (errorMsg.IndexOf("PREVENT_DUPLICATE", StringComparison.OrdinalIgnoreCase) > -1)
                {
                    return "Duplicate Data Exist, Error Log No=" + dataContain.Rows[0][0].ToString();
                }
                else
                {
                    return dataContain.Rows[0][0].ToString();
                }

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        public DataTable GetDataByDataTable(string storeProcedure, List<SqlParameter> sqlParameterlist, string dataBaseName, string user, out string error)
        {
            DataTable dataContain = new DataTable();
            try
            {
                error = String.Empty;
                Database db = new Microsoft.Practices.EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));

                DbCommand dbCommand;

                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dbCommand.CommandTimeout = 1200;
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
                dataContain = db.ExecuteDataSet(dbCommand).Tables[0];
                dbCommand.Parameters.Clear();
                return dataContain;
            }
            catch (Exception ex)
            {
                string log = AddErrorLog(storeProcedure, sqlParameterlist, ex.Message, user);
                try
                {
                    int logNum = Int32.Parse(log);
                    error = "Error occured, error log no=" + log;
                }
                catch (Exception e)
                {
                    error = log;
                }
                return dataContain;
            }
        }

        public DataTable GetDataByDataTable(string storeProcedure, string dataBaseName, string user, out string error)
        {
            DataTable dataContain = new DataTable();
            try
            {
                error = String.Empty;
                Database db = new Microsoft.Practices.EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dataContain = db.ExecuteDataSet(dbCommand).Tables[0];
                dbCommand.Parameters.Clear();
                return dataContain;
            }
            catch (Exception ex)
            {
                string log = AddErrorLog(storeProcedure, null, ex.Message, user);
                try
                {
                    int logNum = Int32.Parse(log);
                    error = "Error occured, error log no=" + log;
                }
                catch (Exception e)
                {
                    error = log;
                }
                return dataContain;
            }
        }

        public bool ExecuteNonQueryByStoreProcedure(string storeProcedure, List<SqlParameter> sqlParameterlist, string dataBaseName, string user, out string error)
        {

            try
            {
                error = String.Empty;
                Database db = new Microsoft.Practices.
                     EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());

                if (db.ExecuteNonQuery(dbCommand) > 0)
                {
                    dbCommand.Parameters.Clear();
                    return true;
                }
                else
                {
                    dbCommand.Parameters.Clear();
                    return false;
                }
            }
            catch (Exception ex)
            {
                string log = AddErrorLog(storeProcedure, sqlParameterlist, ex.Message, user);
                try
                {
                    int logNum = Int32.Parse(log);
                    error = "Error occured, error log no=" + log;
                }
                catch (Exception e)
                {
                    error = log;
                }
                return false;
            }
        }
        public DataTable GetDataByDataTable(string storeProcedure, string dataBaseName)
        {
            try
            {
                DataTable dataContain = new DataTable();
                Database db = new Microsoft.Practices.
                                    EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dataContain = db.ExecuteDataSet(dbCommand).Tables[0];
                return dataContain;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet GetDataByDataSet(string storeProcedure, List<SqlParameter> sqlParameterlist, string dataBaseName)
        {
            try
            {
                DataSet ds = new DataSet();
                Database db = new Microsoft.Practices.
                                   EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());

                ds = db.ExecuteDataSet(dbCommand);
                dbCommand.Parameters.Clear();
                return ds;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet GetDataByDataSet(string StoreProcedure, List<SqlParameter> SqlParameterlist, string DataBaseName, string User, out string error)
        {
            error = String.Empty;
            DataSet ds = new DataSet();
            try
            {
                Database db = new Microsoft.Practices.
                                    EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(DataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(StoreProcedure);
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(SqlParameterlist.ToArray());

                ds = db.ExecuteDataSet(dbCommand);
                dbCommand.Parameters.Clear();
                return ds;
            }
            catch (Exception ex)
            {
                string log = AddErrorLog(StoreProcedure, SqlParameterlist, ex.Message, User);
                try
                {
                    int logNum = Int32.Parse(log);
                    error = "Error occured, error log no=" + log;
                }
                catch (Exception e)
                {
                    error = log;
                }
                return ds;
            }
        }
        public DataSet GetDataByDataSet(string storeProcedure, string dataBaseName)
        {
            try
            {
                Database db = new Microsoft.Practices.
                                    EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                return db.ExecuteDataSet(dbCommand);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public IDataReader GetDataByDataReader(string storeProcedure, List<SqlParameter> sqlParameterlist, string dataBaseName)
        {
            try
            {
                IDataReader dataReader;
                Database db = new Microsoft.Practices.
                                        EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dbCommand.Parameters.Clear();
                dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
                dataReader = db.ExecuteReader(dbCommand);
                dbCommand.Parameters.Clear();
                return dataReader;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IDataReader GetDataByDataReader(string storeProcedure, string dataBaseName)
        {
            try
            {
                IDataReader dataReader;
                Database db = new Microsoft.Practices.
                                        EnterpriseLibrary.Data.Sql.SqlDatabase(DbConnection.GetConnectionStringByDbName(dataBaseName));
                DbCommand dbCommand;
                dbCommand = db.GetStoredProcCommand(storeProcedure);
                dataReader = db.ExecuteReader(dbCommand);
                return dataReader;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int GetPrimaryKey(string primaryField, string tableName, string dataBaseName)
        {
            try
            {
                int pk = 0;

                List<SqlParameter> aSqlParameterlist = new List<SqlParameter>();
                aSqlParameterlist.Add(new SqlParameter("@PrimaryField", primaryField));
                aSqlParameterlist.Add(new SqlParameter("@TblName", tableName));

                DataTable dt = GetDataByDataTable("sp_PrimaryKeyGenerator", aSqlParameterlist, dataBaseName);
                if (dt.Rows.Count > 0)
                {
                    pk = Convert.ToInt32(dt.Rows[0][0].ToString());
                }

                return pk;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataTable ListToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);


            PropertyInfo[] props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in props)
            {

                dataTable.Columns.Add(prop.Name);
            }
            foreach (T item in items)
            {
                var values = new object[props.Length];
                for (int i = 0; i < props.Length; i++)
                {

                    values[i] = props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }

            return dataTable;
        }
        //}


       


    }
    public class JsonObj
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
