var Controller = "ItemEntry" ,update ='', itmNumber='';

 $("span#sidebar-toggle").trigger('click');



$(document).ready(function () {

    $('#ddlHead').select2();
    loadItemHead();
    getItemInfo();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });

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
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
    }
    id.append(content);
    id.val('-1').trigger('change');
    //if (result.length == 1) {
    //    id.val(result[0].Value).trigger('change');
    //}
}

$(document).off('keyup', '#txtWidth').on("keyup", "#txtWidth", function (event) {
    let w = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(w);
});
$(document).off('keyup', '#txtHeight').on("keyup", "#txtHeight", function (event) {
    let w = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(w);
});

$(document).off('keyup', '#txtLength').on("keyup", "#txtLength", function (event) {
    let w = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(w);
});

$(document).off('keyup', '#txtWeight').on("keyup", "#txtWeight", function (event) {
    let w = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(w);
});

function getItemInfo() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/getItemInfo",
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
              '<th>Item Number</th>' +
              '<th>Item Name</th>' +
                '<th>UOM</th>' +
              '<th>Item Head</th>' +
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
                '<td class="code">' + element.ItemCode + '</td>' +
                '<td class="itemName">' + element.ItemName + '</td>' +
                '<td class="uom">' + element.UOM + '</td>' +
                '<td class="headCode">' + element.IHeadCode + '</td>' +
                //'<td class="IsActive">' + element.IsActive + '</td>' +
                '<td><span data-id="' + element.ItemId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                    '<span data-id="' + element.ItemId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
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

        const mode = $("#btnSave").val();
        if (mode == "Update") {
            if (itmNumber == $('#txtItemNumber').val()) {
                saveandUpdate();
            }
            else { DuplicateCheck(); }
        }
        else { DuplicateCheck(); }
      
    }
});

function  saveandUpdate() {
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

function DuplicateCheck() {
    var obj = GetSaveObject();
    var urlpath = base + Controller + "/DuplicateCheck";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (data) {
            
            if (data.IsSessionOut != null) {
                $.pnotify({ text: data.IsSessionOut, type: 'info' });
                return false;
            }
            if (data.list !== null) {
                $.pnotify({ text: 'Same Item Already Exits..!', type: 'danger' });
                return false;
            }
            else { saveandUpdate(); }
            return false;
        },
        error: function (a, b, c) {
          
        }
    });

}

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

    loaddataById(id);
});

function loaddataById(id) {
    let obj = {
        "ItemId": id
    }
    var urlpath = base + Controller + "/LoadById";
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
                if (result.list.length > 0) {
                    var data = result.list;
                    update = 'update';
                    
                    $('#hfId').val(data[0].ItemId);
                    $('#ddlHead').val(data[0].IHeadId).trigger('change');
                    $('#txtItemNumber').val(data[0].ItemCode);
                    $('#txtItemName').val(data[0].ItemName);
                    itmNumber = data[0].ItemCode;
                    //if (data[0].ManufacturerId != null) {
                    //    $("#ddlManufacturer").val(data[0].ManufacturerId).trigger('change');
                    //}
                    //else { $("#ddlManufacturer").val('-1').trigger('change'); }
                    $('#ddlUOM').val(data[0].UOM).trigger('change');

                    if (data[0].Width != '0.00') {
                        $("#txtWidth").val(data[0].Width);
                    } else { $("#txtWidth").val(''); }
                    if (data[0].Height != '0.00') {
                        $("#txtHeight").val(data[0].Height);
                    } else { $("#txtHeight").val(''); }

                    if (data[0].Length != '0.00') {
                        $("#txtLength").val(data[0].Length);
                    } else { $("#txtLength").val(''); }

                    if (data[0].Weight != '0.00') {
                        $("#txtWeight").val(data[0].Weight);
                    } else { $("#txtWeight").val(''); }
                    $('#txtCBM').val(data[0].CBM);
                    if (data[0].MinStockLevel != null) {
                        $("#txtMOrderLabel").val(data[0].MinStockLevel);
                    }else{ $("#txtMOrderLabel").val('');}
                    if (data[0].MaxStockLevel != null) {
                        $("#txtMaxOrderLabel").val(data[0].MaxStockLevel);
                    } else { $("#txtMaxOrderLabel").val(''); }
                    //let IsActive = data[0].IsActive;
                    //$.uniform.update(
                    //      $('#chkIsActive').attr("checked", IsActive)
                    //  );
                  
                    $('#btnSave').val('Update');
                    window.scrollTo(0, 0);

                }
            }
        }
    });

}

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
                "ItemId": id
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

    if ($('#ddlHead').val() == '-1') {
        $('#s2id_ddlHead').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Head Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#s2id_ddlHead').find(".select2-choice").css({ 'border': '1px solid #aaa' });
    }
    if ($('#txtItemNumber').val() == '') {
        $('#txtItemNumber').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Item Number Requried', type: 'error' });
        $('#txtItemNumber').focus();
        valid = false;
        return valid;
    }
    else { $('#txtItemNumber').css({ 'border': '1px solid #aaa' }); }

    //if ($('#txtLength').val() == '') {
    //    $('#txtLength').css({ 'border': '1px solid red' });
    //    $.pnotify({ text: 'Length Requried', type: 'error' });
    //    $('#txtLength').focus();
    //    valid = false;
    //    return valid;
    //} else { $('#txtLength').css({ 'border': '1px solid #aaa' }); }
    //if ($('#txtWidth').val() == '') {
    //    $('#txtWidth').css({ 'border': '1px solid red' });
    //    $.pnotify({ text: 'Width Requried', type: 'error' });
    //    $('#txtWidth').focus();
    //    valid = false;
    //    return valid;
    //} else { $('#txtWidth').css({ 'border': '1px solid #aaa' }); }
    //if ($('#txtHeight').val() == '') {
    //    $('#txtHeight').css({ 'border': '1px solid red' });
    //    $.pnotify({ text: 'Height Requried', type: 'error' });
    //    $('#txtHeight').focus();
    //    valid = false;
    //    return valid;
    //} else { $('#txtHeight').css({ 'border': '1px solid #aaa' }); }

    if ($('#txtCBM').val() == '') {
        $('#txtCBM').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'CBM Requried', type: 'error' });
        $('#txtCBM').focus();
        valid = false;
        return valid;
    } else { $('#txtCBM').css({ 'border': '1px solid #aaa' }); }
   

    if ($("#hfId").val() == "") {
        $("#tbl tbody tr").each(function () {
            
            let code = $(this).find('.code').text().toLowerCase();
            let txtItemNumber = $('#txtItemNumber').val().toLowerCase();
            let headCode = $(this).find('.headCode').text().toLowerCase();
            let head = $("#ddlHead option:selected").text().toLowerCase();
            if (code == txtItemNumber && headCode == head) {
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
        "ItemId": $('#hfId').val() === '' ? '0' : $('#hfId').val(),
        "ItemCode": $('#txtItemNumber').val(),
        "ItemName": $('#txtItemName').val(),
        "IHeadId": $('#ddlHead').val() === '-1' ? '0' : $('#ddlHead').val(),
       // "ManufacturerId": $('#ddlManufacturer').val() === '-1' ? '0' : $('#ddlManufacturer').val(),
        "UOM": $('#ddlUOM').val(),
        "Width": $('#txtWidth').val() == '' ? '0' : $('#txtWidth').val(),
        "Height": $('#txtHeight').val() == '' ? '0' : $('#txtHeight').val(),
        "Length": $('#txtLength').val() == '' ? '0' : $('#txtLength').val(),
        "Weight": $('#txtWeight').val() == '' ? '0' : $('#txtWeight').val(),
        "CBM": $('#txtCBM').val(),
        "MinStockLevel": $('#txtMOrderLabel').val(),
        "MaxStockLevel": $('#txtMaxOrderLabel').val()
        //"IsActive": $('#chkIsActive').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#hfId').val('');
    $('#txtItemNumber').val('');
    $('#txtItemName').val('');
    $('#ddlHead').val('-1').trigger('change');
    itmNumber = '';
     $("#ddlManufacturer").val('-1').trigger('change');
     $("#txtWidth").val('');
     $("#txtHeight").val('');
     $("#txtLength").val(''); 
     $("#txtWeight").val('');
     $("#txtCBM").val('');
     $("#txtMOrderLabel").val('');
     $("#txtMaxOrderLabel").val(''); 

    //$.uniform.update(
    //       $('#chkIsActive').attr("checked", true)
    //   );
     $('#btnSave').val('Save');
     update = '';
}

$(document).off('change', '#ddlHead').on('change', '#ddlHead', function () {
    
    if (update == "") {
        if ($(this).val() !== '-1') {
            var autoObj = {
                "IHeadId": $("#ddlHead").val(),
                "ItemCode": $("#ddlHead option:selected").text()
            }
            $.ajax({
                beforeSend: function () { $.blockUI(); },
                complete: function () { $.unblockUI(); },
                type: "POST",
                url: base + Controller + "/getAutoItemNumber",
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                data: JSON.stringify({ "obj": autoObj }),
                success: function (result) {
                    if (result.IsSessionOut != null) {
                        $.pnotify({ text: result.IsSessionOut, type: 'error' });
                        return false;
                    }
                    if (result.Error != null) {
                        $.pnotify({ text: result.Error, type: 'error' });
                        return false;
                    } else {
                      
                        $("#txtItemNumber").val(result.list[0].ItemCode);
                    }
                },
                error: function (a, b, c) {
                    $.pnotify({ text: 'Something Wrong', type: 'error' });
                }
            });
        }
    }
});
