var Controller = "ItemMove", itmList = [],locStock=[];


 $("span#sidebar-toggle").trigger('click');



$(document).ready(function () {

    $('#ddlHead').select2();
    loadItemHead();
   // loadLocation();
});
// Initial Load//

function loadItemHead() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadItemHead",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlHead'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

//// Dropdown load
function LoadDropdown(result, id) {
    
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    id.append(content);
    id.val('-1').trigger('change');
    //if (result.length == 1) {
    //    id.val(result[0].Value).trigger('change');
    //}
}



$(document).off('change', '#ddlHead').on('change', '#ddlHead', function () {
    $('#tbl tbody').empty();
    if ($(this).val() !== '-1') {
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: base + Controller + "/loadItemByHead",
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "headId": $(this).val() }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                    return false;
                }
                if (result.Error != null) {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                   
                    if (result.list.length > 0) {
                        var fromLocation = '<option value="-1"> Select ----- </option>';
                        $.each(result.listComboData, function (i, obj) {
                            fromLocation += '<option value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                        });
                        var toLocation = '<option value="-1"> Select ----- </option>';
                        $.each(result.listToLocation, function (i, obj) {
                            toLocation += '<option value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                        });
                        locStock = [];
                        locStock = result.listLocationStock;
                        BindTable(result.list, fromLocation, toLocation);
                    } else {
                        $.pnotify({ text: 'No Data Found.', type: 'info' });
                        return false;
                    }
                }
            },
            error: function (a, b, c) {
                $.pnotify({ text: 'Something Wrong', type: 'error' });
            }
        });
    }
});


function BindTable(result, fromLocation, toLocation) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td class="checkbox-column"><input type="checkbox" value="' + element.ItemId + '" class="uniform ItemId" ></td>' +
                '<td class="ItemCode"><input type="hidden" class="hfStockId" id="hfStockId' + index + '" value=""/>' + element.ItemCode + '</td>' +
                '<td class="ItemName"><input type="hidden" class="hfItemId" id="hfItemId' + index + '" value="' + element.ItemId + '"/>' + element.ItemName + '</td>' +
                '<td><select id="ddlFromLocId' + index + '"" class="span12 ddlFromLocId">' + fromLocation + '</select></td>' +
                '<td><input type="text" id="txtStockQty' + index + '" class="span12 StockQty" readonly /></td>' +
                '<td><select id="ddlToLocId' + index + '"" class="span12 ddlToLocId">' + toLocation + '</select></td>' +
                '<td><input type="text" id="txtMoveQty' + index + '" class="span12 MoveQty"/></td>' +
        '</tr>';
        });
    }
    $('#tbl tbody').append(content);
    $('.ddlFromLocId').select2();
    $('.ddlToLocId').select2();
}

$(document).off("change", ".ddlFromLocId").on('change', '.ddlFromLocId', function () {
    let Id = $(this)[0].id.slice(12);
    if ($("#ddlFromLocId" + Id).val() != "-1" || $("#ddlFromLocId" + Id).val() != undefined) {
        var imlst = $.grep(locStock,
             function (x) {
                 if ('' + x.Value + '' == $("#ddlFromLocId" + Id).val() &&  x.ValueStr == $("#hfItemId" + Id).val()) {
                     return x;
                 }
             });
        $("#txtStockQty" + Id).val(imlst[0].Value_New2);
        $("#hfStockId" + Id).val(imlst[0].Value_New);
        imlst = [];
    }

});

$(document).off('keyup', '.MoveQty').on("keyup", ".MoveQty", function (event) {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
        let tblRow = $(this).closest('tr');
        let indexNo = $(tblRow).index();
        let moveQty = parseFloat($(this).val() == "" ? "0" : $(this).val());
        let AvailableQty = parseFloat($(tblRow).find('.StockQty').val() == "" ? "0" : $(tblRow).find('.StockQty').val());
        if (moveQty > AvailableQty) {
            $(this).val('');
            $.pnotify({ text: 'Stock Quantity ' + AvailableQty, type: 'info' });
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

$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        var Lstobj = GetSaveObject();
        var urlpath = base + Controller + "/Save";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "Lstobj": Lstobj }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    if (result._Result !== '0') {
                        $.pnotify({ text: 'Move Successfully', type: 'success' });
                    }
                    else {
                        $.pnotify({ text: 'Something Wrong ', type: 'error' });
                    }
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
    if ($('#ddlHead').val() == '-1') {
        $.pnotify({ text: 'Head Requried', type: 'error' });
        $('#s2id_ddlHead').find(".select2-choice").css({ 'border': '1px solid red' });
        valid = false;
        return valid;
    }
    else {
        $('#s2id_ddlHead').find(".select2-choice").css({ 'border': '1px solid #aaa' });
    }
    var total = $($("#tbl tbody tr").find('.ItemId').is(':checked')).length;
    if (total == 0) {
        $.pnotify({ text: 'Please Check Item Number', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $("#tbl tbody tr").each(function () {
            if ($(this).find('.ItemId').is(':checked')) {
                let qty = $(this).find('.MoveQty').val();
                let flocation = $(this).find('.ddlFromLocId option:selected').val();
                let tlocation = $(this).find('.ddlToLocId option:selected').val();
                if (flocation == "-1" || flocation == undefined) {
                    $.pnotify({ text: 'Please Select From Location. ', type: 'error' });
                    valid = false;
                    return valid;
                }
                if (tlocation == "-1" || tlocation == undefined) {
                    $.pnotify({ text: 'Please Select To Location. ', type: 'error' });
                    valid = false;
                    return valid;
                }
                if (qty == "" || qty == "0") {
                    $(this).find('.MoveQty').focus();
                    $.pnotify({ text: 'Please Input Move Qty. ', type: 'error' });
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
///// Create Object ////
function GetSaveObjectOld() {

    let obj = {
        "IHeadId": $('#ddlHead').val(),
        "ItemId": $('#ddlItem').val(),
        "FromLocationId": $('#ddlFromLocation').val(),
        "ToLocationId": $('#ddlToLocation').val(),
        "MoveQty": $('#txtMoveQty').val(),
        "Note": $('#txtNotes').val(),
        "CurStockId": $('#hfCurStockId').val()

    }
    return obj;
}

function GetSaveObject() {
    let obj = [];
    let headId = $('#ddlHead').val();
    let note = $('#txtNotes').val();
    $("#tbl tbody tr").each(function () {
        let checkItem = $(this).find('.ItemId').is(':checked');
        debugger;
        if (checkItem) {
            let aobj = {
                "IHeadId": headId,
                "ItemId": $(this).find('.hfItemId ').val(),
                "FromLocationId": $(this).find('.ddlFromLocId option:selected').val(),
                "ToLocationId": $(this).find('.ddlToLocId option:selected').val(),
                "MoveQty": $(this).find('.MoveQty').val(),
                "Note": note,
                "CurStockId": $(this).find('.hfStockId').val()
            }
            obj.push(aobj);
        }
    });
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#ddlHead').val('-1').trigger('change');
    $('#tbl tbody').empty();
    $("#txtNotes").val('');
    $($('.uniform-checker').children()[0]).removeClass('uniform-checked');
}
