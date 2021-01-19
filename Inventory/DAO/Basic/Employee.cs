using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Basic
{
    public class Employee:Person
    {
        public int EmployeeId { get; set; }
        public string FullName { get; set; }
        public string EmployeeCode { get; set; }
        public string CardId { get; set; }
        public string EmployeeType { get; set; }
        public string Salutation { get; set; }
        public int DesignationId { get; set; }
        public string DesignationName { get; set; }
        public string FilePath { get; set; }
        public string FileUserName { get; set; }
        public List<Attachment> listAttachment { get; set; }
    }
    public class WrapperEmployee
    {
        public List<Employee> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public List<ComboData> listComboData { get; set; }
    }
}
