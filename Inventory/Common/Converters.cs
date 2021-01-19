using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class Converters
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

        #region Convert DataTableToArrayList
        public static ArrayList ToArrayList(DataTable dt, string ValueText, string DisplayText)
        {
            ArrayList arr = new ArrayList();
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow item in dt.Rows)
                {
                    var obj = new
                    {
                        Value = item[ValueText].ToString(),
                        Text = item[DisplayText].ToString(),
                    };
                    arr.Add(obj);
                }
            }
            return arr;
        }

        #endregion

        #region Convert List to DataTable

        public static DataTable ToDataTable<T>(List<T> iList)
        {
            DataTable dataTable = new DataTable();
            PropertyDescriptorCollection propertyDescriptorCollection =
                TypeDescriptor.GetProperties(typeof(T));
            for (int i = 0; i < propertyDescriptorCollection.Count; i++)
            {
                PropertyDescriptor propertyDescriptor = propertyDescriptorCollection[i];
                Type type = propertyDescriptor.PropertyType;

                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                    type = Nullable.GetUnderlyingType(type);


                dataTable.Columns.Add(propertyDescriptor.Name, type);
            }
            object[] values = new object[propertyDescriptorCollection.Count];
            foreach (T iListItem in iList)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = propertyDescriptorCollection[i].GetValue(iListItem);

                }
                dataTable.Rows.Add(values);
            }
            return dataTable;
        }
        #endregion

        #region Convert List to DataSet
        public static DataSet ToDataSet<T>(List<T> iList)
        {
            DataSet ds = new DataSet();
            var dataTable = new DataTable();
            PropertyDescriptorCollection propertyDescriptorCollection =
                TypeDescriptor.GetProperties(typeof(T));
            for (int i = 0; i < propertyDescriptorCollection.Count; i++)
            {
                PropertyDescriptor propertyDescriptor = propertyDescriptorCollection[i];
                Type type = propertyDescriptor.PropertyType;

                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                    type = Nullable.GetUnderlyingType(type);
                dataTable.Columns.Add(propertyDescriptor.Name, type);
            }
            object[] values = new object[propertyDescriptorCollection.Count];
            foreach (T iListItem in iList)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = propertyDescriptorCollection[i].GetValue(iListItem);

                }
                dataTable.Rows.Add(values);
            }

            ds.Tables.Add(dataTable);
            return ds;
        }
        #endregion
    }
}
