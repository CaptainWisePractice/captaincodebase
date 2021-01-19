//---------- All Global Variable ----------------//
var count = 0, Controller = "SalesReturn", CurrentController = "Sales", CommonController = "Common", addIndex = 22, headList = [], locList = [], TaxList = [], SiteLocation = [], ReceivePayment = "ReceivePayments";
var term = '', comtax = 0, fridtax = 0, ControllerCheckOut = "ItemCheckOut", salePerson = "", saleOutlet = "", shipvia = "", sts = '';
$("span#sidebar-toggle").trigger('click');
//
//----------End of Global variable-------------//

$(document).ready(function () {
    
    $("#dividtype").hide();
    $("#btnRefresh").hide();
    $('.sDate').datepicker({
        dateFormat: 'dd-M-yy'
    });
    BindItemGrid(0);
    $("#txtInvoiceDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    LoadPaymentMethod();
    loadSiteLocation();
    LoadReferralSource();
    if (SalesData.SalesDaoMasterEdit != null) {
        LoadTax();
        sts = '';
        let inv = SalesData.SalesDaoMasterEdit.InvoiceNo;
            loadAllSaleData(inv);
            LoadReturnInvoice(inv);
            document.getElementById('btnHistory').style.display = 'none';
            document.getElementById('btnPrint').style.display = 'none';
            document.getElementById('btnMail').style.display = 'none';
    }
    else {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let invNo = url.searchParams.get("invNo");
        $("#txtNewInvoiceSl").val(invNo);
        LoadTax();
        sts = 'Update';
        //document.getElementById('btnPayment').style.display = 'none';
        document.getElementById('btnHistory').style.display = '';
        document.getElementById('btnPrint').style.display = '';
        document.getElementById('btnMail').style.display = '';
        loadSaleDataInvoiceWise(invNo);
    }
   
});

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

function LoadPaymentMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadPaymentMethod",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {

            setComboWithId(result, '2', $('#ddlPaymentMethodSale'));
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
        success: function (result) {

            myRes = result;
            TaxList = result;
            //amin = [{ name: 'Code', minWidth: '90px' }, { name: 'Qty', minWidth: '60px' }];
            //taxHeader = [{ name: 'Code', minWidth: '50px' }, { name: 'Description', minWidth: '150px' }, { name: 'Rate', minWidth: '50px' }];
            //taxData = [];
            //      $.each(result.ListAutoCpomplete, function (i, obj) {
            //          //var vv = obj.value.toString();
            //          var tax=[];
            //          tax.push(obj.value, obj.Data,obj.text);
            //          taxData.push(tax);
            //      });

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
        minLength: 1,
        select: function (event, ui) {

            $("#hdCustomerName").val(ui.item.id);
            $("#txtCustomerNameSale").val(ui.item.label);
            $("#txtRecvAddress").val(ui.item.Address);
            $("#txtRecvName").val(ui.item.ReceiverName);
            $("#txtJournalMemo").val("Sale; " + ui.item.label);
            $("#ddlDeliveryStatus").val(ui.item.InvoiceDelivery).trigger('change');
            $("#ddlPaymentMethodSale").val(ui.item.PayMethodId).trigger('change');
            $("#txtTerms").val(ui.item.DeliveryStatus);
            term = ui.item.DeliveryStatus;
            $("#hdPaymentTerms").val(ui.item.PayTermId);
            $("#txtRecvSuburb").val(ui.item.City);
            $("#txtPostalCode").val(ui.item.PostalCode);
            $("#txtRecvMobileNo").val(ui.item.MobileNo);

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
    $(id).val('6').trigger('change');
    $(id).select2();



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
       '<td><input type="text" id="ddlHead' + ind + '" class="span12 ddlHead"/><input type="hidden" id="hdddlHead"/></td>' + //' + loadItem(addIndex) + '
      '<td><input type="text" id="txtHeadDesc' + ind + '" class="span12 txtHeadDesc"/></td>' +
       '<td><select id="ddlLocation' + ind + '" class="span12 ddlLocation">' + loadLocation(ind) + '</select></td>' +
      '<td><input type="text" id="txtStock' + ind + '" class="span12 txtStock" readonly/></td>' +
      '<td><input type="text" id="txtSaleQty' + ind + '" class="span12 txtSaleQty" /></td>' +
       '<td><input type="text" id="txtUnitPrice' + ind + '" class="span12 txtUnitPrice ForTotalPrice"  /></td>' +
        '<td><input type="text" id="txtDis' + ind + '" class="span12 txtDis"  /></td>' +
       '<td><input type="text" id="txtTotalPrice' + ind + '" class="span12 txtTotalPrice"/></td>' +
'</tr>';
    $('#tbl tbody').append(content);
    // $('#ddlHead' + ind + "").select2();
    $('#ddlLocation' + ind + "").select2();

}

function loadItem(index) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + ControllerCheckOut + "/loadItemHead",
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

function LoadLocationByheadId(headId, index) {
    var aObj = {
        "IHeadId": headId,
        "SearchText": 'single'
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

function LoadLocationByheadIdEdit(headId, Value, index) {
    var aObj = {
        "IHeadId": headId,
        "SearchText": 'single'
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
function addRow(addIndex) {
    var content = '';
    content += '<tr>' +
               '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
               '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
               '</td>' +
               '<td><input type="text" id="ddlHead' + addIndex + '" class="span12 ddlHead"/><input type="hidden" id="hdddlHead"/></td>' + //' + loadItem(addIndex) + '
               '<td><input type="text" id="txtHeadDesc' + addIndex + '" class="span12 txtHeadDesc"/></td>' +
               '<td><select id="ddlLocation' + addIndex + '" class="span12 ddlLocation">' + loadLocation(addIndex) + '</select></td>' +
               '<td><input type="text" id="txtStock' + addIndex + '" class="span12 txtStock" readonly/></td>' +
    '<td><input type="text" id="txtSaleQty' + addIndex + '" class="span12 txtSaleQty" /></td>' +
     '<td><input type="text" id="txtUnitPrice' + addIndex + '" class="span12 txtUnitPrice ForTotalPrice"  /></td>' +
      '<td><input type="text" id="txtDis' + addIndex + '" class="span12 txtDis"  /></td>' +
     '<td><input type="text" id="txtTotalPrice' + addIndex + '" class="span12 txtTotalPrice"/></td>' +
        '</tr>';
    return content;
}
function loadMultipleColumnHeadId(tblRow) {
    if ($("#hdCustomerName").val() != "0") {
        var amin = [];
        var colors = [];
        var value = $($($(tblRow).children('td:eq(1)').children())[0]).val();
        var urlpath = base + CurrentController + "/GetItemHeadAutoComplete";
        var myRes = [];
        var aObj = {
            "SearchText": value,
            "CustomerId": $("#hdCustomerName").val() == "" ? 0 : $("#hdCustomerName").val()

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
                    colunm = [{ name: 'Code', minWidth: '100px' }, { name: 'Qty', minWidth: '60px' }];
                    colors = [];
                    $.each(result.ListAutoCpomplete, function (i, obj) {
                        //var vv = obj.value.toString();
                        var color = [];
                        color.push(obj.value, obj.text);
                        colors.push(color);
                    });

                    $($($(tblRow).children('td:eq(1)').children())[0]).mcautocomplete({
                        showHeader: true,
                        columns: colunm,
                        source: colors,
                        select: function (event, ui) {

                            var headCode = (ui.item ? ui.item[0] : '');
                            this.value = headCode;

                            // console.log(ui.item[0]);

                            var imlst = $.grep(myRes,
                              function (x) {
                                  if (x.value == headCode) {
                                      return x;
                                  }
                              });

                            

                            $($($(tblRow).children('td:eq(1)')).find('input[type="hidden"]')).val(imlst[0].id);
                            var itmName = $($(tblRow).children('td:eq(2)').find('input')).attr('id');
                            var r = $($(tblRow).children('td:eq(4)').find('input')).attr('id');
                            var unitPrc = $($(tblRow).children('td:eq(6)').find('input')).attr('id');
                            var addNewIndex = 0;
                            $('#' + itmName).val(imlst[0].Data);
                            $('#' + itmName).attr('title', imlst[0].Data);
                            $('#' + unitPrc).val(imlst[0].value1);
                            // imlst = [];

                            $('#' + r).val('');
                            var index = $(tblRow).index();
                            if (index > 0) {
                                addNewIndex = addIndex + index;
                            } else {
                                addNewIndex = index;
                            }

                            locList = [];
                            LoadLocationByheadId(imlst[0].id, addNewIndex);
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
function loadItemHead(tblRow) {

    var value = $($($(tblRow).children('td:eq(1)').children())[0]).val();// $(tblRow).children('td:eq(1)').children().text();
    $($($(tblRow).children('td:eq(1)').children())[0]).autocomplete({
        source: function (request, response) {
            var aObj = {
                "SearchText": value// ReviseReasonBulk

            };

            var urlpath = base + CurrentController + "/GetItemHeadAutoComplete";
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
                        // notify('danger', result.Error);
                        return false;
                    } else {

                        response(result.ListAutoCpomplete);
                        loadItemDDl(result.ListAutoCpomplete, tblRow);


                    }
                },
                error: function (errRes) {
                    // notify('danger', formatErrorMessage(errRes));
                    $.pnotify({ text: formatErrorMessage(errRes), type: 'error' });
                }
            });


        },
        minLength: 2,
        select: function (event, ui) {

            $($($(tblRow).children('td:eq(1)')).find('input[type="hidden"]')).val(ui.item.id);
            // $($($(tblRow).children('td:eq(1)').children())[1]).val(ui.item.id);
            var itmName = $($(tblRow).children('td:eq(2)').find('input')).attr('id');
            var r = $($(tblRow).children('td:eq(4)').find('input')).attr('id');
            var headId = ui.item.id;
            //var imlst = $.grep(headList,
            //  function (x) {
            //      if ('' + x.Value + '' === headId) {
            //          return x;
            //      }
            //  });
            var addNewIndex = 0;
            $('#' + itmName).val(ui.item.Data);
            $('#' + itmName).attr('title', ui.item.Data);
            // imlst = [];

            $('#' + r).val('');
            var index = $(tblRow).index();
            if (index > 0) {
                addNewIndex = addIndex + index;
            } else {
                addNewIndex = index;
            }

            locList = [];
            LoadLocationByheadId(headId, addNewIndex);
        }
    });
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
    if (index !== 0) {
        $(this).closest('tr').remove();
    }
});
$(document).off('click', '.btnAdd').on('click', '.btnAdd', function () {

    if (validationADD() == true) {

        var rowindex = $('#tbl tbody tr').length;
        var addNewIndex = addIndex + rowindex;
        var content = addRow(addNewIndex);
        $("#tbl").append(content);
        //$('#ddlHead' + addIndex + "").select2();
        $('#ddlLocation' + addNewIndex + "").select2();

        //loadItemHead(addIndex);
        //loadLocation(addIndex);

    }

});
$(document).off('change', '.ddlLocation').on('change', '.ddlLocation', function () {
    
    if ($(this).val() !== '-1') {
        var stockqty = $(this).closest("tr")[0].cells[4].childNodes[0].id;
        var qty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var locId = $(this).val();
        if (locList.length > 0) {
            var imlst = $.grep(locList,
              function (x) {
                  if ('' + x.Value + '' === locId) {
                      return x;
                  }
              });
            debugger;
            $('#' + stockqty).val(imlst[0].ValueStr);
            imlst = [];
        } else { $('#' + stockqty).val('0'); }
        if (sts != 'Update') {
            $('#' + qty).val('');
        }
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
    $("#txtNetBill").val(0);
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

        var SaleQty = $($(this).closest("tr")[0].cells[5].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[5].childNodes[0]).val());
        var salePrice = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
        var discount = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[7].childNodes[0]).val());
        if ($("#chkIsActive").is(":checked")) {

            if (SaleQty > 0 && salePrice > 0) {


                // var total = SaleQty * salePrice;
                salePrice = salePrice + parseFloat((salePrice * ((txtval + 0.909) / 100)).toFixed(2));

                // salePrice = salePrice + afterTexAmount;
                var total = SaleQty * salePrice;
                $($(this).closest("tr")[0].cells[6].childNodes[0]).val("");
                $($(this).closest("tr")[0].cells[6].childNodes[0]).val(getdecimalvalue(salePrice));
                var discountAmount = total - (total * (discount / 100));
                $($(this).closest("tr")[0].cells[8].childNodes[0]).val(getdecimalvalue(discountAmount));
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
            $($(this).closest("tr")[0].cells[6].childNodes[0]).val("");
            $($(this).closest("tr")[0].cells[6].childNodes[0]).val(getdecimalvalue(salePrice));

            var total = SaleQty * salePrice;
            var discountAmount = total - (getdecimalvalue(total * (discount / 100)));
            $($(this).closest("tr")[0].cells[8].childNodes[0]).val(getdecimalvalue(discountAmount));
            var newSumText = parseFloat((getdecimalvalue(oldSalePrice) * (txtval / 100)).toFixed(2));
            afterTexAmount += newSumText;


            if (discountAmount > 0) {
                cellTotalValue += parseFloat(discountAmount);
            }
        }


    });

    var NetBill = parseFloat(cellTotalValue);
    var freight = $("#txtFright").val() == "" ? 0 : parseFloat($("#txtFright").val());
    var freightTax = 0;// parseFloat((freight * (txtval / 100)).toFixed(2));
    var Tax = comtax;//(parseFloat(freightTax) + parseFloat(afterTexAmount)).toFixed(2);

    // var NetPayable = NetBill + freight + Tax;

    var NetPayable = 0.00;
    if ($("#chkIsActive").is(":checked")) {
        
        // let a = ((parseFloat(freight) * parseFloat(10.9999)) / 100).toFixed(2);
        // freight = parseFloat(freight + (freight * txtval / 100)).toFixed(2);
        freight = parseFloat(fridtax);

        $("#txtFright").val(getdecimalvalue(freight));
        NetPayable = parseFloat(NetBill) + parseFloat(freight);
    } else {
        //txtTotal
        
        let a = ((parseFloat(freight) * parseFloat(txtval)) / 100).toFixed(2);
        // freight = parseFloat(freight - (freight * txtval / 100)).toFixed(2);
        freight -= parseFloat(a);

        $("#txtFright").val(getdecimalvalue(freight));
        NetPayable = parseFloat(NetBill) + parseFloat(freight) + parseFloat(Tax);


        //txtNetPay
    }
    var paidToday = $("#txtPaidToday").val() == "" ? 0 : parseFloat($("#txtPaidToday").val());
    var payable = NetPayable - paidToday;
    $("#txtTax").val(Tax);
    $("#txtTotal").val(cellTotalValue.toFixed(2));
    $("#txtNetBill").val(getdecimalvalue(NetBill));
    $("#txtNetPay").val(parseFloat(NetPayable).toFixed(2));
    $("#txtRemaining").val(parseFloat(payable).toFixed(2));
});

function getdecimalvalue(val) {
    return parseFloat((Math.floor(100 * val) / 100).toFixed(2));
}
$(document).off('change', '.txtSaleQty').on('change', '.txtSaleQty', function () {
    if ($(this).val() !== '' || $(this).val() !== '0') {
        
        var stockqty = $(this).closest("tr")[0].cells[4].childNodes[0].id;
        var unitPr = $(this).closest("tr")[0].cells[6].childNodes[0].id;
        var vale = $(this)[0].id;
        let b = parseInt($(this).val());
        let aa = parseInt($('#' + stockqty).val());
        if (aa < b) {
            $.msgbox("Are you sure that you want to Sale Qty.. ?", {
                type: "confirm",
                buttons: [
                    { type: "submit", value: "Yes" },
                    { type: "submit", value: "No" }
                ]
            }, function (result) {
                if (result == "Yes") {
                }
                else if (result == "No") {
                    $("#" + vale).val('');
                    // $.pnotify({ text: "Cancel Operation", type: 'info' });
                }
            });
            //$.pnotify({ text: 'Must Less Or Equal to In Hand Qty', type: 'error' });
            //$(this).val('');
        }

        if ($('#' + unitPr).val() !== "") {
            calculatePayment();
        }

    }
});
$(document).on('keyup', '.txtUnitPrice', function (e) {
    if ($(this).val() !== '') {
        var price = $(this).val();
        var SaleQtyId = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        let SaleQty = parseInt($('#' + SaleQtyId).val());
        if (SaleQty > 0) {
            var Total = price * SaleQty;
            $($(this).closest("tr")[0].cells[8].childNodes[0]).val(Total);
            //var TotalPayment = $("#txtTotal").val();
            //var currentValue = 0;
            //if (TotalPayment != "") {
            //    var currentValue = $("#txtTotal").val();
            //}
            //var ResultForTotal = parseInt(currentValue) + parseInt(Total);
            //var NetBill = ResultForTotal + parseInt($("#txtPrevDue").val());

            //$("#txtTotal").val(ResultForTotal);
            //$("#txtNetBill").val(NetBill);
            //
            //$("#txtTotal").val();
        } else {

        }

    }
});

$('body').on("keyup", '.ddlHead', function (e) {

    var tblRow = $(this).closest('tr');
    loadMultipleColumnHeadId(tblRow);
    //loadItemHead(tblRow);
});

$(document).on('keyup', '.txtDis', function (e) {
    if ($(this).val() !== '') {
        //
        //var discountPercentage =parseInt($(this).val());
        //var SaleQty = $($(this).closest("tr")[0].cells[5].childNodes[0]).val();
        //var salePrice = $($(this).closest("tr")[0].cells[6].childNodes[0]).val();

        //if (SaleQty > 0 && salePrice !='') {
        //    var Total = salePrice * SaleQty;
        //    var discountAmount = Total -parseFloat((Total * (discountPercentage / 100)).toFixed(2));
        //    $($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount);


        //}


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
        $("#txtNetBill").val(0);
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
            var SaleQty = $($(this).closest("tr")[0].cells[5].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[5].childNodes[0]).val());
            var salePrice = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
            var discount = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[7].childNodes[0]).val());
            if ($("#chkIsActive").is(":checked")) {

                if (SaleQty > 0 && salePrice > 0) {

                    // txtval = taxPercent - 0.909;
                    // var total = SaleQty * salePrice;
                    // salePrice = salePrice + parseFloat((salePrice * ((txtval) / 100)).toFixed(2));

                    // salePrice = salePrice + afterTexAmount;
                    var total = SaleQty * salePrice;
                    $($(this).closest("tr")[0].cells[6].childNodes[0]).val("");
                    $($(this).closest("tr")[0].cells[6].childNodes[0]).val(getdecimalvalue(salePrice));
                    var discountAmount = total - (total * (discount / 100));
                    $($(this).closest("tr")[0].cells[8].childNodes[0]).val(getdecimalvalue(discountAmount));
                    var SumText = parseFloat((getdecimalvalue(discountAmount) * (txtval / 100)).toFixed(2));
                    afterTexAmount += SumText;


                    if (discountAmount > 0) {
                        cellTotalValue += parseFloat(discountAmount);
                    }
                }
            }
            else {
                // 200 -(200*.0909)

                var oldSalePrice = salePrice;//salePrice;
                // salePrice = parseFloat(salePrice - (salePrice * txtval / 100)).toFixed(2);
                $($(this).closest("tr")[0].cells[6].childNodes[0]).val("");
                $($(this).closest("tr")[0].cells[6].childNodes[0]).val(getdecimalvalue(salePrice));

                var total = SaleQty * salePrice;
                var discountAmount = total - (getdecimalvalue(total * (discount / 100)));
                $($(this).closest("tr")[0].cells[8].childNodes[0]).val(getdecimalvalue(discountAmount));
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
        $("#txtNetBill").val(getdecimalvalue(NetBill));
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

    if ($(this).val() !== '') {
        calculatePayment();
    }

});

function calculatePayment() {

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

    $("#txtNetBill").val(0);
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
        
        var SaleQty = ($($(this).closest("tr")[0].cells[5].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[5].childNodes[0]).val())).toFixed(2);
        var salePrice = ($($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[6].childNodes[0]).val())).toFixed(2);
        var discount = ($($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseFloat($($(this).closest("tr")[0].cells[7].childNodes[0]).val())).toFixed(2);
        if ($("#chkIsActive").is(":checked")) {
            if (SaleQty > 0 && salePrice > 0) {

                var total = SaleQty * salePrice;
                var discountAmount = total - (total * (discount / 100));
                $($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount.toFixed(2));

                var SumText = parseFloat((discountAmount * (txtval / 100)).toFixed(2));
                afterTexAmount += SumText;
                if (discountAmount > 0) {
                    cellTotalValue += (discountAmount);
                }
            }
        } else {

            txtval = taxPercent;
            //var oldSalePrice = $($(this).closest("tr")[0].cells[8].childNodes[0]).val();
            var oldSalePrice = $($(this).closest("tr")[0].cells[6].childNodes[0]).val();
            salePrice = salePrice - parseFloat(((salePrice * txtval / 100).toFixed(2)));
            $($(this).closest("tr")[0].cells[6].childNodes[0]).val("");
            $($(this).closest("tr")[0].cells[6].childNodes[0]).val(parseFloat(oldSalePrice).toFixed(2));

            var total = parseFloat(SaleQty).toFixed(2) * parseFloat(oldSalePrice).toFixed(2);
            var discountAmount = total - (total * (discount / 100));
            $($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount.toFixed(2));
            var newSumText = parseFloat((discountAmount * (txtval / 100)).toFixed(2));
            afterTexAmount += newSumText;
            //salePrice = salePrice - (salePrice * txtval / 100);
            //$($(this).closest("tr")[0].cells[6].childNodes[0]).val(salePrice);
            //afterTexAmount += salePrice * (txtval / 100);
            //var total = SaleQty * salePrice;
            //var discountAmount = total - (total * (discount / 100));
            //$($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount);


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
    $("#txtNetBill").val(NetBill.toFixed(2));
    $("#txtNetPay").val(NetPayable.toFixed(2));
    $("#txtRemaining").val(payable.toFixed(2));
}

$(document).on('keyup', '.calculation', function () {
    calculatePayment();

});
//txtTotalPrice
$(document).on('change', '.txtTotalPrice', function () {

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
    $("#txtNetBill").val(0);
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
    var SaleQty = $($(this).closest("tr")[0].cells[5].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[5].childNodes[0]).val());
    var salePrice = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
    var TotalValue = parseInt($(this).val() == "" ? 0 : $(this).val());
    if ((SaleQty * salePrice) == TotalValue) {

    } else {
        //if (TotalValue > (SaleQty * salePrice)) {
        //   // $.pnotify({ text: 'Total Sale value can not be greater than sale value', type: 'error' });
        //} else {
        //    var pur =  (SaleQty * salePrice) -TotalValue;
        //    var ratio = pur*100/ (SaleQty * salePrice) ;
        //    $($(this).closest("tr")[0].cells[7].childNodes[0]).val(ratio);
        //}
        var pur = (SaleQty * salePrice) - TotalValue;
        var ratio = pur * 100 / (SaleQty * salePrice);
        $($(this).closest("tr")[0].cells[7].childNodes[0]).val(ratio);
    }
    var cellTotalValue = 0;
    $("#txtNetBill").val(0);
    $("#txtTotal").val(0);
    //$("#txtNetBill").val(0);
    $("#txtRemaining").val(0);
    //$("#txtReceive").val(0);
    //$("#txtDue").val(0);
    //txtReceive
    //txtDue

    $('#tbl tbody tr').each(function () {
        var SaleQty = $($(this).closest("tr")[0].cells[5].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[5].childNodes[0]).val());
        var salePrice = $($(this).closest("tr")[0].cells[6].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[6].childNodes[0]).val());
        var discount = $($(this).closest("tr")[0].cells[7].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[7].childNodes[0]).val());

        if ($("#chkIsActive").is(":checked")) {
            if (SaleQty > 0 && salePrice > 0) {
                //var total = SaleQty * salePrice;
                //var discountAmount = total - (total * (discount / 100));
                //    $($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount);


                //    if (discountAmount >0) {
                //    cellTotalValue += parseInt(discountAmount);
                //}
                var discountAmount = $($(this).closest("tr")[0].cells[8].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[8].childNodes[0]).val());
                $($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount.toFixed(2));

                var SumText = parseFloat((discountAmount * (txtval / 100)).toFixed(2));
                afterTexAmount += SumText;
                if (discountAmount > 0) {
                    cellTotalValue += parseInt(discountAmount);
                }
            }
        } else {
            if (SaleQty > 0 && salePrice > 0) {
                //var total = SaleQty * salePrice;
                //var discountAmount = total - (total * (discount / 100));
                //    $($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount);


                //    if (discountAmount >0) {
                //    cellTotalValue += parseInt(discountAmount);
                //}
                var discountAmount = $($(this).closest("tr")[0].cells[8].childNodes[0]).val() == "" ? 0 : parseInt($($(this).closest("tr")[0].cells[8].childNodes[0]).val());
                $($(this).closest("tr")[0].cells[8].childNodes[0]).val(discountAmount.toFixed(2));

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
    $("#txtNetBill").val(NetBill.toFixed(2));
    $("#txtNetPay").val(NetPayable.toFixed(2));
    $("#txtRemaining").val(payable.toFixed(2));
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

function validationADD() {
    var isresult = true;
    $("#tbl tr:gt(0)").each(function () {
        var headId = $(this).children('td:eq(1)').find('input[type="hidden"]').val();//$(this).children('td:eq(1)').find(".ddlHead").val();
        var locId = $(this).children('td:eq(3)').find("select").val();
        var qty = $(this).children('td:eq(5)').find("input").val();
        var SalePrice = $(this).children('td:eq(6)').find("input").val();
        var Total = $(this).children('td:eq(8)').find("input").val();
        if (headId == undefined || headId == "") {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid #aaa' });
        }

        if (locId == undefined || locId == "-1") {
            $(this).children('td:eq(3)').find(".select2-choice").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(3)').find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if (qty === undefined || qty === "" || qty === "0") {
            $(this).children('td:eq(5)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(5)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

        //if (SalePrice == undefined || SalePrice == "" || SalePrice == "0") {
        //    $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid red' });
        //    return isresult = false;
        //}
        //else {
        //    $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid #aaa' });
        //}
       

    });
    if (isresult)
        isresult = true;
    else {
        return isresult = false;
    }
    return isresult;

}
function ValidateCustomerForSave() {
    var isresult = true;
    if (validationADD()) {
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
            isresult = false;
        }
        if (CustomerName === "undefined" || CustomerName === "") {
            $("#txtCustomerNameSale").css({ 'border': '1px solid red' });
            $("#txtCustomerNameSale").focus();
            isresult = false;
        }
        else {
            $("#txtCustomerNameSale").css({ 'border': '1px solid #aaa' });
        }
        //if ($("#txtReferenceNo").val() == "undefined" || $("#txtReferenceNo").val() == "") {
        //    $("#txtReferenceNo").css({ 'border': '1px solid red' });
        //    $("#txtReferenceNo").focus();
        //    return isresult = false;
        //}
        //else {
        //    $("#txtReferenceNo").css({ 'border': '1px solid #aaa' });
        //}

        //if ($("#txtRecvAddress").val() == "undefined" || $("#txtRecvAddress").val() == "") {
        //    $("#txtRecvAddress").css({ 'border': '1px solid red' });
        //    $("#txtRecvAddress").focus();
        //    return isresult = false;
        //}
        //else {
        //    $("#txtRecvAddress").css({ 'border': '1px solid #aaa' });
        //}

        //if ($("#txtRecvSuburb").val() == "undefined" || $("#txtRecvSuburb").val() == "") {
        //    $("#txtRecvSuburb").css({ 'border': '1px solid red' });
        //    $("#txtRecvSuburb").focus();
        //    return isresult = false;
        //}
        //else {
        //    $("#txtRecvSuburb").css({ 'border': '1px solid #aaa' });
        //}
        //if ($("#txtPostalCode").val() == "undefined" || $("#txtPostalCode").val() == "") {
        //    $("#txtPostalCode").css({ 'border': '1px solid red' });
        //    $("#txtPostalCode").focus();
        //    return isresult = false;
        //}
        //else {
        //    $("#txtPostalCode").css({ 'border': '1px solid #aaa' });
        //}

        //if ($("#txtRecvMobileNo").val() == "undefined" || $("#txtRecvMobileNo").val() == "") {
        //    $("#txtRecvMobileNo").css({ 'border': '1px solid red' });
        //    $("#txtRecvMobileNo").focus();
        //    return isresult = false;
        //}
        //else {
        //    $("#txtRecvMobileNo").css({ 'border': '1px solid #aaa' });
        //}

        if (SalesPerson === "undefined" || SalesPerson === "-1") {
            //$("#" + "s2id_" + "ddlSalesPerson").css({ 'border': '1px solid red' });
            $("#s2id_ddlSalesPerson").find(".select2-choice").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            // $("#" + "s2id_" + "ddlSalesPerson").css({ 'border': '1px solid #aaa' });
            $("#s2id_ddlSalesPerson").find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if ($("#ddlSalesOutlet").val() == "undefined" || $("#ddlSalesOutlet").val() == "-1") {
            $("#" + "s2id_" + "ddlSalesOutlet").css({ 'border': '1px solid red' });
            // $("#ddlTax").find(".select2-select-00").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $("#" + "s2id_" + "ddlSalesOutlet").css({ 'border': '1px solid #aaa' });
            isresult = true;
        }


        if (ShipVia === "undefined" || ShipVia === "-1") {
            // $("#" + "s2id_" + "ddlShipVia").css({ 'border': '1px solid red' });
            $("#s2id_ddlShipVia").find(".select2-choice").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            // $("#" + "s2id_" + "ddlShipVia").css({ 'border': '1px solid #aaa' });
            $("#s2id_ddlShipVia").find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        //if (promisDate === "undefined" || promisDate === "") {
        //    $("#txtIDueDate").css({ 'border': '1px solid red' });
        //    return isresult = false;
        //}
        //else {
        //    $("#txtIDueDate").css({ 'border': '1px solid #aaa' });
        //}

        if (tax === "undefined" || tax === "-1") {
            $("#" + "s2id_" + "ddlTax").css({ 'border': '1px solid red' });
            // $("#ddlTax").find(".select2-select-00").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $("#" + "s2id_" + "ddlTax").css({ 'border': '1px solid #aaa' });
            isresult = true;
        }

    } else {
        isresult = false;
    }

    if (isresult)
        isresult = true;
    else {
        isresult = false;
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
        //  "Address": $("#NewAddressEntry").val(),
        "InvoiceNo": $("#txtNewInvoiceSl").val(),
        "InvoiceDate": $("#txtInvoiceDate").val(),
        "SalesPersonId": $("#ddlSalesPerson").val(),
        "Comments": $("#txtComments").val(),
        "ShipVia": $("#ddlShipVia").val(),
        "PrepaidDueDate": $("#txtIDueDate").val(),
        "SubTotal": $("#txtTotal").val(),
        "Freight": $("#txtFright").val(),
        "Tax": $("#txtTax").val(),
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
        "State": $("#txtPostalCode").val(),
        "MobileNo": $("#txtRecvMobileNo").val(),
        "SaleOutletId": $("#ddlSalesOutlet").val(),
       // "PrepaidDueDate": $("#txtPrepaidDueDate").val()
    }
    return obj;
}

function getChildData() {
    let obj = [];
    $("#tbl tr:gt(0)").each(function () {

        let aobj = {
            "IHeadId": $(this).children('td:eq(1)').find('input[type="hidden"]').val(),
            "LocId": $(this).children('td:eq(3)').find("select").val() == "" ? 0 : parseInt($(this).children('td:eq(3)').find("select").val()),
            "SaleQty": $(this).children('td:eq(5)').find("input").val() == "" ? 0 : parseInt($(this).children('td:eq(5)').find("input").val()),
            "SalePrice": $(this).children('td:eq(6)').find("input").val() == "" ? 0 : $(this).children('td:eq(6)').find("input").val(),
            "discount": $(this).children('td:eq(7)').find("input").val() == "" ? 0 : $(this).children('td:eq(7)').find("input").val(),
            "ItemDescription": $(this).children('td:eq(2)').find("input").val() == "" ? 0 : $(this).children('td:eq(2)').find("input").val()
        }
        obj.push(aobj);
    });
    return obj;
}

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

$('#btnSave').on('click', function () {
    if ($("#hfId").val() == "") {

        if (ValidateCustomerForSave()) {
            var obj = GetSaveObject();
            var lstOfChildData = getChildData();
            var urlpath = base + Controller + "/Save";
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
                            let Invoice = result.lstsalesReturnObj[0].InvoiceNo;
                            $("#hfId").val(Invoice);
                            setTimeout(function () {
                                var url = base + "SalesReports/Index?Invoice=" + Invoice + "&Term=" + term;
                                window.open(url, '_blank');
                            }, 2000);

                        }

                    }
                }
            });
        }

    } else {
        $.pnotify({ text: "Already Generated Invoice..!", type: 'error' });
        return false;
    }
});

$('#btnRefresh').on('click', function () {
    // clearAllField();
});
$('#btnCancel').on('click', function () {
    window.history.back();
});
function clearAllField() {
    // LoadReturnInvoice();
    $("#ddlSalesType").prop("disabled", false);
    $("#btnSaveSale").text("Save");
    $("#ddlSalesType").val('1').trigger('change');
    $("#txtCustomerNameSale").val("");
    $("#hdCustomerName").val("0");
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
    $("#txtTax").val("0.00");
    $("#txtNetPay").val("0.00");
    $("#txtTerms").val("Prepaid");
    $("#txtJournalMemo").val("");
    $("#ddlReferralSource").val("-1").trigger('change');
    // $("#txtReferralSource").val("");
    $("#ddlDeliveryStatus").val("4").trigger('change');
    $("#txtPaidToday").val("");
    $("#ddlPaymentMethodSale").val("2").trigger('change');
    $("#divPaymentMethodSale").show();
    $("#txtRemaining").val("0.00");
    $("#lblPaidToday").text("Paid Today");
    $("#txtPaidToday").prop("disabled", false);
    $("#txtReferenceNo").val("");
    $("#addCust").prop("disabled", false);

    $("#txtRecvName").val('');
    $("#txtRecvAddress").val('');
    $("#txtRecvSuburb").val('');
    $("#txtPostalCode").val('');
    $("#txtRecvMobileNo").val('');
    $("#ddlSalesOutlet").val('-1').trigger('change');
    $("#txtPrepaidDueDate").val('');

    //document.getElementById('btnPayment').style.display = 'none';
    //document.getElementById('btnHistory').style.display = 'none';
    //document.getElementById('btnPrint').style.display = 'none';
    //document.getElementById('btnMail').style.display = 'none';
    comtax = 0;
    fridtax = 0;
    BindItemGrid(0);
}

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
                //document.getElementById('btnPayment').style.display = '';
                //document.getElementById('btnHistory').style.display = '';
                //document.getElementById('btnPrint').style.display = '';
                //document.getElementById('btnMail').style.display = '';
                // BindGridSalesData(result.SalesDaoChildEdit);
                BindMasterSalesData(result.SalesDaoMasterEdit);

            }

        }

    });
}

function BindMasterSalesData(obj) {
    
  
    $("#ddlSalesType").val(obj.SalesType).trigger('change');
    $("#ddlSalesType").prop("disabled", true);
    $("#txtCustomerNameSale").val(obj.Name);
    $("#hdCustomerName").val(obj.CustomerId);
    $("#chkIsActive").prop("checked", obj.isTaxInclusive);
    $("#txtTerms").val(obj.PaymentTermsText);
    term = obj.PaymentTermsText;
    $("#hdPaymentTerms").val(obj.PaymentTearmsId);
    $("#txtInvoiceSl").val(obj.InvoiceNo);
    //  $("#txtInvoiceDate").val(obj.InvoiceDate);
    salePerson = obj.SalesPersonId;
    shipvia = obj.ShipVia;
    saleOutlet = obj.SaleOutletId;
    $("#ddlTax").val("GST");//.trigger('change');
    $("#txtComments").val(obj.Comments);
    // $("#ddlShipVia").val(obj.ShipVia).trigger('change');
    //  $("#txtIDueDate").val(obj.PromisedDate);
    //  $("#txtTotal").val(obj.SubTotal);
    //  $("#txtFright").val(obj.FreightCharge);
    //  $("#txtTax").val(obj.tax);
    //  $("#txtNetPay").val(obj.TotalAmount);
   
    $("#txtJournalMemo").val(obj.JournalMemo);
    if (obj.ReferralSource !== "") {
        $("#ddlReferralSource").val(obj.ReferralSource).trigger('change');
    }
    $("#ddlDeliveryStatus").val(obj.InvoiceDeliveryStatus).trigger('change');
    $("#ddlPaymentMethodSale").val(obj.PaymentMethod).trigger('change');
    // $("#txtRemaining").val(obj.BalanceDue);
    //$("#divPaymentMethodSale").hide();
    //  $("#lblPaidToday").text("Applied To Date");
    //$("#txtPaidToday").prop("disabled", true);
    $("#txtReferenceNo").val(obj.ReferenceNo);
    $("#txtRecvName").val(obj.ReceiverName);
    $("#txtRecvAddress").val(obj.Address);
    $("#txtRecvSuburb").val(obj.City);
    $("#txtPostalCode").val(obj.State);
    $("#txtRecvMobileNo").val(obj.MobileNo);
    $("#ddlSalesOutlet").val(obj.SaleOutletId).trigger('change');
    $("#txtPrepaidDueDate").val(obj.PrepaidDueDate);
    LoadSalesPerson();
    loadSaleOutlet();
    LoadShippingMethod();
    //$("#ddlPaymentMethodSale").attr('display', 'none');
}


function loadSaleDataInvoiceWise(inv) {
    var urlpath = base + Controller + "/loadSaleDataInvoiceWise";
    var obj = {
        InvoiceNo: inv
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
                MasterSalesData(result.SalesDaoMasterEdit);
                BindGridSalesData(result.SalesDaoChildEdit);

            }

        }

    });
}

function MasterSalesData(obj) {
    
    //  salePerson = "", saleOutlet = "", shipvia = ""
    let tx = obj.TaxType;
    $("#ddlSalesType").val(obj.SalesType).trigger('change');
    $("#ddlSalesType").prop("disabled", true);
    $("#txtCustomerNameSale").val(obj.Name);
    $("#hdCustomerName").val(obj.CustomerId);
    $("#hfCustomerMail").val(obj.CustomerMail);
    $("#chkIsActive").prop("checked", obj.isTaxInclusive);
    $("#txtTerms").val(obj.PaymentTermsText);
    term = obj.PaymentTermsText;
    $("#hdPaymentTerms").val(obj.PaymentTearmsId);
    var newStr = obj.InvoiceNo.slice(0, obj.InvoiceNo.length - 2);
    $("#txtInvoiceSl").val(newStr);
    $("#txtInvoiceDate").val(obj.InvoiceDate);
    salePerson = obj.SalesPersonId;
    shipvia = obj.ShipVia;
    saleOutlet = obj.SaleOutletId;
    $("#ddlTax").val(tx);//.trigger('change');
    $("#txtComments").val(obj.Comments);
    $("#txtIDueDate").val(obj.PromisedDate);
    $("#txtTotal").val(obj.SubTotal);
    $("#txtFright").val(obj.FreightCharge);
    $("#txtTax").val(obj.tax);
    $("#txtNetPay").val(obj.TotalAmount);
   
    $("#txtJournalMemo").val(obj.JournalMemo);
    if (obj.ReferralSource !== "") {
        $("#ddlReferralSource").val(obj.ReferralSource).trigger('change');
    }
    $("#ddlDeliveryStatus").val(obj.InvoiceDeliveryStatus).trigger('change');
    $("#txtPaidToday").val(obj.AppliedToDate);
    $("#ddlPaymentMethodSale").val(obj.PaymentMethod).trigger('change');
    $("#txtRemaining").val(obj.BalanceDue);
    $("#lblPaidToday").text("Applied To Date");
    //$("#txtPaidToday").prop("disabled", true);
    $("#btnSave").val("Update");
    $("#btnSave").prop("disabled", true);
    $("#txtReferenceNo").val(obj.ReferenceNo);
    $("#txtRecvName").val(obj.ReceiverName);
    $("#txtRecvAddress").val(obj.Address);
    $("#txtRecvSuburb").val(obj.City);
    $("#txtPostalCode").val(obj.State);
    $("#txtRecvMobileNo").val(obj.MobileNo);
    $("#txtPrepaidDueDate").val(obj.PrepaidDueDate);
    LoadSalesPerson();
    loadSaleOutlet();
    LoadShippingMethod();
}

function BindGridSalesData(childData) {
  
    $("#idtbody").empty();
    count++;
    let content = '';
    $.each(childData, function (ind, obj) {
        let status = "";
        var total = obj.SalesQty * obj.SalesPrice;
        var discountAmount = total - (total * (obj.Discount / 100));
        if (obj.DespatchDate != "") {
            status = 'readonly';
        } else { status = ""; }
        debugger;
        var bbs = obj.ItemDescription.toString().replace(/"|" /g, '&quot;');
        content = '<tr>' +
       '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
          '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
       '</td>' +
      '<td><input type="text" id="ddlHead' + ind + '" value="' + obj.ItemCode + '" class="span12 ddlHead" ' + status + ' /><input type="hidden" value=' + obj.ItemHeadId + ' id="hdddlHead"/></td>' + //' + loadItem(addIndex) + '
      '<td><input type="text" value="' + bbs + '" id="txtHeadDesc' + ind + '" class="span12 txtHeadDesc" readonly/><input type="hidden" id="hfSaleDetId' + ind + '" value="' + obj.SaleDetsId + '"/></td>' +
      '<td><select id="ddlLocation' + ind + '" class="span12 ddlLocation"></select></td>' +
      '<td><input type="text" id="txtStock' + ind + '" value=' + obj.CurrentStockQty + ' class="span12 txtStock" readonly/></td>' +
      '<td><input type="text" id="txtSaleQty' + ind + '" value=' + obj.SalesQty + ' class="span12 txtSaleQty" ' + status + ' /></td>' +
      '<td><input type="text" id="txtUnitPrice' + ind + '" value=' + obj.SalesPrice + ' class="span12 txtUnitPrice ForTotalPrice" ' + status + ' /></td>' +
      '<td><input type="text" id="txtDis' + ind + '" value=' + obj.Discount + ' class="span12 txtDis ForTotalPrice"  ' + status + ' /></td>' +
      '<td><input type="text" id="txtTotalPrice' + ind + '" value=' + discountAmount + ' class="span12 txtTotalPrice" ' + status + ' /></td>' +
       '</tr>';

        $('#tbl tbody').append(content);
        LoadLocationByheadIdEdit(obj.ItemHeadId, obj.LocationId, ind);
        $("#ddlLocation" + ind).select2();
      
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

function LoadReturnInvoice(inv) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/LoadReturnInvoice",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "invoice": inv }),
        success: function (result) {
            $("#txtNewInvoiceSl").val(result);
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

//$(document).off('click', '#btnPayment').on('click', '#btnPayment', function () {

//    var customerId = $("#hdCustomerName").val();
//    if (customerId != '') {
//        var baseUrl = base + 'ReceivePayments/ReceivePayments?customerId=' + customerId;
//        window.location.href = baseUrl;
//    }
//});

$(document).off('click', '#btnHistory').on('click', '#btnHistory', function () {
   
    let Invoice = $("#txtNewInvoiceSl").val();
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
                    '<table  id ="tabeledata" class="tabeledata separate" style="width:100%;max-height:300px; overflow:auto;">' +
                    '<tr><th>Invoice</th><th>Date</th> <th>Memo</th> <th>Charges</th> <th>Payments</th> <th>Item Description</th> <th>Refund</th> <th>Notes</th><tr>';
                if (data != null) {
                    $.each(data,
                        function (i, obj) {

                            content += '<tr>' +
                            '<td>' + obj.InvoiceNo + '</td>' +
                                '<td>' + obj.PaymentDate + '</td>' +
                                '<td>' + obj.PayMemo + '</td>' +
                                '<td>' + obj.SalesPrice + '</td>' +
                                '<td>' + obj.Discount + '</td>' +
                                '<td>' + obj.ItemDescription + '</td>' +
                                '<td>' + obj.RefundAmount + '</td>' +
                                '<td>' + obj.Comments + '</td>' +
                            '</tr>';

                        });

                }
                content += '</table>  <br/> <div style="margin-top:5px;font-size:12px; color:red;text-align: center;"> Balance Due : ' + result.SalesPaymentHisList[0].DueAmount + ' </div>';

                $(content).dialog({
                    resizable: true,
                    modal: true,
                    title: ' Transaction History ',
                    height: 400,
                    width: 900,
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
    var url = base + "SalesReports/Index?Invoice=" + $("#txtNewInvoiceSl").val() + "&Term=" + $("#txtTerms").val();
        window.open(url, '_blank');
});

//$(document).off('click', '#btnMail').on('click', '#btnMail', function () {
//        // Local = SL-1810281001
//        email = "rahat@melbourniansfurniture.com.au";  ////rahat@melbourniansfurniture.com.au   //sayed108cse@gmail.com
//        if (email != "") {
//            // let invoice = "SL-1810281001";// Server ="SL-1811011001";
//            $.ajax({
//                beforeSend: function () { $.blockUI(); },
//                complete: function () { $.unblockUI(); },
//                type: "POST",
//                url: base + "SalesReports/SendMail",
//                contentType: "application/json;charset=utf-8",
//                dataType: "JSON",
//                data: JSON.stringify({ "saleInvoice": $("#txtInvoiceSl").val(), "term": $("#txtTerms").val(), "email": email.trim() }),
//                success: function (result) {
//                    if (result.IsSessionOut != null) {
//                        $.pnotify({ text: 'Session Out Please login again', type: 'info' });
//                        return false;
//                    }
//                    if (result.Error != null) {
//                        $.pnotify({ text: result.Error, type: 'error' });
//                        return false;
//                    } else {
//                        $.pnotify({ text: result, type: 'info' });
//                    }
//                },
//                error: function (a, b, c) {
//                    $.pnotify({ text: 'Something Wrong', type: 'error' });
//                }
//            });
//        } else { $.pnotify({ text: 'Customer E-mail Not Found !.', type: 'error' }); }
//});

function loadInisialColumnHeadId(tblRow) {
    let coloumLLst = [];
    let colors = [];
    let value = $(tblRow).val();
    var urlpath = base + CurrentController + "/GetInialAutoComplete";
    let myRes = [];
    var aObj = {
        "SearchText": value,
        "CustomerId": $("#hdCustomerName").val() == "" ? 0 : $("#hdCustomerName").val()
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
                //$.pnotify({ text: "Loading Error", type: 'error' });
                return false;
            } else {
                
                myRes = result.ListAutoCpomplete;
                coloumLLst = [{ name: 'Code', minWidth: '100px' }, { name: 'Qty', minWidth: '60px' }];
                colors = [];
                $.each(result.ListAutoCpomplete, function (i, obj) {
                    //var vv = obj.value.toString();
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