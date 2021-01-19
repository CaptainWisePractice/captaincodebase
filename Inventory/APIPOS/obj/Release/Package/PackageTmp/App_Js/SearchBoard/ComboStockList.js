var Controller = 'ComboStockList';
$("span#sidebar-toggle").trigger('click');
$('#ddlHead').select2();
//loadItemHead();
LoadItem();

function LoadItem() {
    var urlpath = base + Controller + "/GetStockComboItem";
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
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Item Code</th>' +
              '<th>Item Description</th>' +
              '<th>Warehouse Avail(QTY)</th>' +
              '<th>Dandenong Avail(QTY)</th>' +
              '<th>Reservoir Avail(QTY)</th>' +
              '<th>Hoppers Avail(QTY)</th> ' +
              '<th>Incoming</th> ' +
              '<th>Production</th>' +
              '<th>Combo RRP</th>' +
              '<th>Combo Special</th>' +
              '<th>Status</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableRow(result) {
    let content = '';
    if (result != null) {
        $(result).each(function (index, element) {
            if (element.IsActive == 1) {
                status = 'Continue';
            } else { status = 'Discontinue'; }

            content += '<tr>' +
               // '<td class="head"><a href="#" class="itemhead">' + element.ItemCode + '</a><input type="hidden" value="' + element.IHeadId + '" /></td>' +
                '<td>' + element.ItemCode + '</td>' +
                '<td>' + element.ItemName + '</td>' +
                '<td>' + element.WareStock + '</td>' +
                '<td>' + element.TStock + '</td>' +
                '<td>' + element.TCheckOut + '</td>' +
                '<td>' + element.TAvailable + '</td>' +
                '<td>' + element.InComing + '</td>' +
                '<td>' + element.InProduction + '</td>' +
                '<td>' + element.Length + '</td>' +
                '<td>' + element.Weight + '</td>' +
                '<td>' + status + '</td>' +
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



$("#btnExportToExcel").click(function () {
    exportToExcel(this, '#demo-dtable-04');
});

function exportToExcel() {

    var tab_text = "<tr>";
    var tdhead ='<th>Item Code</th>' +
              '<th>Item Description</th>' +
              '<th>Warehouse Availability (QTY)</th>' +
              '<th>Dandenong Availability (QTY)</th>' +
              '<th>Reservoir Availability (QTY)</th>' +
              '<th>Hoppers Availability (QTY)</th> ' +
              '<th>Incoming</th> ' +
              '<th>Production</th>' +
              '<th>Combo RRP</th>' +
              '<th>Combo Special</th>' +
              '<th>Status</th>' ;
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
            + '<td>' + tableData[i].cells[7].innerText + '</td>'
            + '<td>' + tableData[i].cells[8].innerText + '</td>'
            + '<td>' + tableData[i].cells[9].innerText + '</td>'
            + '<td>' + tableData[i].cells[10].innerText + '</td>'
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
        worksheet: "Combo Stock List" || 'Worksheet',
        table: tab_text
    }
    var a = document.createElement('a');
    // window.location.href = data_type + base64(format(template, ctx));
    a.href = data_type + base64(format(template, ctx));
    //setting the file name
    a.download = 'Combo_Stock_List.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
}