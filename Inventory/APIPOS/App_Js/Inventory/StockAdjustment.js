var Controller = "StockAdjustment";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    $('.select2').select2();
    loadItemHead();
});
function loadItemHead() {
    $.ajax({
        type: "POST",
        url: base + CommonController + "/loadItemHead",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
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
    var content = '<option  value="-1">-- Select --</option>';
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
    }
    $(id).append(content);
    $(id).select2();
}
$('#ddlItemHead').on('change', function () {
    ClearItemHeadData();
    let selectedValue = $(this).val();
    if (selectedValue != '-1') {
        var urlpath = base + Controller + "/GetDataByItemCode";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "ItemCode": selectedValue }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                }
                else if (result.list != null) {
                    if (result.list.length > 0) {
                        BindTable(result.list);
                    }
                }
            }
        });
    }
    else {
        $('#tbl tbody').empty();
    }
    
});
function ClearItemHeadData() {
    $('#tbl tbody').empty();
}

function BindTable(result) {
    let content = '';
    $('#tbl tbody').empty();
    if (result != undefined) {
        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td class="checkbox-column"><input type="checkbox" value="' + element.CurStockId + '"  class="uniform CurStockId" ></td>' +
                '<td class="ItemName">' + element.ItemName + '</td>' +
                '<td class="LocName">' + element.LocName + '</td>' +
                '<td class="ManufactureName">' + element.ManufactureName + '</td>' +
                '<td class="CurQty">' + element.CurQty + '</td>' +
                '<td><input type="text" id="txtQty' + index + '" class="span12 numeric Qty"/></td>' +
                '<td><input type="text" id="txtPhy' + index + '" class="span12" Readonly/></td>' +
        '</tr>';
        });
    }
    $('#tbl tbody').append(content);
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
        $.pnotify({ text: 'Item Head Requried', type: 'error' });
        valid = false;
        return valid;
    }
    if ($('#ddlItemCode').val() == '-1') {
        $.pnotify({ text: 'Item Code Requried', type: 'error' });
        valid = false;
        return valid;
    }
    var total = $($("#tbl tbody tr").find('.CurStockId').is(':checked')).length;
    if (total == 0) {
        $.pnotify({ text: 'Please Check Item Number ', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $("#tbl tbody tr").each(function () {
            if ($(this).find('.CurStockId').is(':checked')) {
                let qty = $(this).find('.Qty').val();                
                if (qty == "") {
                    $(this).find('.Qty').focus();
                        $.pnotify({ text: 'Please Input Remove Qty. ', type: 'error' });
                        valid = false;
                        return valid;
                } 
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
    let obj = []; let notes = $('#txtNotes').val();
    $("#tbl tbody tr").each(function () {
        let checkItem = $(this).find('.CurStockId').is(':checked');
        if (checkItem) {
            let aobj = {
                "CurStockId": $(this).find('.CurStockId').val(),
                "CurQty": $(this).find('.Qty').val(),
                "Notes": notes
            }
            obj.push(aobj);
        }
    });
    return obj;
}

///// Clear Data Start ////
function ClearData() {
  //  let value= $('#ddlItemHead option:selected').val();
    $('#ddlItemHead').val('-1').trigger('change');
    $('#tbl tbody').empty();
    $($('.uniform-checker').children()[0]).removeClass('uniform-checked');
    $('#txtNotes').val('');
}

$(document).off('change', '.Qty').on('change', '.Qty', function () {
    var phyStock = $(this).closest("tr")[0].cells[6].childNodes[0].id;
    if ($(this).val() !== '' || $(this).val() !== '0') {
        var stock = $(this).closest("tr")[0].cells[4].innerText.trim();
        let b = parseFloat($(this).val());
        let totalp = parseInt(stock) - parseInt(b);
        $("#" + phyStock).val(totalp);
    }
    else { $("#" + phyStock).val(''); }
});