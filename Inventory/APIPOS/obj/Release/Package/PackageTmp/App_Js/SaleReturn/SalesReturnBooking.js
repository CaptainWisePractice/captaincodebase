var count = 0, Controller = "SalesReturnBooking";

$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {

    $('#btnRefresh').hide();
    $('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    $('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    $('#txtTo').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    getDate();
    $('#demo-dtable-04').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
    Loaddatatable();
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

function Loaddatatable() {
    var urlpath = base + Controller + "/GetReturnBookingData";

    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate }),
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
                    var ddlDelMethod = '<option value="-1"> Select ----- </option>';
                    $.each(result.listComboData, function (i, obj) {
                        ddlDelMethod += '<option value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                    });

                    var ddlWarehouse = '<option value="-1"> Select ----- </option>';
                    $.each(result.LstComboData, function (i, obj) {
                        ddlWarehouse += '<option value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                    });


                    BindTable(result.list, ddlDelMethod, ddlWarehouse);
                }
            }
        }
    });
}

function BindTable(data, ddlDelMethod, ddlWarehouse) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data, ddlDelMethod, ddlWarehouse);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1
    });
    $('.txtRequiedDate').datepicker({ dateFormat: 'dd-M-yy' });
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
            '<tr>' +
            '<th ></th>' +
            '<th >Date</th>' +
            '<th >Invoice No</th>' +
            '<th >Customer Name</th>' +
            '<th >Item Code</th>' +
            '<th >Item Number</th>' +
            '<th >Req Return Qty</th>' +
            '<th >Location</th>' +
            '<th >Carrier Name</th>' +
            '<th >Required Date</th>' +
            '<th >Tracking</th>' +
            '<th >Return By</th>' +
            '<th >Notes</th>' +
            '<th >Status</th>' +
             '</tr>' +
        '</thead>';
    return content;
}

//'<th width="4%"></th>' +
//          '<th width="8%">Invoice No</th>' +
//          '<th width="12%">Customer Name</th>' +
//          '<th width="10%">Item Code</th>' +
//          '<th width="12%">Item Number</th>' +
//          '<th width="10%">Req Return Qty</th>' +
//          '<th width="15%">Carrier Name</th>' +
//          '<th width="10%">Required Date</th>' +
//          '<th width="10%">Tracking</th>' +
//          '<th width="12%">Status</th>' +

function TableRow(result, DeliveryMethod, ddlWarehouse) {
    $("#divTable").empty();
    let content = '';
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let color = 'background-color: #0000FF;', btn = '';
            content += '<tr>' +
                '<td class="checkbox-column"><input type="checkbox" class="uniform checkList"><input type="hidden" value="' + element.SRReceiveDetailsId + '" /></td>' +
                '<td class ="date">' + element.RefNo + '</td>' +
                '<td class ="SRReceiveId">' + element.InvoiceNo + '<input type="hidden" value="' + element.SRReceiveId + '" /></td>' +
                '<td class ="CustomerId">' + element.CustomerName + '<input type="hidden"  value="' + element.CustomerId + '" /></td>' +
                '<td class ="IHeadId">' + element.IHeadCode + '<input type="hidden"  value="' + element.IHeadId + '" /></td>' +
                '<td class ="ItemId">' + element.ItemNumber + '<input type="hidden" value="' + element.ItemId + '" /></td>' +
                '<td class ="SaleQty">' + element.SaleQty + '</td>' +
                '<td><select id="ddlLocation' + index + '" class="span12 ddlLocation">' + ddlWarehouse + '</select></td>' +
                '<td><select id="ddlDeliveryMethod' + index + '" class="span12 ddlDeliveryMethod">' + DeliveryMethod + '</select></td>' +
                '<td><input type="text" id="txtRequiedDate' + index + '"  Value="" style="width: 90px;" class="span12 txtRequiedDate" /></td>' +
                '<td><input type="text" id="txtTrakingNo' + index + '"  Value="" style="width: 90px;" class="span12 txtTrakingNo" /></td>' +
                '<td><input type="text" id="txtRetrunBy' + index + '"  Value="" style="width: 90px;" class="span12 txtRetrunBy" /></td>' +
                '<td><input type="text" id="txtNotes' + index + '"  Value="" style="width: 140px;" class="span12 txtNotes" /></td>' +
                '<td>' + element.Status + '</td>' +

        '</tr>';
        });
    }

    return content;
}


$(document).off('click', '#btnSave').on('click', '#btnSave', function () {
   
    if (SaveValidation() == true) {
      
        var objList = GetSaveObject();
        var urlpath = base + Controller + "/SaveReturnAwating";
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
                    $.pnotify({ text: 'Booking Completed', type: 'success' });
                    Loaddatatable();
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
            let aobj = {
                "SRReceiveDetailsId": $(this).find('.checkbox-column input[type=hidden]').val(),
                "SRReceiveId": $(this).find('.SRReceiveId input[type=hidden]').val(),
                "CustomerId": $(this).find('.CustomerId input[type=hidden]').val(),
                "IHeadId": $(this).find('.IHeadId input[type=hidden]').val(),
                "ItemId": $(this).find('.ItemId input[type=hidden]').val(),
                "SaleQty": $(this).find('.SaleQty').text(),
                "InvoiceNo": $(this).find('.SRReceiveId').text(),
                "WarehouseId": $(this).find('.ddlLocation').val(),
                "DeliveryMethod": $(this).find('.ddlDeliveryMethod').val(),
                "RequiedDate": $(this).find('.txtRequiedDate').val(),
                "TrakingNumber": $(this).find('.txtTrakingNo').val(),
                "ReturnBy": $(this).find('.txtRetrunBy').val(),
                "Notes": $(this).find('.txtNotes').val()
            }
            obj.push(aobj);
        }
    });
    return obj;
}


$(document).on('change', ".ftDate", function () {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        Loaddatatable();
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
        var ArryLoc = [];
        if (checkItem) {
            let WarehouseId = $(this).find('.ddlLocation').val();
            if (WarehouseId == "-1" || WarehouseId == undefined) {
                $(this).find('.ddlLocation').focus();
                $.pnotify({ text: 'Select Location. ! ', type: 'info' });
                valid = false
                return valid;
            }

            let DeliveryMethod = $(this).find('.ddlDeliveryMethod').val();
            if (DeliveryMethod == "-1" || DeliveryMethod == undefined) {
                $(this).find('.ddlDeliveryMethod').focus();
                $.pnotify({ text: 'Select Carrier Name. ! ', type: 'info' });
                valid = false
                return valid;
            }

            let retrunBy = $(this).find('.txtRetrunBy').val();
            if (retrunBy == "" || retrunBy == undefined) {
                $(this).find('.txtRetrunBy').focus();
                $.pnotify({ text: 'Input Retrun By . ! ', type: 'info' });
                valid = false
                return valid;
            }
            var oj = {
                "Invoice": $(this).find('.SRReceiveId').text(),
                "WarehouseId" :WarehouseId
            }
            ArryLoc.push(oj);
        }
        if (ArryLoc.length > 0) {

        }
    });
    return valid;
}

$(document).off('change', '.checkList').on("change", ".checkList", function (event) {
    let chk = $(this).is(':checked');
    var inv = $(this).closest('tr').find('.SRReceiveId').text();
    var loc = $(this).closest('tr').find('.ddlLocation').val();
    var nLocId = '-1', counter = 0;
    if (chk) {
        $("#demo-dtable-04 tbody tr").each(function () {
            let checked = $(this).find('.checkList').is(':checked');
            let NewIno = $(this).find('.SRReceiveId').text();
            let NewLoc = $(this).find('.ddlLocation').val();
            if (checked) {
                if (inv == NewIno && NewLoc != '-1') {
                    nLocId = NewLoc;
                    counter = counter + 1;
                    return;
                }
            }
        });
        if (counter > 0) {
            $(this).closest('tr').find('.ddlLocation').val(nLocId).trigger('change');
            $(this).closest('tr').find('.ddlLocation').attr('disabled', true);
        }
    } else { $(this).closest('tr').find('.ddlLocation').val('-1').trigger('change'); $(this).closest('tr').find('.ddlLocation').attr('disabled', false); }

});
