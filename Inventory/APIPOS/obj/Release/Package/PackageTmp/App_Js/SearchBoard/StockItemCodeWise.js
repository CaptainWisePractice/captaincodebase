var Controller = 'StockItemCodeWise';
$("span#sidebar-toggle").trigger('click');
$('#ddlHead').select2();
//loadItemHead();
LoadItem();
//$('#demo-dtable-04').DataTable({
//    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
//});
function LoadItem() {
    var urlpath = base + Controller + "/GetStockItemCode";

    let obj = {
        "IHeadId": '0'
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
                $("#divTable").empty();
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                $("#divTable").empty();
                return false;
            } else {
                BindTable(result.list);
            }
        }
    });

}

function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    var tbl = $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1,
        "bDestroy": true
    });
    new FixedHeader(tbl);
    //$('#demo-dtable-04').dataTable();
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Item Code</th>' +
              '<th>Item Description</th>' +
              '<th>Stock In-House</th>' +
              '<th>Stock Avail able</th>' +
              '<th>Check Out/ LayBy</th>' +
              '<th>Ware house Stock</th> ' +
              '<th>Awating Des.</th> ' +
              '<th>War. Avail</th>' +
              '<th>In coming</th>' +
              '<th>Produc tion</th>' +
              '<th> CBM </th>' +
              '<th> Manufacturer </th>' +
              '<th> Status </th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableRow(result) {
    let content = '';
    if (result != null) {

        $(result).each(function (index, element) {

            var saleStock = '', iim = '', pp = '', trcolor = '', status = '';
            if (parseInt(element.WareStock) >= 0) {
                saleStock = parseInt(element.TStock) - (parseInt(element.SaleQty) + parseInt(element.TCheckOut));
            }
            else {
                if (parseInt(element.WareStock) < 0)
                { saleStock = (parseInt(element.TStock) - (parseInt(element.SaleQty) + parseInt(element.TCheckOut))) } else {
                    saleStock = (parseInt(element.TStock) - (parseInt(element.SaleQty) + parseInt(element.TCheckOut))) - parseInt(element.WareStock);
                }
            }

            if (element.InProduction !== "0") {
                var prodDate = element.ProductionEndDate;
                prodDate = prodDate.replace(/,/g, '<br><br>');
                pp = '<span class="spnDetails">' + element.InProduction + '</span><span class="spnTooltip"><strong> Production Finish Date <br> <br>' + prodDate + '</strong></span>';
            }
            else {
                pp = element.InProduction;
            }

            if (element.InComing !== "0") {

                var EtaDate = element.ETADate;
                EtaDate = EtaDate.replace(/,/g, '<br><br>');
                iim = '<span class="spnDetails">' + element.InComing + '</span><span class="spnTooltip"><strong> ETA Warehouse <br> <br>' + EtaDate + '</strong></span>';
            } else {
                iim = element.InComing;
            }



            if (element.IsActive == 1) {
                status = 'Continue';
            } else { status = 'Discontinue';  }

            if (element.MaxStockLevel != "0" && element.MinStockLevel != "0") {
                if (parseInt(element.WareStock) > 0) {
                    if (parseInt(element.MaxStockLevel) <= parseInt(element.WareStock)) {
                        trcolor = 'style="background-color:#006400 !important;"';
                    } else {
                        if (parseInt(element.MinStockLevel) < parseInt(element.WareStock)) {
                            trcolor = '';
                        } else { trcolor = 'style="background-color:#FFA500 !important;"'; }
                    }
                } else { trcolor = 'style="background-color:red !important;"'; }
            } else { trcolor = ''; }


            content += '<tr>' +
                '<td class="head"><a href="#" class="itemhead">' + element.ItemCode + '</a><input type="hidden" value="' + element.IHeadId + '" /></td>' +
                //'<td >' + element.ItemCode + '</td>' +
                '<td ' + trcolor + '>' + element.ItemName + '</td>' +
                '<td >' + element.TStock + '</td>' +
                '<td >' + saleStock + ' </td>' +
                '<td><span class="spnDetails">' + element.TCheckOut + '</span><span class="spnTooltip">' +
                '<strong>' + element.ChkOutInvoiceNo + '</strong></span> </td>' +
                '<td >' + element.TAvailable + '</td>' +
                '<td><span class="spnDetails">' + element.SaleQty + '</span><span class="spnTooltip">' +
                '<strong>' + element.InvoiceNo + '</strong></span> </td>' +
                '<td style="background-color:#FFFF00; font-weight:bold; text-align:center;">' + element.WareStock + '</td>' +
                '<td>' + iim + '</td>' +
                '<td>' + pp + '</td>' +
                '<td >' + element.CBM + '</td>' +
                '<td >' + element.Manufacturer + '</td>' +
                '<td >' + status + '</td>' +
        '</tr>';
        });
    }
    return content;
}


$('#btnSearch').on('click', function () {
    LoadItem();
});

function loadItemHead() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadItemHead",
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
                LoadDropdown(result.listComboData, $('#ddlHead'));
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
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    id.append(content);
    id.val('-1').trigger('change');
    //if (result.length == 1) {
    //    id.val(result[0].Value).trigger('change');
    //}
}


$(document).off('click', '.itemhead').on('click', '.itemhead', function () {

    let tblRow = $(this).closest('tr');
    let headId = $(tblRow).find('.head input[type=hidden]').val();
    let headname = $(tblRow).find('.head').text();
    StockData(headId, headname);
});

function StockData(headId, headname) {
    var urlpath = base + Controller + "/GetStockByItemCode";
    let obj = {
        "IHeadId": headId
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

                var data = result.list;
                var content =
                    '<div style="font-family:Verdana"><div style="margin-top:5px;font-size:18px;font-weight:bold; color:green;text-align: center;"> Item Code : ' + headname + '</div> <br/>';
                content +=
                    '<table class="tabelle separate" style="width:100%;max-height:300px; overflow:auto;">' +
                    '<tr><th>Item Number</th><th>Stock Qty</th> <th>Box dimensions</th> <th>Box weight</th> <th>CBM</th><tr>';
                if (data != null) {
                    $.each(data,
                        function (i, obj) {
                            content += '<tr>' +
                                '<td>' + obj.ItemCode + '</td>' +
                                '<td>' + obj.TStock + '</td>' +
                                '<td>' + obj.Length + '</td>' +
                                '<td>' + obj.Weight + '</td>' +
                                '<td>' + obj.CBM + '</td>' +
                                '</tr>';

                        });
                }
                content += '</table>';
                content += ' <br/><div><img src="../Uploads/ItemHead/' + data[0].LocName.trim() + '" style="height:150px;width:200px;margin-left: 27%;" alt="Not Found" border="1"> </div>';
                $(content).dialog({
                    resizable: true,
                    modal: true,
                    title: ' Stock Quantity ',
                    height: 350,
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


$("#btnExportToExcel").click(function () {
    exportToExcel(this, '#demo-dtable-04');
});

function exportToExcel() {

    var tab_text = "<tr>";
    var tdhead = '<th>Item Code</th>' +
              '<th>Item Description</th>' +
              '<th>Stock In-House</th>' +
              '<th>Stock Available</th>' +
              '<th>CheckOut/ LayBy</th>' +
              '<th>Warehouse Stock</th> ' +
              '<th>Awating Des.</th> ' +
              '<th style="background:#FFFF00;">War. Avail</th>' +
    '<th>Incoming Stock</th>' +
    '<th>Production Stock</th>' +
    '<th> CBM </th>' +
    '<th> Manufacturer </th>' +
    '<th> Status </th>';
    var textRange, rows = '';
    tab = document.getElementById('demo-dtable-04');
    tab_text = tab_text + tdhead + "</tr>";
    var tableData = $('#demo-dtable-04 tr:gt(0)');
    for (var i = 0; i < tableData.length; i++) {

        let rcolor = '';
        rcolor = tableData[i].cells[1].style.cssText;
        rows += '<tr>'
            + '<td>' + tableData[i].cells[0].innerText + '</td>'
            + '<td style="' + rcolor + '">' + tableData[i].cells[1].innerText + '</td>'
            + '<td>' + tableData[i].cells[2].innerText + '</td>'
            + '<td>' + tableData[i].cells[3].innerText + '</td>'
            + '<td>' + tableData[i].cells[4].innerText + '</td>'
            + '<td>' + tableData[i].cells[5].innerText + '</td>'
            + '<td>' + tableData[i].cells[6].innerText + '</td>'
            + '<td style="background:#FFFF00;">' + tableData[i].cells[7].innerText + '</td>'
            + '<td>' + tableData[i].cells[8].innerText + '</td>'
            + '<td>' + tableData[i].cells[9].innerText + '</td>'
            + '<td>' + tableData[i].cells[10].innerText + '</td>'
            + '<td>' + tableData[i].cells[11].innerText + '</td>'
            + '<td>' + tableData[i].cells[12].innerText + '</td>'
            + '</tr>';
    }
    tab_text += rows;
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
        worksheet: "Stock List" || 'Worksheet',
        table: tab_text
    }
    var a = document.createElement('a');
    // window.location.href = data_type + base64(format(template, ctx));
    a.href = data_type + base64(format(template, ctx));
    //setting the file name
    a.download = 'Stock_List.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
}