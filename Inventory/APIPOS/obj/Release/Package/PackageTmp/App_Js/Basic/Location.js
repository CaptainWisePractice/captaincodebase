var Controller = "Location";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {    
    loadWarehouse();
    getLocation();
    $('#ddlWarehouse').select2();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
});


///// Initial Load Method Start////
function getLocation() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/getLocation",
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
function loadWarehouse() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadWarehouse",
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
                LoadDropdown(result.listComboData, $('#ddlWarehouse'));
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
              '<th>Site</th>' +
              '<th>Location</th>' +
              '<th>Description</th>' +
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
                '<td class="Warehouse"><input type="hidden" class="WarehouseId" value="' + element.WarehouseId + '"/>' + element.WarehouseName + '</td>' +
                '<td class="LocName">' + element.LocName + '</td>' +
                '<td class="description">' + element.Description + '</td>' +
                '<td class="note">' + element.Notes + '</td>' +
                //'<td class="IsActive">' + element.IsActive + '</td>' +
                '<td><span data-id="' + element.LocId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                    '<span data-id="' + element.LocId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
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
    let LocName = $(tblRow).find('.LocName').text();
    let description = $(tblRow).find('.description').text();
    let note = $(tblRow).find('.note').text();
    //let IsActive = ($(tblRow).find('.IsActive').text() === 'true');
    $('#LocId').val(id);
    $('#ddlWarehouse').val(WarehouseId).trigger('change');
    $('#txtLocation').val(LocName);
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
                    "LocId": id
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
    if ($('#ddlWarehouse').val() == '-1') {
        $('#s2id_ddlWarehouse').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Warehouse Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlWarehouse').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    if ($('#txtLocation').val() == '') {
        $.pnotify({ text: 'Location Name Requried', type: 'error' });
        $('#txtLocation').css({ 'border': '1px solid red' });
        $('#txtLocation').focus();
        valid = false;
        return valid;
    }
    else { $('#txtLocation').css({ 'border': '1px solid #aaa' }); }

    //$("#tbl tbody tr").each(function () {
    //    let rowId = $(this).find('.delete').attr('data-id');
    //    let hdId = $('#LocId').val();
    //    if (rowId != hdId) {
    //        let LocName = $(this).find('.LocName').text().toLowerCase().trim();
    //        let warehouseId = $(this).find('.WarehouseId').val();
    //        let ddlwarehouseId = $('#ddlWarehouse').val();
    //        let txtLocName = $('#txtLocation').val().toLowerCase().trim();
    //        if (LocName == txtLocName && warehouseId == ddlwarehouseId) {
    //            $.pnotify({ text: 'Same Warehouse and Location Already Exist', type: 'error' });
    //            valid = false;
    //            return valid;
    //        }
    //    }
    //});
    return valid;
}
///// Validation End ////
///// Create Object ////
function GetSaveObject() {
    let obj = {
        "LocId": $('#LocId').val(),
        "WarehouseId":$('#ddlWarehouse').val(),
        "LocName": $('#txtLocation').val(),
        "Description": $('#txtDescription').val(),
        "Notes": $('#txtNotes').val()
        //"IsActive": $('#chkIsActive').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#LocId').val('0');
    $('#ddlWarehouse').val('-1').trigger('change');
    $('#txtLocation').val('');
    $('#txtDescription').val('');
    $('#txtNotes').val('');
    //$.uniform.update(
    //       $('#chkIsActive').attr("checked", true)
    //   );
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



