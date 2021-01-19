var Controller = "TradingTerms";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    getTradingTermdata();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
});
///// Initial Load Method Start////
function getTradingTermdata() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetTradingTermdata",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({
                    text: result.IsSessionOut, type: 'info'
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
              '<th>Description</th>' +
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
                '<td class="name">' + element.Name + '</td>' +
                '<td class="description">' + element.Description + '</td>' +
                '<td><span data-id="' + element.TradingTermId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                 '<span data-id="' + element.TradingTermId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
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
    let name = $(tblRow).find('.name').text();
    let description = $(tblRow).find('.description').text();
    $('#TradingTermId').val(id);
    $('#txtName').val(name);
    $('#txtDescription').val(description);
    $('#btnSave').val('Update');
    window.scrollTo(0, 0);
});
$(document).off('click', '.delete').on('click', '.delete', function () {
    var id = $(this).attr('data-id');
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
                "TradingTermId": id
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
    } else { $('#txtName').css({ 'border': '1px solid #aaa' }); }
    return valid;
}

///// Create Object ////
function GetSaveObject() {
    let obj = {
        "TradingTermId": $('#TradingTermId').val(),
        "Name": $('#txtName').val(),
        "Description": $('#txtDescription').val()

        //"IsActive": $('#chkIsActive').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#TradingTermId').val('0');
    $('#txtName').val('');
    $('#txtDescription').val('');

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