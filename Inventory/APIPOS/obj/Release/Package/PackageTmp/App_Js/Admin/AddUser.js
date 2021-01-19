var Controller = "AddUser", LocController = "Location", SaleContoller = "Sales";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadOutlet();
    LoadAllUserData();
    $('#ddlWarehouse').select2();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
});


///// Initial Load Method Start////
function LoadAllUserData() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/LoadAllUser",
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
                BindTable(result.list);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function loadOutlet() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + SaleContoller + "/loadSaleOutlet",
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
               
                LoadDropdown(result, $('#ddlWarehouse'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
//// Dropdown load
function LoadDropdown(result, id) {
   // $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    $(id).append(content);
    //$(id).val('').trigger('change');
    $(id).select2();
}
///// Initial Load Method End////
///// Start Table ////
function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableInitialRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#tbl').dataTable({
        "iDisplayLength": -1
    });
}
function TableHeader() {
    let content = '';
    content = '<table class="table table-striped" id="tbl">' +
       '<thead>' +
              '<tr>' +
              '<th>SL#</th>' +
              '<th>Branch </th>' +
              '<th>Full Name</th>' +
              '<th>User Name</th>' +
              '<th>Password</th>' +
              '<th>Email</th>' +
              '<th>Status</th>' +
              '<th>Action </th>' +
              '</tr>' +
              '</thead>';
    return content;
}
function TableInitialRow(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            let status = '';
            if (element.IsActive == true) {
                status = 'Active';
            }else{status='Inactive'}

            content += '<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td class="warehouse"><input type="hidden" class="WarehouseId" value="' + element.WarehouseId + '"/>' + element.Warehouse + '</td>' +
                '<td class="fullName"><input type="hidden" class="UserType" value="' + element.UserType + '"/>' + element.FullName + '</td>' +
                '<td class="userName">' + element.UserName + '</td>' +
               // '<td class="userName">' + element.Password + '</td>' +
                '<td><input type="password" class="pasword" value="' + element.Password + '"/></td>' +
                '<td class="email">' + element.Email + '</td>' +
                '<td class="isActive">' + status + '</td>' +
                '<td><span data-id="' + element.Id + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                '<span data-id="' + element.Id + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
                '</td>' +
        '</tr>';
        });

    }
    return content;
}
///// End Table ////
///// Start Button Click ////
$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        let save = $('#btnSave').val();
        if (save == 'Save') {
            DuplicateCheck();
        }
        else { SaveandUpdate(); }
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
$(document).off('click', '.edit').on('click', '.edit', function () {
    let tblRow = $(this).closest('tr');
    let id = $(this).attr('data-id');
    let WarehouseId = $(tblRow).find('.WarehouseId').val();
    let userType = $(tblRow).find('.fullName input[type=hidden]').val();
    let fullName = $(tblRow).find('.fullName').text();
    let userName = $(tblRow).find('.userName').text();
    let password = $(tblRow).find('.pasword').val();
    let email = $(tblRow).find('.email').text();
    let isActive = ($(tblRow).find('.isActive').text().trim() == "Active") ? true : false;
    //let IsActive = ($(tblRow).find('.IsActive').text() === 'true');
    $('#Id').val(id);
    $('#ddlUserType').val(userType).trigger('change');
    $('#ddlWarehouse').val(WarehouseId).trigger('change');
    $('#txtFullName').val(fullName);
    $('#txtUserName').val(userName);
    $('#txtPasssword').val(password);
    $('#txtConPassword').val(password);
    $('#txtEmail').val(email);
    $.uniform.update(
          $('#chkIsActive').attr("checked", isActive)
      );
    $('#btnSave').val('Update');
    window.scrollTo(0, 0);
});
$(document).off('click', '.delete').on('click', '.delete', function () {
    let id = $(this).attr('data-id');
    $.msgbox("Are you sure that you want to permanently delete the selected element?", {
        type: "confirm",
        buttons: [
            { type: "submit", value: "Yes" },
            { type: "submit", value: "No" }
        ]
    }, function (result) {
        if (result == "Yes") {
            $("#divTable").empty();

            let obj = {
                "Id": id
            }
            var urlpath = base + Controller + "/Delete";
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
                        $.pnotify({ text: 'Delete Successfully', type: 'success' });
                        BindTable(result.list);
                    }
                }
            });
        }
        else if (result == "No") {
            $.pnotify({ text: "Cancel Delete Operation", type: 'info' });
        }
        //$.msgbox("You clicked " + result)
    }
    );
});
///// End Button Click ////
///// Validation Start ////
function SaveValidation() {
    let valid = true;

    if ($('#ddlUserType').val() == '-1') {
       // $('#ddlUserType').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'UserType Requried', type: 'error' });
        $('#ddlUserType').focus();
        valid = false;
        return valid;
    }// else { $('#ddlUserType').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }

    if ($('#ddlUserType').val() == '2') {
        if ($('#ddlWarehouse').val() == '-1') {
            $('#s2id_ddlWarehouse').find(".select2-choice").css({ 'border': '1px solid red' });
            $.pnotify({ text: 'Warehouse Requried', type: 'error' });
            valid = false;
            return valid;
        } else { $('#s2id_ddlWarehouse').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    } else { $('#s2id_ddlWarehouse').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }


    if ($('#txtUserName').val() == '') {
        $.pnotify({ text: 'User Name Requried', type: 'error' });
       // $('#txtUserName').css({ 'border': '1px solid red' });
        $('#txtUserName').focus();
        valid = false;
        return valid;
    }
    else { $('#txtUserName').css({ 'border': '1px solid #aaa' }); }

    if ($('#txtPasssword').val() == '') {
        $.pnotify({ text: 'Passsword Requried', type: 'error' });
        $('#txtPasssword').css({ 'border': '1px solid red' });
        $('#txtPasssword').focus();
        valid = false;
        return valid;
    }
    else { $('#txtPasssword').css({ 'border': '1px solid #aaa' }); }


    if ($('#txtConPassword').val() == '') {
        $.pnotify({ text: 'Confirm Password Requried', type: 'error' });
        $('#txtConPassword').css({ 'border': '1px solid red' });
        $('#txtConPassword').focus();
        valid = false;
        return valid;
    }
    else { $('#txtConPassword').css({ 'border': '1px solid #aaa' }); }

    return valid;
}
///// Validation End ////
///// Create Object ////
function GetSaveObject() {
    let obj = {
        "Id": $('#Id').val(),
        "WarehouseId": $('#ddlWarehouse').val(),
        "FullName": $('#txtFullName').val(),
        "UserName": $('#txtUserName').val(),
        "Password": $('#txtPasssword').val(),
        "ConfirmPassword": $('#txtConPassword').val(),
        "Email": $('#txtEmail').val() ,
        "UserType": $('#ddlUserType').val(),
        "IsActive": $('#chkIsActive').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#Id').val('0');
    $('#ddlUserType').val('-1').trigger('change');
    $('#ddlWarehouse').val('-1').trigger('change');
    $('#txtFullName').val('');
    $('#txtUserName').val('');
    $('#txtPasssword').val('');
    $('#txtConPassword').val('');
    $('#txtEmail').val('');
    $.uniform.update(
           $('#chkIsActive').attr("checked", true)
       );
    $('#btnSave').val('Save');
}
///// Clear Data Start ////

function DuplicateCheck() {
    var obj = GetSaveObject();
    var urlpath = base + Controller + "/DuplicateCheck";
    $.ajax({
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (data) {
            
            if (data.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }
            
            if (data.Save_error === "True") {
                $.pnotify({ text: 'Same User Name Already Exits..!', type: 'error' });
                return false;
            }
            else { SaveandUpdate(); }
            return false;
        },
        error: function (a, b, c) {
            window.ShowCustomDialog(a, c, "Error in saving Data");
        }
    });

}

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
                let save = $('#btnSave').val();
                if (save == 'Save') {
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                }
                else {
                    $.pnotify({ text: 'Update Successfully', type: 'success' });
                }
                ClearData();
                BindTable(result.list);
            }
        }
    });
}


$(document).off('change', '#txtOldPasssword').on('change', '#txtOldPasssword', function () {
    if ($(this).val() !== '') {
        
        //var password = '@Session["Password"]';
        var ps = $("#hfSessionPassword").val();
        if ($(this).val() != ps) {
            $.pnotify({ text: "Input Correct Password.!", type: 'error' });
            $(this).val('');
        }
    }
});

$('#btnNewSave').on('click', function () {
    if (SaveChangeValidation() == true) {
        var obj = GetSaveChangeObject();
        var urlpath = base + Controller + "/UserChangePassword";
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
                        $.pnotify({ text: 'Password Update Successful', type: 'success' });
                        ClearDataPassword();
                    }
                }
            });
    }
});

function ClearDataPassword() {
    $('#txtOldPasssword').val('');
    $('#txtPasssword').val('');
    $('#txtConPassword').val('');
}

function GetSaveChangeObject() {
    let obj = {
        "Password": $('#txtPasssword').val(),
        "ConfirmPassword": $('#txtConPassword').val()
    }
    return obj;
}

function SaveChangeValidation() {
    let valid = true;


    if ($('#txtOldPasssword').val() == '') {
        $('#txtOldPasssword').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Old Passsword Requried', type: 'error' });
        $('#txtOldPasssword').focus();
        valid = false;
        return valid;
    }
    else { $('#txtOldPasssword').css({ 'border': '1px solid #aaa' }); }

    if ($('#txtPasssword').val() == '') {
        $.pnotify({ text: 'Passsword Requried', type: 'error' });
        $('#txtPasssword').css({ 'border': '1px solid red' });
        $('#txtPasssword').focus();
        valid = false;
        return valid;
    }
    else { $('#txtPasssword').css({ 'border': '1px solid #aaa' }); }


    if ($('#txtConPassword').val() == '') {
        $.pnotify({ text: 'Confirm Password Requried', type: 'error' });
        $('#txtConPassword').css({ 'border': '1px solid red' });
        $('#txtConPassword').focus();
        valid = false;
        return valid;
    }
    else { $('#txtConPassword').css({ 'border': '1px solid #aaa' }); }

    return valid;
}

$('#btnNewRefresh').on('click', function () {
    ClearDataPassword();
});



