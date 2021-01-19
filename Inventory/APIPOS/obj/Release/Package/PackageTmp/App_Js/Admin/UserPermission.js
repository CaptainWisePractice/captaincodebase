var Controller = "UserPermission";
$("span#sidebar-toggle").trigger('click'); var userList = [];

$(document).ready(function () {
    loadUserName();
});
///// Initial Load Method Start////
function loadUserName() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/LoadUserName",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            userList = [];
            userList = result;
            LoadDropdown(result, $('#ddlUserName'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadDropdown(result, id) {
    var content = '<option  value="-1">-- Select --</option>';
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
    }
    $(id).append(content);
    $(id).select2();

}
$(document).off('change', '#ddlUserName').on('change', '#ddlUserName', function () {
    $('#tbl tbody').empty();
    let userId = $('#ddlUserName').val();
    if ($('#ddlUserName').val() !== '-1') {
        var imlst = $.grep(userList,
           function (x) {
               if ('' + x.Value + '' === $('#ddlUserName').val()) {
                   return x;
               }
           });
        $('#txtFullName').val(imlst[0].ValueStr);
        imlst = [];
        var urlpath = base + Controller + "/GetMenudata";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "Id": userId }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    var data = result.lstlist
                    BindTable(data);
                }
            }
        });
    }
});
function BindTable(result) {
    let content = '', checkmaster = '', checkchild = '', counter=0;
    var masterdata = result[0];
    for (var i = 0; i < masterdata.length; i++) {
        var menuId = masterdata[i].MenuId;
        checkmaster = masterdata[i].Notes;
        if (checkmaster != '') {
            checkmaster = 'checked';
            counter = counter + 1;
        }
        var childData = $.grep(result[1],
                function (c) {
                    if (c.WarehouseId === menuId) {
                        return c;
                    }
                });
        content += '<tr>' +
                  '<td style="vertical-align: middle;text-align: center;" rowspan="' + (childData.length +1) + '">' + masterdata[i].MenuName + '</td>' +
                  '<td class="menuName">' + masterdata[i].MenuName + '</td>' +
                  '<td class="checkbox-column"><input type="checkbox" ' + checkmaster + ' value="' + masterdata[i].MenuId + '" class="uniform menuId" ></td>' +
          '</tr>';

        if (childData.length > 0) {
            $(childData).each(function (index, element) {
                checkchild = element.Notes;
                if (checkchild != '') {
                    checkchild = 'checked';
                    counter = counter + 1;
                }
                content += '<tr>' +
                   // '<td class="mainMenu">' + + '</td>' +
                    '<td class="menuName">' + element.MenuName + '</td>' +
                    '<td class="checkbox-column"><input type="checkbox" ' + checkchild + ' value="' + element.MenuId + '" class="uniform menuId" ></td>' +
            '</tr>';
            });
        }
    }
    $('#tbl tbody').append(content);

    if (counter > 0) {
        $("#btnMenuSave").val("Update");
    } else { $("#btnMenuSave").val("Save"); }
}

///// Start Button Click ////
$('#btnMenuSave').on('click', function () {
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
            data: JSON.stringify({ "obj": obj, "userId": $('#ddlUserName').val() }),
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
    //var baseUrl = base + "Home/Index";
    //window.location.href = baseUrl;
});
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#ddlUserName').val() == '-1') {
        $('#s2id_ddlUserName').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'User Name Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlUserName').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    var total = $($("#tbl tbody tr").find('.menuId').is(':checked')).length;
    if (total == 0) {
        $.pnotify({ text: 'Please Checked Menu. ', type: 'error' });
        valid = false;
        return valid;
    }

    return valid;
}

///// Create Object ////
function GetSaveObject() {
    let obj = [];
    $("#tbl tbody tr").each(function () {
        let checkmenuId = $(this).find('.menuId').is(':checked');
        if (checkmenuId) {
            let aobj = {
                "Id": $('#ddlUserName option:selected').val(),
                "MenuId": $(this).find('.menuId').val()
            }
            obj.push(aobj);
        }
    });
    return obj;
}

function ClearData() {
    $('#ddlUserName').val('-1').trigger('change');
    $('#txtFullName').val('');
    $($('.uniform-checker').children()[0]).removeClass('uniform-checked');
}
