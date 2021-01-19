var Controller = 'StocklistLocationwise', ControllerStock = 'StockItemCodeWise';;
$("span#sidebar-toggle").trigger('click');
$('#ddlHead').select2();
//loadItemHead();
LoadItem();

function LoadItem() {
    var urlpath = base + Controller + "/GetStocklistLocationwise";

    let obj = {
        "IHeadId": $('#ddlHead').val() === '-1' ? '0' : $('#ddlHead').val()
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
              '<th>Item name</th>' +
              '<th>Warehouse Total Qty</th>' +
              '<th>Warehouse Available Qty</th>' +
              '<th>Dandenong Available QTY</th>' +
              '<th>Reservoir Available QTY</th> ' +
              '<th>Hoppers Available QTY</th> ' +
              '<th>Damage Stock</th>'+
              '</tr>' +
              '</thead>';
    return content;
}

function TableRow(result) {
    let content = '';
    if (result != null) {
        $(result).each(function (index, element) {

            var saleStock = '', trcolor = '';

            saleStock = parseInt(element.WareStock) - parseInt(element.SaleQty);

            content += '<tr>' +
                '<td class="head"><a href="#" class="itemhead">' + element.ItemCode + '</a><input type="hidden" value="' + element.IHeadId + '" /></td>' +
              //  '<td >' + element.ItemCode + '</td>' +
                '<td >' + element.ItemName + '</td>' +
                '<td >' + element.WareStock + '</td>' +
                '<td >' + saleStock + ' </td>' +
                '<td >' + element.TStock + '</td>' +
                '<td >' + element.TCheckOut + '</td>' +
                '<td >' + element.TAvailable + '</td>' +
                '<td >' + element.InComing + '</td>' +
        '</tr>';
        });
    }
    return content;
}

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
    var urlpath = base + ControllerStock + "/GetStockByItemCode";
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
              '<th>Item name</th>' +
              '<th>Warehouse Total Qty</th>' +
              '<th>Warehouse Available Qty</th>' +
              '<th>Dandenong Available QTY</th>' +
              '<th>Reservoir Available QTY</th> ' +
              '<th>Hoppers Available QTY</th> ' +
              '<th>Damage Stock</th>';
    var textRange, rows = '';
    tab = document.getElementById('demo-dtable-04');
    tab_text = tab_text + tdhead + "</tr>";
    var tableData = $('#demo-dtable-04 tr:gt(0)');
    for (var i = 0; i < tableData.length; i++) {

        let rcolor = '';
        rcolor = tableData[i].cells[1].style.cssText;
        rows += '<tr>'
            + '<td>' + tableData[i].cells[0].innerText + '</td>'
            + '<td>' + tableData[i].cells[1].innerText + '</td>'
            + '<td>' + tableData[i].cells[2].innerText + '</td>'
            + '<td>' + tableData[i].cells[3].innerText + '</td>'
            + '<td>' + tableData[i].cells[4].innerText + '</td>'
            + '<td>' + tableData[i].cells[5].innerText + '</td>'
            + '<td>' + tableData[i].cells[6].innerText + '</td>'
            + '<td>' + tableData[i].cells[6].innerText + '</td>'

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
        worksheet: "Stock List Location Wise" || 'Worksheet',
        table: tab_text
    }
    var a = document.createElement('a');
    // window.location.href = data_type + base64(format(template, ctx));
    a.href = data_type + base64(format(template, ctx));
    //setting the file name
    a.download = 'StockList_Locationwise.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
}