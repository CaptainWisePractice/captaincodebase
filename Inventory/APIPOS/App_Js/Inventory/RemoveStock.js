var Controller = "RemoveStock";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    $('.select2').select2();
    $("#txtRemoveDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    $('#frmRemoveStock').wizard();
    loadItemNumber();
    GetPendingTransactionData();
    $('#frmRemoveStock .btn-toolbar').remove();
    $("#iddivManual").show();
    $("#iddivExcel").hide();
});
//// Dropdown load
function LoadDropdown(result, id, selectedValue) {
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option ValueStr="' + obj.ValueStr + '"  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    $(id).append(content);
    $(id).val(selectedValue).trigger('change');
    $(id).select2();
}
function loadItemNumber() {
    $.ajax({
        type: "POST",
        url: base + Controller + "/loadItemNumber",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result.listComboData, $('#ddlItemNumber'), '-1');
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function GetPendingTransactionData() {
    $('#spnPendingTransactionCount').text('');
    $('#tbl tbody').empty();
    var urlpath = base + Controller + "/GetPendingTransactionData";
    $.ajax({
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
               // $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                if (result.list != undefined) {
                    if (result.list.length > 0) {
                        $('#spnPendingTransactionCount').text(result.list.length);
                        TableRowBind(result.list);

                    }
                }
            }
        }
    });
}
function TableRowBind(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td class="checkbox-column" style="width: 5%;"><input type="checkbox" style="margin-right: 15px;" value="' + element.Id + '" class="uniform Id" ></td>' +
                '<td><input class="ItemId" type="hidden" value="' + element.ItemId + '"/>' + element.ItemNumber + '</td>' +
                '<td class="ItemDescription">' + element.ItemDescription + '</td>' +
                '<td class="Site">' + element.Site + '</td>' +
                '<td><input class="LocId" type="hidden" value="' + element.LocId + '"/>' + element.Location + '</td>' +
                '<td><input type="number" style="width: 60px;" class="Qty" value="' + element.Qty + '"  class="form-control span12" /></td>' +
        '</tr>';
        });

    }
    $('#tbl tbody').append(content);
}
$('#ddlItemNumber').on('change', function () {
    ClearItemNumberData();
    let Value = $(this).val();
    if (Value != '-1') {
        $('#txtDescription').val($(this).find(' option:selected').attr('ValueStr'));
        var urlpath = base + Controller + "/loadLocationByItem";
        $.ajax({
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "ItemId": Value }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    LoadDropdown(result.listComboData, $('#ddlLocation'), '-1');
                }
            }
        });
    }
});
$('#ddlLocation').on('change', function () {
    let Value = $(this).val();
    if (Value != '-1') {
        $('#txtStockQty').val($(this).find(' option:selected').attr('ValueStr'));
        var urlpath = base + Controller + "/loadLocationByItem";
    }
});
$('#txtQty').on('input', function () {
    let qty = parseFloat($(this).val() == "" ? 0 : $(this).val());
    let stkQty = parseFloat($('#txtStockQty').val());
    if (qty > stkQty) {
        $.pnotify({ text: 'Stock Quantity', type: 'error' });
        $(this).val('');
    }
});
$(document).off('keyup', '#txtQty').on("keyup", "#txtQty", function (event) {
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

function ClearItemNumberData() {
    $('#txtDescription').val('');
    $('#ddlLocation').get(0).options.length = 0;
    $('#ddlLocation').select2();
    $('#txtStockQty').val('');
    $('#txtQty').val('');
    $('#txtAreaNotes').val('');
}
function ClearCommitData() {
    $('#chkCheckAll').parent().removeClass('uniform-checked');
}
$('#btnRemove').on('click', function () {    
    if (RemoveValidation() == true) {
        var obj = getRemoveCommitObject();
        var urlpath = base + Controller + "/RemovePendingTransaction";
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
                    $.pnotify({ text: 'Remove Successfully', type: 'success' });
                    ClearCommitData();
                    //$('#ddlItemNumber').val('-1').trigger('change');
                    GetPendingTransactionData();
                }
            }
        });
    }
});
$('#btnDiscard').on('click', function () {
    window.history.back();
});

$('#btnCommit').on('click', function () {
    if (CommitValidation() == true) {
        var obj = getCommitObject();
        var urlpath = base + Controller + "/UpdateData";
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
                    $.pnotify({ text: 'Commit Successfully', type: 'success' });
                    //$('#ddlItemNumber').val('-1').trigger('change');
                    GetPendingTransactionData();
                    ClearCommitData();
                }
            }
        });
    }
});

function getCommitObject() {
    let obj = [];
    $("#tbl tbody tr").each(function () {
        let checkItem = $(this).find('.Id').is(':checked');
        if (checkItem) {
            let aobj = {
                "Id": $(this).find('.Id').val(),
                "ItemId": $(this).find('.ItemId').val(),
                "LocId": $(this).find('.LocId').val(),
                "Qty": $(this).find('.Qty').val()
            }
            obj.push(aobj);
        }
    });
    return obj;
}

function RemoveValidation() {
    let valid = false;
    $("#tbl tbody tr").each(function () {
        let checkItem = $(this).find('.Id').is(':checked');
        if (checkItem) {
            valid = true;
            return valid;
        }
    });
    if (valid == false) {
        $.pnotify({ text: 'Check Pending Transaction Item', type: 'error' });
    }
    return valid;
}

function CommitValidation() {
    let valid = true;
    if ($("#tbl tbody tr").length == 0) {
        $.pnotify({ text: 'No Pending Transaction Item', type: 'error' });
        valid = false;
        return valid;
    }
    return valid;
}
function getRemoveCommitObject() {
    let obj = [];
    $("#tbl tbody tr").each(function () {
        let checkItem = $(this).find('.Id').is(':checked');
        if (checkItem) {
            let aobj = {
                "Id": $(this).find('.Id').val(),
                "ItemId": $(this).find('.ItemId').val(),
                "LocId": $(this).find('.LocId').val(),
                "Qty": $(this).find('.Qty').val()
            }
            obj.push(aobj);
       }
    });
    return obj;
}
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
                    $('#ddlItemNumber').val('-1').trigger('change');
                    GetPendingTransactionData();
                }
            }
        });
    }
});
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#ddlItemNumber').val() == '-1') {
        $.pnotify({ text: 'Item Number Requried', type: 'error' });
        $('#ddlItemNumber').focus();
        valid = false;
        return valid;
    }
    if ($('#ddlLocation').val() == '-1') {
        $.pnotify({ text: 'Location Requried', type: 'error' });
        $('#ddlLocation').focus();
        valid = false;
        return valid;
    }
    if (parseFloat($('#txtQty').val() == "" ? 0 : $('#txtQty').val()) > 0) {
        valid = true;
        return valid;
    }
    else {
        $.pnotify({ text: 'Qty is greater than 0', type: 'error' });
        $('#txtQty').focus();
        valid = false;
        return valid;
    }

    if ($('#txtAreaNotes').val() == '') {
        $.pnotify({ text: 'Notes Requried', type: 'error' });
        $('#txtAreaNotes').focus();
        valid = false;
        return valid;
    }

    return valid;
}
///// Create Object ////
function GetSaveObject() {
    let obj = [];
    obj = {
        "ItemId": $('#ddlItemNumber').val(),
        "LocId": $('#ddlLocation').val(),
        "Qty": $('#txtQty').val(),
        "RemoveDate": $('#txtRemoveDate').val(),
        "Note": $('#txtAreaNotes').val()
    }
    return obj;
}
///// End Object ////



/*  for radio button */
$('#rdManual').on('click', function () {
    $("#iddivManual").show();
    $("#iddivExcel").hide();
});

$('#rdExcel').on('click', function () {
    $("#iddivManual").hide();
    $("#iddivExcel").show();
});


$('#btnUpload').on('click', function () {
    var objLst = '';
    var $file = document.getElementById('file');
    if ($file.files.length > 0) {
        var ff = $file.files[0].name.split(/\.(?=[^\.]+$)/);
        let extension = ff[1];
        if (extension == "csv") {
            Papa.parse($file.files[0], {
                header: true,
                complete: function (results) {
                    debugger;
                    objLst = results.data;
                    uploadcsv(objLst);
                }
            });
        } else {
            $.pnotify({ text: 'Please Choose CSV file !.', type: 'error' });
            document.getElementById('file').value = "";
        }
    } else { $.pnotify({ text: 'Please Choose CSV File !.', type: 'error' }); }
});


function uploadcsv(objLst) {
    var urlpath = base + Controller + "/ExcelUpload";
    $331.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "objLst": objLst }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                document.getElementById('file').value = "";
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                document.getElementById('file').value = "";
                return false;
            } else {
                $.pnotify({ text: 'File Upload Successfully', type: 'success' });
                document.getElementById('file').value = "";
                GetPendingTransactionData();
            }
        }
    });
}


//$('#btnUpload').on('click', function () {
//    var data = new FormData();
//    var $file = document.getElementById('file');
//    debugger;
//    if ($file.files.length > 0) {
//        for (var i = 0; i < $file.files.length; i++) {
//            data.append('Excelfile', $file.files[i]);
//        }
//        var ff = $file.files[0].name.split(/\.(?=[^\.]+$)/);
//        let extension = ff[1];
//        if (extension == "xlsx" || extension == "xls") {
//            var urlpath = base + Controller + "/ExcelUpload";
//            $331.ajax({
//                beforeSend: function () { $.blockUI(); },
//                complete: function () { $.unblockUI(); },
//                type: "POST",
//                url: urlpath,
//                contentType: false,
//                processData: false,
//                data: data,
//                success: function (result) {
//                    if (result.IsSessionOut != null) {
//                        $.pnotify({ text: result.IsSessionOut, type: 'info' });
//                        return false;
//                    } else if (result.Error != null && result.Error != "") {
//                        $.pnotify({ text: result.Error, type: 'error' });
//                        return false;
//                    } else {
//                        $.pnotify({ text: 'File Upload Successfully', type: 'success' });
//                        document.getElementById('file').value = "";
//                        GetPendingTransactionData();
//                    }
//                }
//            });
//        } else {
//            $.pnotify({ text: 'Please Choose Excel file !.', type: 'error' });
//            document.getElementById('file').value = "";
//        }
//    } else { $.pnotify({ text: 'Please Choose File !.', type: 'error' }); }
//});


