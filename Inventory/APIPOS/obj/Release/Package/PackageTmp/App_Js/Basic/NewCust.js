var ControllerCust = "Customer", CommonController = "Common";
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
    $331("#divLastName").show();
    $331("#lblName").text("First Name");
    loadLocationCust();
    loadCountry();
    GetCustomerNo();
    GetTaxCode();//ddlTaxCode
    GetPaymentTerms();
    loadPaymentMethod();
    $('#wizard-demo-2 .btn-toolbar').remove();
    visibleHiddenAddress();

});
function loadLocationCust() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadAddressType",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdownCust(result, $('#ddlCusLocation'), 1);
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
///// Initial Load Method Start////
function loadAddress() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadAddressType",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdownCust(result, $('#ddlAddress'), 1);
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
            LoadDropdownCust(result, $('.Country'), 9);
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function GetCustomerNo() {
    $331.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + ControllerCust + "/GetCustomerNo",
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
        url: base + ControllerCust + "/GetCustomerdata",
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
                LoadDropdownCust(result, $('#ddlTaxCode'), 5);
                LoadDropdownCust(result, $('#ddlFreightTaxCode'), 5);
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
                LoadDropdownCust(result, $('#ddlPaymentDue'), 2);

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
                LoadDropdownCust(result, $('#ddlPaymentMethod'), 5);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

///// Initial Load Method End////


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

$(document).on('change', '#ddlCusLocation', function (parameters) {

    visibleHiddenAddress();
});

$(document).on('change', '#ddlDesignation', function (parameters) {

    if ($(this).val() == 'Individual') {
        $("#divLastName").show();
        $("#lblName").text("First Name");
    } else { $("#divLastName").hide(); $("#lblName").text("Name"); }
});

$331(document).on('change', '#chkShippingAddressSame', function () {
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
function LoadDropdownCust(result, id, selectedValue) {
    $(id).get(0).options.length = 0;
    var content = '';
    $.each(result, function (i, obj) {
        content += '<option ValueStr="' + obj.ValueStr + '"  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    $(id).append(content);
    $(id).val(selectedValue).trigger('change');
    $(id).select2();
    //$('s2id_' + id).css('z-index', '2000');
}

///// Start Button Click ////
$331(document).on('click', '#btnSave', function (parameters) {
    if (SaveValidation() == true) {
        var name = $('#txtName').val();
        var mobileNo = $('#txtPhone1').val();

        var obj = GetSaveObjectCust();
        var data = new FormData();
        data.append('data', JSON.stringify(obj));
        var $file = document.getElementById('file');

        if ($file.files.length > 0) {
            for (var i = 0; i < $file.files.length; i++) {
                data.append('files', $file.files[i]);
            }
        }
        //var obj = JSON.stringify({ "data": data });
        var urlpath = base + ControllerCust + "/Save";
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
                    var modal = document.getElementById('myModal');
                    let save = $('#btnSave').val();
                    if (save == 'Save') {
                        $.pnotify({ text: 'Save Successfully', type: 'success' });

                    }
                    else {
                        $.pnotify({ text: 'Update Successfully', type: 'success' });
                    }
                    modal.style.display = "none";
                    ClearDataCust();

                    PopupSaveCustomer(name, mobileNo);

                }
            }
        });
    }
});




$(document).on('click', '#btnRefresh', function (parameters) {
    GetCustomerNo();
    GetCustomerdata();
    //BindTable(result.list);
    ClearDataCust();
});
$('#btnRefresh').on('click', function () {
    window.location.reload();


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


///// Validation Start ////
function SaveValidation() {
    debugger;
    let valid = true;
    let Location = $('#ddlCusLocation option:selected').val();
    if ($331('#txtName').val() == '') {
        $331('#txtName').css({ 'border': '1px solid red' });
        $331('#txtName').focus();
        $.pnotify({ text: 'Name Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $331('#txtName').css({ 'border': '1px solid #aaa' });
    }
    if ($331('#txtPhone1').val() == '') {
        $331('#txtPhone1').css({ 'border': '1px solid red' });
        $331('#txtPhone1').focus();
        $.pnotify({ text: 'Phone No Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $('#txtPhone1').css({ 'border': '1px solid #aaa' });
    }
    if ($331('#txtEmail').val() == '') {
        $331('#txtEmail').css({ 'border': '1px solid red' });
        $331('#txtEmail').focus();
        $.pnotify({ text: 'Email ID Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $331('#txtEmail').css({ 'border': '1px solid #aaa' });
    }
    if ($331('#txtBilToAddress').val() == '') {
        if (Location == 2) {
            $('#ddlCusLocation').val(1).trigger('change');
        }
        $331('#txtBilToAddress').css({ 'border': '1px solid red' });
        $331('#txtBilToAddress').focus();
        $.pnotify({ text: 'Address Requried', type: 'error' });
        valid = false;
        return valid;
    }
    else {
        $331('#txtBilToAddress').css({ 'border': '1px solid #aaa' });
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
function GetSaveObjectCust() {
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
function ClearDataCust() {
    //$('#txtCustCode').val('');
    $('#txtCustomerId').val('');
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
