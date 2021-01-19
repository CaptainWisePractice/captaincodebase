//---------- All Global Variable ----------------//
var count = 0, Controller = "ItemCheckOut", CurrentController = "Sales", CommonController = "Common", addIndex = 22, headList = [], locList = [], TaxList = [], SiteLocation = [], ReceivePayment = "ReceivePayments";
var term = '', comtax = 0, fridtax = 0, salePerson = "", saleOutlet = "", shipvia = "", sts = '', userName = '', comboCount = 0;
var editFieldLst = [], userManagerPer = [], stateLst = [], payMethod = "", bookStatus = '', parDispatch = '', fullDispatch = '';
$("span#sidebar-toggle").trigger('click');
//
//----------End of Global variable-------------//

$(document).ready(function () {

    userName = $("#hfUserName").val();
    branchId = $("#hfBranchId").val();

    if (PaymentData.length > 0) {
        $('#test').inputpicker({
            data: PaymentData,
            fields: [
                { name: 'value', text: 'Rate' },
                { name: 'text', text: 'Code' },
                { name: 'description', text: 'Description' }
            ],
            autoOpen: true,
            headShow: true,
            fieldText: 'value',
            fieldValue: 'text',
            pagination: true,
            pageMode: '',
            pageField: 'p',
            pageLimitField: 'per_page',
            limit: 5,
            pageCurrent: 1
        });
    }
    $('.sDate').datepicker({
        dateFormat: 'dd-M-yy'
    });
    BindItemGrid(0);
    $("#txtInvoiceDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());

    if (userName == "Admin") {
        $('#txtInvoiceDate').attr('readonly', false).datepicker();
    } else { $('#txtInvoiceDate').attr('readonly', true).datepicker("destroy"); }

    loadSiteLocation();
    loadModel();
    LoadReferralSource();
    LoadUserandManagerPercentange();

    if (SalesData != null && SalesData.length > 0) {
        LoadTax();
        let inv = SalesData;
        sts = 'Update';
        loadAllSaleData(inv);
        $("#tridInvoice").show();
        $("#divQuote").hide(); $("#divOrderStatus").show();
    }
    else {
        LoadTax();
        LoadPaymentMethod();
        sts = ''; saleOutlet = branchId;
        LoadSalesPerson();
        loadSaleOutlet();
        LoadShippingMethod();
        document.getElementById('btnPayment').style.display = 'none';
        document.getElementById('btnHistory').style.display = 'none';
        document.getElementById('btnPrint').style.display = 'none';
        document.getElementById('btnMail').style.display = 'none';
        document.getElementById('btnSaleReturn').style.display = 'none';
        $("#tridInvoice").hide();
        $("#divQuote").hide(); $("#divOrderStatus").hide();
    }


});

function LoadUserandManagerPercentange() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadUserandManagerPercentange",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        //   data: JSON.stringify({ "userName": userName }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {

                userManagerPer = [];
                if (result.SaleEditPermissionLst != null) {
                    if (result.SaleEditPermissionLst.length > 0) {
                        userManagerPer = result.SaleEditPermissionLst;
                    }
                }
                stateLst = [];
                if (result.ComboDataLst.length > 0) {
                    stateLst = result.ComboDataLst;
                    AutoCompleteState();
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Sales Outlet Load Problem !', type: 'error' });
        }
    });
}

function loadSiteLocation() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/GetWareHouse",
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
                SiteLocation = [];
                SiteLocation = result;
                locList = result;
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'WareHouse Load Problem !', type: 'error' });
        }
    });
}

function loadSaleOutlet() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/loadSaleOutlet",
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

                LoadDropdown(result, $('#ddlSalesOutlet'));
                if (saleOutlet != "") {
                    $('#ddlSalesOutlet').val(saleOutlet).trigger('change');
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Sales Outlet Load Problem !', type: 'error' });
        }
    });
}

function loadModel(parameters) {
    // When the user clicks the button, open the modal 
    $("#addCust").click(function (parameters) {
        clearAllField();
        $("#myModal").css("display", "block");
        //  modal.style.display = "block";
        $(".ss").addClass("select2-drop");
    });


    // When the user clicks on <span> (x), close the modal
    $(document).on('click', '#btnCancel', function (parameters) {
        $("#myModal").css("display", "none");
        //modal.style.display = "none";
    });



    $("#Registraton").click(function (parameters) {

        var url = base + "Registration/Registration";
        location.href = url;


    });


    // When the user clicks on <span> (x), close the modal
    $(document).on('click', '#btnCancelRegistration', function (parameters) {
        $("#myModalForRegistraton").css("display", "none");
        //modal.style.display = "none";
    });

}

function LoadPaymentMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadPaymentMethod",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (result) {
            if (payMethod != "") {
                LoadDropdown(result, $('#ddlPaymentMethodSale'));
                $('#ddlPaymentMethodSale').val(payMethod).trigger('change');
            } else { setComboWithId(result, '2', $('#ddlPaymentMethodSale')); }
            //LoadDropdown(result, $('#ddlPaymentMethod'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function LoadShippingMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/GetShippingMethod",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlShipVia'));
            if (shipvia != "") {
                $('#ddlShipVia').val(shipvia).trigger('change');
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function LoadDevliveryStatus() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadInvDeliveryStatus",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {

            setComboWithId(result, '4', $('#ddlDeliveryStatus'));
            // LoadDropdown(result, $('#ddlDeliveryStatus'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function LoadSalesPerson() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/GetSalesPerason",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlSalesPerson'));
            //if (salePerson != "") {
            //    $('#ddlSalesPerson').val(salePerson).trigger('change');
            //}
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadSalesPersonForEdit() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/GetSalesPerasonInvoieEdit",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlSalesPerson'));
            if (salePerson != "") {
                $('#ddlSalesPerson').val(salePerson).trigger('change');
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}


function LoadTax() {
    var myRes = [], taxHeader = [], taxData = [];

    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadTax",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (result) {

            myRes = result;
            TaxList = result;

            $('#ddlTax').inputpicker({
                //data: [
                //    { value: "1", text: "Text 1", description: "This is the description of the text 1." },
                //    { value: "2", text: "Text 2", description: "This is the description of the text 2." },
                //    { value: "3", text: "Text 3", description: "This is the description of the text 3." }
                //],
                data: myRes,
                fields: [
                    { name: 'value', text: 'Code' },
                    { name: 'description', text: 'Description' },
                    { name: 'text', text: 'text' }
                ],
                autoOpen: true,
                headShow: true,
                fieldText: 'value',
                fieldValue: 'value'

            });
            $('#ddlTax').val("GST").trigger('change');

        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Tax Load Error.', type: 'error' });
        }
    });

}
function loadCustomer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadAddressType",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlAddressType'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

$(document).on('keyup', '#txtCustomerNameSale', function (parameters) {
    var v = $(this).val();
    auto(v);
});

function auto(txtval) {
    $("#txtCustomerNameSale").autocomplete({

        source: function (request, response) {
            var aObj = {
                "SearchText": txtval// ReviseReasonBulk
            };

            var urlpath = base + CurrentController + "/LoadCustomerAutoComplete";
            $.ajax({
                type: "POST",
                url: urlpath,
                dataType: "JSON",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({ "aObj": aObj }),
                success: function (result) {
                    if (result.IsSessionOut != null) {
                        $.pnotify({ text: "Your Session Is Over,Please Login Again", type: 'error' });
                        // notify('danger', "Your Session Is Over,Please Login Again");
                        return false;
                    } else if (result.Error != null && result.Error != "") {
                        $.pnotify({ text: result.Error, type: 'error' });
                        //notify('danger', result.Error);
                        return false;
                    } else {

                        response(result.CustomerLoadAutoComplete);
                    }
                },
                error: function (errRes) {
                    $.pnotify({ text: errRes, type: 'error' });
                }
            });

        },
        minLength: 2,
        select: function (event, ui) {

            $("#hdCustomerName").val(ui.item.id);
            $("#txtCustomerNameSale").val('');
            $("#txtCustomerNameSale").val(ui.item.label.split('|')[0].trim());
            $("#txtRecvAddress").val(ui.item.Address);
            $("#txtRecvName").val(ui.item.ReceiverName);
            $("#txtJournalMemo").val("Sale; " + ui.item.label.split('|')[0].trim());
            $("#ddlDeliveryStatus").val(ui.item.InvoiceDelivery).trigger('change');
            $("#ddlPaymentMethodSale").val(ui.item.PayMethodId).trigger('change');
            $("#txtTerms").val(ui.item.DeliveryStatus);
            term = ui.item.DeliveryStatus;
            $("#hdPaymentTerms").val(ui.item.PayTermId);
            $("#txtRecvSuburb").val(ui.item.City);
            $("#txtPostalCode").val(ui.item.PostalCode);
            $("#txtRecvMobileNo").val(ui.item.MobileNo);
            $("#txtState").val(ui.item.State);
            let balanceDueDays = ui.item.BalanceDueDays;

            if (ui.item.TaxType == "IncGST") {
                $.uniform.update(
                     $('#chkIsActive').attr("checked", true)
                );
            } else {
                $.uniform.update(
                  $('#chkIsActive').attr("checked", false)
             );
            }

            if (term != "Prepaid" && parseInt(balanceDueDays) > 0) {
                $('#txtPrepaidDueDate').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() + parseInt(balanceDueDays))));
            } else { $('#txtPrepaidDueDate').val(''); }

        }
    });
}

function PopupSaveCustomer(name, mobileNo) {
    var aObj = {
        "Name": name,
        "MobileNo": mobileNo
    };
    var urlpath = base + CurrentController + "/LoadPopupCustomer";
    $.ajax({
        type: "POST",
        url: urlpath,
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ "aObj": aObj }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: "Your Session Is Over,Please Login Again", type: 'error' });
                // notify('danger', "Your Session Is Over,Please Login Again");
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                //notify('danger', result.Error);
                return false;
            } else {
               
                let ui = result.CustomerLoadAutoComplete[0];
                $("#hdCustomerName").val(ui.id);
                $("#txtCustomerNameSale").val('');
                $("#txtCustomerNameSale").val(ui.label.split('|')[0].trim());
                $("#txtRecvAddress").val(ui.Address);
                $("#txtRecvName").val(ui.ReceiverName);
                $("#txtJournalMemo").val("Sale; " + ui.label.split('|')[0].trim());
                $("#ddlDeliveryStatus").val(ui.InvoiceDelivery).trigger('change');
                $("#ddlPaymentMethodSale").val(ui.PayMethodId).trigger('change');
                $("#txtTerms").val(ui.DeliveryStatus);
                term = ui.DeliveryStatus;
                $("#hdPaymentTerms").val(ui.PayTermId);
                $("#txtRecvSuburb").val(ui.City);
                $("#txtPostalCode").val(ui.PostalCode);
                $("#txtRecvMobileNo").val(ui.MobileNo);
                $("#txtState").val(ui.State);

                if (ui.TaxType == "IncGST") {
                    $.uniform.update(
                         $('#chkIsActive').attr("checked", true)
                    );
                } else {
                    $.uniform.update(
                      $('#chkIsActive').attr("checked", false)
                 );
                }
            }
        },
        error: function (errRes) {
            $.pnotify({ text: errRes, type: 'error' });
        }
    });

}

function CreateNewCustomer() {

    try {

        var content = '<div id="anim-modal" class="modal fade hide">' +
            '<div class="modal-header">' +
            '<button class="close" type="button" data-dismiss="modal">&times;</button>' +
            'This is a modal header' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa tellus, vestibulum consectetur vulputate eget, posuere adipiscing odio. Aliquam vestibulum sodales lectus, eu blandit lorem.</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<a href="#" class="btn btn-primary" data-dismiss="modal">Close</a>' +
            '</div>' +
            '</div>';
    }
    catch (error) {
        console.log(error);
    }
}

function getCustomerAddress(customerId) {
    var urlpath = base + CurrentController + "/GetCustomerAddress";

    if (customerId != "") {
        var aObj = {
            "SearchText": customerId // ReviseReasonBulk
        };
        $.ajax({
            type: "POST",
            url: urlpath,
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ "aObj": aObj }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    notify('danger', "Your Session Is Over,Please Login Again");
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    notify('danger', result.Error);
                    return false;
                } else {
                    LoadDropdown5(result.CustomerAddresses, $("#ddlAddressOfCustomer"));
                }
            },
            error: function (errRes) {
                // notify('danger', formatErrorMessage(errRes));
                $.pnotify({ text: formatErrorMessage(errRes), type: 'error' });
            }
        });
    } else {
        $.pnotify({ text: 'Please select Customer Name First', type: 'error' });
    }
}

//// Dropdown load
function LoadDropdown(result, id) {
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        if (result.length > 1) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        } else {
            content += '<option  selected value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        }

    });
    $(id).append(content);
    //$(id).val('').trigger('change');
    $(id).select2();

}
function LoadDropdown5(result, id) {
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.CustomerId + '" >' + obj.Address + '</option>';
    });
    $(id).append(content);
    //$(id).val('').trigger('change');
    $(id).select2();


}
function setCombo(data, selectedvalue) {
    var content = '<option value="-1">Select.......</option>';
    if (data == undefined || data.length == 0 || data == null) {
        return content;
    }
    else {
        if (selectedvalue == undefined || selectedvalue == null) {
            $.each(data.CustomerAddresses, function (i, obj) {
                content += '<option value="' + obj.CustomerId + '">' + obj.Address + '</option>';
            });
        }

        else {
            $.each(data.CustomerAddresses, function (i, obj) {
                if (obj.CustomerId == selectedvalue) {

                    content += '<option value="' + obj.CustomerId + '" selected>' + obj.Address + '</option>';
                } else {
                    content += '<option value="' + obj.CustomerId + '">' + obj.Address + '</option>';
                }
            });
        }

    }
    return content;
}
function setComboWithId(data, selectedvalue, id) {

    var content = '<option value="-1">Select.......</option>';
    if (data == undefined || data.length == 0 || data == null) {
        return content;
    }
    else {
        if (selectedvalue == undefined || selectedvalue == null) {
            $.each(data, function (i, obj) {
                content += '<option value="' + obj.Value + '">' + obj.DisplayName + '</option>';
            });
        }

        else {
            $.each(data, function (i, obj) {
                if (obj.Value == selectedvalue) {
                    content += '<option value="' + obj.Value + '" selected>' + obj.DisplayName + '</option>';
                } else {
                    content += '<option value="' + obj.Value + '">' + obj.DisplayName + '</option>';
                }
            });
        }

    }
    $(id).append(content);
    $(id).val(selectedvalue).trigger('change');
    $(id).select2();
}

function LoadLocationByheadIdEdit(headId, Value, index, itemType) {

    var aObj = {
        "IHeadId": headId,
        "SearchText": itemType
    };
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadWareHouseByHeadId",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "aObj": aObj }),
        success: function (result) {
            if (result.length > 0) {
                locList = [];
                locList = result;
                $('#ddlLocation' + index).empty();
                setComboWithIdEdit(result, Value, $('#ddlLocation' + index));

            }

        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });

}

function setComboWithIdEdit(data, selectedvalue, id) {
    var content = '<option value="-1">Select.......</option>';
    if (data == undefined || data.length == 0 || data == null) {
        return content;
    }
    else {
        if (selectedvalue == undefined || selectedvalue == null) {
            $.each(data, function (i, obj) {
                content += '<option value="' + obj.Value + '">' + obj.DisplayName + '</option>';
            });
            $(id.selector).append(content);
        }
        else {
            $.each(data, function (i, obj) {
                if (obj.Value == selectedvalue) {
                    content += '<option value="' + obj.Value + '" selected>' + obj.DisplayName + '</option>';
                } else {
                    content += '<option value="' + obj.Value + '">' + obj.DisplayName + '</option>';
                }
            });
            $(id.selector).append(content);
            $(id.selector).val(selectedvalue).trigger('change');
        }

    }

}

function BindItemGrid(ind) {
    $("#idtbody").empty();
    count++;
    let content = '';
    content += '<tr>' +
       '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
          '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
       '</td>' +
       '<td><input type="text" id="ddlHead' + ind + '" class="span12 ddlHead"/><input type="hidden" id="hdddlHead"/></td>' +
       '<td id="txtCombo' + ind + '"><p style="font-weight: 900; display:none;" id="p' + ind + '"><a style="color: red;font-style: italic;" href="#" class="clickcombo">Combo</a></p></td>' +
       '<td><input type="text" id="txtHeadDesc' + ind + '" class="span12 txtHeadDesc" /><input type="hidden" id="hfSaleDetId' + ind + '" value="0"/></td>' +
       '<td><select id="ddlLocation' + ind + '" class="span12 ddlLocation">' + loadLocation(ind) + '</select></td>' +
       '<td><input type="text" id="txtStock' + ind + '" class="span12 txtStock" readonly/><input type="hidden" id="hfSpecialPrice' + ind + '" value="0"/></td>' +
       '<td><input type="number" id="txtSaleQty' + ind + '" class="span12 txtSaleQty" readonly /><input type="hidden" id="hfPreSale' + ind + '" value=""/></td>' +
       '<td><input type="number" id="txtUnitPrice' + ind + '" class="span12 txtUnitPrice ForTotalPrice" readonly/><input type="hidden" id="hfItemType' + ind + '" value=""/></td>' +
       '<td><input type="number" id="txtDis' + ind + '" class="span12 txtDis" readonly/></td>' +
       '<td><input type="number" id="txtTotalPrice' + ind + '" class="span12 txtTotalPrice" readonly/></td>' +
       '</tr>';
    $('#tbl tbody').append(content);
    $('#ddlLocation' + ind + "").select2();

}

function loadItem(index) {
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
        url: base + CurrentController + "/GetWareHouse",
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

                locList = [];
                locList = result;
                setComboWithId(result, '-1', $('#ddlLocation' + index));
                loadInisialColumnHeadId(('#ddlHead' + index));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadLocationByheadId(headId, index, itemType) {
    var aObj = {
        "IHeadId": headId,
        "SearchText": itemType
    };
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadWareHouseByHeadId",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "aObj": aObj }),
        success: function (result) {

            if (result.length > 0) {
                locList = [];
                locList = result;
                $('#ddlLocation' + index).empty();
                setComboWithId(result, '-1', $('#ddlLocation' + index));
                // LoadDropdown(result.listComboData, $('#ddlLocation' + index));
            }

        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });

}

function addRow(addIndex) {
    var content = '';
    content += '<tr>' +
               '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
               '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
               '</td>' +
               '<td><input type="text" id="ddlHead' + addIndex + '" class="span12 ddlHead"/><input type="hidden" id="hdddlHead"/></td>' + //' + loadItem(addIndex) + '
               '<td id="txtCombo' + addIndex + '"><p style="font-weight: 900;display:none;" id="p' + addIndex + '"><a style="color: red;font-style: italic;" href="#" class="clickcombo">Combo</a></p></td>' +
               '<td><input type="text" id="txtHeadDesc' + addIndex + '" class="span12 txtHeadDesc" /><input type="hidden" id="hfSaleDetId' + addIndex + '" value="0"/></td>' +
               '<td><select id="ddlLocation' + addIndex + '" class="span12 ddlLocation">' + loadLocation(addIndex) + '</select></td>' +
               '<td><input type="text" id="txtStock' + addIndex + '" class="span12 txtStock" readonly/><input type="hidden" id="hfSpecialPrice' + addIndex + '" value="0"/></td>' +
               '<td><input type="number" id="txtSaleQty' + addIndex + '" class="span12 txtSaleQty" readonly/><input type="hidden" id="hfPreSale' + addIndex + '" value=""/></td>' +
               '<td><input type="number" id="txtUnitPrice' + addIndex + '" class="span12 txtUnitPrice ForTotalPrice" readonly /><input type="hidden" id="hfItemType' + addIndex + '" value=""/></td>' +
               '<td><input type="number" id="txtDis' + addIndex + '" class="span12 txtDis" readonly /></td>' +
               '<td><input type="number" id="txtTotalPrice' + addIndex + '" class="span12 txtTotalPrice" readonly/></td>' +
        '</tr>';
    return content;
}

function loadMultipleColumnHeadId(tblRow) {
    if ($("#hdCustomerName").val() != "0") {

        var colors = [];
        var value = $($($(tblRow).children('td:eq(1)').children())[0]).val();
        var urlpath = base + CurrentController + "/GetItemHeadAutoComplete";
        var myRes = [];
        var aObj = {
            "SearchText": value,
            "CustomerId": $("#hdCustomerName").val() == "" ? 0 : $("#hdCustomerName").val(),
            "Name": $("#txtTerms").val()

        };
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

                    return false;
                } else {

                    myRes = result.ListAutoCpomplete;
                    column = [{ name: 'Code', minWidth: '100px' }, { name: 'Qty', minWidth: '60px' }];
                    colors = [];
                    $.each(result.ListAutoCpomplete, function (i, obj) {

                        var color = [];
                        color.push(obj.value, obj.text);
                        colors.push(color);
                    });

                    $($($(tblRow).children('td:eq(1)').children())[0]).mcautocomplete({
                        showHeader: true,
                        columns: column,
                        source: colors,
                        select: function (event, ui) {

                            var headCode = (ui.item ? ui.item[0] : '');
                            this.value = headCode;

                            var imlst = $.grep(myRes,
                              function (x) {
                                  if (x.value == headCode) {
                                      return x;
                                  }
                              });

                            $($($(tblRow).children('td:eq(1)')).find('input[type="hidden"]')).val(imlst[0].id);

                            var itmName = $($(tblRow).children('td:eq(3)').find('input')).attr('id');
                            var r = $($(tblRow).children('td:eq(5)').find('input')).attr('id');
                            var unitPrc = $($(tblRow).children('td:eq(7)').find('input')).attr('id');
                            let specPrice = $($(tblRow).children('td:eq(5)').find('input[type=hidden]')).attr('id');
                            let itemType = $($(tblRow).children('td:eq(7)').find('input[type=hidden]')).attr('id');
                            var addNewIndex = 0;
                            $('#' + itmName).val(imlst[0].Data);
                            $('#' + itmName).attr('title', imlst[0].Data);
                            $('#' + unitPrc).val(imlst[0].value1);
                            $('#' + specPrice).val(imlst[0].value2);
                            $('#' + itemType).val(imlst[0].Itemtype);
                            // imlst = [];

                            $('#' + r).val('');
                            var index = $(tblRow).index();
                            if (index > 0) {
                                addNewIndex = addIndex + index;
                            } else {
                                addNewIndex = index;
                            }
                           
                            if (imlst[0].Itemtype == "combo") {
                               // $("#comboHeader").css('display', '');
                               // $("#txtCombo" + addNewIndex).css('display', '');
                                $("#p" + addNewIndex).css('display', '');
                               // comboCount = comboCount + 1;
                            } else {
                                //if (comboCount == 0) {
                                //    $("#txtCombo" + addNewIndex).css('display', 'none');
                                //} else { $("#txtCombo" + addNewIndex).css('display', ''); }
                                $("#p" + addNewIndex).css('display', 'none');
                            }

                            locList = [];
                            LoadLocationByheadId(imlst[0].id, addNewIndex, imlst[0].Itemtype);
                            return false;

                        },

                    });

                }
            },
            error: function (errRes) {
                $.pnotify({ text: formatErrorMessage(errRes), type: 'error' });
            }
        });
    } else {
        $(".ddlHead").val('');
        $.pnotify({ text: "Pls Input Customer.!", type: 'error' });
    }

}

function loadItemDDl(itemlist, tblRow) {

    $($(tblRow).children('td:eq(1)').children()).inputpicker({
        //data: [
        //    { value: "1", text: "Text 1", description: "This is the description of the text 1." },
        //    { value: "2", text: "Text 2", description: "This is the description of the text 2." },
        //    { value: "3", text: "Text 3", description: "This is the description of the text 3." }
        //],
        data: itemlist,
        fields: [
            { name: 'value', text: 'Code' },
            { name: 'text', text: 'Qty' }
            //{ name: 'description', text: 'Description' }
        ],
        autoOpen: true,
        headShow: true,
        fieldText: 'value',
        fieldValue: 'text',
        pagination: true,
        pageMode: '',
        pageField: 'p',
        pageLimitField: 'per_page',
        limit: 5,
        pageCurrent: 1
    });
}

$(document).off('click', '.btnRemove').on('click', '.btnRemove', function () {

    var index = $(this).closest('tr').index();
    var finishe = $(this).closest('tr');
    var saleDetsId = $(this).closest('tr')[0].cells[3].childNodes[1].value;
    if ($("#tbl")[0].rows.length > 1) {
        if (saleDetsId == "0") {
            $(this).closest('tr').remove();
            calculatePayment();
        } else {
            $.msgbox("Are you sure that you want to Remove ?", {
                type: "confirm",
                buttons: [
                    { type: "submit", value: "Yes" },
                    { type: "submit", value: "No" }
                ]
            }, function (result) {
                if (result == "Yes") {
                    var urlpath = base + CurrentController + "/SaleDetailIdDelete";
                    $.ajax({
                        beforeSend: function () { $.blockUI(); },
                        complete: function () { $.unblockUI(); },
                        type: "POST",
                        url: urlpath,
                        contentType: "application/json;charset=utf-8",
                        dataType: "JSON",
                        data: JSON.stringify({ "saleDetsId": saleDetsId }),
                        success: function (result) {
                            if (result.IsSessionOut != null) {
                                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                                return false;
                            } else if (result.Error != null && result.Error != "") {
                                $.pnotify({ text: result.Error, type: 'error' });
                                return false;
                            } else {
                                finishe.remove();
                                calculatePayment();
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

$(document).off('click', '.btnAdd').on('click', '.btnAdd', function () {

    if (validationADD() === true) {

        var rowindex = $('#tbl tbody tr').length;
        var addNewIndex = addIndex + rowindex;
        var content = addRow(addNewIndex);
        $("#tbl").append(content);
        //$('#ddlHead' + addIndex + "").select2();
        $('#ddlLocation' + addNewIndex + "").select2();
        let couter = 0;
        //$("#tbl tr:gt(0)").each(function () {
        //    let itemType = $(this).children('td:eq(7)').find('input[type="hidden"]').val();
        //    if (itemType == "combo") {
        //        couter = couter + 1;
        //    }
        //});
       
        //if (couter > 0) {
           // $("#txtCombo" + addNewIndex).css('display', '');
           // $("#p" + addNewIndex).css('display', 'none');
       // } //else { $("#txtCombo" + addNewIndex).css('display', 'none'); }
       
      

    }

});

$(document).off('change', '.ddlLocation').on('change', '.ddlLocation', function () {

    var stockqty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
    var qty = $(this).closest("tr")[0].cells[6].childNodes[0].id;
    var presaleId = $(this).closest("tr")[0].cells[6].lastChild.id;
    var unitprice = $(this).closest("tr")[0].cells[7].childNodes[0].id;
    var discount = $(this).closest("tr")[0].cells[8].childNodes[0].id;
    var totalprice = $(this).closest("tr")[0].cells[9].childNodes[0].id;

    if ($(this).val() !== '-1') {
        var locId = $(this).val();
        if (locList.length > 0) {
            var imlst = $.grep(locList,
              function (x) {
                  if ('' + x.Value + '' === locId) {
                      return x;
                  }
              });

            $('#' + stockqty).val(imlst[0].ValueStr);
            imlst = [];
        } else { $('#' + stockqty).val('0'); }
        if (sts != 'Update') {
            $('#' + qty).val('');
        }
        $('#' + presaleId).val('');
        $('#' + qty).attr('readonly', false)
        $('#' + unitprice).attr('readonly', false)
        $('#' + discount).attr('readonly', false)
        $('#' + totalprice).attr('readonly', false)

    } else {
        $('#' + stockqty).val('');
        $('#' + presaleId).val('');
        $('#' + qty).attr('readonly', true)
        $('#' + unitprice).attr('readonly', true)
        $('#' + discount).attr('readonly', true)
        $('#' + totalprice).attr('readonly', true)
    }
});

//chkIsActive
$(document).off('change', '#chkIsActive').on('change', '#chkIsActive', function () {

    var cellTotalValue = 0;
    var afterTexAmount = 0;
    var val = $("#ddlTax").val();
    var imlst = $.grep(TaxList,
                       function (x) {
                           if (x.value == val) {
                               return x;
                           }
                       });
    var taxPercent = parseInt((imlst[0].text.split('%'))[0]);
    var txtval = taxPercent - 0.909;
    // $("#txtNetBill").val(0);
    $("#txtTotal").val(0);
    $("#txtRemaining").val(0);
    var isTaxInclusive = true;
    if ($("#chkIsActive").is(":checked")) {
        isTaxInclusive = true;
        $("#txtTax").attr('disabled', true);
    } else {
        isTaxInclusive = false;
        $("#txtTax").attr('disabled', false);
    }
    $('#tbl tbody tr').each(function () {

        var SaleQty = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
        var salePrice = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[7].childNodes[0]).val());
        var discount = $($(this).closest("tr")[0].cells[8].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[8].childNodes[0]).val());
        if ($("#chkIsActive").is(":checked")) {
           
            if (SaleQty > 0 && salePrice > 0) {
                // var total = SaleQty * salePrice;
                salePrice = salePrice + parseFloat((salePrice * ((txtval + 0.909) / 100)).toFixed(2));

                // salePrice = salePrice + afterTexAmount;
                var total = SaleQty * salePrice;
                $($(this).closest("tr")[0].cells[7].childNodes[0]).val("");
                $($(this).closest("tr")[0].cells[7].childNodes[0]).val(getdecimalvalue(salePrice));
                var discountAmount = total - (total * (discount / 100));
                $($(this).closest("tr")[0].cells[9].childNodes[0]).val(getdecimalvalue(discountAmount));
                var SumText = parseFloat((getdecimalvalue(discountAmount) * (txtval / 100)).toFixed(2));
                afterTexAmount += SumText;

                if (discountAmount > 0) {
                    cellTotalValue += parseFloat(discountAmount);
                }
            }
        }
        else {
            // 200 -(200*.0909)
           
            var oldSalePrice = $($(this).closest("tr")[0].cells[8].childNodes[0]).val();//salePrice;
            salePrice = parseFloat(salePrice - (salePrice * txtval / 100)).toFixed(2);
            $($(this).closest("tr")[0].cells[7].childNodes[0]).val("");
            $($(this).closest("tr")[0].cells[7].childNodes[0]).val(getdecimalvalue(salePrice));

            var total = SaleQty * salePrice;
            var discountAmount = total - (getdecimalvalue(total * (discount / 100)));
            $($(this).closest("tr")[0].cells[9].childNodes[0]).val(getdecimalvalue(discountAmount));
            var newSumText = parseFloat((getdecimalvalue(oldSalePrice) * (txtval / 100)).toFixed(2));
            afterTexAmount += newSumText;

            if (discountAmount > 0) {
                cellTotalValue += parseFloat(discountAmount);
            }
        }


    });
   
    var NetBill = parseFloat(cellTotalValue);
    var freight = $("#txtFright").val() == "" ? 0 : parseFloat($("#txtFright").val());
    //var freight = $("#hfFright").val() == "" ? 0 : parseFloat($("#hfFright").val());
    var freightTax = 0;// parseFloat((freight * (txtval / 100)).toFixed(2));
    var Tax = afterTexAmount;//comtax;//(parseFloat(freightTax) + parseFloat(afterTexAmount)).toFixed(2);

    // var NetPayable = NetBill + freight + Tax;

    var NetPayable = 0.00;
    if ($("#chkIsActive").is(":checked")) {

        // let a = ((parseFloat(freight) * parseFloat(10.9999)) / 100).toFixed(2);
        // freight = parseFloat(freight + (freight * txtval / 100)).toFixed(2);
        // freight = parseFloat(fridtax);
        let frd = $("#hfFright").val() == "" ? 0 : $("#hfFright").val();
        let ft = parseFloat(frd) + parseFloat((frd * ((txtval + 0.909) / 100)).toFixed(2));
        freight = parseFloat(ft).toFixed(2);

        $("#txtFright").val(freight);
        NetPayable = parseFloat(NetBill) + parseFloat(freight);
    } else {
        //txtTotal

        let a = ((parseFloat(freight) * parseFloat(txtval)) / 100).toFixed(2);
        // freight = parseFloat(freight - (freight * txtval / 100)).toFixed(2);
        freight = (freight - parseFloat(a)).toFixed(2);

        $("#txtFright").val(freight);
        NetPayable = parseFloat(NetBill) + parseFloat(freight) + parseFloat(Tax);


        //txtNetPay
    }
    var paidToday = $("#txtPaidToday").val() == "" ? 0 : parseFloat($("#txtPaidToday").val());
    //  var payable = NetPayable - paidToday;
    var payable = parseFloat($("#txtNetPay").val()) - paidToday;
    // $("#txtTax").val(Tax);
    $("#txtTotal").val(cellTotalValue.toFixed(2));
    //  $("#txtNetBill").val(getdecimalvalue(NetBill.toFixed(2)));
    // $("#txtNetPay").val(parseFloat(NetPayable).toFixed(2));
    $("#txtRemaining").val(parseFloat(payable).toFixed(2));
});

function getdecimalvalue(val) {
    return parseFloat((Math.floor(100 * val) / 100).toFixed(2));
}

$(document).off('change', '.txtSaleQty').on('change', '.txtSaleQty', function () {
    if ($(this).val() !== '' || $(this).val() !== '0') {

        var wareId = $(this).closest("tr")[0].cells[4].childNodes[1].id;
        var stockqty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var unitPr = $(this).closest("tr")[0].cells[7].childNodes[0].id;
        var preSale = $(this).closest("tr")[0].cells[6].childNodes[1].id;
        var vale = $(this)[0].id;
        let b = parseInt($(this).val());
        let aa = parseInt($('#' + stockqty).val());
        let warehouseId = $('#' + wareId).val();
        if (userName == "Admin") {

            if (aa < b) {

                if (warehouseId == "6") {
                    $.msgbox("<span style='font-weight:bold; color:#FF0000;'>WARNING!!!</span> Are you sure to sale this qty?", {
                        type: "confirm",
                        buttons: [
                            { type: "submit", value: "Yes" },
                            { type: "submit", value: "No" }
                        ]
                    }, function (result) {
                        if (result == "Yes") {
                            $("#" + preSale).val('Yes');
                        }
                        else if (result == "No") {
                            $("#" + vale).val('');
                        }
                    });

                } else {
                    $.pnotify({ text: 'Must Less Or Equal to In Hand Qty', type: 'error' });
                    $(this).val('');
                }

            }
        } else {
            if (aa < b) {
                if (warehouseId == "6") {
                    $.msgbox("<span style='font-weight:bold; color:#FF0000;'>WARNING!!!</span> Are you sure to sale this qty??", {
                        type: "confirm",
                        buttons: [
                            { type: "submit", value: "Yes" },
                            { type: "submit", value: "No" }
                        ]
                    }, function (result) {
                        if (result == "Yes") {
                            $("#" + preSale).val('Yes');
                        }
                        else if (result == "No") {
                            $("#" + vale).val('');
                        }
                    });

                } else {
                    $.pnotify({ text: 'Access denied for you. Pls contact your Admin', type: 'info' });
                    $(this).val('');
                }
            }

        }

        if ($('#' + unitPr).val() !== "") {
            calculatePayment();
        }

    }
});

$(document).off('change', '.txtUnitPrice').on('change', '.txtUnitPrice', function () {

    if ($(this).val() !== '') {
        var price = $(this).val();
        var SaleQtyId = $(this).closest("tr")[0].cells[6].childNodes[0].id;
        var specPriceId = $(this).closest("tr")[0].cells[5].childNodes[1].id;
        let SaleQty = parseInt($('#' + SaleQtyId).val());
        let specPrice = $('#' + specPriceId).val();
        debugger
        var isSpecialPrice = userManagerPer.length > 0 ? userManagerPer[0].IsSpecialPrice : false;
        if (isSpecialPrice == false) {
            if ((parseFloat(specPrice) <= parseFloat(price)) || ($("#txtTerms").val() != "Prepaid")) {
                if (SaleQty > 0) {
                    var Total = price * SaleQty;
                    $($(this).closest("tr")[0].cells[9].childNodes[0]).val(Total);
                }
            } else {
                $(this).val('');
                $($(this).closest("tr")[0].cells[9].childNodes[0]).val('');
                $.pnotify({ text: 'You need to sale under Special Price', type: 'info' });
            }
        } else {
            if (SaleQty > 0) {
                var Total = price * SaleQty;
                $($(this).closest("tr")[0].cells[9].childNodes[0]).val(Total);
            }
        }
    }
});

$('body').on("keyup", '.ddlHead', function (e) {

    var tblRow = $(this).closest('tr');
    loadMultipleColumnHeadId(tblRow);

});

$(document).off('change', '.txtDis').on('change', '.txtDis', function () {
    if ($(this).val() !== '') {
        var cellTotalValue = 0;
        var afterTexAmount = 0;
        var val = $("#ddlTax").val();
        var isSpecialPrice = userManagerPer.length > 0 ? userManagerPer[0].IsSpecialPrice : false;
        var imlst = $.grep(TaxList,
                           function (x) {
                               if (x.value == val) {
                                   return x;
                               }
                           });
        var taxPercent = parseInt((imlst[0].text.split('%'))[0]);
        var txtval = taxPercent - 0.909;
        // $("#txtNetBill").val(0);
        $("#txtTotal").val(0);
        $("#txtRemaining").val(0);
        var isTaxInclusive = true;
        if ($("#chkIsActive").is(":checked")) {
            isTaxInclusive = true;
            $("#txtTax").attr('disabled', true);
        } else {
            isTaxInclusive = false;
            $("#txtTax").attr('disabled', false);
        }
        $('#tbl tbody tr').each(function () {

            var SaleQty = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
            var salePrice = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[7].childNodes[0]).val());
            var discount = $($(this).closest("tr")[0].cells[8].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[8].childNodes[0]).val());
            let specPrice = $($(this).closest("tr")[0].cells[5].childNodes[1]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[5].childNodes[1]).val());
            if ($("#chkIsActive").is(":checked")) {

                if (SaleQty > 0 && salePrice > 0) {
                    var total = SaleQty * salePrice;
                    let tolPecPrice = SaleQty * specPrice;
                    $($(this).closest("tr")[0].cells[7].childNodes[0]).val("");
                    $($(this).closest("tr")[0].cells[7].childNodes[0]).val(getdecimalvalue(salePrice));
                    var discountAmount = total - (total * (discount / 100));

                    if (isSpecialPrice == false) {
                        if (tolPecPrice <= discountAmount || $("#txtTerms").val() != "Prepaid") {
                            $($(this).closest("tr")[0].cells[9].childNodes[0]).val(getdecimalvalue(discountAmount));
                            var SumText = parseFloat((getdecimalvalue(discountAmount) * (txtval / 100)).toFixed(2));
                            afterTexAmount += SumText;
                            if (discountAmount > 0) {
                                cellTotalValue += parseFloat(discountAmount);
                            }
                        } else {
                            $($(this).closest("tr")[0].cells[8].childNodes[0]).val('0');
                            $($(this).closest("tr")[0].cells[9].childNodes[0]).val(getdecimalvalue(total));
                            let SumText = parseFloat((getdecimalvalue(total) * (txtval / 100)).toFixed(2));
                            afterTexAmount += SumText;
                            cellTotalValue += parseFloat(total);
                            $.pnotify({ text: 'You need to sale under Special Price', type: 'info' });
                        }
                    } else {
                        $($(this).closest("tr")[0].cells[9].childNodes[0]).val(getdecimalvalue(discountAmount));
                        var SumText = parseFloat((getdecimalvalue(discountAmount) * (txtval / 100)).toFixed(2));
                        afterTexAmount += SumText;
                        if (discountAmount > 0) {
                            cellTotalValue += parseFloat(discountAmount);
                        }
                    }
                }
            }
            else {
                // 200 -(200*.0909)
                var oldSalePrice = salePrice;//salePrice;
                $($(this).closest("tr")[0].cells[7].childNodes[0]).val("");
                $($(this).closest("tr")[0].cells[7].childNodes[0]).val(getdecimalvalue(salePrice));

                var total = SaleQty * salePrice;
                let tolPecPrice = SaleQty * specPrice;
                var discountAmount = total - (getdecimalvalue(total * (discount / 100)));
                if (tolPecPrice <= discountAmount || $("#txtTerms").val() != "Prepaid") {
                    $($(this).closest("tr")[0].cells[9].childNodes[0]).val(getdecimalvalue(discountAmount));
                    var newSumText = parseFloat((getdecimalvalue(discountAmount) * ((txtval + 0.909) / 100)).toFixed(2));
                    afterTexAmount += newSumText;
                    if (discountAmount > 0) {
                        cellTotalValue += parseFloat(discountAmount);
                    }
                } else {
                    $($(this).closest("tr")[0].cells[8].childNodes[0]).val('0');
                    $($(this).closest("tr")[0].cells[9].childNodes[0]).val(getdecimalvalue(total));
                    let newSumText = parseFloat((getdecimalvalue(total) * ((txtval + 0.909) / 100)).toFixed(2));
                    afterTexAmount += newSumText;
                    cellTotalValue += parseFloat(total);
                    $.pnotify({ text: 'You need to sale under Special Price', type: 'info' });
                }
            }

        });

        var NetBill = cellTotalValue;
        var freight = $("#txtFright").val() == "" ? 0 : parseFloat($("#txtFright").val());
        var Tax = afterTexAmount.toFixed(2);
        // var NetPayable = NetBill + freight + Tax;

        var NetPayable = 0.00;
        if ($("#chkIsActive").is(":checked")) {
            NetPayable = NetBill + freight;
        } else {
            //txtTotal
            NetPayable = parseFloat(NetBill) + parseFloat(freight) + parseFloat(Tax);


            //txtNetPay
        }
        var paidToday = $("#txtPaidToday").val() == "" ? 0 : parseFloat($("#txtPaidToday").val());
        var payable = NetPayable - paidToday;
        $("#txtTax").val(Tax);
        $("#txtTotal").val(cellTotalValue.toFixed(2));
        // $("#txtNetBill").val(getdecimalvalue(NetBill));
        $("#hfNetPay").val(parseFloat(NetPayable).toFixed());
        $("#txtNetPay").val(parseFloat(NetPayable).toFixed());
        $("#txtRemaining").val(parseFloat(payable).toFixed());

    }
});

$(document).on('change', '#ddlTax', function () {

    var val = $(this).val();
    var imlst = $.grep(TaxList,
                       function (x) {
                           if (x.value == val) {
                               return x;
                           }
                       });

    var taxPercent = parseInt((imlst[0].text.split('%'))[0]);
    if (sts == '') {
        if (!($("#chkIsActive").is(':checked'))) {
            $("#txtTax").val(0);
            $.pnotify({ text: 'Tax inclusive is not checked', type: 'error' });
        } else {
            $("#txtTax").val(taxPercent);
        }
    }

    calculatePayment();

});

$(document).on('change', '.ForTotalPrice', function () {
    calculatePayment();

});

$(document).on('change', '#txtFright', function () {

    var cellTotalValue = 0;
    var afterTexAmount = 0;
    var val = $("#ddlTax").val();
    var imlst = $.grep(TaxList,
                       function (x) {
                           if (x.value == val) {
                               return x;
                           }
                       });
    var taxPercent = parseInt((imlst[0].text.split('%'))[0]);
    var txtval = 0;
    if (taxPercent != 0) {
        txtval = taxPercent - 0.909;
    }
    // $("#txtNetBill").val(0);
    $("#txtTotal").val(0);
    $("#txtRemaining").val(0);
    $("#hfFright").val($(this).val());
    var isTaxInclusive = true;
    if ($("#chkIsActive").is(":checked")) {
        isTaxInclusive = true;
        $("#txtTax").attr('disabled', true);
    } else {
        isTaxInclusive = false;
        $("#txtTax").attr('disabled', false);
    }
    $('#tbl tbody tr').each(function () {
        var SaleQty = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
        var salePrice = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[7].childNodes[0]).val());
        var discount = $($(this).closest("tr")[0].cells[8].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[8].childNodes[0]).val());
        if ($("#chkIsActive").is(":checked")) {

            if (SaleQty > 0 && salePrice > 0) {
                var total = SaleQty * salePrice;
                var discountAmount = total - (total * (discount / 100));
                var SumText = parseFloat((getdecimalvalue(discountAmount) * (txtval / 100)).toFixed(2));
                afterTexAmount += SumText;
                if (discountAmount > 0) {
                    cellTotalValue += parseFloat(discountAmount);
                }
            }
        }
        else {

            var oldSalePrice = salePrice;//salePrice;
           
            var total = SaleQty * salePrice;
            var discountAmount = total - (getdecimalvalue(total * (discount / 100)));
            // $($(this).closest("tr")[0].cells[8].childNodes[0]).val(getdecimalvalue(discountAmount));
            var newSumText = parseFloat((getdecimalvalue(discountAmount) * ((txtval + 0.909) / 100)).toFixed(2));
            afterTexAmount += newSumText;
            if (discountAmount > 0) {
                cellTotalValue += parseFloat(discountAmount);
            }
        }
    });

    var NetBill = cellTotalValue;
    var freight = $("#txtFright").val() == "" ? 0 : parseFloat($("#txtFright").val());
    var Tax = afterTexAmount.toFixed(2);

    var NetPayable = 0.00;
    if ($("#chkIsActive").is(":checked")) {
        NetPayable = NetBill + freight;
    } else {
        NetPayable = parseFloat(NetBill) + parseFloat(freight) + parseFloat(Tax);
    }
    if (sts != 'Update') {
        $("#txtPaidToday").val('');
    }
    var paidToday = $("#txtPaidToday").val() == "" ? 0 : parseFloat($("#txtPaidToday").val());
    var payable = NetPayable - paidToday;
    $("#txtTax").val(Tax);
    $("#txtTotal").val(cellTotalValue.toFixed(2));
    // $("#txtNetBill").val(getdecimalvalue(NetBill));
    $("#hfNetPay").val(parseFloat(NetPayable).toFixed(2));
    $("#txtNetPay").val(parseFloat(NetPayable).toFixed(2));
    $("#txtRemaining").val(parseFloat(payable).toFixed(2));
    $("#txtManagerDiscount").val($("#txtManagerDiscount").val()).trigger('change');


});

$(document).on('change', '#txtManagerDiscount', function () {
    var val = $("#ddlTax").val();
    var imlst = $.grep(TaxList,
                       function (x) {
                           if (x.value == val) {
                               return x;
                           }
                       });
    var taxPercent = parseInt((imlst[0].text.split('%'))[0]);
    var txtval = 0;
    if (taxPercent != 0) {
        txtval = taxPercent - 0.909;
    }

    if ($(this).val() != '' && $(this).val() != '0' && $("#hfNetPay").val() != '') {
        if (userManagerPer.length > 0) {

            let manDis = userManagerPer[0].ManagerDiscount;
            let tAmount = $("#txtNetPay").val();
            let total = parseFloat($("#txtTotal").val());
            let tFright = $("#txtFright").val() == "" ? 0 : parseFloat($("#txtFright").val());
            let manAmount = $("#txtManagerDiscount").val();
            let dicountAmount = (parseFloat(tAmount) * parseFloat(manDis)) / 100;
            if (parseFloat(dicountAmount) >= parseFloat(manAmount)) {
                let tdue = ((total + tFright) - manAmount).toFixed(2);
                let totTax = 0;
                if ($("#chkIsActive").is(":checked")) {
                    totTax = parseFloat((tdue * (txtval / 100)).toFixed(2));
                } else {
                    totTax = parseFloat((tdue * (10 / 100)).toFixed(2));
                }
                $("#txtNetPay").val(parseFloat(tdue).toFixed(2));
                //  $("#txtRemaining").val(tdue);
                if (sts != 'Update') {
                    $("#txtPaidToday").val('');
                }
                let pay = $("#txtPaidToday").val() == '' ? 0 : $("#txtPaidToday").val();
                let payable = parseFloat(tdue) - parseFloat(pay);
                $("#txtRemaining").val(parseFloat(payable).toFixed(2));
                $("#txtTax").val(totTax);
            } else {
                $("#txtManagerDiscount").val('');
                if (sts != 'Update') {
                    $("#txtPaidToday").val('');
                }
                $.pnotify({ text: "Max Discount Amount = " + dicountAmount, type: 'info' });
            }
        } else { $("#txtManagerDiscount").val(''); $.pnotify({ text: "Don't allow to Discount", type: 'info' }); }
    } else {

        //$("#txtPaidToday").val($('').val());
        if (sts != 'Update') {
            $("#txtPaidToday").val('');
        }
        let toal = $("#hfNetPay").val(); let totTax = 0;
        if ($("#chkIsActive").is(":checked")) {
            totTax = parseFloat((toal * (txtval / 100)).toFixed(2));
        } else {
            let freit = ($("#txtFright").val() == "" ? 0 : $("#txtFright").val());
            let subtot = ($("#txtTotal").val() == "" ? 0 : $("#txtTotal").val());
            toal = parseFloat(freit) + parseFloat(subtot);
            //totTax =  ((parseFloat(toal) * 10)/100).toFixed(2);
            totTax = parseFloat((toal * (10 / 100)).toFixed(2));

            toal = toal + totTax;

        }

        $("#txtTax").val(totTax);
        let pay = $("#txtPaidToday").val() == '' ? 0 : $("#txtPaidToday").val();
        $("#txtNetPay").val(parseFloat(toal).toFixed(2));

        let payable = parseFloat(toal) - parseFloat(pay);
        $("#txtRemaining").val(parseFloat(payable).toFixed(2));
    }
});

function calculatePayment() {

    // if (sts != 'Update') {

    var cellTotalValue = 0;
    var afterTexAmount = 0;
    var val = $("#ddlTax").val();
    var imlst = $.grep(TaxList,
                       function (x) {
                           if (x.value == val) {
                               return x;
                           }
                       });
    var taxPercent = parseInt((imlst[0].text.split('%'))[0]);
    var txtval = 0;
    if (taxPercent != 0) {
        txtval = taxPercent - 0.909;
    }

    // $("#txtNetBill").val(0);
    $("#txtTotal").val(0);
    $("#txtRemaining").val(0);
    var isTaxInclusive = true;
    if ($("#chkIsActive").is(":checked")) {
        isTaxInclusive = true;
        $("#txtTax").attr('disabled', true);
    } else {
        isTaxInclusive = false;
        $("#txtTax").attr('disabled', false);
    }

    $('#tbl tbody tr').each(function () {

        var SaleQty = ($($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[6].childNodes[0]).val())).toFixed(2);
        var salePrice = ($($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[7].childNodes[0]).val())).toFixed(2);
        var discount = ($($(this).closest("tr")[0].cells[8].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[8].childNodes[0]).val())).toFixed(3);

        if ($("#chkIsActive").is(":checked")) {
            if (SaleQty > 0 && salePrice > 0) {

                var total = SaleQty * salePrice;
                var discountAmount = total - (total * (discount / 100));
                var result = Math.round(discountAmount * 100) / 100.000001;
                $($(this).closest("tr")[0].cells[9].childNodes[0]).val(discountAmount.toFixed(2));

                var SumText = parseFloat((discountAmount * (txtval / 100)).toFixed(2));
                afterTexAmount += SumText;
                if (discountAmount > 0) {
                    cellTotalValue += (discountAmount);
                }
            }
        } else {

            txtval = taxPercent;
            //var oldSalePrice = $($(this).closest("tr")[0].cells[8].childNodes[0]).val();
            var oldSalePrice = $($(this).closest("tr")[0].cells[7].childNodes[0]).val();
            salePrice = salePrice - parseFloat(((salePrice * txtval / 100).toFixed(2)));
            $($(this).closest("tr")[0].cells[7].childNodes[0]).val("");
            $($(this).closest("tr")[0].cells[7].childNodes[0]).val(parseFloat(oldSalePrice).toFixed(2));

            var total = parseFloat(SaleQty).toFixed(2) * parseFloat(oldSalePrice).toFixed(2);
            var discountAmount = total - (total * (discount / 100));
            $($(this).closest("tr")[0].cells[9].childNodes[0]).val(discountAmount.toFixed(2));
            var newSumText = parseFloat((discountAmount * (txtval / 100)).toFixed(2));
            afterTexAmount += newSumText;

            if (discountAmount > 0) {
                cellTotalValue += (discountAmount);
            }
        }

    });

    var NetBill = parseFloat(cellTotalValue);
    var freight = $("#txtFright").val() == "" ? 0 : parseFloat($("#txtFright").val());
    fridtax = freight;
    // added Sayed
    var freightTax = parseFloat((freight * (txtval / 100)).toFixed(2));
    var Tax = (parseFloat(freightTax) + parseFloat(afterTexAmount)).toFixed(2);    //afterTexAmount.toFixed(2);
    comtax = Tax;
    var NetPayable = "";
    if ($("#chkIsActive").is(":checked")) {
        NetPayable = parseFloat(NetBill) + parseFloat(freight);
    } else {
        NetPayable = parseFloat(NetBill) + parseFloat(freight) + parseFloat(Tax);
    }
    //var  NetPayable = NetBill + freight + Tax;

    var paidToday = $("#txtPaidToday").val() == "" ? 0 : parseFloat($("#txtPaidToday").val());
    var payable = NetPayable - paidToday;
    $("#txtTax").val(Tax);
    $("#txtTotal").val(cellTotalValue.toFixed(2));
    // $("#txtNetBill").val(NetBill.toFixed(2));
    $("#hfNetPay").val(NetPayable.toFixed(2));
    $("#txtNetPay").val(NetPayable.toFixed(2));
    $("#txtRemaining").val(payable.toFixed(2));
    // }
}

$(document).on('keyup', '.calculation', function () {
    calculatePayment();

});
//txtTotalPrice
$(document).on('change', '.txtTotalPrice', function () {
    var cellTotalValue = 0;
    var afterTexAmount = 0;
    var isSpecialPrice = userManagerPer.length > 0 ? userManagerPer[0].IsSpecialPrice : false;
    var val = $("#ddlTax").val();
    var imlst = $.grep(TaxList,
                       function (x) {
                           if (x.value == val) {
                               return x;
                           }
                       });
    var taxPercent = parseInt((imlst[0].text.split('%'))[0]);

    var txtval = taxPercent - 0.909;
    // $("#txtNetBill").val(0);
    $("#txtTotal").val(0);
    $("#txtRemaining").val(0);
    var isTaxInclusive = true;
    if ($("#chkIsActive").is(":checked")) {
        isTaxInclusive = true;
        $("#txtTax").attr('disabled', true);
    } else {
        isTaxInclusive = false;
        $("#txtTax").attr('disabled', false);
    }

    var trRow = $(this).closest('tr');
    var SaleQty = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
    var salePrice = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "0.00" ? 0 : parseInt($($(this).closest("tr")[0].cells[7].childNodes[0]).val());
    let specPrice = $($(this).closest("tr")[0].cells[5].childNodes[1]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[5].childNodes[1]).val());

    var TotalValue = parseInt($(this).val() == "" ? 0 : $(this).val());

    if (SaleQty != 0 && salePrice != 0) {
        if ((SaleQty * salePrice) < TotalValue) {
            $.pnotify({ text: "Over to Price !", type: 'info' });
            $(this).val((SaleQty * salePrice));
        } else {
            var pur = (SaleQty * salePrice) - TotalValue;
            let specPricetol = (SaleQty * specPrice);
            let totalV = (SaleQty * salePrice);
            if (isSpecialPrice == false) {
                if (specPricetol <= TotalValue || $("#txtTerms").val() != "Prepaid") {
                    var ratio = pur * 100 / (SaleQty * salePrice);
                    $($(this).closest("tr")[0].cells[8].childNodes[0]).val(ratio);
                } else {
                    $(this).val(totalV);
                    $($(this).closest("tr")[0].cells[8].childNodes[0]).val('0');
                    $.pnotify({ text: 'You need to sale under Special Price', type: 'info' });
                }
            } else {
                var ratio = pur * 100 / (SaleQty * salePrice);
                $($(this).closest("tr")[0].cells[8].childNodes[0]).val(ratio);
            }
        }
        var cellTotalValue = 0;

        $("#txtTotal").val(0);
        //$("#txtNetBill").val(0);
        $("#txtRemaining").val(0);

        $('#tbl tbody tr').each(function () {
            var SaleQty = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
            var salePrice = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[7].childNodes[0]).val());
            var discount = $($(this).closest("tr")[0].cells[8].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[8].childNodes[0]).val());

            if ($("#chkIsActive").is(":checked")) {
                if (SaleQty > 0 && salePrice > 0) {
                    var discountAmount = $($(this).closest("tr")[0].cells[9].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[9].childNodes[0]).val());

                    $($(this).closest("tr")[0].cells[9].childNodes[0]).val(discountAmount.toFixed(2));
                    var SumText = parseFloat((discountAmount * (txtval / 100)).toFixed(2));
                    afterTexAmount += SumText;
                    if (discountAmount > 0) {
                        cellTotalValue += parseInt(discountAmount);
                    }
                }
            } else {
                if (SaleQty > 0 && salePrice > 0) {

                    var discountAmount = $($(this).closest("tr")[0].cells[9].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[9].childNodes[0]).val());

                    $($(this).closest("tr")[0].cells[9].childNodes[0]).val(discountAmount.toFixed(2));
                    var SumText = parseFloat((discountAmount * (txtval / 100)).toFixed(2));
                    afterTexAmount += SumText;
                    if (discountAmount > 0) {
                        cellTotalValue += parseInt(discountAmount);
                    }
                }
            }



        });

        var NetBill = cellTotalValue;
        var freight = $("#txtFright").val() == "" ? 0 : parseFloat($("#txtFright").val());
        var Tax = afterTexAmount.toFixed(2);
        var NetPayable = "";
        if ($("#chkIsActive").is(":checked")) {
            NetPayable = parseFloat(NetBill) + parseFloat(freight);
        } else {
            NetPayable = parseFloat(NetBill) + parseFloat(freight) + parseFloat(Tax);
        }
        //var  NetPayable = NetBill + freight + Tax;
        var paidToday = $("#txtPaidToday").val() == "" ? 0 : parseFloat($("#txtPaidToday").val());
        var payable = NetPayable - paidToday;
        $("#txtTax").val(Tax);
        $("#txtTotal").val(cellTotalValue.toFixed(2));
        // $("#txtNetBill").val(NetBill.toFixed(2));
        $("#hfNetPay").val(NetPayable.toFixed(2));
        $("#txtNetPay").val(NetPayable.toFixed(2));
        $("#txtRemaining").val(payable.toFixed(2));
    }
    else {
        $.pnotify({ text: "Please Input Ship or Price !", type: 'info' });
        $(this).val('');
    }

    $("#txtManagerDiscount").val($("#txtManagerDiscount").val()).trigger('change');
});

$(document).on('change', '#txtCustomerNameSale', function () {
    var CustomerId = $("#hdCustomerName").val();
    if (CustomerId > 0) {
        var aObj = {
            "SearchText": CustomerId // ReviseReasonBulk
        };
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: base + CurrentController + "/GetCustomerDue",
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "aObj": aObj }),
            success: function (result) {

                if (result.length > 0) {
                    $("#txtPrevDue").val(result[0].CustomerDueAmount);
                    calculatePayment();
                    return false;
                } else {
                    $("#txtPrevDue").val(0);
                }

            },
            error: function (a, b, c) {
                $.pnotify({ text: 'Something Wrong', type: 'error' });
            }
        });
    }
});

$(document).on('change', '#txtPaidToday', function () {

    if ($("#txtPaidToday").val() != "" && $("#txtPaidToday").val() != "0") {
        let paidToday = $("#txtPaidToday").val() == "" ? 0 : parseFloat($("#txtPaidToday").val());
        let TotalAMount = $("#txtNetPay").val() == "" ? 0 : parseFloat($("#txtNetPay").val());
        let payable = parseFloat(TotalAMount) - parseFloat(paidToday);
        $("#txtRemaining").val(payable.toFixed(2));
    } else { $("#txtRemaining").val($("#txtNetPay").val()); }


});

function validationADD() {
    var isresult = true;
    $("#tbl tr:gt(0)").each(function () {

        var headId = $(this).children('td:eq(1)').find('input[type="hidden"]').val();//ddlHead
        var locId = $(this).children('td:eq(4)').find("select").val();
        var qty = $(this).children('td:eq(6)').find("input").val();
        var SalePrice = $(this).children('td:eq(7)').find("input").val();
        var Total = $(this).children('td:eq(9)').find("input").val();
        if (headId == undefined || headId == "" || headId == "0") {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid #aaa' });
        }

        if (locId == undefined || locId == "-1") {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if (qty == undefined || qty == "" || qty == "0") {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

        if (SalePrice == undefined || SalePrice == "" || SalePrice == "0.00") {
            $(this).children('td:eq(7)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(7)').find(".span12").css({ 'border': '1px solid #aaa' });
        }
        if (Total == undefined || Total == "" || Total == "0") {
            $(this).children('td:eq(9)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(9)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

    });
    if (isresult)
        return isresult = true;
    else {
        return isresult = false;
    }
    return isresult;

}
function ValidateCustomerForSave() {
    var isresult = true;

    var customId = $("#hdCustomerName").val();
    var CustomerName = $("#txtCustomerNameSale").val();
    var ShipTo = $("#NewAddressEntry").val();
    var SalesPerson = $("#ddlSalesPerson").val();
    var ShipVia = $("#ddlShipVia").val();
    var promisDate = $("#txtIDueDate").val();
    var tax = $("#ddlTax").val();
    if (customId === "undefined" || customId === "") {
        $("#txtCustomerNameSale").val('');
        $("#txtCustomerNameSale").focus();
        return isresult = false;
    }
    if (CustomerName === "undefined" || CustomerName === "") {
        $("#txtCustomerNameSale").css({ 'border': '1px solid red' });
        $("#txtCustomerNameSale").focus();
        return isresult = false;
    }
    else {
        $("#txtCustomerNameSale").css({ 'border': '1px solid #aaa' });
    }

    //if ($("#txtInvoiceSl").val() == "" || $("#txtInvoiceSl").val().length <= 7) {
    //    $("#txtInvoiceSl").css({ 'border': '1px solid red' });
    //    $("#txtInvoiceSl").focus();
    //    return isresult = false;
    //}
    //else {
    //    $("#txtInvoiceSl").css({ 'border': '1px solid #aaa' });
    //}

    $("#tbl tr:gt(0)").each(function () {

        var headId = $(this).children('td:eq(1)').find('input[type="hidden"]').val();//ddlHead
        var locId = $(this).children('td:eq(4)').find("select").val();
        var qty = $(this).children('td:eq(6)').find("input").val();
        var SalePrice = $(this).children('td:eq(7)').find("input").val();
        var Total = $(this).children('td:eq(9)').find("input").val();
        if (headId == undefined || headId == "" || headId == "0") {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid #aaa' });
        }

        if (locId == undefined || locId == "-1") {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(4)').find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if (Total == undefined || Total == "") {
            $(this).children('td:eq(9)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(9)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

    });

    if (SalesPerson === "undefined" || SalesPerson === "-1") {
        $("#s2id_ddlSalesPerson").find(".select2-choice").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#s2id_ddlSalesPerson").find(".select2-choice").css({ 'border': '1px solid #aaa' });
    }

    if ($("#ddlSalesOutlet").val() == "undefined" || $("#ddlSalesOutlet").val() == "-1") {
        $("#s2id_ddlSalesOutlet").find(".select2-choice").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#s2id_ddlSalesOutlet").find(".select2-choice").css({ 'border': '1px solid #aaa' });
        isresult = true;
    }

    if (ShipVia === "undefined" || ShipVia === "-1") {
        $("#s2id_ddlShipVia").find(".select2-choice").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#s2id_ddlShipVia").find(".select2-choice").css({ 'border': '1px solid #aaa' });
    }

    if (promisDate === "undefined" || promisDate === "") {
        $("#txtIDueDate").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#txtIDueDate").css({ 'border': '1px solid #aaa' });
    }

    if (tax === "undefined" || tax === "-1") {
        $("#" + "s2id_" + "ddlTax").css({ 'border': '1px solid red' });
        // $("#ddlTax").find(".select2-select-00").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#" + "s2id_" + "ddlTax").css({ 'border': '1px solid #aaa' });
        isresult = true;
    }

    if (($("#ddlSalesOutlet").val() == "1" || $("#ddlSalesOutlet").val() == "2") || $("#ddlSalesOutlet").val() == "3"
        || $("#ddlSalesOutlet").val() == "10" && ($("#ddlSalesType").val() != "Quotes")) {
        if (sts != 'Update') {
            if (userManagerPer.length > 0) {
                let userPercent = userManagerPer[0].UserDeposit;
                let tAmount = $("#txtNetPay").val();
                let paidAmt = $("#txtPaidToday").val() == "" ? 0 : $("#txtPaidToday").val();
                let minAmount = (parseFloat(tAmount) * parseFloat(userPercent)) / 100;
                if (parseFloat(minAmount) > parseFloat(paidAmt)) {
                    $.pnotify({ text: "Paid Today Minimum $ " + minAmount, type: 'info' });
                    $("#txtPaidToday").focus();
                    return isresult = false;

                } else { isresult = true; }
            }
        }
    }

    let remainT = $("#txtRemaining").val();
    let tRemain = parseInt(remainT);
    if ($("#txtTerms").val() == "Prepaid" && tRemain != 0 && $("#txtPrepaidDueDate").val() == "") {
        $("#txtPrepaidDueDate").css({ 'border': '1px solid red' });
        return isresult = false;
    } else { $("#txtPrepaidDueDate").css({ 'border': '1px solid #aaa' }); isresult = true; }

    if (isresult)
        return isresult = true;
    else {
        return isresult = false;
    }
    return isresult;
}
function ValidateNewCustomer() {
    var isresult = true;

    var Name = $("#txtName").val();
    var Phone2 = $("#txtTel").val();
    var BillTo = $("#txtBillTo").val();
    var ShipTo = $("#txtShipTo").val();

    var City = $("#txtCity").val();
    var State = $("#txtState").val();
    if (Name === "undefined" || Name === "") {
        $("#txtName").css({ 'border': '1px solid red' });
        isresult = false;
    }
    else {
        $("#txtName").css({ 'border': '1px solid red' });
    }

    if (BillTo === "undefined" || BillTo === "") {
        $("#txtBillTo").css({ 'border': '1px solid red' });
        isresult = false;
    }
    else {
        $("#txtBillTo").css({ 'border': '1px solid red' });
    }

    if (ShipTo === "undefined" || ShipTo === "") {
        $("#txtShipTo").css({ 'border': '1px solid red' });
        isresult = false;
    }
    else {
        $("#txtShipTo").css({ 'border': '1px solid red' });
    }

    if (Phone2 === "undefined" || Phone2 === "") {
        $("#txtTel").css({ 'border': '1px solid red' });
        isresult = false;
    }
    else {
        $("#txtTel").css({ 'border': '1px solid red' });
    }
    if (City === "undefined" || City === "") {
        $("#txtCity").css({ 'border': '1px solid red' });
        isresult = false;
    }
    else {
        $("#txtCity").css({ 'border': '1px solid red' });
    }
    if (State === "undefined" || State === "") {
        $("#txtState").css({ 'border': '1px solid red' });
        isresult = false;
    }
    else {
        $("#txtState").css({ 'border': '1px solid red' });
    }


    if (isresult)
        isresult = true;
    else {
        isresult = false;
    }
    return isresult;
}

function GetSaveObject(parameters) {
    var isNewAddress, Address = "";
    var obj = {
        "SalesType": $("#ddlSalesType").val(),
        "PaymentTearmsId": $("#hdPaymentTerms").val(),
        "CustomerName": $("#txtCustomerNameSale").val(),
        "CustomerId": $("#hdCustomerName").val(),
        "isTaxInclusive": $("#chkIsActive").is(":checked") == true ? true : false,
        "SalesId": $("#hfSalesId").val(),
        "InvoiceNo": $("#txtInvoiceSl").val(),
        "InvoiceDate": $("#txtInvoiceDate").val(),
        "SalesPersonId": $("#ddlSalesPerson").val(),
        "Comments": $("#txtComments").val(),
        "ShipVia": $("#ddlShipVia").val(),
        "DueDate": $("#txtIDueDate").val(),
        "SubTotal": $("#txtTotal").val(),
        "Freight": $("#txtFright").val(),
        "Tax": $("#txtTax").val(),
        "ManagerDiscount": $("#txtManagerDiscount").val() == "" ? 0 : $("#txtManagerDiscount").val(),
        "TotalAmount": $("#txtNetPay").val(),
        "TaxType": $("#ddlTax").val(),
        "JournalMemo": $("#txtJournalMemo").val(),
        "ReferralSource": $("#ddlReferralSource").val() == "-1" ? "" : $("#ddlReferralSource").val(),
        "DeliveryStatus": $("#ddlDeliveryStatus").val(),
        "PaidToday": $("#txtPaidToday").val(),
        "PaymentMethod": $("#ddlPaymentMethodSale").val(),
        "Due": $("#txtRemaining").val(),
        "PaymentTermsText": $("#txtTerms").val(),
        "ReferenceNo": $("#txtReferenceNo").val(),
        "Name": $("#txtRecvName").val(),
        "Address": $("#txtRecvAddress").val(),
        "City": $("#txtRecvSuburb").val(),
        "PostalCode": $("#txtPostalCode").val(),
        "State": $("#txtState").val(),
        "MobileNo": $("#txtRecvMobileNo").val(),
        "SaleOutletId": $("#ddlSalesOutlet").val(),
        "PrepaidDueDate": $("#txtPrepaidDueDate").val()
    }
    return obj;
}

function getChildData() {
    let obj = [];
    $("#tbl tr:gt(0)").each(function () {

        let aobj = {
            "IHeadId": $(this).children('td:eq(1)').find('input[type="hidden"]').val(),
            "SaleDetsId": $(this).children('td:eq(3)').find('input[type="hidden"]').val(),
            "LocId": $(this).children('td:eq(4)').find("select").val() == "" ? 0 : parseInt($(this).children('td:eq(4)').find("select").val()),
            "StockQty": $(this).children('td:eq(5)').find("input").val() == "" ? 0 : parseInt($(this).children('td:eq(5)').find("input").val()),
            "SaleQty": $(this).children('td:eq(6)').find("input").val() == "" ? 0 : parseInt($(this).children('td:eq(6)').find("input").val()),
            "SalePrice": $(this).children('td:eq(7)').find("input").val() == "" ? 0 : $(this).children('td:eq(7)').find("input").val(),
            "discount": $(this).children('td:eq(8)').find("input").val() == "" ? 0 : $(this).children('td:eq(8)').find("input").val(),
            "discountPrice": $(this).children('td:eq(9)').find("input").val() == "" ? 0 : $(this).children('td:eq(9)').find("input").val(),
            "ItemDescription": $(this).children('td:eq(3)').find("input").val() == "" ? 0 : $(this).children('td:eq(3)').find("input").val(),
            "PreSale": $(this).children('td:eq(6)').find('input[type="hidden"]').val(),
            "Itemtype": $(this).children('td:eq(7)').find('input[type="hidden"]').val()
        }
        obj.push(aobj);
    });
    return obj;
}
///// End Table ////
///// Click Event////
$("#btnClose").on('click', function (parameters) {
    $("#txtName").val("");
    $("#txtBillTo").val("");
    $("#txtShipTo").val("");
    $("#txtTel").val("");
    $("#txtCity").val("");
    $("#txtState").val("");

    $("#anim-modal .close").click();
    // $('#anim-modal').removeClass('in');
    // $('#anim-modal').modal().hide();
    // $('#anim-modal').modal('toggle');
    //$(this).dialog('destroy').remove();
});
$(".rdoship").change(function (parameters) {

    var curId = $(this).attr('id');
    if (curId == 'NewAddress') {
        $("#NewAddressEntry").show();
        $("#ddlAddressOfCustomer").hide();
    } else {
        $("#NewAddressEntry").hide();
        var curCustomerId = $("#hdCustomerName").val();
        if (curCustomerId != "") {
            getCustomerAddress(curCustomerId);
        } else {
            $("#NewAddress").prop('checked', true);
            $("#NewAddressEntry").hide();
            $("#NewAddressEntry").show();
            $.pnotify({ text: 'Please select Customer Name First', type: 'error' });
        }

    }
});


$('#btnSaveSale').on('click', function () {

    if ((ValidateCustomerForSave() == true) && (validationADD() == true)) {

        if ($("#btnSaveSale").val() == "Update") {
            $.msgbox("Are you sure that you want to Update Invoice ?", {
                type: "confirm",
                buttons: [
                    { type: "submit", value: "Yes" },
                    { type: "submit", value: "No" }
                ]
            }, function (result) {
                if (result == "Yes") {
                    saveUpdate();
                }
                else if (result == "No") {
                    $.pnotify({ text: "Cancel Operation", type: 'info' });
                }
            }
          );
        } else { saveUpdate(); }

    }

});

function saveUpdate() {

    var obj = GetSaveObject();
    var lstOfChildData = getChildData();
    var urlpath = base + CurrentController + "/Save";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj, "lstOfChildData": lstOfChildData }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                if (result.lstsalesReturnObj.length > 0) {
                    $.pnotify({ text: 'Save Success', type: 'info' });
                    clearAllField();
                    $("#txtTerms").val("Prepaid");
                    $('#btnSaveSale').val('Save');
                    //   $('#txtInvoiceSl').val(result.lstsalesReturnObj[0].InvoiceNo);
                    let Invoice = result.lstsalesReturnObj[0].InvoiceNo;
                    let saleOutletId = result.lstsalesReturnObj[0].SaleOutletId;
                    if (saleOutletId == 1 || saleOutletId == 2 || saleOutletId == 10) {
                        setTimeout(function () {
                            var url = base + "SalesReports/SaleInvoiceStore?Invoice=" + Invoice;
                            window.open(url, '_blank');
                        }, 2000);
                    }
                    else {
                        setTimeout(function () {
                            var url = base + "SalesReports/Index?Invoice=" + Invoice + "&Term=" + term;
                            window.open(url, '_blank');
                        }, 2000);
                    }

                }
            }
        }
    });
}

$('#btnRefreshSale').on('click', function () {
    var url = base + "Sales/Sales";
    window.location.href = url;
});
$('#btnCancelSale').on('click', function () {
    window.history.back();
});
function clearAllField() {
    // LoadInvoice();
     $("#tridInvoice").hide();
    $("#txtInvoiceSl").prop("readonly", false);
    $("#ddlSalesType").prop("disabled", false);
    $("#btnSaveSale").text("Save");
    $("#ddlSalesType").val('1').trigger('change');
    $("#txtCustomerNameSale").val("");
    $("#hdCustomerName").val("0");
    $("#hfSalesId").val("0");
    $("#hfCustomerMail").val("");
    $("#chkIsActive").prop("checked", true);
    $("#NewAddressEntry").val("");
    // var newinv="SL-"+ (parseInt(($("#txtInvoiceSl").val().split('-'))[1])+1).toString();
    //$("#txtInvoiceSl").val(newinv);
    $("#txtInvoiceDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    $("#ddlSalesPerson").val("-1").trigger('change');
    $("#txtComments").val("");
    $("#ddlShipVia").val("-1").trigger('change');
    $("#txtIDueDate").val("");
    $("#txtTotal").val("0.00");
    $("#txtFright").val("");
    $("#txtManagerDiscount").val("");
    $("#txtTax").val("0.00");
    $("#txtNetPay").val("0.00"); $("#hfNetPay").val("");
    $("#txtTerms").val("Prepaid");
    $("#txtJournalMemo").val("");
    $("#ddlReferralSource").val("-1").trigger('change');
    $("#txtInvoiceSl").val("");
    $("#ddlDeliveryStatus").val("4").trigger('change');
    $("#txtPaidToday").val("");
    $("#ddlPaymentMethodSale").val("2").trigger('change');

    $("#txtRemaining").val("0.00");
    $("#lblPaidToday").text("Paid Today");
    $("#txtPaidToday").prop("disabled", false);
    $("#txtReferenceNo").val("");
    $("#addCust").prop("disabled", false);

    $("#txtRecvName").val('');
    $("#txtRecvAddress").val('');
    $("#txtRecvSuburb").val('');
    $("#txtPostalCode").val('');
    $("#txtState").val('');
    $("#txtRecvMobileNo").val('');
    $("#ddlSalesOutlet").val('-1').trigger('change');
    $("#txtPrepaidDueDate").val('');
    $('#btnSaveSale').val('Save');
    $("#btnSaveSale").prop("disabled", false);
    document.getElementById('btnPayment').style.display = 'none';
    document.getElementById('btnHistory').style.display = 'none';
    document.getElementById('btnPrint').style.display = 'none';
    document.getElementById('btnMail').style.display = 'none';
    document.getElementById('btnSaleReturn').style.display = 'none';
    comtax = 0;
    fridtax = 0;
    $.uniform.update(
          $('#chkIsActive').attr("checked", true)
    );
    BindItemGrid(0);
    LoadTax();
}

function BindMasterSalesData(obj) {

    //  salePerson = "", saleOutlet = "", shipvia = ""
    $("#txtInvoiceSl").prop("readonly", true);
    let tx = obj.TaxType;
    $("#addCust").prop("disabled", false);
    $.uniform.update(
          $('#chkIsActive').attr("checked", obj.isTaxInclusive)
      );
    $("#ddlSalesType").val(obj.SalesType).trigger('change');
    if (obj.SalesType == 'Invoice') {
        $("#ddlSalesType").prop("disabled", true);
    } else { $("#ddlSalesType").prop("disabled", false); }
    $("#txtCustomerNameSale").val(obj.Name);
    $("#hdCustomerName").val(obj.CustomerId);
    $("#hfCustomerMail").val(obj.CustomerMail);
    $("#hfSalesId").val(obj.SalesId);

    $("#txtTerms").val(obj.PaymentTermsText);
    term = obj.PaymentTermsText;
    $("#hdPaymentTerms").val(obj.PaymentTearmsId);
    $("#txtInvoiceSl").val(obj.InvoiceNo);
    $("#txtInvoiceDate").val(obj.InvoiceDate);
    payMethod = obj.PaymentMethod;
    salePerson = obj.SalesPersonId;
    shipvia = obj.ShipVia;
    saleOutlet = obj.SaleOutletId;
    $("#ddlTax").val(tx).trigger('change');
    $("#txtComments").val(obj.Comments);
    $("#txtIDueDate").val(obj.PromisedDate);
    $("#txtTotal").val(obj.SubTotal);
    $("#txtFright").val(obj.FreightCharge);
    $("#txtTax").val(obj.tax);
    $("#txtManagerDiscount").val(obj.ManagerDiscount);
    $("#txtNetPay").val(obj.TotalAmount);
    $("#hfNetPay").val(obj.TotalAmount);

    $("#txtJournalMemo").val(obj.JournalMemo);
    if (obj.ReferralSource !== "") {
        $("#ddlReferralSource").val(obj.ReferralSource).trigger('change');
    }
    $("#ddlDeliveryStatus").val(obj.InvoiceDeliveryStatus).trigger('change');
    $("#txtPaidToday").val(obj.AppliedToDate);

    $("#txtRemaining").val(obj.BalanceDue);
    $("#lblPaidToday").text("Applied To Date");

    $("#btnSaveSale").val("Update");
    //if ((userName == "Admin") || (userName == "alan") || (userName == "Honey")
    //    || (userName == "lulu") || (userName == "evan")) {

    if (obj.DispatchStatus == "" && obj.ReturnStatus == "") {
        $("#btnSaveSale").prop("disabled", false);
    } else {
        $("#btnSaveSale").prop("disabled", true);
        fullDispatch = 'full';
    }

    //} else {
    //    $("#btnSaveSale").prop("disabled", true);
    //}
    $("#addCust").prop("disabled", true);
    $("#txtReferenceNo").val(obj.ReferenceNo);
    $("#txtRecvName").val(obj.ReceiverName);
    $("#txtRecvAddress").val(obj.Address);
    $("#txtRecvSuburb").val(obj.City);
    $("#txtPostalCode").val(obj.PostalCode);
    $("#txtState").val(obj.State);
    $("#txtRecvMobileNo").val(obj.MobileNo);
    $("#txtPrepaidDueDate").val(obj.PrepaidDueDate);

    LoadSalesPersonForEdit();
    loadSaleOutlet();
    LoadShippingMethod();

    if (obj.SalesType == "Quotes") {
        var today = new Date();
        var entryDate = new Date(obj.InvoiceDate);
        var diffDays = entryDate.getDate() - today.getDate();
        if (diffDays > 15 && diffDays < 0) {
            $("#btnSaveSale").prop("disabled", true);
            $("#btnPayment").prop("disabled", true);
            $("#btnMail").prop("disabled", true);
            $("#btnSaleReturn").prop("disabled", true);
            $("#divQuote").show();
        } else {
            $("#btnSaveSale").prop("disabled", false);
            $("#btnPayment").prop("disabled", false);
            $("#btnMail").prop("disabled", false);
            $("#btnSaleReturn").prop("disabled", false);
            $("#divQuote").hide();
        }
    }
    $("#ddlOrderStatus").prop("disabled", true);

    // For Edit Permission //

    if (editFieldLst.length > 0) {
        if (editFieldLst[0].UserName != "") {
            $("#ddlSalesType").prop("disabled", false);
        } else { $("#ddlSalesType").prop("disabled", true); }
        if (editFieldLst[1].UserName != "") {
            $("#txtCustomerNameSale").prop("readonly", false);
        } else { $("#txtCustomerNameSale").prop("readonly", true); }
        if (editFieldLst[2].UserName != "") {
            $("#txtRecvName").prop("readonly", false);
        } else { $("#txtRecvName").prop("readonly", true); }
        if (editFieldLst[3].UserName != "") {
            $("#txtRecvAddress").prop("readonly", false);
        } else { $("#txtRecvAddress").prop("readonly", true); }
        if (editFieldLst[4].UserName != "") {
            $("#txtRecvSuburb").prop("readonly", false);
        } else { $("#txtRecvSuburb").prop("readonly", true); }
        if (editFieldLst[5].UserName != "") {
            $("#txtPostalCode").prop("readonly", false);
        } else { $("#txtPostalCode").prop("readonly", true); }
        if (editFieldLst[6].UserName != "") {
            $("#txtState").prop("readonly", false);
        } else { $("#txtState").prop("readonly", true); }
        if (editFieldLst[7].UserName != "") {
            $("#txtRecvMobileNo").prop("readonly", false);
        } else { $("#txtRecvMobileNo").prop("readonly", true); }
        //if (editFieldLst[8].UserName != "") {
        //    $("#txtInvoiceDate").prop("readonly", false);
        //} else { $("#txtInvoiceDate").prop("readonly", true); }
        if (editFieldLst[9].UserName != "") {
            $("#txtReferenceNo").prop("readonly", false);
        } else { $("#txtReferenceNo").prop("readonly", true); }
        if (editFieldLst[17].UserName != "") {
            $("#ddlSalesPerson").prop("disabled", false);
        } else { $("#ddlSalesPerson").prop("disabled", true); }
        if (editFieldLst[18].UserName != "") {
            $("#ddlSalesOutlet").prop("disabled", false);
        } else { $("#ddlSalesOutlet").prop("disabled", true); }
        if (editFieldLst[19].UserName != "") {
            $("#txtComments").prop("readonly", false);
        } else { $("#txtComments").prop("readonly", true); }
        if (editFieldLst[20].UserName != "") {
            $("#ddlShipVia").prop("disabled", false);
        } else { $("#ddlShipVia").prop("disabled", true); }
        if (editFieldLst[21].UserName != "") {
            $('#txtIDueDate').attr('readonly', false).datepicker();
        } else { $('#txtIDueDate').attr('readonly', true).datepicker("destroy"); }
        if (editFieldLst[22].UserName != "") {
            $("#txtFright").prop("readonly", false);
        } else { $("#txtFright").prop("readonly", true); }
        if (editFieldLst[23].UserName != "") {
            $("#Tax").prop("readonly", false);
        } else { $("#Tax").prop("readonly", true); }
        if (editFieldLst[24].UserName != "") {
            $("#txtPaidToday").prop("readonly", true);
        } else { $("#txtPaidToday").prop("readonly", true); }
        if (editFieldLst[25].UserName != "") {
            $("#ddlPaymentMethodSale").prop("disabled", false);
        } else { $("#ddlPaymentMethodSale").prop("disabled", true); }
        if (editFieldLst[26].UserName != "") {
            $('#txtPrepaidDueDate').attr('readonly', false).datepicker();
        } else { $('#txtPrepaidDueDate').attr('readonly', true).datepicker("destroy"); }
        if (editFieldLst[27].UserName != "") {
            $("#txtManagerDiscount").prop("readonly", false);
        } else { $("#txtManagerDiscount").prop("readonly", true); }

    }
    LoadPaymentMethod();
}

function BindGridSalesData(childData) {
    $("#idtbody").empty();
    let bcount = 0, parcount = 0;
    let chdlength = childData.length;
    // bookStatus = '', parDispatch = '', fullDispatch = ''
    let ICodeSts = '', IDesSts = '', ShipSts = '', PriceSts = '', DiscSts = '', TotalSts = '';
    if (editFieldLst[10].UserName != "") {
        ICodeSts = '';
    } else { ICodeSts = 'readonly'; }
    if (editFieldLst[11].UserName != "") {
        IDesSts = '';
    } else { IDesSts = 'readonly'; }
    if (editFieldLst[13].UserName != "") {
        ShipSts = '';
    } else { ShipSts = 'readonly'; }
    if (editFieldLst[14].UserName != "") {
        PriceSts = '';
    } else { PriceSts = 'readonly'; }
    if (editFieldLst[15].UserName != "") {
        DiscSts = '';
    } else { DiscSts = 'readonly'; }
    if (editFieldLst[16].UserName != "") {
        TotalSts = '';
    } else { TotalSts = 'readonly'; }

    count++;
    let content = '';
    $.each(childData, function (ind, obj) {
       
        // for order status //
        if (obj.AwBookingStatus != "") {
            bcount = bcount + 1;
        }
        if (obj.DispatchStatus != "") {
            parcount = parcount + 1;
        }
        let stle = '';
        if (obj.Itemtype == "combo") {
            stle = '';
        } else { stle = 'display:none;'; }

        let status = "";
        var total = obj.SalesQty * obj.SalesPrice;
        var discountAmount = total - (total * (obj.Discount / 100));
        if (obj.DespatchDate != "") {
            status = 'readonly';
            ICodeSts = '', IDesSts = '', ShipSts = '', PriceSts = '', DiscSts = '', TotalSts = '';
        } else { status = ""; }

        var bbs = obj.ItemDescription.toString().replace(/"|" /g, '&quot;');
        content = '<tr>' +
      '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
          '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
      '</td>' +
      '<td><input type="text" id="ddlHead' + ind + '" value="' + obj.ItemCode + '" class="span12 ddlHead" ' + status + ' ' + ICodeSts + ' /><input type="hidden" value=' + obj.ItemHeadId + ' id="hdddlHead"/></td>' +
      '<td id="txtCombo' + ind + '"><p style="font-weight: 900;' + stle + '" id="p' + ind + '"><a style="color: red;font-style: italic;" href="#" class="clickcombo">Combo</a></p></td>' +
      '<td><input type="text" value="' + bbs + '" id="txtHeadDesc' + ind + '" class="span12 txtHeadDesc" ' + status + ' ' + IDesSts + ' /><input type="hidden" id="hfSaleDetId' + ind + '" value="' + obj.SaleDetsId + '"/></td>' +
      '<td><select id="ddlLocation' + ind + '" class="span12 ddlLocation"></select></td>' +
      '<td><input type="text" id="txtStock' + ind + '" value=' + obj.CurrentStockQty + ' class="span12 txtStock" readonly/><input type="hidden" id="hfSpecialPrice' + ind + '" value="' + obj.DueAmount + '"/></td>' +
      '<td><input type="number" id="txtSaleQty' + ind + '" value=' + obj.SalesQty + ' class="span12 txtSaleQty" ' + status + ' ' + ShipSts + ' /><input type="hidden" id="hfPreSale' + ind + '" value=""/></td>' +
      '<td><input type="number" id="txtUnitPrice' + ind + '" value=' + obj.SalesPrice + ' class="span12 txtUnitPrice ForTotalPrice" ' + status + ' ' + PriceSts + ' /><input type="hidden" id="hfItemType' + ind + '" value="' + obj.Itemtype + '"/></td>' +
      '<td><input type="number" id="txtDis' + ind + '" value=' + obj.Discount + ' class="span12 txtDis ForTotalPrice"  ' + status + ' ' + DiscSts + ' /></td>' +
      '<td><input type="number" id="txtTotalPrice' + ind + '" value=' + obj.discountPrice + ' class="span12 txtTotalPrice" ' + status + ' ' + TotalSts + ' /></td>' +
       '</tr>';

        $('#tbl tbody').append(content);
        LoadLocationByheadIdEdit(obj.ItemHeadId, obj.LocationId, ind, obj.Itemtype);
        $("#ddlLocation" + ind).select2();
    });
    // for Order Status
    if (fullDispatch != '') {
        $("#ddlOrderStatus").val('3').trigger('change');
    } else {
        if ((shipvia == '4' || shipvia == '6' || shipvia == '8' || shipvia == '1002')
            && bcount == 0 && parcount != chdlength) {
            $("#ddlOrderStatus").val('4').trigger('change');
        }
        if ((shipvia != '4' && shipvia != '6' && shipvia != '8' && shipvia != '1002')
             && bcount == 0) {
            $("#ddlOrderStatus").val('1').trigger('change');
        }
        if (bcount > 0 && parcount > 0) {
            $("#ddlOrderStatus").val('6').trigger('change');
        }
        if (bcount == chdlength && parcount == 0) {
            $("#ddlOrderStatus").val('2').trigger('change');
        }
        if (bcount < chdlength && parcount == 0) {
            $("#ddlOrderStatus").val('5').trigger('change');
        }
        if (parcount > 0) {
            $("#ddlOrderStatus").val('6').trigger('change');
        }
    }
    // for Ship Via
    if (bcount > 0 || parcount > 0) {
        $("#ddlShipVia").prop("disabled", true);
    } else { $("#ddlShipVia").prop("disabled", false); }

}

function goToEdit(inv, trRow, tableId) {

    clearAllField();
    $("#btnSaveSale").text("Update");
    $("#addCust").prop("disabled", true);
    var url = base + CurrentController + "/Sales?invNo=" + inv;
    // var trRow = $(this);
    $("#" + tableId + " tr").css({ "background-color": "white" });
    $(trRow).css({ "background-color": "#cdcdcd" });
    $(trRow).css({ "color": "white" });

    $("#myModalForRegistraton").css("display", "none");

    loadAllSaleData(inv);
    // location.href = url; //"@Url.Action('Sales', 'Sales', new {invNo= '125345' })"; //.replace("123456",s.toString());
}
//btnClose btnNewInvoice
$(document).on('click', '#btnCloseRegis', function (parameters) {
    $("#myModalForRegistraton").css("display", "none");
});
$(document).on('click', '.newSale', function (parameters) {
    clearAllField();
    $("#myModalForRegistraton").css("display", "none");
});
$(document).on('click', '#btnReceivePayment', function (parameters) {
    var invno = $(this).attr('data_InvoiceId');
    clearAllField();
    var url = base + ReceivePayment + "/Sales?invNo=" + invno;
    $("#myModalForRegistraton").css("display", "none");
    window.open(url);
});
$(document).on('click', '.btnRedirect', function (parameters) {

    clearAllField();
    $("#btnSaveSale").text("Update");
    $("#addCust").prop("disabled", true);
    var invno = $(this).attr('data_InvoiceId');
    var trRow = $(this).closest('tr');
    //var url = base + CurrentController + "/Sales?invNo=" + invno;
    // var trRow = $(this);
    //$("#" + tableId + " tr").css({ "background-color": "white" });
    //$(trRow).css({ "background-color": "#cdcdcd" });
    //$(trRow).css({ "color": "white" });
    //location.href = url; //"@Url.Action('Sales', 'Sales', new {invNo= '125345' })"; //.replace("123456",s.toString());
    // window.open(url,'_blank' // <- This is what makes it open in a new window.
    //);

    $("#myModalForRegistraton").css("display", "none");
    loadAllSaleData(invno);
    // window.open(url // <- This is what makes it open in a new window.
    //);
});

function loadAllSaleData(inv) {

    var urlpath = base + CurrentController + "/GetAllSale";
    var obj = {
        SearchText: inv
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
            if (result != null) {
                document.getElementById('btnPayment').style.display = '';
                document.getElementById('btnHistory').style.display = '';
                document.getElementById('btnPrint').style.display = '';
                document.getElementById('btnMail').style.display = '';
                document.getElementById('btnSaleReturn').style.display = '';
                editFieldLst = [];
                editFieldLst = result.SaleEditPermissionLst;
                BindMasterSalesData(result.SalesDaoMasterEdit);
                BindGridSalesData(result.SalesDaoChildEdit);


            }

        }

    });
}

// Added Sayed
function LoadReferralSource() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/GetLoadReferralSource",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {

            LoadDropdown(result, $('#ddlReferralSource'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
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

function LoadInvoice() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadInvoice",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            $("#txtInvoiceSl").val(result);
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

$(document).off('click', '#btnPayment').on('click', '#btnPayment', function () {

    var customerId = $("#hdCustomerName").val();
    if (customerId != '') {
        var baseUrl = base + 'ReceivePayments/ReceivePayments?customerId=' + customerId;
        window.location.href = baseUrl;
    }
});

$(document).off('click', '#btnHistory').on('click', '#btnHistory', function () {

    let Invoice = $("#txtInvoiceSl").val();
    PayemntHistory(Invoice);
});

function PayemntHistory(Invoice) {
    var urlpath = base + CurrentController + "/InvoiceWisePaymentHistory";
    let obj = {
        "InvoiceNo": Invoice
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

                var data = result.SalesPaymentHisList;
                var invlength = data.length;
                var len = 0;
                var content =
                    '<div style="font-family:Verdana"> <br/>';
                content +=
                    '<table id ="tabeledata" class="tabeledata separate" style="width:100%;max-height:300px; overflow:auto; font-size:12px; line-height:normal;">' +
                    '<tr><th>Invoice</th><th>Date</th> <th>Memo</th> <th>Charges</th> <th>Payments</th> <th>Item Description</th> <th>Refund</th> <th>Notes</th><tr>';
                if (data != null) {
                    $.each(data,
                        function (i, obj) {

                            content += '<tr>' +
                            '<td style="line-height: auto;">' + obj.InvoiceNo + '</td>' +
                                '<td style="line-height: auto;">' + obj.PaymentDate + '</td>' +
                                '<td style="line-height: auto;">' + obj.PayMemo + '</td>' +
                                '<td style="line-height: auto;">' + obj.SalesPrice + '</td>' +
                                '<td style="line-height: auto;">' + obj.Discount + '</td>' +
                                '<td style="line-height: auto;">' + obj.ItemDescription + '</td>' +
                                '<td style="line-height: auto;">' + obj.RefundAmount + '</td>' +
                                '<td style="line-height: auto;">' + obj.Comments + '</td>' +
                            '</tr>';

                        });

                }
                content += '</table>  <br/> <div style="margin-top:5px;font-size:12px; color:red;text-align: center;"> Balance Due : ' + result.SalesPaymentHisList[0].DueAmount + ' </div>';

                $(content).dialog({
                    resizable: true,
                    modal: true,
                    title: ' Transaction History ',
                    height: 420,
                    width: 1000,
                    buttons: {
                        "OK": function () {
                            $(this).dialog('destroy').remove();
                        }
                    }
                });
            }
        }
    });

}

$(document).off('click', '#btnPrint').on('click', '#btnPrint', function () {

    let saleOutletId = $("#ddlSalesOutlet").val();
    if (saleOutletId == "1" || saleOutletId == "2" || saleOutletId == "10") {
        let url = base + "SalesReports/SaleInvoiceStore?Invoice=" + $("#txtInvoiceSl").val();
        window.open(url, '_blank');
    }
    else {
        if (saleOutletId == "12") {
            let url = base + "SalesReports/SaleFBInvoice?Invoice=" + $("#txtInvoiceSl").val();
            window.open(url, '_blank');
        } else {
            let url = base + "SalesReports/Index?Invoice=" + $("#txtInvoiceSl").val() + "&Term=" + $("#txtTerms").val();
            window.open(url, '_blank');
        }
    }
});

$(document).off('click', '#btnMail').on('click', '#btnMail', function () {
    // Local = SL-1810281001
    email = $("#hfCustomerMail").val();
    //"rahat@melbourniansfurniture.com.au";  ////rahat@melbourniansfurniture.com.au   //sayed108cse@gmail.com
    let saleoutletId = $("#ddlSalesOutlet").val();
    if (email != "") {
        // let invoice = "SL-1810281001";// Server ="SL-1811011001";SendMail
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: base + "SalesReports/SendMailFromDB",
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "saleInvoice": $("#txtInvoiceSl").val(), "term": $("#txtTerms").val(), "email": email.trim(), "outletId": saleoutletId }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: 'Session Out Please login again', type: 'info' });
                    return false;
                }
                if (result.Error != null) {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: result, type: 'info' });
                }
            },
            error: function (a, b, c) {
                $.pnotify({ text: 'Something Wrong', type: 'error' });
            }
        });
    } else { $.pnotify({ text: 'Customer E-mail Do Not Found !.', type: 'error' }); }
});

$(document).off('click', '#btnSaleReturn').on('click', '#btnSaleReturn', function () {
    let Retinvno = $("#txtInvoiceSl").val();
    var url = base + "SalesReturn/SalesReturn?invNo=" + Retinvno;
    //var url = base + "Sales/Sales?invNo=" + invno;
    //window.open(url, '_blank');
    location.href = url; //"@Url.Action('Sales', 'Sales', new {invNo= '125345' })"; //.replace("123456",s.toString());

});

function loadInisialColumnHeadId(tblRow) {
    let coloumLLst = [];
    let colors = [];
    let value = $(tblRow).val();
    var urlpath = base + CurrentController + "/GetInialAutoComplete";
    let myRes = [];
    var aObj = {
        "SearchText": value,
        "CustomerId": $("#hdCustomerName").val() == "" ? 0 : $("#hdCustomerName").val(),
        "Name": $("#txtTerms").val()
    };
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
                return false;
            } else {

                myRes = result.ListAutoCpomplete;
                coloumLLst = [{ name: 'Code', minWidth: '100px' }, { name: 'Qty', minWidth: '60px' }];
                colors = [];
                $.each(result.ListAutoCpomplete, function (i, obj) {
                    var color = [];
                    color.push(obj.value, obj.text);
                    colors.push(color);
                });
                $(tblRow).mcautocomplete({
                    showHeader: true,
                    columns: coloumLLst,
                    source: colors,
                    select: function (event, ui) {
                        var headCode = (ui.item ? ui.item[0] : '');
                        this.value = headCode;
                        var imlst = $.grep(myRes,
                          function (x) {
                              if (x.value == headCode) {
                                  return x;
                              }
                          });
                        return false;
                    },
                });

            }
        },
        error: function (errRes) {
            $.pnotify({ text: formatErrorMessage(errRes), type: 'error' });
        }
    });
}

$(document).off('change', '#ddlSalesType').on('change', '#ddlSalesType', function () {
    if ($("#ddlSalesType").val() == "Quotes") {
        $("#txtPaidToday").val('');
        $("#txtPaidToday").prop("disabled", true);
    } else { $("#txtPaidToday").prop("disabled", false); }
    //calculatePayment();
});

function AutoCompleteState() {
    var select = false;
    $("#txtState").autocomplete({
        source: stateLst,
        autoFocus: true,
        selectFirst: true,
        open: function (event, ui)
        { if (select) select = false; },
        select: function (event, ui) {
            $('#txtState').val(ui.item.label);
            select = true;
            return false;
        },
        change: function (event, ui) {
            if (!select) {
                $('ul.ui-autocomplete li:first a').trigger('click');
            }
            var data = $.data(this);//Get plugin data for 'this'
            // console.log(data.autocomplete.selectedItem);
        }
    });
}

// for Combo Item List

$(document).off('click', 'a.clickcombo').on('click', 'a.clickcombo', function () {
    
    let tblRow = $(this).closest('tr');
    let headId = $(tblRow).find('#hdddlHead').val();
    let headname = $(tblRow).find('.ddlHead').val();
    ComboSetdata(headId, headname);
});

function ComboSetdata(headId, headname) {
    var urlpath = base + CurrentController + "/GetComboSetDetailsById";
   
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "IHeadId": headId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                var data = result.SalesList;
                var content = 
                    '<div style="font-family:Verdana">';
                   // '<div style="margin-top:5px;font-size:18px;font-weight:bold; color:green;text-align: center;"> Combo Name : ' + headname + '</div> <br/>';
                content +=
                    '<table class="tabelle separate" style="width:100%;max-height:300px; overflow:auto;">' +
                    '<tr><th>Item Code</th><th>Item Description</th> <th>Qty</th> <th>Unit Price</th><tr>';
                if (data != null) {
                    $.each(data,
                        function (i, obj) {
                            content += '<tr>' +
                                '<td>' + obj.FirstName + '</td>' +
                                '<td>' + obj.LastName + '</td>' +
                                '<td>' + obj.ShipVia + '</td>' +
                                '<td>' + obj.discount + '</td>' +
                                '</tr>';
                        });
                }
                content += '</table>';
                $(content).dialog({
                    resizable: true,
                    modal: true,
                    title: 'Set Include(' + headname + ')',
                    height: 300,
                    width: 550,
                    buttons: {
                        "OK": function () {
                            $(this).dialog('destroy').remove();
                        }
                    }
                });
            }
        }
    });

}

