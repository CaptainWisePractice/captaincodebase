var Controller = "ItemCheckIn", addIndex = 22, cusList = [];

$("span#sidebar-toggle").trigger('click');
loadCustomer()
$("#ddlCustomer").select2();

function loadCustomer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadCustomer",
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
                LoadDropdown(result.listComboData, $('#ddlCustomer'));
                cusList = [];
                cusList = result.listComboData;
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

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
}


$("#ddlCustomer").change(function () {
    
    if ($('#ddlCustomer').val() !== '-1') {
        var imlst = $.grep(cusList,
            function (x) {
                if ('' + x.Value + '' === $('#ddlCustomer').val()) {
                    return x;
                }
            });
        $('#txtCustomerInfo').val(imlst[0].ValueStr);
        imlst = [];
        Loaddatatable($(this).val());
    }
    else { $('#txtCustomerInfo').val(''); }
});


function Loaddatatable(CustomerId) {
    var urlpath = base + Controller + "/GetCheckOutDataByCustomerId";
    let obj = {
        "CustomerId": CustomerId
    }
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
                BindTable(result.listItemCheckIn);
            }
        }
    });
}

function BindTable(result) {
    $('#tbl tbody').empty();
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td >' + (index + 1) + '</td>' +
                '<td >' + element.IHeadCode + ' <input type="hidden" id="hfIHeadId' + index + '" Value="' + element.IHeadId + '" class="span12 IHeadId"/></td>' +
                '<td class="IHeadName">' + element.IHeadName + '</td>' +
                '<td >' + element.LocName + ' <input type="hidden" id="hfLocId' + index + '" Value="' + element.LocId + '" class="span12 LocId"/></td>' +
                '<td class="CheckOutQty">' + element.CheckInQty + '</td>' +
                '<td class="CheckInQty">' + element.CheckInQty + '</td>' +
             
        '</tr>';
        });
    }
    $('#tbl tbody').append(content);
}

$('#btnSave').on('click', function () {
    if (validation() == true) {
        var objList = GetSaveObject();
        var urlpath = base + Controller + "/CheckInSave";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "objList": objList }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                    ClearData();
                }
            }
        });
    }
    else {
        $.pnotify({ text: "Plz Fillup Red Marks Field", type: 'error' });
    }
});


function validation() {
    let valid = true;
    if ($('#ddlCustomer').val() == '-1') {
        $.pnotify({ text: 'Customer Requried', type: 'error' });
        valid = false;
        return valid;
    }
    //if ($('#txtCode').val() == '') {
    //    $.pnotify({ text: 'Code Requried', type: 'error' });
    //    $('#txtCode').focus();
    //    valid = false;
    //    return valid;
    //}
   
    return valid;
}

function GetSaveObject() {
    let obj = [];
    $("#tbl tr:gt(0)").each(function () {
        
        let aobj = {
            "IHeadId" : $(this).children('td:eq(1)').find("Input").val(),
            "LocId": $(this).children('td:eq(3)').find("Input").val(),
            "CheckInQty": $(this).children('td:eq(4)')[0].innerText.trim(),//$(this).children('td:eq(4)').find(".CheckOutQty").val(),
            "CustomerId": $("#ddlCustomer").val()
        }
        obj.push(aobj);
        debugger;
    });
    return obj;
}

function ClearData() {
    $("#ddlCustomer").val('-1').trigger('change');
    $("#txtCustomerInfo").val('');
    $('#tbl tbody').empty();
   
}

$('#btnRefresh').on('click', function () {
    ClearData();
});
$('#btnCancel').on('click', function () {
    window.history.back();
});
