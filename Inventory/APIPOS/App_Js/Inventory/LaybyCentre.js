var count = 0, Controller = "LaybyCentre";

$("span#sidebar-toggle").trigger('click');
Loaddatatable();

function Loaddatatable() {
    var urlpath = base + Controller + "/GetLaybyData";
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
                $('#demo-dtable-04 tbody').empty();
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $('#demo-dtable-04 tbody').empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.list);
            }
        }
    });
}

function BindTable(result) {
    $('#demo-dtable-04 tbody').empty();
    let content = '';
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let color = '', date ='';
            color = 'background-color: red;'; btn = '';

            if (element.Comment == "Awating") {
                element.Comment = "Awaiting";
            }

            if (element.RequiedDate == null) {
                date = "";
            }
            else {
                date = element.RequiedDate;
            }
            content += '<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td>' + element.DueDate + '</td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + element.RefNo + '</td>' +
                '<td>' + element.CustomerName + '</td>' +
                '<td>' + element.City + '</td>' +
                '<td>' + element.PostalCode + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.Box + '</td>' +
                '<td>' + date + '</td>' +
                '<td style="' + color + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Comment + '</td>' +
               // '<td><input type="button" ' + btn + ' class="despatch" id="' + element.SaleId + '" style="width: 90px; ' + color + '" value="' + element.Comment + '" /></td>' +

        '</tr>';
        });
    }
    $('#demo-dtable-04 tbody').append(content);
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1,
        "bDestroy": true
    });
    //$('#demo-dtable-04').dataTable();
}

$('#btnCancel').on('click', function () {
    window.history.back();
});