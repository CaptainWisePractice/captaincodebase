var Controller = "FOBPriceSet", headList=[];//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadItemHead();
    $('#ddlItemHead').select2();
    
});

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
                $.pnotify({ text: 'Session Out Please login again', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.ldata, $('#ddlItemHead'));
                headList = [];
                headList = result.ldata;
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
    $(id).append(content);
    //$(id).val('').trigger('change');
    $(id).select2();
}

$(document).off('change', '#ddlItemHead').on('change', '#ddlItemHead', function () {
    if ($(this).val() !== '-1') {
        $('#txtLastPrice').val('');
        var manId = $(this).val();
        var lst = $.grep(headList,
          function (x) {
              if ('' + x.Value + '' == manId) {
                  return x;
              }
          });
        $('#txtLastPrice').val(lst[0].ValueStr);
        lst = [];
    }
});


///// Start Button Click ////
$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        SaveandUpdate();
    }
});
$('#btnRefresh').on('click', function () {
    ClearData();
});
$('#btnCancel').on('click', function () {
    ClearData();
    window.history.back();
});

///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#ddlItemHead').val() == '-1') {
        $('#s2id_ddlItemHead').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Item Code Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlItemHead').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    if ($('#txtPrice').val() == '' || $('#txtPrice').val() == '0') {
        $.pnotify({ text: 'Price Requried', type: 'error' });
        $('#txtPrice').css({ 'border': '1px solid red' });
        $('#txtPrice').focus();
        valid = false;
        return valid;
    }
    else { $('#txtPrice').css({ 'border': '1px solid #aaa' }); }
    return valid;
}
///// Validation End ////
///// Create Object ////
function GetSaveObject() {
    let obj = {
        "IHeadId": $('#ddlItemHead').val(),
        "InitialPrice": $('#txtLastPrice').val(),
        "Price": $('#txtPrice').val(),
        //"IsActive": $('#chkIsActive').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#ddlItemHead').val('-1').trigger('change');
    $('#txtLastPrice').val('');
    $('#txtPrice').val('');
}
///// Clear Data Start ////


function SaveandUpdate() {
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
                loadItemHead();
                $('#txtLastPrice').val('');
                $('#txtPrice').val('');
                  
            }
        }
    });
}



