using DAO.Basic;
using System;

namespace DAO.Reports
{
    [Serializable]
    public class CustomerReports:Customer
    {
        public string FullName { get; set; }
    }
}
