var Controller = "SupplierPayment", MasterId = '', ManufacturerId = '', poDate = '', poNumber = '', PoList = [];

$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadManufacturer();
    $('#ddlManufacturer').select2();
    loadPINumber();
    $('#ddlPINumber').select2();
    window.scrollTo(20, 0);
    $('#txtPaymentDate').datepicker({ dateFormat: 'dd-M-yy' });
    getDate();
});

function getDate() {
    var monthsArr = new Array();
    // store month names into our array
    monthsArr[0] = "Jan";
    monthsArr[1] = "Feb";
    monthsArr[2] = "Mar";
    monthsArr[3] = "Apr";
    monthsArr[4] = "May";
    monthsArr[5] = "Jun";
    monthsArr[6] = "Jul";
    monthsArr[7] = "Aug";
    monthsArr[8] = "Sep";
    monthsArr[9] = "Oct";
    monthsArr[10] = "Nov";
    monthsArr[11] = "Dec";

    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth();
    var year = todaydate.getFullYear();
    var date = day + "-" + monthsArr[month] + "-" + year;
    document.getElementById("txtPaymentDate").value = date;
}

function loadManufacturer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadPOSupplier",
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

function loadPINumber() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "SupplierPayment/loadPINumber",
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
                PoList = result.listComboData;
                LoadDropdown(result.listComboData, $('#ddlPINumber'));
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

$(document).off('change', '#ddlManufacturer').on('change', '#ddlManufacturer', function () {
    if ($(this).val() !== '-1') {
        var imlst = $.grep(PoList,
         function (x) {
             if ('' + x.ValueStr + '' == $('#ddlManufacturer').val()) {
                 return x;
             }
         });
        LoadDropdown(imlst, $('#ddlPINumber'));
        imlst = [];
    }
    
});

$(document).off('change', '#ddlPINumber').on('change', '#ddlPINumber', function () {
    if ($(this).val() !== '-1') {
        if ($('#ddlManufacturer').val() == '-1') {
             $('#ddlPINumber').val('-1').trigger('change')
           // $("#ddlPINumber")[0].options.length = 0;
            $.pnotify({ text: 'Select Manufacture Firstly.!', type: 'info' });
        } else {
            let POMasterId = $('#ddlPINumber').val();
            var urlpath = base + Controller + "/GetManufactureandPiWiseData";
                $.ajax({
                    beforeSend: function () { $.blockUI(); },
                    complete: function () { $.unblockUI(); },
                    type: "POST",
                    async: false,
                    url: urlpath,
                    contentType: "application/json;charset=utf-8",
                    dataType: "JSON",
                    data: JSON.stringify({ "POMasterId": POMasterId }),
                    success: function (result) {
                        if (result.IsSessionOut != null) {
                            $.pnotify({ text: result.IsSessionOut, type: 'error' });
                            return false;
                        } else if (result.Error != null && result.Error != "") {
                            $.pnotify({ text: result.Error, type: 'error' });
                            return false;
                        } else {
                            if (result.listPOMaster.length > 0) {
                                $('#txtDepedUSD').val(result.listPOMaster[0].DepAmountUSD);
                                $('#txtDepedAUD').val(result.listPOMaster[0].DepAmountAUD);
                                $('#txtDueAmount').val(result.listPOMaster[0].ShipRateUSD);
                                $('#txtOrderValue').val(result.listPOMaster[0].TotalAmount);
                                $('#txtDepositDate').val(result.listPOMaster[0].DepositDate);
                            }
                        }
                    }
                });
        }
    }

});


$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
       
        var obj = {
            "ManufacturerId": $("#ddlManufacturer").val(),
            "POMasterId": $("#ddlPINumber").val(),
            "PODate": $("#txtPaymentDate").val(),
            "DepAmountUSD": $("#txtDepUSD").val(),
            "DepAmountAUD": $("#txtDepAUD").val(),
            "Description": $("#txtNotes").val()
        };

        var urlpath = base + Controller + "/SupplierPaySave";
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
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                    ClearData();
                }
            }
        });
       
    }
});

function SaveValidation() {
    let valid = true;
    var couter = 0;

    if ($('#ddlManufacturer').val() == '-1') {
        $('#s2id_ddlManufacturer').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Manufacturer Requried. !', type: 'info' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlManufacturer').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }

    if ($('#ddlPINumber').val() == '-1') {
        $('#s2id_ddlPINumber').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'PI Number Requried. !', type: 'info' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlPINumber').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }

    if ($('#txtDepUSD').val() == '') {
        $('#txtDepUSD').find(".span12").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'BOP(USD) Requried. !', type: 'info' });
        valid = false;
        return valid;
       
    } else { $('#txtDepUSD').find(".span12").css({ 'border': '1px solid #aaa' }); }

    if ($('#txtDepAUD').val() == '') {
        $('#txtDepAUD').find(".span12").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'BOP(AUD) Requried. !', type: 'info' });
        valid = false;
        return valid;
    } else { $('#txtDepAUD').find(".span12").css({ 'border': '1px solid #aaa' });}
   

    return valid;
}


$('#btnRefresh').on('click', function () {
    ClearData();
});

$('#btnCancel').on('click', function () {
    window.history.back();
});

function ClearData() {
    $('#ddlManufacturer').val('-1').trigger('change');
    $('#ddlPINumber').val('-1').trigger('change')
    $('#txtDepedUSD').val('');
    $('#txtDepedAUD').val('');
    $('#txtDueAmount').val('');
    $('#txtOrderValue').val('');
    $('#txtDepUSD').val('');
    $('#txtDepAUD').val('');
    $('#txtConversionRate').val('');
    $("#txtNotes").val('');
    $('#txtDepositDate').val('');
}

$(document).off('change', '#txtDepUSD').on('change', '#txtDepUSD', function () {
    if ($(this).val() !== '' && $(this).val() !== '0') {
        if ($("#txtDepAUD").val() !== '' && $("#txtDepAUD").val() !== '0') {
            let depUsd = $(this).val(); 
            let depedUsd = $("#txtDepedUSD").val();
            let depedUad = $("#txtDepedAUD").val();
            let depUad = $("#txtDepAUD").val();
            var avg = (parseFloat(depUsd) + parseFloat(depedUsd)) / (parseFloat(depUad) + parseFloat(depedUad));
            $("#txtConversionRate").val(avg.toFixed(3));
        } else { $("#txtConversionRate").val(''); }

    } else { $("#txtConversionRate").val(''); }
});

$(document).off('change', '#txtDepAUD').on('change', '#txtDepAUD', function () {
    if ($(this).val() !== '' && $(this).val() !== '0') {
        if ($("#txtDepUSD").val() !== '' && $("#txtDepUSD").val() !== '0') {
            let depUad = $(this).val();
            let depedUsd = $("#txtDepedUSD").val();
            let depedUad = $("#txtDepedAUD").val();
            let depUsd = $("#txtDepUSD").val();
            var avg = (parseFloat(depUsd) + parseFloat(depedUsd)) / (parseFloat(depUad) + parseFloat(depedUad));
            $("#txtConversionRate").val(avg.toFixed(3));
        } else { $("#txtConversionRate").val(''); }
    } else { $("#txtConversionRate").val(''); }
});

$(document).off('keyup', '.number').on("keyup", ".number", function (event) {
    let a = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(a);
});