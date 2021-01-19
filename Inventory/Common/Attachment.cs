using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class Attachment
    {
        public int AttachId { get; set; }
        public string DocName { get; set; }
        public int DocTypeId { get; set; }
        public int Id { get; set; }
        public string FileLocation { get; set; }
        public string FileNameSave { get; set; }
        public string FileNameUser { get; set; }
        public string CreateBy { get; set; }
        public string GateWay { get; set; }
    }
}
