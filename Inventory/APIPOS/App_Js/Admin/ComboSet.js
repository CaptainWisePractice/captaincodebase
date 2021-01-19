var Controller = "ComboItemSet", addIndex = 0;//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');

$(document).ready(function () {
   // loadIheadNameList();
    getComboSetdata();

    BindHeadGrid(0);
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
});
///// Initial Load Method Start////
function getComboSetdata() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/getComboSetdata",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({text: result.IsSessionOut, type: 'info'
                });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({text: result.Error,type: 'error'});
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

function BindHeadGrid(ind) {
   
    $("#idtbody").empty();
    let content = '';
    content += '<tr>' +
       '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
          '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
       '</td>' +
       '<td><input type="text" id="txtHeadCode' + ind + '" class="span12 txtHeadCode"/><input type="hidden" id="hfHeadCode' + ind + '"/></td>' +
       '<td><input type="text" id="txtQty' + ind + '" class="span12 txtQty numeric"/><input type="hidden" id="hfComboDetId' + ind + '" value="0"/></td>' +
       '<td><input type="text" id="txtItemPrice' + ind + '" class="span12 txtItemPrice numeric"/></td>' +
       '</tr>';
    $('#DetailTable tbody').append(content);
    auto('', 0);
}
$(document).off('click', '.btnAdd').on('click', '.btnAdd', function () {

    if (validationADD() === true) {
        var rowindex = $('#DetailTable tbody tr').length;
        var addNewIndex = addIndex + rowindex;
        var content = addRow(addNewIndex);
        $("#DetailTable").append(content);
       
    }

});

function addRow(addIndex) {
    var content = '';
    content += '<tr>' +
               '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
               '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
               '</td>' +
               '<td><input type="text" id="txtHeadCode' + addIndex + '" class="span12 txtHeadCode"/><input type="hidden" id="hfHeadCode' + addIndex + '"/></td>' +
               '<td><input type="text" id="txtQty' + addIndex + '" class="span12 txtQty numeric"/><input type="hidden" id="hfComboDetId' + addIndex + '" value="0"/></td>' +
               '<td><input type="text" id="txtItemPrice' + addIndex + '" class="span12 txtItemPrice numeric"/></td>' +
        '</tr>';
    return content;
}

function validationADD() {
    var isresult = true;
    $("#DetailTable tr:gt(0)").each(function () {

        var headId = $(this).children('td:eq(1)').find('input[type="hidden"]').val();//ddlHead
        var qty = $(this).children('td:eq(2)').find("input").val();

        if (headId == undefined || headId == "" || headId == "0") {
            $(this).children('td:eq(1)').find(".txtHeadCode").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".txtHeadCode").css({ 'border': '1px solid #aaa' });
        }

        if (qty == undefined || qty == "" || qty == "0") {
            $(this).children('td:eq(2)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(2)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

    });
    if (isresult)
        return isresult = true;
    else {
        return isresult = false;
    }
    return isresult;

}


$(".numeric").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

$(document).off('click', '.btnRemove').on('click', '.btnRemove', function () {
    debugger
    var index = $(this).closest('tr').index();
    var finishe = $(this).closest('tr');
    var DetsItemId = $(this).closest('tr')[0].cells[2].childNodes[1].value;
    if ($("#DetailTable")[0].rows.length > 1) {
        if (DetsItemId == "0") {
            $(this).closest('tr').remove();
        } else {
            $.msgbox("Are you sure that you want to Delete ?", {
                type: "confirm",
                buttons: [
                    { type: "submit", value: "Yes" },
                    { type: "submit", value: "No" }
                ]
            }, function (result) {
                if (result == "Yes") {
                    var urlpath = base + Controller + "/ComboItemDetailIdDelete";
                    $.ajax({
                        beforeSend: function () { $.blockUI(); },
                        complete: function () { $.unblockUI(); },
                        type: "POST",
                        url: urlpath,
                        contentType: "application/json;charset=utf-8",
                        dataType: "JSON",
                        data: JSON.stringify({ "DetsItemId": DetsItemId }),
                        success: function (result) {
                            if (result.IsSessionOut != null) {
                                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                                return false;
                            } else if (result.Error != null && result.Error != "") {
                                $.pnotify({ text: result.Error, type: 'error' });
                                return false;
                            } else {
                                finishe.remove();
                            }
                        }
                    });
                }
                else if (result == "No") {
                    $.pnotify({ text: "Cancel Operation", type: 'info' });
                }
            });

        }
    }
   
});

$(document).on('keyup', '.txtHeadCode', function (parameters) {
    var v = $(this).val();
    //var tblRow = $(this).closest('tr');
    var index = $(this).closest('tr').index();
    auto(v, index);
});

function auto(txtval, index) {
    $(".txtHeadCode").autocomplete({
        source: function (request, response) {
            var aObj = {
                "Description": txtval
            };
            var urlpath = base + Controller + "/GetItemHeadAutoComplete";
            $.ajax({
                type: "POST",
                url: urlpath,
                dataType: "JSON",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({ "aObj": aObj }),
                success: function (result) {
                    if (result.IsSessionOut != null) {
                        $.pnotify({ text: "Your Session Is Over,Please Login Again", type: 'error' });
                        return false;
                    } else if (result.Error != null && result.Error != "") {
                        $.pnotify({ text: result.Error, type: 'error' });
                        return false;
                    } else {
                       
                        response(result.ListAutoCpomplete);
                    }
                },
                error: function (errRes) {
                    $.pnotify({ text: errRes, type: 'error' });
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
 
            $("#hfHeadCode" + index).val(ui.item.id)
            let txt = ui.item.label;
            setTimeout(function () {
                $("#txtHeadCode" + index).val(txt)
            }, 1);
           
        }
    });
}

function loadIheadNameList() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadItemHead",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        //  data: JSON.stringify({ "headId": headId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                var content = '';
                //  LoadDropdown(result.listComboData, $('#ddlItem' + index));
                $("#ddlItemHead")[0].options.length = 0;
                $('#ddlItemHead option').remove();
                $.each(result.listComboData, function (i, obj) {
                    content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                });
                $('#ddlItemHead').append(content);
                $('#ddlItemHead').multipleSelect({
                    filter: true,
                    includeSelectAllOption: true,
                    placeholder: 'Item Head List',
                    minimumCountSelected: 6,
                    selectAllDelimiter: ['[',']'],
                    delimiter: ',',
                });
                $('.ms-parent button').addClass('btn2');
                $('.ms-parent button').show();

                $('#ddlItemHead').multipleSelect("uncheckAll");
               
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
              '<th>IsActive</th>' +
              '<th> Action </th>' +
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
                '<td class="comboName">' + element.ComboName + '</td>' +
                '<td class="description">' + element.Description + '</td>' +
                '<td class="IsActive">' + ischeck + '</td>' +
                '<td><span data-id="' + element.ComboSetId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                 '<span data-id="' + element.ComboSetId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
                '</td>' +
        '</tr>';
        });

    }
    return content;
}
///// End Table ////
///// Start Button Click ////
$('#btnSave').on('click', function () {
    if ((SaveValidation() == true) && (validationADD() == true)) {
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

    let name = $(tblRow).find('.comboName').text();
    let description = $(tblRow).find('.description').text();
    let IsActive = ($(tblRow).find('.IsActive').text().trim() == "Continue") ? true : false;
    $('#hfComboSetId').val(id);
    $('#txtComboName').val(name);
    $('#txtDescription').val(description);
    getComboSetdataById(id);
   // $("#ddlItemHead").multipleSelect('setSelects', selectedOptions);

    $.uniform.update(
          $('#chkIsActive').attr("checked", IsActive)
      );    
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
                "ComboSetId": id
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
        if ($('#txtComboName').val() == '') {
            $('#txtComboName').css({ 'border': '1px solid red' });
            $.pnotify({ text: 'Combo Code Requried', type: 'error' });
            $('#txtComboName').focus();
            valid = false;
            return valid;
        } else { $('#txtComboName').css({ 'border': '1px solid #aaa' }); }

        if ($('#txtDescription').val() == '') {
            $('#txtDescription').css({ 'border': '1px solid red' });
            $.pnotify({ text: 'Description Requried', type: 'error' });
            $('#txtDescription').focus();
            valid = false;
            return valid;
        } else { $('#txtDescription').css({ 'border': '1px solid #aaa' }); }

        //if ($("#ddlItemHead").multipleSelect('getSelects').join(',') == "") {
        //    $.pnotify({ text: 'Head Name Requried', type: 'error' });
        //    valid = false;
        //    return valid;
        //}
         let rowId = $(this).find('.delete').attr('data-id');
         let hdId = $('#ComboSetId').val();
         if (rowId != hdId) {
         let name = $(this).find('.name').text().toLowerCase().trim();
         let txtComboName = $('#txtComboName').val().toLowerCase().trim();
          if (name == txtComboName) {
         $.pnotify({ text: 'Name Already Exist', type: 'error' });
         valid = false;
          return valid;
            }
         }

        return valid;
    }
    ///// Validation End ////
///// Create Object ////
function GetSaveObject() {
        let obj = {
            "ComboSetId": $('#hfComboSetId').val(),
            "ComboName": $('#txtComboName').val(),
            "Description": $('#txtDescription').val(),
            "IsActive": $('#chkIsActive').is(":checked"),
            "LstComboSetDetails": getDetailList()
        }
        return obj;
  }
/// End Object ///

function getDetailList() {
    let obj = [];
    $("#DetailTable tr:gt(0)").each(function () {
        let aobj = {
            "IHeadId": $(this).children('td:eq(1)').find('input[type="hidden"]').val(),
            "ComboSetDelailsId": $(this).children('td:eq(2)').find('input[type="hidden"]').val(),
            "Qty": $(this).children('td:eq(2)').find('input').val(),
            "ItemPrice": $(this).children('td:eq(3)').find('input').val() == "" ? 0 : $(this).children('td:eq(3)').find('input').val()
        }
        obj.push(aobj);
    });
    return obj;
}
 /// Clear Data Start ///
function ClearData() {
        $('#hfComboSetId').val('0');
        $('#txtComboName').val('');
        $('#txtDescription').val('');
        $.uniform.update(
               $('#chkIsActive').attr("checked", true)
           );
        $('#btnSave').val('Save');
        $("#idtbody").empty();
        BindHeadGrid(0);
}
 /// Clear Data Start ///
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

function getComboSetdataById(id) {
   
    let obj = {
        "ComboSetId": id
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetComboSetdataById",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "_obj": obj }),
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
                debugger
                griddatabind(result);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function griddatabind(childData) {
  
    $("#idtbody").empty();
    let content = '';
    $.each(childData, function (ind, obj) {

        content = '<tr>' +
         '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
            '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
         '</td>' +
         '<td><input type="text" id="txtHeadCode' + ind + '" value="' + obj.IHeadCode + '" class="span12 txtHeadCode"/><input type="hidden" id="hfHeadCode' + ind + '" value="' + obj.IHeadId + '"/></td>' +
         '<td><input type="text" id="txtQty' + ind + '" value="' + obj.Qty + '" class="span12 txtQty numeric"/><input type="hidden" id="hfComboDetId' + ind + '" value="' + obj.ComboSetDelailsId + '"/></td>' +
          '<td><input type="text" id="txtItemPrice' + ind + '" value="' + obj.ItemPrice + '" class="span12 txtItemPrice numeric"/></td>' +
         '</tr>';
        $('#DetailTable tbody').append(content);
        auto('', 0);
    });
}