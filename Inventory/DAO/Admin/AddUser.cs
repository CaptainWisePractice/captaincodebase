using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Admin
{
   public class AddUser:CommonModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public int WarehouseId { get; set; }
        public string Warehouse { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Email { get; set; }
        public string Notes { get; set; }
        public string UserType { get; set; }

        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public string SaleField { get; set; }
        public decimal UserDeposit { get; set; }
        public decimal ManagerDiscount { get; set; }
        public bool IsSpecialPrice { get; set; }
    }
   public class WrapperAddUser
    {
        public List<AddUser> list { get; set; }
        public List<List<AddUser>> lstlist { get; set; }

        public List<ComboData> listComboData { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
