var count = 0, Controller = "ManualBookRegister", FreightController = "FreightDespatch";
$("span#sidebar-toggle").trigger('click');

Loaddatatable();

function Loaddatatable() {
    var urlpath = base + Controller + "/GetManualBookRegisterData";

    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
       // data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate, "type": type }),
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
            '<th >Booking Date</th>' +
            '<th >Invoice No</th>' +
            '<th >Ref. No</th>' +
            '<th >Customer Name</th>' +
            '<th >Suburb</th>' +
            '<th >Item Code</th>' +
            '<th >Qty</th>' +
            '<th >Box</th>' +
            '<th >Required Date</th>' +
            '<th >Delivery Date</th>' +
            '<th >Desp. By</th>' +
            '<th >Status</th>' +
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
            let color = '', btn = '', podlink = '', trcolor = '';
            if (element.Comment == "Despatched")
            { color = 'background-color: green;'; btn = 'disabled'; }
            else {
                element.Comment = "Awaiting";
                color = 'background-color: red;';
            }

            content += '<tr ' + trcolor + '>' +
               '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + element.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + element.DueDate + '</td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + element.RefNo + '</td>' +
                '<td>' + element.CustomerName + '</td>' +
                '<td>' + element.City + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.Box + '</td>' +
                '<td>' + element.RequiedDate + '</td>' +
                '<td>' + element.TrakingNumber + '</td>' +
                '<td>' + element.LocId + '</a></td>' +
                '<td style="' + color + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Comment + '</td>' +

        '</tr>';
        });
    }
    return content;

}

//$(document).on('change', ".ftDate", function () {
//    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
//        Loaddatatable('From');
//    }
//});


$(document).on('click', '.btnRedirect', function (parameters) {
    debugger;
    var invno = $(this).attr('data_InvoiceId');
    var url = base + "ManualBooking/ManualBooking?invNo=" + invno;
    window.open(url, '_blank');
});

