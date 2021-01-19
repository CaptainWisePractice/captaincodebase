var Controller = "POConsumption", MasterId = '', ManufacturerId = '', poDate = '', poNumber = '';

$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadManufacturer();
    $('#ddlManufacturer').select2();
    window.scrollTo(20, 0);
    var url_string = window.location.href;
    var url = new URL(url_string);
    let id = url.searchParams.get("Id");
    if (id != null) {
        MasterId = id.trim();
    }
    let manuId = url.searchParams.get("ManufacturerId");
    if (manuId != null) {
        ManufacturerId = manuId.trim();
    }
    let pDate = url.searchParams.get("pDate");
    let poNo = url.searchParams.get("poNo");
    let notes = url.searchParams.get("notes");
    if (pDate != null) {
        poDate = pDate.trim();
        $("#txtOrderEstimateDate").val(poDate);
    } else { getDate(); }

    if (poNo != null) {
        poNumber = poNo.trim();
        $("#txtPONumber").val(poNumber);
        $('#txtPONumber').prop('readonly', true);
    }
    if (notes != null) {
        $("#txtNotes").val(notes.trim());
       
    }


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
    document.getElementById("txtOrderEstimateDate").value = date;
}

function loadManufacturer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadManufacturer",
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
    if (ManufacturerId !== '') {
        $("#ddlManufacturer").val(ManufacturerId).trigger('change');
    } else { id.val('-1').trigger('change'); }
}

$(document).off('change', '#ddlManufacturer').on('change', '#ddlManufacturer', function () {
    if ($(this).val() !== '-1') {

        let ManufacturerId = $('#ddlManufacturer').val();
        var urlpath = base + Controller + "/GetPOConstionByManufacturer";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "ManufacturerId": ManufacturerId, "MasterId": MasterId }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    $("#idtbody").empty();
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    $("#idtbody").empty();
                    return false;
                } else {

                    BindTable(result.list);
                }
            }
        });
    }
    else { $("#idtbody").empty(); }
});

function BindTable(data) {
    $("#idtbody").empty();
    let content = '';
    if (data != null) {
        production = '', incoming = '', iim = '', pp = '';
        $.each(data,
          function (i, row) {
              if (row.ProQty !== "") {
                  production = row.ProQty;
                  pp = '<span class="spnDetails">' + row.ProQty + '</span><span class="spnTooltip"><strong> Production Finish Date <br> <br>' + row.FileName + '</strong></span>';
              }
              else {
                  pp = row.ProQty;
              }
              if (row.IncomQty !== "") {
                  incoming = row.IncomQty;
                  iim = '<span class="spnDetails">' + row.IncomQty + '</span><span class="spnTooltip"><strong> ETA Warehouse <br> <br>' + row.FilePath + '</strong></span>';
              } else {
                  iim = row.IncomQty;
              }
              content += '<tr>' +
         '<td> ' + (i + 1) + '</td>' +
         '<td>' + row.IHeadCode + '</td>' +
         '<td>' + row.IHeadName + '</td>' +
         '<td>' + row.Color + '</td>' +
         '<td>' + row.Size + '</td>' +
         '<td>' + row.CBM + '</td>' +
         '<td>' + row.SaleStock + '</td>' +
         '<td style="background-color:#FFFF00; font-weight:bold; text-align:center;">' + row.WareStock + '</td>' +
         '<td>' + iim + '</td>' +
         '<td>' + pp + '</td>' +
          //'<td><span class="spnDetails">' + row.IncomQty + '</span><span class="spnTooltip">' +
          //      '<strong> ETA Warehouse <br> <br>' + row.FilePath + '</strong></span> </td>' +
          //'<td><span class="spnDetails">' + row.ProQty + '</span><span class="spnTooltip">' +
          //      '<strong> Production Finish Date <br> <br>' + row.FileName + '</strong></span> </td>' +
         '<td><input type="text" id="txtOrderQty' + i + '" value="' + row.OrderQty + '" class="span12 txtOrderQty comm"/></td>' +
         '<td id="txtOrder' + i + '" style="display:none">' + row.OrderQty + '</td>' +
         '<td><input type="text" id="txtUPrice' + i + '"  value="' + row.CostingPrice + '" class="span12 txtUPrice comm"/></td>' +
         '<td id="txtPrice' + i + '" style="display:none">' + row.CostingPrice + '</td>' +
         '<td id="txtTPrice' + i + '">' + row.NewPrice + '</td>' +
         '<td id="txtTCBM' + i + '">' + row.TotCBM + '</td>' +
         '<td style="display:none">' + row.IHeadId + '</td>' +
         '</tr>';
          });
        $('#tbl tbody').append(content);

        var tbl = document.getElementById('tbl');
        var rows = tbl.getElementsByTagName('tr');
        if (incoming.trim() == "") {
            for (var row = 0; row < rows.length; row++) {
                rows[row].cells[8].style.display = 'none';
            }
        }
        else {
            for (var row = 0; row < rows.length; row++) {
                rows[row].cells[8].style.display = '';
            }
        }

        if (production.trim() == "") {
            for (var row = 0; row < rows.length; row++) {
                rows[row].cells[9].style.display = 'none';
            }
        }
        else {
            for (var row = 0; row < rows.length; row++) {
                rows[row].cells[9].style.display = '';
            }
        }

        if (MasterId !== "") {
            FooterQtyCalculation();
            FooterPriceCalculation();
            FooterToCalculation();
            footerBoxCBMCalculation();
        }

        //  document.getElementById('tbl').rows[0].cells[8].style.display = 'none';
        // document.getElementById('tbl').rows[0].cells[9].style.display = 'none';
    }
}

$(document).off('keyup', '.comm').on("keyup", ".comm", function (event) {
    let a = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(a);
});

$(document).off('change', '.txtOrderQty').on('change', '.txtOrderQty', function () {
    if ($(this).val() !== '') {
        var txtord = $(this).closest("tr")[0].cells[11].id;
        var cbm = $(this).closest("tr")[0].cells[5].innerText;//$(this).closest("tr")[0].cells[5].childNodes[0].id;
        var unitprice = $(this).closest("tr")[0].cells[12].childNodes[0].id;
        var totalprice = $(this).closest("tr")[0].cells[14].id; //$(this).closest("tr")[0].cells[12].childNodes[0].id;
        var tocbm = $(this).closest("tr")[0].cells[15].id; //$(this).closest("tr")[0].cells[13].childNodes[0].id;
        let b = parseFloat($(this).val());
        let unitP = $('#' + unitprice).val();
        //  let tcbm = $('#' + cbm).val();
        if (unitP !== "" && unitP !== "0") {
            let totalp = parseFloat(unitP) * parseFloat(b);
            if (totalp != 0) {
                $("#" + totalprice).val(totalp);
            } else { document.getElementById(totalprice).innerHTML = totalp.toFixed(2); FooterToCalculation(); }

            $('#' + unitprice).val(unitP).trigger('change');
        }
        let ttcbm = parseFloat(cbm) * parseFloat(b);
        document.getElementById(tocbm).innerHTML = ttcbm.toFixed(2);
        document.getElementById(txtord).innerHTML = $(this).val();
        // $("#" + tocbm).val(ttcbm.toFixed(3));

        FooterQtyCalculation();
        footerBoxCBMCalculation();

    }
});

$(document).off('change', '.txtUPrice').on('change', '.txtUPrice', function () {
    if ($(this).val() !== '' || $(this).val() !== '0') {
        var txtpric = $(this).closest("tr")[0].cells[13].id;
        document.getElementById(txtpric).innerHTML = $(this).val();
        var orderqty = $(this).closest("tr")[0].cells[10].childNodes[0].id;
        var totalprice = $(this).closest("tr")[0].cells[14].id;
        let b = parseFloat($(this).val());
        let aa = $('#' + orderqty).val();
        if (aa !== "" && aa !== "0") {
            let totalp = parseFloat(b) * parseFloat(aa);
            document.getElementById(totalprice).innerHTML = totalp.toFixed(2);
            //  $("#" + totalprice).val(totalp.toFixed(2));
            FooterToCalculation();
        }
        FooterPriceCalculation();
    }
});

function FooterQtyCalculation() {

    var torderQty = '0';
    $("#tbl tr:gt(1)").each(function () {
        let orderQty = $(this).children('td:eq(10)').find("Input").val();
        if (orderQty != '' && orderQty != '0') {
            torderQty = parseFloat(torderQty) + parseFloat(orderQty);
        }
    });
    let qty = $("tfoot tr")[0].cells[10].childNodes[0].id;
    document.getElementById(qty).innerHTML = torderQty.toFixed(2);

};

function FooterPriceCalculation() {

    var price = '0';
    $("#tbl tr:gt(1)").each(function () {
        let tprice = $(this).children('td:eq(12)').find("Input").val();
        if (tprice != '' && tprice != '0') {
            price = parseFloat(price) + parseFloat(tprice);
        }
    });
    let prce = $("tfoot tr")[0].cells[12].childNodes[0].id;
    document.getElementById(prce).innerHTML = price.toFixed(2);
}

function FooterToCalculation() {
    var tvalue = '0';
    $("#tbl tr:gt(1)").each(function () {

        let tval = $(this).children('td:eq(14)')[0].innerText;
        if (tval != '' && tval != '0') {
            tvalue = parseFloat(tvalue) + parseFloat(tval);
        }
    });
    let tot = $("tfoot tr")[0].cells[14].childNodes[0].id;
    document.getElementById(tot).innerHTML = tvalue.toFixed(2);
}

function footerBoxCBMCalculation() {
    var tobox = '0';
    $("#tbl tr:gt(1)").each(function () {
        let box = $(this).children('td:eq(15)')[0].innerText;
        if (box != '' && box != '0') {

            tobox = (parseFloat(tobox) + parseFloat(box)).toFixed(3);
        }
    });
    let bx = $("tfoot tr")[0].cells[15].childNodes[0].id;
    document.getElementById(bx).innerHTML = tobox;
}

//var tableToExcel = (function () {

//    var uri = 'data:application/vnd.ms-excel;base64,'
//      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
//      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
//      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
//    return function (table, name) {
//        if (!table.nodeType) table = document.getElementById(table)
//        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
//        window.location.href = uri + base64(format(template, ctx))
//    }
//    $("#divTable").html('');
//})()

$("#btnExportToExcel").click(function () {
    exportToExcel(this, '#tbl');
});

function exportToExcel() {
    var tab_text = "<tr >";
    var tdheder = ' <th width="2%">#SL</th>' +
        ' <th width="8%">Item Code</th>' +
        ' <th width="16%">Item Description</th>' +
        ' <th width="6%">Color</th>' +
        ' <th width="5%">Size</th>' +
        ' <th width="6%">CBM</th>' +
        ' <th width="8%">Sale Stock</th>' +
        ' <th width="6%">Stock (W)</th>' +
        ' <th width="6%">Incoming Qty</th>' +
        ' <th width="6%">Production Qty</th>' +
        ' <th width="6%">Order Qty</th>' +
        ' <th width="6%">Unit Price</th>' +
        ' <th width="6%">Total Price</th>' +
        ' <th width="6%">Total CBM</th>';
    var textRange; var j = 0, rows = '';
    tab = document.getElementById('tbl');
    tab_text = tab_text + tdheder + "</tr>";
    var tableData = $('#tbl tr:gt(1)');
    for (var i = 0; i < tableData.length; i++) {

        let income = tableData[i].cells[8].innerText.length > 8 ? 0 : tableData[i].cells[8].innerText;
        let prod = tableData[i].cells[9].innerText.length > 8 ? 0 : tableData[i].cells[9].innerText;

        rows += '<tr>'
            + '<td>' + tableData[i].cells[0].innerText + '</td>'
            + '<td>' + tableData[i].cells[1].innerText + '</td>'
            + '<td>' + tableData[i].cells[2].innerText + '</td>'
            + '<td>' + tableData[i].cells[3].innerText + '</td>'
            + '<td>' + tableData[i].cells[4].innerText + '</td>'
            + '<td>' + tableData[i].cells[5].innerText + '</td>'
            + '<td>' + tableData[i].cells[6].innerText + '</td>'
            + '<td style="background-color:#FFFF00; font-weight:bold; text-align:center;">' + tableData[i].cells[7].innerText + '</td>'
            + '<td>' + income + '</td>'
            + '<td>' + prod + '</td>'
            + '<td>' + tableData[i].cells[11].innerText + '</td>'
            + '<td>' + tableData[i].cells[13].innerText + '</td>'
            + '<td>' + tableData[i].cells[14].innerText + '</td>'
            + '<td>' + tableData[i].cells[15].innerText + '</td>'
            + '</tr>';
    }
    tab_text += rows;//'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64, ';
    var data_type = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="2px">{table}</table></body></html>',
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        }
    var ctx = {
        worksheet: "New Order Estimate" || 'Worksheet',
        table: tab_text
    }
    var a = document.createElement('a');
    // window.location.href = data_type + base64(format(template, ctx));
    a.href = data_type + base64(format(template, ctx));
    //setting the file name
    a.download = 'New_Order_Estimate.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
}

$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        var orderNo = $("#ddlManufacturer option:selected").text();
        var todaydate = new Date();
        var day = todaydate.getDate();
        var month = todaydate.getMonth();
        var year = todaydate.getFullYear();
        var date = day + "-" + month + "-" + year;
        var obj = {
            "ManufacturerId": $("#ddlManufacturer").val(),
            "Manufacturer": orderNo + '-' + date,
            "UpdatedBy": $("#txtOrderEstimateDate").val(),
            "Description": $("#txtPONumber").val(),
            "FileName": $("#txtNotes").val()
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
                    $('#ddlManufacturer').val('-1').trigger('change');
                    $('#txtPONumber').val('');
                    $('#txtNotes').val('');
                    document.getElementById('totalqt').innerHTML = '';
                    document.getElementById('totalpr').innerHTML = '';
                    document.getElementById('totalval').innerHTML = '';
                    document.getElementById('gtotalcbm').innerHTML = '';

                }
            }
        });

    }
});

function SaveValidation() {
    let valid = true;
    var couter = 0;
    if ($('#txtPONumber').val() == '') {
        $.pnotify({ text: 'Input PO Number. !', type: 'info' });
        $('#txtPONumber').focus();
        valid = false;
        return valid;
    }

    if ($('#ddlManufacturer').val() == '-1') {
        $('#s2id_ddlManufacturer').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Manufacturer Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlManufacturer').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    $("#tbl tr:gt(1)").each(function () {
        let orderqty = $(this).children('td:eq(11)')[0].innerText;
        let uprice = $(this).children('td:eq(13)')[0].innerText;
        if (orderqty !== "" && orderqty !== "0") {
            if (uprice == "" && uprice == "0") {
                $.pnotify({ text: 'Unit Price Requried', type: 'error' });
                valid = false;
                return valid;
            } else {
                couter = couter + 1;
                valid = true;
                return valid;
            }
        }
    });
    if (couter > 0) {
        valid = true;
        return valid;
    } else {
        $.pnotify({ text: 'Please Input Order Qty !.', type: 'info' });
        valid = false;
        return valid;
    }

    return valid;
}
///// Validation End ////
///// Create Object ////
function GetSaveObject() {
    let obj = [];
    $("#tbl tr:gt(1)").each(function () {
        let aobj = {
            "IHeadId": $(this).children('td:eq(16)')[0].innerText,
            "WareStock": $(this).children('td:eq(7)')[0].innerText,
            "SaleStock": $(this).children('td:eq(6)')[0].innerText,
            "IncomQty": $(this).children('td:eq(8)')[0].innerText,
            "ProQty": $(this).children('td:eq(9)')[0].innerText,
            "OrderQty": $(this).children('td:eq(11)')[0].innerText,
            "CostingPrice": $(this).children('td:eq(13)')[0].innerText,
            "NewPrice": $(this).children('td:eq(14)')[0].innerText,
            "TotCBM": $(this).children('td:eq(15)')[0].innerText

        }
        obj.push(aobj);
    });
    return obj;
}

$('#btnRefresh').on('click', function () {
    var baseUrl = base + 'POConsumption/POConsumption';
    window.location.href = baseUrl;
});

$(document).off('click', '#btnBack').on('click', '#btnBack', function () {
    var baseUrl = base + 'POConsumption/NewOrderEstimate';
    window.location.href = baseUrl;
});