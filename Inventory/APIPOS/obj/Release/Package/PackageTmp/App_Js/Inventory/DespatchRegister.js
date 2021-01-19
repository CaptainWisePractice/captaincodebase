var count = 0, Controller = "DespatchRegister";

$("span#sidebar-toggle").trigger('click');
$('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
$('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
$('#txtTo').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
getDate();
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
   // document.getElementById("txtFrom").value = date;
    document.getElementById("txtTo").value = date;
}
Loaddatatable('In');

function Loaddatatable(type) {
    var urlpath = base + Controller + "/GettDespatchRegisterData";
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
    content = '<table id="demo-dtable-04" class="table table-striped table-bordered">' +
       '<thead>' +
            '<tr>' +
            ' <th>Invoice Date</th>'+
            '<th>Invoice No</th>'+
            '<th>Ref. No</th>'+
            '<th>Customer Name</th>'+
            '<th>Suburb</th>'+
            '<th>POSTCODE</th>'+
            '<th>Item Code</th>'+
            '<th>Qty</th>'+
            '<th>Delivery Method</th>'+
            '<th>Req. Des. Date</th>'+
             '<th>Tracking</th>'+
             '<th>Desp. By</th>'+
             '<th>Order Status</th>' +
             '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result) {
    $("#divTable").empty();
    let content = '';
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let color = '';
            if (element.Comment == 'Despatched') {
                color = 'background-color: green;';
            }
            else {
               // element.Comment = "Awaiting";
                color = 'background-color: red;';
            }
            content += '<tr>' +
                '<td>' + element.RequiedDate + '</td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + element.RefNo + '</td>' +
                '<td>' + element.CustomerName + '</td>' +
                '<td>' + element.City + '</td>' +
                '<td>' + element.PostalCode + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.IHeadId + '</td>' +
                '<td>' + element.DueDate + '</td>' +
                '<td>' + element.Box + '</td>' +
                '<td>' + element.CustomerId + '</td>' +
                '<td style="' + color + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Comment + '</td>' +
        '</tr>';
        });
    }
    return content;
   
}

$('#btnCancel').on('click', function () {
    window.history.back();
});


$(document).on('change', ".ftDate", function () {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        Loaddatatable('From');
    }
});