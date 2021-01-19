var Controller = "DeliveryMethod";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    getAlldata();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
});
///// Initial Load Method Start////
function getAlldata() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetAlldata",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({text: result.IsSessionOut, type: 'info'});
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
    content = '<table class="table table-striped table-fixed" id="tbl">' +
       '<thead>' +
              '<tr>' +
              '<th style="width:5%">SL#</th>' +
              '<th style="width:40%">Delivery Method</th>' +
              '<th style="width:10%">Action </th>' +
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
                '<td><span data-id="' + element.AddrTypeID + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                    '<span data-id="' + element.AddrTypeID + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
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
  //  let IsActive = ($(tblRow).find('.IsActive').text() === 'true');
    $('#ID').val(id);
    $('#txtName').val(name);
    //$.uniform.update(
    //      $('#chkIsActive').attr("checked", IsActive)
    //  );
    $('#btnSave').val('Update');
    window.scrollTo(0, 0);
});
$(document).off('click', '.delete').on('click', '.delete', function () {
    var id = $(this).attr('data-id');
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
                "AddrTypeID": id
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
            $.pnotify({ text: 'Name Requried', type: 'error' });
            valid = false;
            return valid;
        }
        $("#tbl tbody tr").each(function () {
            let rowId = $(this).find('.delete').attr('data-id');
            let hdId = $('#ID').val();
            if (rowId != hdId) {
                let name = $(this).find('.name').text().toLowerCase().trim();
                let txtName = $('#txtName').val().toLowerCase().trim();
                if (name == txtName) {
                    $.pnotify({ text: 'Name Already Exist', type: 'error' });
                    valid = false;
                    return valid;
                }
            }
        });
        return valid;
    }
    ///// Validation End ////
    ///// Create Object ////
    function GetSaveObject() {
        let obj = {
            "AddrTypeID": $('#ID').val(),
            "Name": $('#txtName').val()
        }
        return obj;
    }
    ///// End Object ////
    ///// Clear Data Start ////
    function ClearData() {
        $('#ID').val('0');
        $('#txtName').val('');
        $('#btnSave').val('Save');
    }
    ///// Clear Data Start ////