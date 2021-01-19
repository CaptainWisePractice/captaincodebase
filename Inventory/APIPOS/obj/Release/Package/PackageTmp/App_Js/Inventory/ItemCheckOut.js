var Controller = "ItemCheckOut", addIndex = 22, headList = [], locList = [];

    $("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    LoadTable(0);
    $('#txtDueDate').datepicker({ dateFormat: 'dd-M-yy', minDate: new Date() });

});

function LoadTable(ind) {
    $("#idtbody").empty();
    let content = '';
    content += '<tr>' +
         '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
              '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
          '</td>' +
               //'<td><button type="button" class="btn btn-mini icol-add btnAdd"></button> &nbsp &nbsp ' +
               //'<button type="button" class="btn btn-mini icol-cancel btnRemove"></button>' +
               //'</td>' +
              '<td><select id="ddlHead' + ind + '" class="span12 ddlHead">' + loadItemHead(ind) + '</select></td>' +
              '<td><input type="text" id="txtHeadDesc' + ind + '" Value="" class="span12 txtHeadDesc"/></td>' +
              '<td><select id="ddlItem' + ind + '" class="span12 ddlItem">' + loadItem(ind, ind) + '</select></td>' +
              '<td><select id="ddlLocation' + ind + '" class="span12 ddlLocation">' + loadLocation(ind) + '</select></td>' +
              '<td><input type="text" id="txtStock' + ind + '"  Value="" class="span12 txtStock" readonly/></td>' +
              '<td><input type="text" id="txtQty' + ind + '"  Value="" class="span12 Qty"/></td>' +
              '</tr>';

            $('#tbl tbody').append(content);
            $('#ddlHead' + ind + "").select2();
            $('#ddlLocation' + ind + "").select2();
}

function loadItemHead(index) {
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
                LoadDropdown(result.listComboData, $('#ddlHead' + index));
                headList = [];
                headList = result.listComboData;
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadLocation(index) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadLocation",
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
                LoadDropdown(result.listComboData, $('#ddlLocation'+ index));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}


function loadItem(headId,index) {
    if (headId != 0) {
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: base + Controller + "/loadItem",
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "headId": headId }),
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
                    $("#ddlItem" + index)[0].options.length = 0;
                    
                    $('#ddlItem'+index + ' option').remove();
                    $.each(result.listComboData, function (i, obj) {
                        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                    });
                    $('#ddlItem' + index).append(content);
                    $('#ddlItem' + index).multipleSelect({
                        filter: true,
                        includeSelectAllOption: true,
                        placeholder: 'Item Number'
                    });
                    $('.ms-parent button').addClass('btn2');
                    $('.ms-parent button').show();
                    $('#ddlItem' + index).multipleSelect("checkAll");
                }
            },
            error: function (a, b, c) {
                $.pnotify({ text: 'Something Wrong', type: 'error' });
            }
        });
    }
}

//$(document).off('change', '.ddlItem').on('change', '.ddlItem', function () {
//        var index = this.id.slice(7); //$(this).closest('tr').index();
//        let id = "#ddlItem" + index;
//        let itm = $(id).multipleSelect('getSelects').join(', ');
//        
//       // let itmdata = item.join(', ');
      
//        if (itm != '') {

//        }
//      //  LoadLocationByheadId(headId, index);

//});


//// Dropdown load
function LoadDropdown(result, id) {
    $(id)[0].options.length = 0;
    var content = '';
    content = '<option  value="-1">-- Select --</option>';
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

$(document).off('click', '.btnAdd').on('click', '.btnAdd', function () {
    if (validationADD() === true) {
        var rowindex = $('#tbl tbody tr').length;
        addIndex = addIndex + rowindex;
        var content = addRow(addIndex);
        $("#tbl").append(content);
        $('#ddlHead' + addIndex + "").select2();
        $('#ddlLocation' + addIndex + "").select2();
        //loadItemHead(addIndex);
        //loadLocation(addIndex);

    }

});

$(document).off('click', '.btnRemove').on('click', '.btnRemove', function () {
    var index = $(this).closest('tr').index();
    var finishe = $(this).closest('tr');
    if (index !== 0) {
            $(this).closest('tr').remove();
    }
});

function addRow(addIndex) {
    var content = '';
    content += '<tr>' +
          '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
                 '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
          '</td>' +
               //'<td><button type="button" class="btn btn-mini icol-add btnAdd"></button> &nbsp &nbsp ' +
               //'<button type="button" class="btn btn-mini icol-cancel btnRemove"></button>' +
               //'</td>' +
               '<td><select id="ddlHead' + addIndex + '" class="span12 ddlHead">' + loadItemHead(addIndex) + '</select></td>' +
               '<td><input type="text" id="txtHeadDesc' + addIndex + '" class="span12 txtHeadDesc"/></td>' +
               '<td><select id="ddlItem' + addIndex + '" class="span12 ddlItem">' + loadItem(0, addIndex) + '</select></td>' +
               '<td><select id="ddlLocation' + addIndex + '" class="span12 ddlLocation">' + loadLocation(addIndex) + '</select></td>' +
                '<td><input type="text" id="txtStock' + addIndex + '" class="span12 txtStock" readonly/></td>' +
               '<td><input type="text" id="txtQty' + addIndex + '" class="span12 Qty"/></td>' +
        '</tr>';
    return content;
}

$(document).off('keyup', '.Qty').on("keyup", ".Qty", function (event) {
    let a = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(a);
});

$(document).off('change', '.ddlHead').on('change', '.ddlHead', function () {
    if ($(this).val() !== '-1') {
      
        var index = this.id.slice(7); //$(this).closest('tr').index();
        var itmName = $(this).closest("tr")[0].cells[2].childNodes[0].id;
        var r = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var qty = $(this).closest("tr")[0].cells[6].childNodes[0].id;
     
        var headId = $(this).val();
        var imlst = $.grep(headList,
          function (x) {
             
              if ('' + x.Value + '' === headId) {
                  return x;
              }
          });

        $('#' + itmName).val(imlst[0].ValueStr);
        imlst = [];

        $('#' + r).val('');
        $('#' + qty).val('');
        LoadLocationByheadId(headId, index);
        loadItem(headId, index);

    }
});

function LoadLocationByheadId(headId, index) {

    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadLocationByHeadId",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "headId": headId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlLocation' + index));
                locList = [];
                locList = result.listComboData;
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });

}

$(document).off('change', '.ddlLocation').on('change', '.ddlLocation', function () {
    if ($(this).val() !== '-1') {
        
        var stockqty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var qty = $(this).closest("tr")[0].cells[6].childNodes[0].id;
        var locId = $(this).val();
        var imlst = $.grep(locList,
          function (x) {

              if ('' + x.Value + '' === locId) {
                  return x;
              }
          });

        $('#' + stockqty).val(imlst[0].ValueStr);
        imlst = [];
        $('#' + qty).val('');
    }
});

$(document).off('change', '.Qty').on('change', '.Qty', function () {
    if ($(this).val() !== '' || $(this).val() !== '0') {
        
        var stockqty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        let b = parseInt($(this).val());
        let aa = parseInt($('#' + stockqty).val());
        
        if (aa < b) {
            $.pnotify({ text: 'Must Less Or Equal to In Hand Qty', type: 'error' });
            $(this).val('');
        }
       
    }
});


$('#btnSave').on('click', function () {
    if (validationADD() == true && OtherValidation() == true) {

        var obj = {
            "CustomerName": $("#txtCustomerName").val(),
            "ContractNo": $("#txtContractNo").val(),
            "CustomerInfo": $("#txtCustomerInfo").val(),
            "DueDate": $("#txtDueDate").val(),
            "Note": $("#txtNotes").val(),
            "Email": $("#txtMail").val()
        };

        var objList = GetSaveObject();
        var urlpath = base + Controller + "/Save";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "obj": obj, "objList": objList }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                    LoadTable(0);
                    ClearData();
                }
            }
        });
    }
    else {
        $.pnotify({ text: "Plz Fillup Red Marks Field", type: 'error' });
    }
});

function validationADD() {
    var isresult = true;
    $("#tbl tr:gt(0)").each(function () {
        
        var headId = $(this).children('td:eq(1)').find("select").val();
        var locId = $(this).children('td:eq(4)').find("select").val();
        let itm = $(this)[0].cells[3].childNodes[0].id;
        let id = "#" + itm;
        let itmdata = $(id).multipleSelect('getSelects').join(',');
        var qty = $(this).children('td:eq(6)').find("input").val();
        if (headId === "undefined" || headId === "-1") {
            $(this).children('td:eq(1)').find(".select2-choice").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if (itmdata === "") {
            $(this).children('td:eq(3)').find(".ms-parent").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(3)').find(".ms-parent").css({ 'border': '1px solid #aaa' });
        }

        if (locId === "undefined" || locId === "-1") {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if (qty === "undefined" || qty === "" || qty === "0") {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

    });
    if (isresult)
        isresult = true;
    else {
        isresult = false;

    }
    return isresult;

}

function OtherValidation() {
    let valid = true;
    if ($('#txtCustomerName').val() == '') {
        $('#txtCustomerName').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Customer Name Requried', type: 'error' });
        $('#txtCustomerName').focus();
        valid = false;
        return valid;
    } else { $('#txtCustomerName').css({ 'border': '1px solid #aaa' }); }

    if ($('#txtContractNo').val() == '') {
        $('#txtContractNo').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Contract No Requried', type: 'error' });
        $('#txtContractNo').focus();
        valid = false;
        return valid;
    } else { $('#txtContractNo').css({ 'border': '1px solid #aaa' }); }

    if ($('#txtCustomerInfo').val() == '') {
        $('#txtCustomerInfo').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Information Requried', type: 'error' });
        $('#txtCustomerInfo').focus();
        valid = false;
        return valid;
    } else { $('#txtCustomerInfo').css({ 'border': '1px solid #aaa' }); }
   
    return valid;
}

function GetSaveObject() {
    let obj = [];
    $("#tbl tr:gt(0)").each(function () {

        let itm = $(this)[0].cells[3].childNodes[0].id;
        let id = "#" + itm;
        let itmdata = $(id).multipleSelect('getSelects').join(',');
        
        let aobj = {
            "IHeadId" : $(this).children('td:eq(1)').find("select").val(),
            "LocId": $(this).children('td:eq(4)').find("select").val(),
            "CheckInQty": $(this).children('td:eq(6)').find("input").val(),
            "Item": itmdata
        }
        obj.push(aobj);
    });
    return obj;
}

function ClearData() {
    $("#txtContractNo").val('');
    $("#txtDueDate").val('');
    $("#txtCustomerName").val('');
    $("#txtCustomerInfo").val('');
    $("#txtNotes").val('');
    $("#txtMail").val('');
}

$('#btnRefresh').on('click', function () {
    ClearData();
    LoadTable(0);
});
$('#btnCancel').on('click', function () {
    window.history.back();
});

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

