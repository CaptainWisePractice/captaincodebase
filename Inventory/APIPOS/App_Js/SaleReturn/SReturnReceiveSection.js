var count = 0, Controller = "SReturnReceiveSection";

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
    var urlpath = base + Controller + "/GetReturnReceiveData";

    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate, "Status": type }),
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
                if (result.list.length > 0) {
                    var dropdown = '<option value="-1"> Select ----- </option>';
                    $.each(result.listComboData, function (i, obj) {
                        dropdown += '<option value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                    });
                    BindTable(result.list, dropdown);
                }
            }
        }
    });
}

function BindTable(data, dropdown) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data, dropdown);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1
    });
    $('.txtRecvDate').datepicker({ dateFormat: 'dd-M-yy' });
    $('.ddlLocation').select2();
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
            '<tr>' +
            '<th></th>' +
            '<th>Return Date</th>' +
            '<th>Return No</th>' +
            '<th>Invoice No</th>' +
            '<th>Customer Name</th>' +
            '<th>Item Code</th>' +
            '<th>Item Box Number</th>' +
            '<th>Req. Return Qty</th>' +
            '<th>Tracking No</th>' +
            '<th>Carrier Name</th>' +
            '<th>Recv. Qty</th>' +
            '<th>Return Location</th>' +
            '<th>Recv. Date</th>' +
            '<th>Print </th>' +
            '<th>Status</th>' +
             '</tr>' +
        '</thead>';
    return content;
}

           //'<th width="3%"></th>' +
           //'<th width="8%">Invoice No</th>' +
           //'<th width="12%">Customer Name</th>' +
           //'<th width="10%">Item Code</th>' +
           //'<th width="12%">Item Number</th>' +
           //'<th width="8%">Req. Qty</th>' +
           //'<th width="10%">Tracking No</th>' +
           //'<th width="10%">Carrier Name</th>' +
           //'<th width="8%">Recv. Qty</th>' +
           //'<th width="13%">Return Location</th>' +
           //'<th width="8%">Recv. Date</th>' +
           //'<th width="8%">Status</th>' +

function TableRow(result, Location) {
    $("#divTable").empty();
    let content = '';
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let color = '', btn = '';
            if (element.Status == "Awating")
            { color = 'background-color: red;'; btn = ''; }
            if (element.Status == "Complete")
            { color = 'background-color: green;'; btn = 'disabled'; }
            content += '<tr>' +
                '<td class="checkbox-column"><input type="checkbox" ' + btn + ' class="uniform checkList"><input type="hidden" value="' + element.SRReceiveDetailsId + '" /></td>' +
                '<td class ="returnDate">' + element.RequiedDate + '</td>' +
                '<td class ="returnNo"> RT-' + element.RefNo + '</td>' +
                '<td class ="SRReceiveId">' + element.InvoiceNo + '<input type="hidden" value="' + element.SRReceiveId + '" /></td>' +
                '<td class ="CustomerId">' + element.CustomerName + '<input type="hidden"  value="' + element.CustomerId + '" /></td>' +
                '<td class ="IHeadId">' + element.IHeadCode + '<input type="hidden"  value="' + element.IHeadId + '" /></td>' +
                '<td class ="ItemId">' + element.ItemNumber + '<input type="hidden" value="' + element.ItemId + '" /></td>' +
                '<td class ="ReqQty">' + element.SaleQty + '</td>' +
                '<td class ="TrakingNo">' + element.TrakingNumber + '<input type="hidden" value="' + element.ReturnAwatingBookId + '" /></td>' +
                '<td class ="CarrierName">' + element.DeliveryMethod + '</td>' +
                '<td><input type="text" id="txtRecvQty' + index + '"  Value="" style="width: 65px;" class="span12 txtRecvQty numeric" /></td>' +
                '<td><select id="ddlLocation' + index + '" class="span12 ddlLocation">' + Location + '</select></td>' +
                '<td><input type="text" id="txtRecvDate' + index + '"  Value="" style="width: 85px;" class="span12 txtRecvDate" /></td>' +
                '<td><span class="btn btn-medium btnPrint"><i class="icol-printer"></i></span>Print<input type="hidden" class="Id" value="' + element.RefNo + '"/></td>' +
                '<td style="' + color + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Status + '</td>' +

        '</tr>';
        });
    }

    return content;
}

$(document).off('click', '#btnSave').on('click', '#btnSave', function () {

    if (SaveValidation() == true) {
  
        var objList = GetSaveObject();
        var urlpath = base + Controller + "/SaveReturnReceive";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "objList": objList }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: 'Return Receive Successful', type: 'success' });
                    Loaddatatable('In');
                }
            }
        });

    }

});

function GetSaveObject() {
    let obj = [];
    $("#demo-dtable-04 tbody tr").each(function () {
        let checkItem = $(this).find('.checkList').is(':checked');
        if (checkItem) {
            let status = '';
            let reqqty = $(this).find('.ReqQty').text();
            let recvqrt = $(this).find('.txtRecvQty').val();
            if (parseInt(reqqty) == parseInt(recvqrt)) {
                status = 'Full';
            } else { status = 'Partial'; }
            let aobj = {
                "ReturnAwatingBookId": $(this).find('.TrakingNo input[type=hidden]').val(),
                "SRReceiveDetailsId": $(this).find('.checkbox-column input[type=hidden]').val(),
                "SRReceiveId": $(this).find('.SRReceiveId input[type=hidden]').val(),
                "CustomerId": $(this).find('.CustomerId input[type=hidden]').val(),
                "IHeadId": $(this).find('.IHeadId input[type=hidden]').val(),
                "ItemId": $(this).find('.ItemId input[type=hidden]').val(),
                "InvoiceNo": $(this).find('.SRReceiveId').text(),
                "SaleQty": $(this).find('.txtRecvQty').val(),
                "LocId": $(this).find('.ddlLocation option:selected').val(),
                "RequiedDate": $(this).find('.txtRecvDate').val(),
                "Status": status
            }
            obj.push(aobj);
        }
    });
    return obj;
}


$(document).on('change', ".ftDate", function () {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        Loaddatatable('From');
    }
});

$('#btnCancel').on('click', function () {
    window.history.back();
});

function SaveValidation() {
    let valid = true;
    var tCheck = $($("#demo-dtable-04 tbody tr").find('.checkList').is(':checked')).length;
    if (tCheck == 0) {
        $.pnotify({ text: 'Please Checked Sale Invoice. !', type: 'info' });
        valid = false;
        return valid;
    }

    $("#demo-dtable-04 tbody tr").each(function () {
        let checkItem = $(this).find('.checkList').is(':checked');
        if (checkItem) {
           
            let RecvQty = $(this).find('.txtRecvQty').val();
            let Location = $(this).find('.ddlLocation option:selected').val();

            if (RecvQty == "" || RecvQty == "0") {
                $(this).find('.txtRecvQty').focus();
                $.pnotify({ text: 'Input Recv. Qty ! ', type: 'info' });
                valid = false
                return valid;

            }
            if (Location == "-1" || Location == undefined) {
                $(this).find('.ddlLocation').focus();
                $.pnotify({ text: 'Select Location . ! ', type: 'info' });
                valid = false
                return valid;

            }

        }
    });
    return valid;
}

$(document).off('keyup', '.numeric').on("keyup", ".numeric", function (event) {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
    }
    else {
        if (Value.length > 0) {
            $(this).val('');
            $.pnotify({ text: 'Only Numeric Value', type: 'info' });
        }
        return;
    }
});

$(document).off('keyup', '.txtRecvQty').on('keyup', '.txtRecvQty', function () {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
        let tblRow = $(this).closest('tr');
        let indexNo = $(tblRow).index();
        let AmountAppliedValue = parseFloat($(this).val() == "" ? "0" : $(this).val());
        let AvailableQty = parseFloat($(tblRow).find('.ReqQty').text());
        if (AmountAppliedValue > AvailableQty) {
            $(this).val('');
            $.pnotify({ text: 'Available Quantity ' + AvailableQty, type: 'info' });
            return;
        }
    }
    else {
        if (Value.length > 0) {
            $(this).val('');
            notify('danger', 'Only Numeric Value');
        }
        return;
    }
});

$(document).on('click', '.btnPrint', function (parameters) {
   
    let invoiceNo = $(this).closest('td')[0].childNodes[2].value;
    var url = base + "SalesReturnReceive/ReturnRecPrintInvoice?InvoiceNo=" + invoiceNo;
    window.open(url, '_blank');
});
