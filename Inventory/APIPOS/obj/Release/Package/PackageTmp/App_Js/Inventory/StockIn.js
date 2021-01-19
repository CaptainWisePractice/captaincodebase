var Controller = "StockIn";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click'); var manId = '', itmList = [];

$(document).ready(function () {
    loadItemHead();
});
///// Initial Load Method Start////
function loadItemHead() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadItemHead",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            manId = '';
            LoadDropdown(result, $('#ddlItemHead'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
//// Dropdown load default method
function LoadDropdown(result, id) {
    $(id).get(0).options.length = 0;
    if (id.attr('id') == 'ddlItemHead') {
        itmList = [];
        itmList = result;
    }
    var content = '<option  value="-1">-- Select --</option>';
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
    }
    $(id).append(content);

    if (id.attr('class') == 'span12 SupplierID') {
        if (manId != '0') {
            $(id).val(manId).trigger('change');
        }
    }
    $(id).select2();
}
var ItemHead = $('#ddlItemHead');
ItemHead.on('change', function ()
{
    $('#tbl tbody').empty();
    let ItemHeadValue = ItemHead.val();
    if (ItemHeadValue != '-1') {
        var imlst = $.grep(itmList,
           function (x) {
               if ('' + x.Value + '' === $('#ddlItemHead').val()) {
                   return x;
               }
           });
        manId = imlst[0].Value_New;
        imlst = [];
        let obj = {
            "IHeadId": ItemHeadValue
        }
        var urlpath = base + Controller + "/GetDataByItemHead";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "obj": obj }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {                    
                    $.pnotify({ text: result.Error, type: 'error' });
                    $('#txtOldPrice').val('');
                    $('#txtAvgPrice').val('');
                    return false;
                } else {
                    $('#txtOldPrice').val(result.list[0].OldPrice);
                    $('#txtAvgPrice').val(result.list[0].AvgPrice);
                    BindTable(result.list);
                    loadtableDropdown();
                }
            }
        });
    }
});
function BindTable(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td class="checkbox-column"><input type="checkbox" value="' + element.ItemId + '" class="uniform ItemId" ></td>' +
                '<td class="ItemCode">' + element.ItemCode + '</td>' +
                '<td class="ItemName">' + element.ItemName + '</td>' +
                '<td class="InHandQty">' + element.InHandQty + '</td>' +
                '<td><input type="text" id="txtQty' + index + '" class="span12 numeric Qty"/></td>' +
                '<td><select id="ddlLocId' + index + '"" class="span12 LocId"></select></td>' +
                '<td><select id="ddlSupplierID' + index + '"" class="span12 SupplierID"></select></td>' +
                '<td><input type="text" id="txtLotNo' + index + '" class="span12 LotNo"/></td>' +
        '</tr>';
        });
    }
    $('#tbl tbody').append(content);   
}
function loadtableDropdown() {
    loadLocation();
    loadSupplier();
}
function loadLocation() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadLocationWithSite",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('.LocId'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function loadSupplier() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadManufacturer",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('.SupplierID'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

///// Start Button Click ////
$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        var obj = GetSaveObject();
        var urlpath = base + Controller + "/Save";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "obj": obj }),
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
});
$('#btnRefresh').on('click', function () {
    ClearData();
});
$('#btnCancel').on('click', function () {
    window.history.back();
});
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#ddlItemHead').val() == '-1') {
        $('#s2id_ddlItemHead').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Item Head Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlItemHead').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    var total = $($("#tbl tbody tr").find('.ItemId').is(':checked')).length;
    if (total == 0) {
        $.pnotify({ text: 'Please Check Your Item ', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $("#tbl tbody tr").each(function () {
            if ($(this).find('.ItemId').is(':checked')) {
              
                let qty = parseFloat($(this).find('.Qty').val() == "" ? "0" : $(this).find('.Qty').val());
                let idQty = $(this).closest("tr")[0].cells[4].childNodes[0].id;
                let id = $(this).closest("tr")[0].cells[5].childNodes[0].id;
                let lot = $(this).find('.LotNo').val();
                let a = id.substr(5);
                let loc = $("#" + a).val();
                if (qty > 0) {
                    $('#' + idQty).css({ 'border': '1px solid #aaa' });
                }
                else {
                    $.pnotify({ text: 'Input Qty. ', type: 'error' });
                    $('#' + idQty).css({ 'border': '1px solid red' });
                    valid = false;
                    return valid;
                }

                if (loc == '-1') {
                    $('#' + id).find(".select2-choice").css({ 'border': '1px solid red' });
                    $.pnotify({ text: 'Select Location. ', type: 'error' });
                    valid = false;
                    return valid;
                } else { $('#' + id).find(".select2-choice").css({ 'border': '1px solid #aaa' }); }

                if (lot == "") {
                    $(this).find('.LotNo').css({ 'border': '1px solid red' });
                    $.pnotify({ text: 'Input Lot. ', type: 'error' });
                    valid = false;
                    return valid;
                } else { $(this).find('.LotNo').css({ 'border': '1px solid #aaa' }); }
            }

        });
    }

    if ($('#txtNotes').val() == '') {
        $('#txtNotes').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Input Notes', type: 'error' });
        valid = false;
        return valid;
    } else { $('#txtNotes').css({ 'border': '1px solid #aaa' }); }

    return valid;
}
///// Validation End ////
$(document).off('keyup', '.numeric').on("keyup", ".numeric", function (event) {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
    }
    else {
        if (Value.length > 0) {
            $(this).val('');
            $.pnotify({ text: 'Only Numeric Value ', type: 'error' });            
        }
        return;
    }
});
///// Create Object ////
function GetSaveObject() {
    let obj = [];
    let NewPrice = $('#txtNewPrice').val() == "" ? "0" : $('#txtNewPrice').val();
    let OldPrice = $('#txtOldPrice').val();
    let notes = $('#txtNotes').val();
    $("#tbl tbody tr").each(function () {
        let checkItem = $(this).find('.ItemId').is(':checked');
        if (checkItem) {
            let aobj = {
                "IHeadId": $('#ddlItemHead option:selected').val(),
                "ItemId": $(this).find('.ItemId').val(),
                "Qty": $(this).find('.Qty').val(),
                "LocId": $(this).find('.LocId option:selected').val(),
                "SupplierID": $(this).find('.SupplierID option:selected').val() == "-1" ? "0" : $(this).find('.SupplierID option:selected').val(),
                "LotNo": $(this).find('.LotNo').val(),
                "NewPrice": NewPrice,
                "OldPrice": OldPrice,
                "Notes": notes
            }
            obj.push(aobj);
        }
    });
    return obj;
}
///// End Object ////

///// Clear Data Start ////
function ClearData() {
    $('#ddlItemHead').val('-1').trigger('change');
    $('#txtOldPrice').val('');
    $('#txtNewPrice').val('');
    $('#txtAvgPrice').val('');
    $($('.uniform-checker').children()[0]).removeClass('uniform-checked');
    $('#txtNotes').val('');
}
///// Clear Data Start ////