
$("span#sidebar-toggle").trigger('click');

    //set initial state.
    LoadinitialData();

function LoadinitialData() {

    var url = base + 'ItemCategory/LoadCategory';
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: url,
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            BuildTable(data);
        },
        error: function (a, b, c) {
            ShowCustomDialog(formatErrorMessage(a, c), 'Load Error');
        }

    });

}

function BuildTable(data) {
    if (data != null) {
        var tbl_Header = '<table class="table table-striped" id="tbl">' +
              '<thead>' +
              '<tr>' +
              '<th>SL#</th>' +
              '<th>Name</th>' +
              '<th>Code</th>' +
              //'<th>Is Active</th>' +
              '<th> Edit </th>' +
               '<th> Delete </th>' +
              '</tr>' +
              '</thead>' +
              '<tbody>';
        var tbl_lastPart = '</tbody></table>';
        var tbl_tr = '';
        $.each(data, function (i, obj) {
            tbl_tr += '<tr>' +
                                           '<td>' + (i + 1) + '</td>' +
                                           '<td class="category">' + obj.ItmCategory + '</td>' +
                                           '<td class="code">' + obj.ItemCode + '</td>' +
                                           //'<td class="isactive">' + obj.IsActive + '</td>' +
                                           '<td><span data-id="' + obj.CategotyId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                                           '</td>' +
                                            '<td><span data-id="' + obj.CategotyId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
                                           '</td>' +
                                           
                                 '</tr>';
        });
        $('.table-container').html('');
        $('.table-container').append(tbl_Header + tbl_tr + tbl_lastPart);
        $('#tbl').dataTable();
        //$('#dt_a').DataTable({
        //    scrollY: '50vh',
        //    scrollCollapse: true,
        //    ordering: true,
        //    searching: true,
        //    paging: true

        //});
    }
}

$('#btnSave').on('click',
    function () {
   
        let save = $('#btnSave').val();
        if (save == 'Save') {
            DuplicateCheck();
        }
        else { saveData(); }
       
        //$('#modal_Category').modal('hide');
        //if (DuplicateCheck()) {
        //    saveData();
        //}
    });

function saveData() {
    var url = base + 'ItemCategory/SaveData';
    var objSave = new Object();
    objSave.CategotyId = $('#idCategoty').val() === '' ? '0' : $('#idCategoty').val();
    objSave.ItemCode = $('#txtCode').val() === '' ? '' : $('#txtCode').val();
    objSave.ItmCategory = $('#txtItemCategory').val();
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: url,
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ "obj": objSave }),
            success: function (data) {
                
                //if (data.isSessionOut != null) {
                //    ShowCustomDialog("Your Session Timed Out, Please Login Again");
                //    return false;
                //}
                if (data.Error != null) {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                }
                if (data.Status) {

                    let save = $('#btnSave').val();
                    if (save == 'Save') {
                        $.pnotify({ text: 'Save Successfully', type: 'success' });
                    }
                    else {
                        $.pnotify({ text: 'Update Successfully', type: 'success' });
                    }
                    ClearData();
                    BuildTable(data.ICategories);
                 
                } else {
                    BuildTable(data.ICategories);
                }
            },
            error: function () {
                notify('danger', 'Server is not responding');
            }
        });

}

function ClearData() {
   
    $('#txtItemCategory').val('');
    $('#txtCode').val('');
    $('#idCategoty').val('');
    $('#btnSave').val('Save');
}


// Validation


function DuplicateCheck() {
    var objSave = new Object();
    objSave.CategotyId = $('#idCategoty').val().trim() === '' ? '0' : $('#idCategoty').val().trim();
    objSave.ItemCode = $('#txtCode').val().trim() === '' ? '' : $('#txtCode').val().trim();
    objSave.ItmCategory = $('#txtItemCategory').val();
    
    if (objSave.ItmCategory === "") {
        $.pnotify({ text: 'Category Requried', type: 'error' });
        $('#txtItemCategory').focus();
        return false;
    } else {
        var urlpath = base + "ItemCategory/DuplicateCheck";
        $.ajax({
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "obj": objSave }),
            success: function (data) {
                
                if (data.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                }
                
                if (data.Save_error === "True") {
                    $.pnotify({ text: 'Already Exits..!', type: 'error' });
                    return false;
                }
                else { saveData(); }
                return false;
            },
            error: function (a, b, c) {
                window.ShowCustomDialog(a, c, "Error in saving Data");
            }
        });
    }

}


//function SaveValidation() {
//    let valid = true;
//    if ($("#hfId").val() == "") {
//        $("#tbl tbody tr").each(function () {
//            let name = $(this).find('.category').text().toLowerCase();
//            let txtName = $('#txtItemCategory').val().toLowerCase();
//            if (name == txtName) {
//                $.pnotify({ text: 'Already Exist', type: 'error' });
//                valid = false;
//                return valid;
//            }
//        });
//    }
//    return valid;
//}


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
    let category = $(tblRow).find('.category').text();
    let code = $(tblRow).find('.code').text();
    
    //let IsActive = ($(tblRow).find('.isactive').text() === 'True')? true : false;
    $('#idCategoty').val(id);
    $('#txtItemCategory').val(category);
    $('#txtCode').val(code);
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
            var url = base + 'ItemCategory/Delete';
          
            var urlpath = url;
            $.ajax({
                beforeSend: function () { $.blockUI(); },
                complete: function () { $.unblockUI(); },
                type: "POST",
                url: urlpath,
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                data: JSON.stringify({ "id": id }),
                success: function (result) {
                    if (result.Error != null && result.Error != "") {
                        $.pnotify({ text: result.Error, type: 'error' });
                        return false;
                    } else {
                        $.pnotify({ text: 'Delete Successfully', type: 'success' });
                        BuildTable(result.ICategories);
                    }
                }
            });
        }
        else if (result == "No") {
            $.pnotify({ text: "Cancel Delete Operation", type: 'info' });
        }
    });

});



