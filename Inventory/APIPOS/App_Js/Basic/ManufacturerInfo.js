var Controller = "ManufacturerInfo", CommonController = "Common", manufact ='';//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');

//window.onload = function () {
//    $("span#sidebar-toggle").trigger('click');
//};
$(document).ready(function () {
    loadCountry();
    loadTradingTerms();
    getManufacturerInfo();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });

});

function loadCountry() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadCountry",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlCountry'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadTradingTerms() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadTradingTerms",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlTradingTerms'));
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
    $(id).val('-1').trigger('change');
    $(id).select2();
}
///// Initial Load Method Start////
function getManufacturerInfo() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/Getdata",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({
                    title: 'Oh No!',
                    text: 'Something terrible happened.',
                    type: 'info'
                });
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
              '<th>Name</th>' +
              '<th>Contact No</th>' +
              '<th>E-Mail</th>' +
              '<th>Contact Person</th>' +
              '<th>Note</th>' +
              //'<th>Is Active</th>' +
              '<th> Action </th>' +
              '</tr>' +
              '</thead>';
    return content;
}
function TableInitialRow(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td class="name">' + element.Name + '<input type="hidden" value="' + element.CountryId + '" /></td>' +
                '<td class="contNo">' + element.ContractNo + '<input type="hidden" value="' + element.TradingTermId + '" /></td>' +
                '<td class="email">' + element.Email + '</td>' +
                '<td class="description">' + element.Description + '</td>' +
                '<td class="note">' + element.Notes + '</td>' +
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
        else {
            if (manufact == $('#txtName').val()) {
                SaveandUpdate();
            } else { DuplicateCheck(); }
        }
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
    let name = $(tblRow).find('.name').text();
    let contNo = $(tblRow).find('.contNo').text();
    let email = $(tblRow).find('.email').text();
    let countryId = $(tblRow).find('Input').val();
    let tradingTermId = $(tblRow).find('.contNo input[type=hidden]').val();
    let description = $(tblRow).find('.description').text();
    let note = $(tblRow).find('.note').text();
    //let IsActive = ($(tblRow).find('.IsActive').text() === 'true');
    
    $('#hfId').val(id);
    $('#txtName').val(name);
    manufact = name;
    $('#txtContNo').val(contNo);
    $('#txtMail').val(email);
    if (countryId != '0') {
        $('#ddlCountry').val(countryId).trigger('change');
    }
    else { $('#ddlCountry').val('-1').trigger('change'); }

    if (tradingTermId != '0') {
        $('#ddlTradingTerms').val(tradingTermId).trigger('change');
    }
    else { $('#ddlTradingTerms').val('-1').trigger('change'); }

    $('#txtDescription').val(description);
    $('#txtNotes').val(note);
    //$.uniform.update(
    //      $('#chkIsActive').attr("checked", IsActive)
    //  );
    $('#btnSave').val('Update');
    window.scrollTo(0, 0);
});
$(document).off('click', '.delete').on('click', '.delete', function () {
    let id = $(this).attr('data-id');
    $.msgbox("Are you sure that you want to permanently delete..? ", {
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
    });

});
///// End Button Click ////
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#txtName').val() == '') {
        $('#txtName').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Name Requried', type: 'error' });
        $('#txtName').focus();
        valid = false;
        return valid;
    }
    else { $('#txtName').css({ 'border': '1px solid #aaa' }); }
    if ($('#txtContNo').val() == '') {
        $('#txtContNo').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Contract No Requried', type: 'error' });
        $('#txtContNo').focus();
        valid = false;
        return valid;
    } else { $('#txtContNo').css({ 'border': '1px solid #aaa' }); }
    if ($('#btnSave').val() == "Save") {
        $("#tbl tbody tr").each(function () {
            let name = $(this).find('.name').text().toLowerCase();
            let txtName = $('#txtName').val().toLowerCase();
            if (name == txtName) {
                $.pnotify({ text: 'Name Already Exist', type: 'error' });
                valid = false;
                return valid;
            }
        });
    }
    return valid;
}
///// Validation End ////
///// Create Object ////
function GetSaveObject() {
    let obj = {
        "Id": $('#hfId').val() === '' ? '0' : $('#hfId').val(),
        "Name": $('#txtName').val(),
        "ContractNo": $('#txtContNo').val(),
        "Email": $('#txtMail').val(),
        "CountryId": $('#ddlCountry').val() == '-1' ? '0' : $('#ddlCountry').val(),
        "TradingTermId": $('#ddlTradingTerms').val() == '-1' ? '0' : $('#ddlTradingTerms').val(),
        "Description": $('#txtDescription').val(),
        "Notes": $('#txtNotes').val()
        //"IsActive": $('#chkIsActive').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#hfId').val('');
    $('#txtName').val('');
    $('#txtContNo').val('');
    $('#txtMail').val('');
    $('#txtDescription').val('');
    $('#txtNotes').val('');
    $('#ddlCountry').val('-1').trigger('change');
    $('#ddlTradingTerms').val('-1').trigger('change');
    //$.uniform.update(
    //       $('#chkIsActive').attr("checked", true)
    //   );
    $('#btnSave').val('Save');
    manufact = '';
}


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
                $.pnotify({ text: 'Already Exits..!', type: 'error' });
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

$(document).off('change', '#txtMail').on('change', '#txtMail', function () {
    if ($(this).val() !== '') {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if ($(this).val().match(mailformat)) {
            return true;
        }
        else {
            alert("You have entered an invalid email address.!");
            $(this).val('');
            return false;
        }
    }
});

