var count = 0, CheckOutController = "ItemCheckOut", Controller = "SaleApproved", CommonController = "Common";

$("span#sidebar-toggle").trigger('click');
$('#btnSave').val('Approved');

$("#ddlSalesInvoice").select2();
//$("#txtApprovalDate").datepicker({ dateFormat: 'dd-M-yy' });
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
    document.getElementById("txtApprovalDate").value = date;
}
loadSaleInvoice();

// Initial Load//

function loadSaleInvoice() {
    var obj = GetSaveObject();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadSaleInvoice",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
          
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlSalesInvoice'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

//// Dropdown load
function LoadDropdown(result, id) {
    debugger;
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
    }
    id.append(content);
    id.val('-1').trigger('change');
}

///// Create Object ////
function GetSaveObject() {

    let obj = {
        "SaleId": $('#ddlSalesInvoice').val() === '-1' ? '' : $('#ddlSalesInvoice').val(),
        "PaidAmount": $('#txtRecAmount').val(),
        "txtPrevDue": $('#txtDueAmount').val()
    }
    return obj;
}

$("#ddlSalesInvoice").change(function () {
    debugger;
    if ($('#ddlSalesInvoice').val() !== '-1') {
        Loaddatatable($(this).val());
    }
});

function Loaddatatable(sId) {
    var urlpath = base + Controller + "/GetDataBySaleId";

    let SaleId = sId;
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "SaleId": sId }),
        success: function (result) {
            debugger;
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.LstlistData);
            }
        }
    });
}

function BindTable(result) {
    debugger;
    $('#tbl tbody').empty();
    let content = '';
    if (result.length > 0) {

        $("#txtCustomer").val(result[0][0].CustomerName);
        $("#txtShipTo").val(result[0][0].Address);
        $("#txtShipVia").val(result[0][0].ShipVia);
        $("#txtSaleTye").val(result[0][0].SaleType);
        $("#txtDueDate").val(result[0][0].DueDate);
        $("#txtPaymentMode").val(result[0][0].PaymentMode);
        $("#txtSalesPerson").val(result[0][0].SalePerson);
        $("#txtComments").val(result[0][0].Comment);
        $("#txtTotal").val(result[0][0].TotalAmount);
        $("#txtPaid").val(result[0][0].PaidAmount);
        $("#txtDueAmount").val(result[0][0].PrevAmount);
       // $("#txtRecAmount").val(result[0].PaymentMode);
        var olist = result[1];
        $(olist).each(function (index, element) {
        //for (var i = 1; i < result.length; i++) {
            content += '<tr>' +
                '<td >' + (index + 1) + '</td>' +
                '<td >' + element.IHeadCode + '</td>' +
                '<td>' + element.IHeadName + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.SalePrice + '</td>' +
                '<td>' + element.Discount + '</td>' +
                '<td>' + element.Total + '</td>' +

        '</tr>';
        });
    }
    $('#tbl tbody').append(content);
}

$('#btnSave').on('click', function () {
    if ($("#ddlSalesInvoice").val() !=='-1') {
        var objList = GetSaveObject();
        var urlpath = base + Controller + "/Save";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "obj": objList }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: 'Approved Successfully', type: 'success' });
                    loadSaleInvoice();
                    ClearData();
                }
            }
        });
    }
    else {
        $.pnotify({ text: "Plz Select Sale Invoice..!", type: 'error' });
    }
});


$('#btnCancel').on('click', function () {
    var baseUrl = base + "Home/Index";
    window.location.href = baseUrl;
});

$('#btnRefresh').on('click', function () {
    ClearData();
});

function ClearData() {
    $("#ddlSalesInvoice").val('-1').trigger('change')
    $('#tbl tbody').empty();
    $("#txtCustomer").val('');
    $("#txtShipTo").val('');
    $("#txtShipVia").val('');
    $("#txtSaleTye").val('');
    $("#txtDueDate").val('');
    $("#txtPaymentMode").val('');
    $("#txtSalesPerson").val('');
    $("#txtComments").val('');
    $("#txtTotal").val('');
    $("#txtPaid").val('');
    $("#txtDueAmount").val('');
}
