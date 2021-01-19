var Controller = "CustomerPrice", ItemController = "ItemEntry", checkValue='';
$("span#sidebar-toggle").trigger('click');

$(document).ready(function () {
    $('#txtFrom').datepicker({
        dateFormat: 'dd-M-yy',
        onSelect: function (dateText) {
            $("#txtTo").val('');
            $("#txtTo").datepicker("destroy");
            $('#txtTo').datepicker({
                dateFormat: 'dd-M-yy',
                //  maxDate: new Date(),
                minDate: new Date(dateText)
            });
        }
    });
    $('#ddlCustomer').select2();
    loadPostPaidCustomer();
    getSellingPrice();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });

});

// Initial Load//

function loadPostPaidCustomer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadPostPaidCustomer",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            debugger;
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlCustomer'));
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
}

function getSellingPrice() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetAllData",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        //  data: JSON.stringify({ "headId": headId }),
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

$(document).on('click', '#chkSale1', function () {
    let price = $('#chkSale1').is(':checked');
    if (price == true) {
        checkValue = '1';
        $.uniform.update(
          $('#chkSale2').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSale3').attr("checked", false)
      );
        $.uniform.update(
          $('#chkRetail').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSpecial').attr("checked", false)
      );
        $.uniform.update(
        $('#chkWholeSale').attr("checked", false)
    );
    } else { checkValue = ''; }
});

$(document).on('click', '#chkSale2', function () {
    let price = $('#chkSale2').is(':checked');
    if (price == true) {
        checkValue = '2';
        $.uniform.update(
          $('#chkSale1').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSale3').attr("checked", false)
      );
        $.uniform.update(
          $('#chkRetail').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSpecial').attr("checked", false)
      );
        $.uniform.update(
        $('#chkWholeSale').attr("checked", false)
    );
    } else { checkValue = ''; }
});

$(document).on('click', '#chkSale3', function () {
    let price = $('#chkSale3').is(':checked');
    if (price == true) {
        checkValue = '3';
        $.uniform.update(
         $('#chkSale2').attr("checked", false)
     );
        $.uniform.update(
          $('#chkSale1').attr("checked", false)
      );
        $.uniform.update(
          $('#chkRetail').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSpecial').attr("checked", false)
      );
        $.uniform.update(
        $('#chkWholeSale').attr("checked", false)
    );
    } else { checkValue = ''; }
});


$(document).on('click', '#chkSpecial', function () {
    let price = $('#chkSpecial').is(':checked');
    if (price == true) {
        checkValue = '5';
        $.uniform.update(
         $('#chkSale2').attr("checked", false)
     );
        $.uniform.update(
          $('#chkSale3').attr("checked", false)
      );
        $.uniform.update(
          $('#chkRetail').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSale1').attr("checked", false)
      );
        $.uniform.update(
        $('#chkWholeSale').attr("checked", false)
    );
    } else { checkValue = ''; }
});


$(document).on('click', '#chkRetail', function () {
    let price = $('#chkRetail').is(':checked');
    if (price == true) {
        checkValue = '4';
        $.uniform.update(
         $('#chkSale2').attr("checked", false)
     );
        $.uniform.update(
          $('#chkSale3').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSale1').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSpecial').attr("checked", false)
      );
        $.uniform.update(
         $('#chkWholeSale').attr("checked", false)
     );
    } else { checkValue = ''; }
});


$(document).on('click', '#chkWholeSale', function () {
    let price = $('#chkWholeSale').is(':checked');
    if (price == true) {
        checkValue = '6';
        $.uniform.update(
         $('#chkSale2').attr("checked", false)
     );
        $.uniform.update(
          $('#chkSale3').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSale1').attr("checked", false)
      );
        $.uniform.update(
          $('#chkSpecial').attr("checked", false)
      );
        $.uniform.update(
          $('#chkRetail').attr("checked", false)
      );
    } else { checkValue = ''; }
});


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

function SaveValidation() {
    let valid = true;
    if ($('#ddlCustomer').val() == '-1') {
        $('#s2id_ddlCustomer').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Customer Requried !', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlCustomer').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }

    if (checkValue == '') {
        $.pnotify({ text: 'Price Checked Requried !', type: 'error' });
        valid = false;
        return valid;
    }

    return valid;
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

function GetSaveObject() {
    let obj = {
        "SellingPriceId": $('#hfId').val(),
        "CustomerId": $('#ddlCustomer').val(),
        "FromDate": $('#txtFrom').val(),
        "ToDate": $('#txtTo').val(),
        "PriceId": checkValue
    }
    return obj;
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
                $.pnotify({ text: 'Already Exits. You Can Update Only.!', type: 'error' });
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
              '<th>Customer Name</th>' +
              '<th>Price Set</th>' +
              '<th>From Date</th>' +
              '<th>To Date</th>' +
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
                '<td class="customer"><input type="hidden" class="customerId" value="' + element.CustomerId + '"/>' + element.IHeadCode + '</td>' +
                '<td class="price"><input type="hidden" class="priceId" value="' + element.PriceId + '"/>' + element.IHeadName + '</td>' +
                '<td class="FromDate">' + element.FromDate + '</td>' +
                '<td class="ToDate">' + element.ToDate + '</td>' +
                '<td><span data-id="' + element.SellingPriceId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                 '<span data-id="' + element.SellingPriceId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
                '</td>' +
        '</tr>';
        });

    }
    return content;
}

function ClearData() {
    $('#ddlCustomer').val('-1').trigger('change');
    $.uniform.update(
          $('.uniform').attr("checked", false)
      );
    $('#hfId').val('0');
    $('#txtFrom').val('');
    $('#txtTo').val('');
    checkValue = '';
    $('#btnSave').val('Save');
}

$(document).off('click', '.edit').on('click', '.edit', function () {
    let tblRow = $(this).closest('tr');
    let id = $(this).attr('data-id');
    let customerId = $(tblRow).find('.customerId').val();
    let priceId = $(tblRow).find('.priceId').val();
    let fromDate = $(tblRow).find('.FromDate').text();
    let toDate = $(tblRow).find('.ToDate').text();
    $('#hfId').val(id);
    $('#txtFrom').val(fromDate);
    $('#txtTo').val(toDate);
    $('#ddlCustomer').val(customerId).trigger('change');
    $.uniform.update(
          $('.uniform').attr("checked", false)
      );
    checkValue = priceId;
    switch (checkValue) {
        case "1":
            $.uniform.update(
            $('#chkSale1').attr("checked", true));
            break;
        case "2":
            $.uniform.update(
            $('#chkSale2').attr("checked", true));
            break;
        case "3":
            $.uniform.update(
            $('#chkSale3').attr("checked", true));
            break;
        case "4":
            $.uniform.update(
            $('#chkRetail').attr("checked", true));
            break;
        case "5":
            $.uniform.update(
            $('#chkSpecial').attr("checked", true));
            break;
        case "6":
            $.uniform.update(
            $('#chkWholeSale').attr("checked", true));
            break;
    }
   

    window.scrollTo(0, 0);
    $('#btnSave').val('Update');
});
$(document).off('click', '.delete').on('click', '.delete', function () {
    let id = $(this).attr('data-id');
    $.msgbox("Are you sure that you want to permanently delete ?", {
        type: "confirm",
        buttons: [
            { type: "submit", value: "Yes" },
            { type: "submit", value: "No" }
        ]
    }, function (result) {
        if (result == "Yes") {
            $("#divTable").empty();

            let obj = {
                "SellingPriceId": id
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

    }
    );
});