var count = 0, CheckOutController = "ItemCheckOut", Controller = "ItemDispatch", CommonController = "Common", locList = [];;

$("span#sidebar-toggle").trigger('click');
$('#btnSave').val('Dispatch');

//$("#ddlSalesInvoice").select2();
//$("#txtApprovalDate").datepicker({ dateFormat: 'dd-M-yy' });
getDate();

var url_string = window.location.href;
var url = new URL(url_string);
var Id = url.searchParams.get("Id");
var Invoice = url.searchParams.get("Invoice");
//$("#hfCustomerId").val(Id);

$("#SalesInvoice").val(Invoice);
Loaddatatable(Id)

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
//loadSaleInvoice();

// Initial Load//

//function loadSaleInvoice() {
//    var obj = GetSaveObject();
//    $.ajax({
//        beforeSend: function () { $.blockUI(); },
//        complete: function () { $.unblockUI(); },
//        type: "POST",
//        url: base + Controller + "/loadSaleInvoice",
//        contentType: "application/json;charset=utf-8",
//        dataType: "JSON",
//        data: JSON.stringify({ "obj": obj }),
//        success: function (result) {

//            if (result.IsSessionOut != null) {
//                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
//                return false;
//            }
//            if (result.Error != null) {
//                $.pnotify({ text: result.Error, type: 'error' });
//                return false;
//            } else {
//                LoadDropdown(result.listComboData, $('#ddlSalesInvoice'));
//            }
//        },
//        error: function (a, b, c) {
//            $.pnotify({ text: 'Something Wrong', type: 'error' });
//        }
//    });
//}

//// Dropdown load
function LoadDropdown(result, id) {
    
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
    let obj = [];
    $("#tbl tr:gt(0)").each(function () {
        
        let aobj = {
            "IHeadId": $(this).children('td:eq(1)').find("input").val(),
            "LocId": $(this).children('td:eq(4)').find("select").val(),
            "SaleQty": $(this).children('td:eq(6)').find("input").val(),
            "SaleId": Id,
            "CustomerId": $("#hfCustomerId").val()
        }
        obj.push(aobj);
    });
    return obj;
}

//$("#ddlSalesInvoice").change(function () {
//    
//    if ($('#ddlSalesInvoice').val() !== '-1') {
//        Loaddatatable($(this).val());
//    }
//});

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
    
    $('#tbl tbody').empty();
    let content = '';
    if (result.length > 0) {

        $("#txtCustomer").val(result[0][0].CustomerName);
        $("#txtShipTo").val(result[0][0].Address);
        $("#txtShipVia").val(result[0][0].ShipVia);
        $("#hfCustomerId").val(result[0][0].CustomerId);
        var olist = result[1];
        $(olist).each(function (index, element) {
            //for (var i = 1; i < result.length; i++) {
            content += '<tr>' +
                '<td >'+ (index + 1) + '</td>' +
                '<td >'+ element.IHeadCode + '<input type="hidden" id="hfIHeadId' + index + '"  Value="' + element.IHeadId + '" class="span12 IHeadId"/></td>' +
                '<td>'+ element.IHeadName + '</td>' +
                '<td><input type="text" id="txtSaleQty' + index + '"  Value="' + element.SaleQty + '" class="span12 txtSaleQty" readonly/></td>' +
                '<td><select id="ddlLocation' + index + '" class="span12 ddlLocation">' + LoadLocationByheadId(element.IHeadId, index) + '</select></td>' +
                '<td><input type="text" id="txtStock' + index + '"  Value="" class="span12 txtStock" readonly/></td>' +
                '<td><input type="text" id="txtDisQty' + index + '"  Value="" class="span12 txtDisQty"/></td>' +
        '</tr>';
        });
    }
    $('#tbl tbody').append(content);
    $('.ddlLocation').select2();
}

function LoadLocationByheadId(headId, index) {

    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CheckOutController + "/loadLocationByHeadId",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "headId": headId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlLocation' + index));
                locList = [];
                locList = result.listComboData;
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });

}

$(document).off('change', '.ddlLocation').on('change', '.ddlLocation', function () {
    if ($(this).val() !== '-1') {
        
        var stockqty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var qty = $(this).closest("tr")[0].cells[6].childNodes[0].id;
        var locId = $(this).val();
        var imlst = $.grep(locList,
          function (x) {

              if ('' + x.Value + '' === locId) {
                  return x;
              }
          });

        $('#' + stockqty).val(imlst[0].ValueStr);
        imlst = [];
        $('#' + qty).val('');
    }
});

$('#btnSave').on('click', function () {
    if (validationADD() == true && OtherValidation() == true) {

        var objList = GetSaveObject();
        var urlpath = base + Controller + "/Save";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({"objList": objList }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                    ClearData();
                }
            }
        });
    }
    else {
        $.pnotify({ text: "Plz Fillup Red Marks Field", type: 'error' });
    }
});

function validationADD() {
    var isresult = true;
    $("#tbl tr:gt(0)").each(function () {
        var locId = $(this).children('td:eq(4)').find("select").val();
        var qty = $(this).children('td:eq(6)').find("input").val();
        if (locId === "undefined" || locId === "-1") {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if (qty === "undefined" || qty === "" || qty === "0") {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

    });
    if (isresult)
        isresult = true;
    else {
        isresult = false;

    }
    return isresult;

}

function OtherValidation() {
    let valid = true;
    if ($('#SalesInvoice').val() == '') {
        $.pnotify({ text: 'Sale Invoice Requried', type: 'error' });
        valid = false;
        return valid;
    }
    return valid;
}


$('#btnCancel').on('click', function () {
    window.history.back();
});

$('#btnRefresh').on('click', function () {
    ClearData();
});

function ClearData() {
    $("#SalesInvoice").val('');
    $('#tbl tbody').empty();
    $("#txtCustomer").val('');
    $("#txtShipTo").val('');
    $("#txtShipVia").val('');
    $("#hfCustomerId").val('');
   
}

$(document).off('click', '#btnFind').on('click', '#btnFind', function () {
    var baseUrl = base + 'DespatchCenter/DespatchCenter';
    window.location.href = baseUrl;
});

$(document).off('change', '.txtDisQty').on('change', '.txtDisQty', function () {
    if ($(this).val() !== '' || $(this).val() !== '0') {
        
        var stockqty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var sellqty = $(this).closest("tr")[0].cells[3].childNodes[0].id;
        let b = parseInt($(this).val());
        let aa = parseInt($('#' + stockqty).val());
        let sell = parseInt($('#' + sellqty).val());
        
        if (aa < b) {
            $.pnotify({ text: 'Must Less Or Equal to Stock Qty.!', type: 'error' });
            $(this).val('');
        }

        if (sell != b) {
            $.pnotify({ text: 'Must Be Equal to Sell Qty.!', type: 'error' });
            $(this).val('');
        }

    }
});
