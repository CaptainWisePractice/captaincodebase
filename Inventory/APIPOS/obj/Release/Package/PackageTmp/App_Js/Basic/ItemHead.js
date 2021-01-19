var Controller = "ItemHead",HName='';    // Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {

    $wzd_form = $('#wizard-demo-2').validate({ onsubmit: false });
    $('#wizard-demo-2').wizard({
        onStepLeave: function (wizard, step) {
            return $wzd_form.form();
        },
        onBeforeSubmit: function () {
            return $wzd_form.form();
        }
    });

    $('#wizard-demo-2 .btn-toolbar').remove();

    $('#ddlcategory').select2();
    $('#ddlManufacturer').select2();
    $('#txtCostPrice').attr('readonly', false);
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });

    InitialLoad();
});

// Initial Load Method Start//


function InitialLoad() {
   
    LoadCategory();
    loadManufacturer();
    getItemHead();
}

function LoadCategory() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadCategory",
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
                LoadDropdown(result.listComboData, $('#ddlcategory'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadManufacturer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadManufacturer",
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
                LoadDropdown(result.listComboData, $('#ddlManufacturer'));
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

function getItemHead() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/getItemHead",
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
              '<th>Categoy</th>' +
              '<th>Head Code</th>' +
              '<th>Head Description</th>' +
              '<th>CBM</th>' +
              '<th>Manufacturer</th>' +
              '<th>Costing Price</th>' +
              '<th>New Price</th>' +
              '<th>Status</th>' +
              '<th style="width: 60px;"> Action </th>' +
              '</tr>' +
              '</thead>';
    return content;
}
function TableInitialRow(result) {
    let content = '', ischeck='';
    if (result != undefined) {
        $(result).each(function (index, element) {
            if (element.IsActive == true) {
                ischeck = 'Continue';
            } else { ischeck = 'Discontinue'; }
            content += '<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td class="category"><input type="hidden" class="categoryId" value="' + element.CategoryId + '"/>' + element.Category + '</td>' +
                '<td class="code"><input type="hidden" class="colorId" value="' + element.ColorId + '"/>' + element.IHeadCode + '</td>' +
                '<td class="head"><input type="hidden" class="color" value="' + element.Color + '"/>' + element.IHeadName + '</td>' +
                '<td class="cbm"><input type="hidden" class="hd" data-FilePath="' + element.FilePath + '" data-FileName="' + element.FileName + '"/>' + element.CBM + '</td>' +
                '<td class="manufacturer"><input type="hidden" class="manufacturerId" value="' + element.ManufacturerId + '"/>' + element.Manufacturer + '</td>' +
                '<td class="cost"><input type="hidden" class="sizeId" value="' + element.SizeId + '"/>' + element.CostingPrice + '</td>' +
                '<td class="newcost"><input type="hidden" class="size" value="' + element.Size + '"/>' + element.NewPrice + '</td>' +
                '<td class="isActive">' + ischeck + '<input type="hidden" class="isStock" value="' + element.IsStock + '"/>' +
                 '<input type="hidden" class="listingStatus" value="' + element.ListingStatus + '"/> <input type="hidden" class="deliveryStatus" value="' + element.DeliveryStatus + '"/>' +
                '</td>' +
                '<td><span data-id="' + element.IHeadId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                 '<span data-id="' + element.IHeadId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
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
            if (HName == $('#txtCode').val().trim()) {
                debugger;
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
    let categoryId = $(tblRow).find('.categoryId').val();
    let manufacturerId = $(tblRow).find('.manufacturerId').val();
    let code = $(tblRow).find('.code').text();
    let head = $(tblRow).find('.head').text();
    let colorId = $(tblRow).find('.code input[type=hidden]').val();
    let color = $(tblRow).find('.head input[type=hidden]').val();
    let cbm = $(tblRow).find('.cbm').text();
    let cost = $(tblRow).find('.cost').text();
    let newcost = $(tblRow).find('.newcost').text();
    let sizeId = $(tblRow).find('.cost input[type=hidden]').val();
    let size = $(tblRow).find('.newcost input[type=hidden]').val();
    let IsActive = ($(tblRow).find('.isActive').text().trim() == "Continue") ? true : false;
    let IsStock = ($(tblRow).find('.isStock').val() == "true") ? true : false;
    let ListingStatus = ($(tblRow).find('.listingStatus').val() == "true") ? true : false;
    let DeliveryStatus = ($(tblRow).find('.deliveryStatus').val() == "true") ? true : false;

    let FilePath = $(tblRow).find('.hd').attr('data-FilePath');
    let FileName = $(tblRow).find('.hd').attr('data-FileName');
    let image = '<img longdesc="" src="' + FilePath + '" class="clsMyImage" alt="' + FileName + '" title="' + FileName + '" style="width:100px; height:100px;"/>';
    $('#divImgPreview').empty();
    $('#divImgPreview').append(image);
    $('#hfId').val(id);
    $('#ddlcategory').val(categoryId).trigger('change');
    $('#txtCode').val(code);
    HName = code.trim();
    $('#txtHead').val(head);
    $('#txtCBM').val(cbm);
    if (manufacturerId != '0') {
        $('#ddlManufacturer').val(manufacturerId).trigger('change');
    }
    $('#txtCostPrice').val(cost);
    $('#txtNewPrice').val(newcost);
    $.uniform.update(
          $('#chkIsActive').attr("checked", IsActive)
      );

    $.uniform.update(
         $('#chkIsStock').attr("checked", IsStock)
     );
    $.uniform.update(
        $('#chkListingStatus').attr("checked", ListingStatus)
    );
    $.uniform.update(
        $('#chkDeliveryStatus').attr("checked", DeliveryStatus)
    );
    $('#btnSave').val('Update');
    $('#txtCostPrice').attr('readonly', true);
    $('#txtColor').val(color);
    $('#hfColorId').val(colorId);
    $('#txtSize').val(size);
    $('#hfSizeId').val(sizeId);
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
                "IHeadId": id
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
                        $('#btnSave').val('Save');
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
    if ($('#ddlcategory').val() == '-1') {
        $('#s2id_ddlcategory').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Category Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlcategory').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    if ($('#txtCode').val() == '') {
        $('#txtCode').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Code Requried', type: 'error' });
        $('#txtCode').focus();
        valid = false;
        return valid;
    } else { $('#txtCode').css({ 'border': '1px solid #aaa' }); }

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
            let catId = $(this).find('.categoryId').val();
            let categoryId = $('#ddlcategory').val();
            let txtcode = $('#txtCode').val().toLowerCase();
            if ($('#btnSave').val() == "Save") {
                if (code == txtcode && catId == categoryId) {
                    $.pnotify({ text: 'Already Exist ', type: 'error' });
                    valid = false;
                    return valid;
                }
            }
        });
    }
    return valid;
}
///// Validation End ////
///// Create Object ////
function GetSaveObject() {
    let obj = {
        "IHeadId": $('#hfId').val() == '' ? 0 : $('#hfId').val(),
        "CategoryId": $('#ddlcategory').val(),
        "IHeadCode": $('#txtCode').val(),
        "IHeadName": $('#txtHead').val(),
        "CBM": $('#txtCBM').val(),
        "ManufacturerId": $('#ddlManufacturer').val() == '-1' ? '0' : $('#ddlManufacturer').val(),
        "CostingPrice": $('#txtCostPrice').val(),
        "NewPrice": $('#txtNewPrice').val(),
        "Color": $('#txtColor').val(),
        "ColorId": $('#hfColorId').val(),
        "Size": $('#txtSize').val(),
        "SizeId": $('#hfSizeId').val(),
        "IsActive": $('#chkIsActive').is(":checked"),
        "IsStock": $('#chkIsStock').is(":checked"),
        "ListingStatus": $('#chkListingStatus').is(":checked"),
        "DeliveryStatus": $('#chkDeliveryStatus').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    $('#hfId').val('');
    $('#ddlcategory').val('-1').trigger('change');
    $('#ddlManufacturer').val('-1').trigger('change');
    $('#txtCode').val('');
    $('#txtHead').val('');
    $('#txtCBM').val('');
    $('#txtCostPrice').val('');
    $('#txtNewPrice').val('');
    $('#txtColor').val('');
    $('#hfColorId').val('');
    $('#txtSize').val('');
    $('#hfSizeId').val('');
    $.uniform.update(
           $('#chkIsActive').attr("checked", true)
       );
  
    $.uniform.update(
        $('#chkIsStock').attr("checked", true)
    );

    $.uniform.update(
         $('#chkListingStatus').attr("checked", false)
     );

    $.uniform.update(
         $('#chkDeliveryStatus').attr("checked", false)
     );

    $('#btnSave').val('Save');
    $('#txtCostPrice').attr('readonly', false);
    document.getElementById('file').value = "";
    $('#divImgPreview').empty();
    HName = '';
}

$(document).off('keyup', '#txtCostPrice').on("keyup", "#txtCostPrice", function (event) {
    let w = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(w);
});
///// Clear Data Start ////

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
    var data = new FormData();
    data.append('dataList', JSON.stringify(obj));
    var $file = document.getElementById('file');
    if ($file.files.length > 0) {
        for (var i = 0; i < $file.files.length; i++) {
            data.append('files', $file.files[i]);
        }
    }
    //var obj = JSON.stringify({ "data": data });
    var urlpath = base + Controller + "/Save";
    $331.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: false,
        processData: false,
        data: data,
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
                getItemHead();
              //  BindTable(result.list);
            }
        }
    });

}

$("#txtColor").autocomplete({

    source: function (request, response) {
        let color = $("#txtColor").val();
        var urlpath = base + Controller + "/ColorAutoCompleted";
        $.ajax({
            type: "POST",
            url: urlpath,
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ "color": color }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    notify('danger', "Your Session Is Over,Please Login Again");
                    return false;
                } else if (result.Error != null && result.Error !== "") {
                    return false;
                } else {
                    $('#hfColorId').val("");
                    response(result.ListAutoCpomplete);
                }
            }
        });
    },
    minLength: 1,
    select: function (event, ui) {
        $('#hfColorId').val(ui.item.id);
        let ss = ui.item.label;
        $this = $(this);
        setTimeout(function () {
            $('#txtColor').val(ss);
        }, 1);
    }
});


$("#txtSize").autocomplete({

    source: function (request, response) {

        let size = $("#txtSize").val();
        var urlpath = base + Controller + "/SizeAutoCompleted";
        $.ajax({
            type: "POST",
            url: urlpath,
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ "size": size }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    notify('danger', "Your Session Is Over,Please Login Again");
                    return false;
                } else if (result.Error != null && result.Error !== "") {
                    return false;
                } else {
                    $('#hfSizeId').val("");
                    response(result.ListAutoCpomplete);
                }
            }
        });
    },
    minLength: 1,
    select: function (event, ui) {
        $('#hfSizeId').val(ui.item.id);
        let ss = ui.item.label;
        $this = $(this);
        setTimeout(function () {
            $('#txtSize').val(ss);
        }, 1);
    }
});

// File Show for Upload ///

function fileSelected() {
    let prevImg = '';
    let src = $($('#divImgPreview').children()).attr('src');
    if (src != undefined) {
        if ($($('#divImgPreview').children()).attr('src').split('/')[1] == 'Uploads') {
            prevImg = src;
        }
        else {
            prevImg = $($('#divImgPreview').children()).attr('data-previmg');
        }
    }

    var file = document.getElementById('file').files[0];
    if (file) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    document.getElementById('divImgPreview').innerHTML = ['<img src="', e.target.result, '" data-prevImg="' + prevImg + '" class="clsMyImage" alt="', theFile.name, '" title="', theFile.name, '" style="width:100px; height:100px;"/>'].join('');
                };
            })(file);
            reader.readAsDataURL(file);
        } else {
            alert('Pls upgrade your browser,HTML5 is not supported');
        };
    }
}

//$(document).off('click', '#chkIsActive').on("click", "#chkIsActive", function (event) {
//    let checkBox = $('#chkIsActive').is(":checked");
//    if (checkBox == true) {
//        document.getElementById("lblcheck").innerText = "Continue";
//    } else {
//        document.getElementById("lblcheck").innerText = "Discontinue";
//    }
//});