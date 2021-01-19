using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DAL.HelpingData
{
  public static class ConvertDataTableToList
    {
        #region DataTable To List Convert
        public static List<T> DataTableToList<T>(this DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        private static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName && dr[column.ColumnName] != DBNull.Value)
                    {
                        if (pro.PropertyType == typeof(DateTime?))
                        {
                            pro.SetValue(obj, Convert.ToDateTime(dr[column.ColumnName]), null);
                        }
                        else
                        {
                            if (pro.PropertyType == typeof(Int64))
                            {
                                pro.SetValue(obj, Convert.ToInt64(dr[column.ColumnName]), null);
                            }
                            else
                            {
                                if (pro.PropertyType == typeof(Boolean))
                                {
                                    pro.SetValue(obj, Convert.ToBoolean(dr[column.ColumnName]), null);
                                }
                                else
                                {
                                    pro.SetValue(obj, dr[column.ColumnName], null);
                                }

                            }

                        }
                    }


                    else
                    {
                        continue;
                    }

                }
            }
            return obj;
        }
        #endregion
    }
}
