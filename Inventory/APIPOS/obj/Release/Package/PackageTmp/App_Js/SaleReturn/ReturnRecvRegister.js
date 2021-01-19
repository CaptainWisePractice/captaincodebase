var count = 0, Controller = "ReturnRecvRegister";
$("span#sidebar-toggle").trigger('click');

$(document).ready(function () {
   
    //  $('.date').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    $('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    $('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    $('#txtTo').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    getDate();
    $('#demo-dtable-04').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
    Loaddatatable('In');
});

function getDate() {

    var monthsArr = new Array();
    // store month names into our array
    monthsArr[0] = "Jan";
    monthsArr[1] = "Feb";
    monthsArr[2] = "Mar";
    monthsArr[3] = "Apr";
    monthsArr[4] = "May";
    monthsArr[5] = "Jun";
    monthsArr[6] = "Jul";
    monthsArr[7] = "Aug";
    monthsArr[8] = "Sep";
    monthsArr[9] = "Oct";
    monthsArr[10] = "Nov";
    monthsArr[11] = "Dec";

    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth();
    var year = todaydate.getFullYear();
    var date = day + "-" + monthsArr[month] + "-" + year;
    //  document.getElementById("txtFrom").value = date;
    document.getElementById("txtTo").value = date;
}

function Loaddatatable(type) {
    var urlpath = base + Controller + "/GetReturnRecvRegisterData";
    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate, "type": type }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $("#divTable").empty();
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $("#divTable").empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.list);
            }
        }
    });
}

function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1,
        "bDestroy": true
    });
}

function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
            '<tr>' +
            '<th ></th>' +
            '<th >Date</th>' +
            '<th >Invoice No</th>' +
            '<th >Return Number</th>' +
            '<th >Customer </th>' +
            '<th >Reference No</th>' +
            '<th >Print Return Form</th>' +
            '<th >Status</th>' +
             '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result) {
    $("#divTable").empty();
    let content = '';
    if (result != null) {
        if (result.length > 0) {
            var olist = result;
            $(olist).each(function (index, element) {
                let color = '', btn = '', podlink = '', trcolor = '';

                if (element.Status == "Awaiting Receive") {
                    color = 'background-color: yellow;';
                }
                if (element.Status == "Awaiting Booking")
                { color = 'background-color: red;'; }

                if (element.Status == "Complete")
                { color = 'background-color: green;'; }

                //else { color = 'background-color: red;'; }

                content += '<tr ' + trcolor + '>' +
                   '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + element.ItemNumber + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                    '<td>' + element.DueDate + '</td>' +
                    '<td>' + element.InvoiceNo + '</td>' +
                    '<td> RT-' + element.ItemNumber + '</td>' +
                    '<td>' + element.CustomerName + '</td>' +
                    '<td>' + element.RefNo + '</td>' +
                    '<td><span class="btn btn-medium btnPrint"><i class="icol-printer"></i></span>Print Form<input type="hidden" class="Id" value="' + element.ItemNumber + '"/></td>' +
                    '<td style="' + color + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Status + '</td>' +
            '</tr>';
            });
        }
    }
    return content;

}

$(document).on('change', ".ftDate", function () {
    if ($("#txtFrom").val() != "" && $("#txtTo").val() != "") {
        let f = $("#txtFrom").val();
        let t = $("#txtTo").val();
        var fdate = new Date(f);
        var tdate = new Date(t);
        var difference = tdate - fdate;
        if (difference >= 0) {
            Loaddatatable('From');
        } else {
            $.pnotify({ text: "To Date not correct.?", type: 'info' });
            $("#txtTo").val('');
            $("#txtTo").focus();
        }
       
    }
});

$(document).on('click', '.btnRedirect', function (parameters) {
    var invno = $(this).attr('data_InvoiceId');
    var url = base + "SalesReturnReceive/SalesReturnReceivedInfo?Invoice=" + invno + '&Type=Register';
    window.open(url, '_blank');
});

$(document).on('click', '.btnPrint', function (parameters) {
   
    let invoiceNo = $(this).closest('td')[0].childNodes[2].value;
    var url = base + "SalesReturnReceive/ReturnRecPrintInvoice?InvoiceNo=" + invoiceNo;
    window.open(url, '_blank');
});

