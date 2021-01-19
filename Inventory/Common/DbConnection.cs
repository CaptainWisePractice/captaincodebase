using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
  public static class DbConnection
    {
        private const string UserId = "sa";

        private const string Password = "#System@2010Server";
        private const string DataSource = @"207.180.218.24";

        //private const string Password = "Admin1234";
        //private const string DataSource = @"SAYED-MIS\SQLSERVER2014";

        private static string GenerateString(string dbName)
        {

            string con = "";

            con = @"data source=" + DataSource + ";Initial Catalog=" + dbName + ";Integrated Security=false; User Id=" + UserId + "; password=" + Password + ";";
            return con;
        }
        public static string GetConnectionStringByDbName(string dbName)
        {
            return GenerateString(dbName);
        }
    }
}
