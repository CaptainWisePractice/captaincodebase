var Controller = "Customer";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    $('#ddlDesignation').select2();
    $wzd_form = $('#wizard-demo-2').validate({ onsubmit: false });
    $('#wizard-demo-2').wizard({
        onStepLeave: function (wizard, step) {
            return $wzd_form.form();
        },
        onBeforeSubmit: function () {
            return $wzd_form.form();
        }
    });

    $("#divLastName").show();
    $("#lblName").text("First Name");
    loadLocation();
    loadCountry();
    GetCustomerdata();
    GetCustomerNo();
    GetTaxCode();//ddlTaxCode
    GetPaymentTerms();
    loadPaymentMethod();
    $('#wizard-demo-2 .btn-toolbar').remove();
    visibleHiddenAddress();
});
///// Initial Load Method Start////
function loadLocation() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadAddressType",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlCusLocation'), 1);
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function loadCountry() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadCountry",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('.Country'), 9);
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function GetCustomerNo() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetCustomerNo",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                $('#txtCustCode').val(result.list[0].CustCode);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function GetCustomerdata() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetCustomerdata",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
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
function GetTaxCode() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/GetTaxCode",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result, $('#ddlTaxCode'), 5);
                LoadDropdown(result, $('#ddlFreightTaxCode'), 5);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function GetPaymentTerms() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/GetPaymentTerms",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result, $('#ddlPaymentDue'), 2);

            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function loadPaymentMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadPaymentMethod",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result, $('#ddlPaymentMethod'), 5);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

///// Initial Load Method End////

$('#ddlDesignation').on('change', function () {
    if ($(this).val() == 'Individual') {
        $("#divLastName").show();
        $("#lblName").text("First Name");
    } else { $("#divLastName").hide(); $("#lblName").text("Name"); }
});


function visibleHiddenAddress() {
    $('#lblBilToAddress').css({ display: "none" });
    $('#divBilToAddress').css({ display: "none" });
    $('#lblBilToCity').css({ display: "none" });
    $('#divBilToCity').css({ display: "none" });
    $('#divBilToState').css({ display: "none" });
    $('#lblBilToState').css({ display: "none" });
    $('#lblBilToPostCode').css({ display: "none" });
    $('#divBilToPostCode').css({ display: "none" });
    $('#lblBilToCountry').css({ display: "none" });
    $('#divBilToCountry').css({ display: "none" });
    $('#lblShipToAddress').css({ display: "none" });
    $('#divShipToAddress').css({ display: "none" });
    $('#lblShipToCity').css({ display: "none" });
    $('#divShipToCity').css({ display: "none" });
    $('#divShipToState').css({ display: "none" });
    $('#lblShipToState').css({ display: "none" });
    $('#lblShipToPostCode').css({ display: "none" });
    $('#divShipToPostCode').css({ display: "none" });
    $('#lblShipToCountry').css({ display: "none" });
    $('#divShipToCountry').css({ display: "none" });
    let selectedValue = $('#ddlCusLocation option:selected').val();
    if (selectedValue == 1) {
        $('#lblBilToAddress').css({ display: "block" });
        $('#divBilToAddress').css({ display: "block" });
        $('#lblBilToCity').css({ display: "block" });
        $('#divBilToCity').css({ display: "block" });
        $('#divBilToState').css({ display: "block" });
        $('#lblBilToState').css({ display: "block" });
        $('#lblBilToPostCode').css({ display: "block" });
        $('#divBilToPostCode').css({ display: "block" });
        $('#lblBilToCountry').css({ display: "block" });
        $('#divBilToCountry').css({ display: "block" });
    }
    else if (selectedValue == 2) {
        $('#lblShipToAddress').css({ display: "block" });
        $('#divShipToAddress').css({ display: "block" });
        $('#lblShipToCity').css({ display: "block" });
        $('#divShipToCity').css({ display: "block" });
        $('#divShipToState').css({ display: "block" });
        $('#lblShipToState').css({ display: "block" });
        $('#lblShipToPostCode').css({ display: "block" });
        $('#divShipToPostCode').css({ display: "block" });
        $('#lblShipToCountry').css({ display: "block" });
        $('#divShipToCountry').css({ display: "block" });
    }
}
$('#ddlCusLocation').on('change', function () {
    visibleHiddenAddress();
});
$(document).on('change', '#chkShippingAddressSame', function () {
    let BilToAddress = $('#txtBilToAddress').val();
    let BilToCity = $('#txtBilToCity').val();
    let BilToState = $('#txtBilToState').val();
    let BilToPostalCode = $('#txtBilToPostalCode').val();
    let BilToCountry = $('#ddlBilToCountry option:selected').val();
    //let BilToAddress = $('#txtBilToAddress').val();
    if ($(this).is(':checked')) {
        $("#ddlCusLocation").prop("disabled", true);
        $("#ddlCusLocation").select2();
        $('#txtShipToAddress').val(BilToAddress);
        $('#txtShipToCity').val(BilToCity);
        $('#txtShipToState').val(BilToState);
        $('#txtShipToPostalCode').val(BilToPostalCode);
        $('#ddlShipToCountry').val(BilToCountry).trigger('change');
    }
    else {
        $("#ddlCusLocation").prop("disabled", false);
        $("#ddlCusLocation").select2();
        $('#txtShipToAddress').val('');
        $('#txtShipToCity').val('');
        $('#txtShipToState').val('');
        $('#txtShipToPostalCode').val('');
        $('#ddlShipToCountry').val(9).trigger('change');
    }
});

//// Dropdown load
function LoadDropdown(result, id, selectedValue) {
    $(id).get(0).options.length = 0;
    var content = '';
    $.each(result, function (i, obj) {
        content += '<option ValueStr="' + obj.ValueStr + '"  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    $(id).append(content);
    $(id).val(selectedValue).trigger('change');
    $(id).select2();
}
///// Start Table ////
function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableInitialRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#tbl').dataTable();
}
function TableHeader() {
    let content = '';
    content = '<table class="table table-striped" id="tbl">' +
       '<thead>' +
              '<tr>' +
              //'<th>SL#</th>' +
              '<th>Customer No.</th>' +
              '<th>Name</th>' +
              '<th>Last Name</th>' +
              '<th>Phone No. 1</th>' +
               '<th>Email</th>' +
              '<th>Inactive Card</th>' +
              '<th> Action </th>' +
              '</tr>' +
              '</thead>';
    return content;
}
function TableInitialRow(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {

            let BillToAddress = '', BillToCity = '', BillToPostalCode = '', BillToState = '', BillToCountryID = '';
            let ShipToAddress = '', ShipToCity = '', ShipToPostalCode = '', ShipToState = '', ShipToCountryID = '';
            if (element.lstCustAddress != null) {
                $(element.lstCustAddress).each(function (index2, element2) {
                    if (element2.AddrTypeID == 1) {
                        BillToAddress = element2.Address; BillToCity = element2.City; BillToPostalCode = element2.PostalCode, BillToState = element2.State, BillToCountryID = element2.CountryID;
                    }
                    else if (element2.AddrTypeID == 2) {
                        ShipToAddress = element2.Address; ShipToCity = element2.City; ShipToPostalCode = element2.PostalCode, ShipToState = element2.State, ShipToCountryID = element2.CountryID;
                    }
                });
            }
            let ShippingAddressSame = element.ShippingAddressSame == true ? 'Yes' : 'No';
            let cardStatus = element.InactiveCard == true ? 'Yes' : 'No';
            content += '<tr>' +
                '<td class="CustCode"><input type="hidden" data-Salutation="' + element.Salutation + '"  data-Contact="' + element.Contact +
                    '" data-CardId="' + element.CardId + '" data-ShippingAddressSame="' + ShippingAddressSame +
                    '" data-BillToAddress="' + BillToAddress + '" data-BillToCity="' + BillToCity + '" data-BillToPostalCode="' + BillToPostalCode + '" data-BillToState="' + BillToState + '" data-BillToCountryID="' + BillToCountryID +
                    '" data-ShipToAddress="' + ShipToAddress + '" data-ShipToCity="' + ShipToCity + '" data-ShipToPostalCode="' + ShipToPostalCode + '" data-ShipToState="' + ShipToState + '" data-ShipToCountryID="' + ShipToCountryID +
                   '" data-PrintedForm="' + element.PrintedForm + '" data-InvoiceDelivery="' + element.InvoiceDelivery + '" data-ABNNo="' + element.ABNNo +
                   '" data-ABNBranchNo="' + element.ABNBranchNo + '" data-TxtId="' + element.TxtId + '" data-TaxIdNo="' + element.TaxIdNo +
                   '" data-FreightTaxCode="' + element.FreightTaxCode + '" data-PayTermId="' + element.PayTermId + '" data-DiscountDays="' + element.DiscountDays +
                   '" data-BalanceDueDays="' + element.BalanceDueDays + '" data-DiscountEarlyPayment="' + element.DiscountEarlyPayment +
                   '" data-MonthChargeLatePayment="' + element.MonthChargeLatePayment + '" data-VolumeDiscount="' + element.VolumeDiscount +
                   '" data-PayMethodId="' + element.PayMethodId + '" data-CardNo="' + element.CardNo + '" data-NameofCard="' + element.NameofCard +
                   '" data-Notes="' + element.Notes + '" class="hd" " data-FilePath="' + element.FilePath +
                    '" data-FileUserName="' + element.FileUserName + '" data-Designation="' + element.Designation + '"/>' + element.CustCode +
                '</td>' +
                //'<td class="CustCode">' + element.Designation + '</td>' +
                '<td class="Name"><input type="hidden" class="GSTType" value="' + element.GSTType + '"/>' + element.Name + '</td>' +
                '<td class="LastName">' + element.LastName + '</td>' +
                '<td class="Phone1"><input type="hidden" class="Phone2" value="' + element.Phone2 + '"/><input type="hidden" class="Phone3" value="' + element.Phone3 + '"/>' + element.Phone1 + '</td>' +
                '<td class="Email"><input type="hidden" class="Fax" value="' + element.Fax +
                    '"/><input type="hidden" class="Website" value="' + element.Website + '"/>' + element.Email + '</td>' +
                '<td class="InactiveCard">' + cardStatus + '</td>' +
                '<td><span data-id="' + element.CustomerId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                    '<span data-id="' + element.CustomerId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
                '</td>' +
        '</tr>';
        });
    }
    return content;
}
///// End Table ////
///// Start Button Click ////
$331('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        var obj = GetSaveObject();
        var data = new FormData();
        data.append('data', JSON.stringify(obj));
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
                    GetCustomerNo();
                    GetCustomerdata();
                    //BindTable(result.list);
                    ClearData();

                }
            }
        });
    }
});

$('#btnRefresh').on('click', function () {
    window.location.reload();
});
$('#btnCancel').on('click', function () {
    window.history.back();
    //var baseUrl = base + "Home/Index";
    //window.location.href = baseUrl;
});
$(document).off('click', '.edit').on('click', '.edit', function () {
    let tblRow = $(this).closest('tr');
    let id = $(this).attr('data-id');
    setEditData(tblRow, id);

    $('#btnSave').val('Update');
    window.scrollTo(0, 0);
});
$(document).off('click', '.delete').on('click', '.delete', function () {
    let id = $(this).attr('data-id');
    let obj = {
        "CustomerId": id
    }
    $.msgbox("Are you sure that you want to permanently delete the selected element?", {
        type: "confirm",
        buttons: [
            { type: "submit", value: "Yes" },
            { type: "submit", value: "No" }
        ]
    }, function (result) {
        if (result == "Yes") {
            $("#divTable").empty();
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
                        GetCustomerdata();
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
///// Random Method Start ////
function setEditData(tblRow, id) {
    let InactiveCard = $(tblRow).find('.InactiveCard').text() === 'Yes' ? true : false;
    let ShippingAddressSame = $(tblRow).find('.hd').attr('data-ShippingAddressSame') === 'Yes' ? true : false;
    $('#txtCustCode').val($(tblRow).find('.CustCode').text());
    $('#txtCustomerId').val(id);
    $('#txtName').val($(tblRow).find('.Name').text());
    $('#ddlGSTType').val($(tblRow).find('.GSTType').val()).trigger('change');
    $('#txtLastName').val($(tblRow).find('.LastName').text());
    let FilePath = $(tblRow).find('.hd').attr('data-FilePath');
    let FileUserName = $(tblRow).find('.hd').attr('data-FileUserName');
    let image = '<img longdesc="" src="' + FilePath + '" class="clsMyImage" alt="' + FileUserName + '" title="' + FileUserName + '" style="width:100px; height:100px;"/>';
    $('#divImgPreview').empty();
    $('#divImgPreview').append(image);
    $('#ddlCusLocation').val(1).trigger('change');
    $('#txtBilToAddress').val($(tblRow).find('.hd').attr('data-BillToAddress'));
    $('#txtBilToCity').val($(tblRow).find('.hd').attr('data-BillToCity'));
    $('#txtBilToState').val($(tblRow).find('.hd').attr('data-BillToState'));
    $('#txtBilToPostalCode').val($(tblRow).find('.hd').attr('data-BillToPostalCode'));
    $('#ddlBilToCountry').val($(tblRow).find('.hd').attr('data-BillToCountryID')).trigger('change');
    $('#txtShipToAddress').val($(tblRow).find('.hd').attr('data-ShipToAddress'));
    $('#txtShipToCity').val($(tblRow).find('.hd').attr('data-ShipToCity'));
    $('#txtShipToState').val($(tblRow).find('.hd').attr('data-ShipToState'));
    $('#txtShipToPostalCode').val($(tblRow).find('.hd').attr('data-ShipToPostalCode'));
    $('#ddlShipToCountry').val($(tblRow).find('.hd').attr('data-ShipToCountryID')).trigger('change');
    $('#ddlShipToCountry').val($(tblRow).find('.hd').attr('data-ShipToCountryID')).trigger('change');
    $('#txtSalutation').val($(tblRow).find('.hd').attr('data-Salutation'));
    $('#txtContact').val($(tblRow).find('.hd').attr('data-Contact'));
    $('#txtEmail').val($(tblRow).find('.Email').text());
    $('#txtCardId').val($(tblRow).find('.hd').attr('data-CardId'));
    $('#txtPhone1').val($(tblRow).find('.Phone1').text());
    $('#txtPhone2').val($(tblRow).find('.Phone2').val());
    $('#txtPhone3').val($(tblRow).find('.Phone3').val());
    $('#txtFax').val($(tblRow).find('.Fax').val());
    $('#txtWebsite').val($(tblRow).find('.Website').val());
    $('#ddlPrintedForm').val($(tblRow).find('.hd').attr('data-PrintedForm')).trigger('change');
    $('#ddlInvoiceDelivery').val($(tblRow).find('.hd').attr('data-InvoiceDelivery')).trigger('change');
    $('#txtABN').val($(tblRow).find('.hd').attr('data-ABNNo') == 0 ? '' : $(tblRow).find('.hd').attr('data-ABNNo'));
    $('#txtABNBranch').val($(tblRow).find('.hd').attr('data-ABNBranchNo') == 0 ? '' : $(tblRow).find('.hd').attr('data-ABNBranchNo'));
    $('#ddlTaxCode').val($(tblRow).find('.hd').attr('data-TxtId')).trigger('change');
    $('#txtTaxIdNumber').val($(tblRow).find('.hd').attr('data-TaxIdNo') == 0 ? '' : $(tblRow).find('.hd').attr('data-TaxIdNo'));
    $('#ddlFreightTaxCode').val($(tblRow).find('.hd').attr('data-FreightTaxCode')).trigger('change');
    $('#ddlPaymentDue').val($(tblRow).find('.hd').attr('data-PayTermId')).trigger('change');
    $('#ddlDesignation').val($(tblRow).find('.hd').attr('data-Designation')).trigger('change');

    if ($(tblRow).find('.hd').attr('data-PayTermId') == 4 || $(tblRow).find('.hd').attr('data-PayTermId') == 6) {
        setDiscountDateBalanceDate($(tblRow).find('.hd').attr('data-DiscountDays'), $(tblRow).find('.hd').attr('data-BalanceDueDays'));
    }
    else {
        $('#txtDiscountDays').val($(tblRow).find('.hd').attr('data-DiscountDays') == 0 ? '' : $(tblRow).find('.hd').attr('data-DiscountDays'));
        $('#txtBalanceDueDays').val($(tblRow).find('.hd').attr('data-BalanceDueDays') == 0 ? '' : $(tblRow).find('.hd').attr('data-BalanceDueDays'));
    }

    //$('#txtContact').val($(tblRow).find('.hd').attr('data-DiscountDays'));
    //$('#txtContact').val($(tblRow).find('.hd').attr('data-BalanceDueDays'));
    $('#txtDiscountEarlyPayment').val($(tblRow).find('.hd').attr('data-DiscountEarlyPayment') == 0 ? '' : $(tblRow).find('.hd').attr('data-DiscountEarlyPayment'));
    $('#txtMonthlyChargeLatePayment').val($(tblRow).find('.hd').attr('data-MonthChargeLatePayment') == 0 ? '' : $(tblRow).find('.hd').attr('data-MonthChargeLatePayment'));
    $('#txtVolumeDiscount').val($(tblRow).find('.hd').attr('data-VolumeDiscount') == 0 ? '' : $(tblRow).find('.hd').attr('data-VolumeDiscount'));
    $('#ddlPaymentMethod').val($(tblRow).find('.hd').attr('data-PayMethodId')).trigger('change');
    $('#txtCardNolast4Digit').val($(tblRow).find('.hd').attr('data-CardNo') == 0 ? '' : $(tblRow).find('.hd').attr('data-CardNo'));
    $('#txtNameofCard').val($(tblRow).find('.hd').attr('data-NameofCard'));
    $('#txtAreaNotes').val($(tblRow).find('.hd').attr('data-Notes'));
    $.uniform.update(
          $('#chkInactiveCard').attr("checked", InactiveCard)
      );
    $.uniform.update(
          $('#chkShippingAddressSame').attr("checked", ShippingAddressSame)
      );
}
///// Random Method End ////
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    let Location = $('#ddlCusLocation option:selected').val();
    if ($('#txtName').val() == '') {
        $('#txtName').css({ 'border': '1px solid red' });
        $('#txtName').focus();
        $.pnotify({ text: 'Name Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#txtName').css({ 'border': '1px solid #aaa' });
    }
    if ($('#txtPhone1').val() == '') {
        $('#txtPhone1').css({ 'border': '1px solid red' });
        $('#txtPhone1').focus();
        $.pnotify({ text: 'Phone No Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#txtPhone1').css({ 'border': '1px solid #aaa' });
    }

    if ($('#txtEmail').val() == '') {
        $('#txtEmail').css({ 'border': '1px solid red' });
        $('#txtEmail').focus();
        $.pnotify({ text: 'Email ID Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#txtEmail').css({ 'border': '1px solid #aaa' });
    }


    if ($('#txtBilToAddress').val() == '') {
        if (Location == 2) {
            $('#ddlCusLocation').val(1).trigger('change');
        }
        $('#txtBilToAddress').css({ 'border': '1px solid red' });
        $('#txtBilToAddress').focus();
        $.pnotify({ text: 'Address Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#txtBilToAddress').css({ 'border': '1px solid #aaa' });
    }
    if ($('#txtBilToCity').val() == '') {
        if (Location == 2) {
            $('#ddlCusLocation').val(1).trigger('change');
        }
        $('#txtBilToCity').css({ 'border': '1px solid red' });
        $('#txtBilToCity').focus();
        $.pnotify({ text: 'Suburb Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#txtBilToCity').css({ 'border': '1px solid #aaa' });
    }
    if ($('#txtBilToPostalCode').val() == '') {
        if (Location == 2) {
            $('#ddlCusLocation').val(1).trigger('change');
        }
        $('#txtBilToPostalCode').css({ 'border': '1px solid red' });
        $('#txtBilToPostalCode').focus();
        $.pnotify({ text: 'Post Code Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#txtBilToPostalCode').css({ 'border': '1px solid #aaa' });
    }

    $("#tbl tbody tr").each(function () {
        let rowId = $(this).find('.delete').attr('data-id');
        let hdId = $('#txtCustomerId').val();
        if (rowId != hdId) {
            let CustCode = $(this).find('.hd').text().trim();
            let txtCustCode = $('#txtCustCode').val().trim();
            if (CustCode == txtCustCode) {
                $.pnotify({ text: 'Customer No Already Exist', type: 'error' });
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
    let DiscountDays, BalanceDueDays;
    if ($('#ddlPaymentDue').val() == 4 || $('#ddlPaymentDue').val() == 6) {
        DiscountDays = $('#ddlDiscountDate').val();
        BalanceDueDays = $('#ddlBalanceDueDate').val();
    }
    else {
        DiscountDays = $('#txtDiscountDays').val() == '' ? 0 : $('#txtDiscountDays').val();
        BalanceDueDays = $('#txtBalanceDueDays').val() == '' ? 0 : $('#txtBalanceDueDays').val();
    }
    let objAddr = [];
    for (var i = 0; i < $('#ddlCusLocation option').length; i++) {
        let selectedValue = $($('#ddlCusLocation option')[i]).val();
        if (selectedValue == 1) {
            let objAddress =
        {
            "AddrTypeID": $($('#ddlCusLocation option')[i]).val(),
            "Address": $('#txtBilToAddress').val(),
            "City": $('#txtBilToCity').val(),
            "State": $('#txtBilToState').val(),
            "PostalCode": $('#txtBilToPostalCode').val(),
            "CountryID": $('#ddlBilToCountry').val()
        }
            objAddr.push(objAddress);
        }
        else if (selectedValue == 2) {
            let objAddress2 =
        {
            "AddrTypeID": $($('#ddlCusLocation option')[i]).val(),
            "Address": $('#txtShipToAddress').val(),
            "City": $('#txtShipToCity').val(),
            "State": $('#txtShipToState').val(),
            "PostalCode": $('#txtShipToPostalCode').val(),
            "CountryID": $('#ddlShipToCountry').val()
        }
            objAddr.push(objAddress2);
        }
    }
    let obj = {
        "CustCode": $('#txtCustCode').val(),
        "CustomerId": $('#txtCustomerId').val() == "" ? 0 : $('#txtCustomerId').val(),
        "Designation": $('#ddlDesignation option:selected').val(),
        "Name": $('#txtName').val(),
        "Salutation": $('#txtSalutation').val(),
        "Contact": $('#txtContact').val(),
        "CardId": $('#txtCardId').val(),
        "Phone1": $('#txtPhone1').val(),
        "Phone2": $('#txtPhone2').val(),
        "Phone3": $('#txtPhone3').val(),
        "Fax": $('#txtFax').val(),
        "Email": $('#txtEmail').val(),
        "Website": $('#txtWebsite').val(),
        "ShippingAddressSame": $('#chkShippingAddressSame').is(":checked"),
        "InactiveCard": $('#chkInactiveCard').is(":checked"),
        "PrintedForm": $('#ddlPrintedForm').val(),
        "TaxIdNo": $('#txtTaxIdNumber').val(),
        "InvoiceDelivery": $('#ddlInvoiceDelivery').val(),
        "TxtId": $('#ddlTaxCode').val(),
        "ABNNo": $('#txtABN').val() == '' ? 0 : $('#txtABN').val(),
        "FreightTaxCode": $('#ddlFreightTaxCode').val(),
        "GSTType": $('#ddlGSTType').val(),
        "ABNBranchNo": $('#txtABNBranch').val() == '' ? 0 : $('#txtABNBranch').val(),
        "PayTermId": $('#ddlPaymentDue').val(),
        "DiscountEarlyPayment": $('#txtDiscountEarlyPayment').val() == '' ? 0 : $('#txtDiscountEarlyPayment').val(),
        "DiscountDays": DiscountDays,
        "MonthChargeLatePayment": $('#txtMonthlyChargeLatePayment').val() == '' ? 0 : $('#txtMonthlyChargeLatePayment').val(),
        "BalanceDueDays": BalanceDueDays,
        "VolumeDiscount": $('#txtVolumeDiscount').val() == '' ? 0 : $('#txtVolumeDiscount').val(),
        "PayMethodId": $('#ddlPaymentMethod').val(),
        "Notes": $('#txtAreaNotes').val(),
        "CardNo": $('#txtCardNolast4Digit').val() == '' ? 0 : $('#txtCardNolast4Digit').val(),
        "NameofCard": $('#txtNameofCard').val(),
        "PreviousImage": $($('#divImgPreview').children()).attr('data-previmg'),
        "lstCustAddress": objAddr,
        "LastName": $('#txtLastName').val()
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    //$('#txtCustCode').val('');
    $('#txtCustomerId').val('0');
    $('#txtName').val('');
    $('#txtLastName').val('');
    $('#txtSalutation').val('');
    $('#txtContact').val('');
    $('#txtEmail').val('');
    $('#txtCardId').val('');
    $('#txtPhone1').val('');
    $('#txtPhone2').val('');
    $('#txtPhone3').val('');
    $('#ddlCusLocation').val(1).trigger('change');
    $('#txtBilToAddress').val('');
    $('#txtBilToCity').val('');
    $('#txtBilToState').val('');
    $('#txtBilToPostalCode').val('');
    $('#ddlBilToCountry').val(9).trigger('change');
    $('#txtShipToAddress').val('');
    $('#txtShipToCity').val('');
    $('#txtShipToState').val('');
    $('#txtShipToPostalCode').val('');
    $('#ddlShipToCountry').val(9).trigger('change');

    $('#txtABN').val('');
    $('#txtABNBranch').val('');
    $('#ddlTaxCode').val(5).trigger('change');
    $('#txtTaxIdNumber').val('');
    $('#ddlFreightTaxCode').val(5).trigger('change');
    $('#ddlPaymentDue').val(2).trigger('change');

    $('#txtDiscountDays').val('');
    $('#txtBalanceDueDays').val('');
    $('#txtDiscountEarlyPayment').val('');
    $('#txtMonthlyChargeLatePayment').val('');
    $('#txtVolumeDiscount').val('');
    $('#ddlPaymentMethod').val(5).trigger('change');
    $('#txtCardNolast4Digit').val('');
    $('#txtNameofCard').val('');
    $('#txtAreaNotes').val('');
    $('#ddlDiscountDate').val(1).trigger('change');
    $('#ddlBalanceDueDate').val(1).trigger('change');
    $('#txtFax').val('');
    $('#txtWebsite').val('');

    document.getElementById('file').value = "";
    $.uniform.update(
           $('#chkInactiveCard').attr("checked", false)
       );
    $.uniform.update(
          $('#chkShippingAddressSame').attr("checked", false)
      );
    $("#ddlCusLocation").prop("disabled", false);
    $("#ddlCusLocation").select2();
    $("#txtDateAdded").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    $('#divImgPreview').empty();
    $('#btnSave').val('Save');
}
///// Clear Data End ////

$(document).off('change', '#txtEmail').on('change', '#txtEmail', function () {
    if ($(this).val() !== '') {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if ($(this).val().match(mailformat)) {
            return true;
        }
        else {
            alert("You have entered an invalid Email address.!");
            $(this).val('');
            return false;
        }
    }
});

$(document).off('change', '#txtABN').on('change', '#txtABN', function () {
    let status = validateABN($(this).val());
    if (status === false) {
        $('#txtABN').val('');
        $.pnotify({ text: 'Please Enter Valid Australian Business Number ', type: 'error' });
    }
});
function paymentDueVisibleHidden(value) {
    $("#lblDiscountDate").css({ display: "none" });
    $("#divDiscountDate").css({ display: "none" });
    $("#lblDiscountDays").css({ display: "block" });
    $("#divDiscountDays").css({ display: "block" });

    $("#lblBalanceDueDate").css({ display: "none" });
    $("#divBalanceDueDate").css({ display: "none" });
    $("#lblBalanceDueDays").css({ display: "block" });
    $("#divBalanceDueDays").css({ display: "block" });
    if (value == 4 || value == 6) {
        $("#lblDiscountDate").css({ display: "block" });
        $("#divDiscountDate").css({ display: "block" });
        $("#lblDiscountDays").css({ display: "none" });
        $("#divDiscountDays").css({ display: "none" });

        $("#lblBalanceDueDate").css({ display: "block" });
        $("#divBalanceDueDate").css({ display: "block" });
        $("#lblBalanceDueDays").css({ display: "none" });
        $("#divBalanceDueDays").css({ display: "none" });
    }
}
function setDiscountDateBalanceDate(DiscountDateSelectedValue, BalanceDueDateSelectedValue) {
    var discountDate = '';
    for (var i = 1; i < 31; i++) {
        if (i == 1 || i == 21) {
            discountDate += '<option value="' + i + '" >' + i + 'st' + '</option>';
        }
        else if (i == 2 || i == 22) {
            discountDate += '<option value="' + i + '" >' + i + 'nd' + '</option>';
        }
        else if (i == 3 || i == 23) {
            discountDate += '<option value="' + i + '" >' + i + 'rd' + '</option>';
        }
        else {
            discountDate += '<option value="' + i + '" >' + i + 'th' + '</option>';
        }

    }
    discountDate += '<option value="31" >EOM</option>';
    $('#ddlDiscountDate').append(discountDate);
    $('#ddlDiscountDate').select2();
    $('#ddlBalanceDueDate').append(discountDate);
    $('#ddlBalanceDueDate').select2();
    $('#ddlDiscountDate').val(DiscountDateSelectedValue).trigger('change.select2');
    $('#ddlBalanceDueDate').val(BalanceDueDateSelectedValue).trigger('change.select2');

}
$(document).off('change', '#ddlPaymentDue').on('change', '#ddlPaymentDue', function () {
    paymentDueVisibleHidden($(this).val());
    //$('$divDiscountDate').css('display','none')
    if ($(this).val() == 4 || $(this).val() == 6) {
        setDiscountDateBalanceDate(0, 0);
    }
});
$('#ddlDiscountDate').on('change', function () {
    let selectedValue = $(this).val();
    if (selectedValue == 31) {
        $('#ddlBalanceDueDate').val(31).trigger('change');
    }
});
//document.getElementById('txtABN').addEventListener('input', function (e) {
//    var x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,3})/);    
//    e.target.value = !x[4] ? !x[3] ? !x[2] ? x[1] : x[1] + ' ' + x[2] : x[1] + ' ' + x[2] + ' ' + x[3] : x[1] + ' ' + x[2] + ' ' + x[3] + ' ' + x[4];    
//});
function validateABN(value) {

    var weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
		abn = value.split(' ').join('');//.replace(/[^\d]/, ''),
    result = false;
    // check length is 11 digits
    if (abn.length === 11) {
        // apply ato check method
        var sum = 0,
			weight;

        for (var index = 0; index <= weights.length - 1; index++) {
            weight = weights[index];
            digit = abn[index] - (index ? 0 : 1);
            sum += weight * digit;
        }
        result = sum % 89 === 0;
    }
    return result;
}

$(document).off('keyup', '#txtABN').on("keyup", "#txtABN", function (event) {
    var Value = $(this).val();
    var Reg = /[[0-9 ]+]/;//    /[a-zA-Z0-9]/i;// /^\s*[a-zA-Z0-9]+\s*$/;
    if (Reg.test(Value)) {
    }
});
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
//document.getElementById('txtDiscountEarlyPayment').addEventListener('input', function (e) {
//    debugger;    
//    if (e.target.value.length > 4) {
//        let x =e.target.value.match(/(\d.{0,2})(\d{0,1})/);
//        e.target.value = !x[2] ? x[1] : x[1] + x[2];
//    }
//    else {
//        let x = e.target.value.match(/(\d.{0,2})(\d{0,2})/);
//        e.target.value = !x[2] ? x[1] : x[1] + x[2];
//    }

//    //let abn = e.target.value.split('.').join('');
//});
//$("#txtDiscountEarlyPayment").on("keypress keyup blur", function (event) {
//    debugger;
//    let value = '00.00%' + $(this).val() + event.key;
//    let v2 = value.substring(value.length - 5);
//    let v3 = ($(this).val() + event.key).split('.');
//});
