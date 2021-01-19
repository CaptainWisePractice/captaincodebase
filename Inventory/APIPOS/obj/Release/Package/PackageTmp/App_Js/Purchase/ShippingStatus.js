var Controller = 'ShippingStatus';
$("span#sidebar-toggle").trigger('click');

LoadShippingData();
$('#demo-dtable-04').DataTable({
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
});
function LoadShippingData() {
    var urlpath = base + Controller + "/GetShippingStatus";

    //let obj = {
    //    "IHeadId": $('#ddlHead').val() === '-1' ? '0' : $('#ddlHead').val()
    //}
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
      //  data: JSON.stringify({ "obj": obj }),
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
                BindTable(result.listPOMaster);
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
        "iDisplayLength": -1
    });
    new FixedHeader(tbl);
    //$('#demo-dtable-04').dataTable();
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th style="display:none"></th>' +
              '<th>PI NO</th>' +
              '<th>Container No</th>' +
              '<th>Shipping Agent</th>' +
              '<th>Shipper</th>' +
              '<th>Shipper Person</th> ' +
              '<th>ITEMS</th> ' +
              '<th>POL</th>' +
              '<th>Sailing Date</th>' +
              '<th>ETA Port</th>' +
              '<th>Payment Status</th>' +
              '<th>Prod. Pics</th>' +
              '<th>Documents</th>' +
              '<th>Bill Of Lading</th>' +
              '<th>ETA(War.)</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableRow(result) {
    let content = '', shipagent ='';
    if (result != null) {
        $(result).each(function (index, element) {
          
            let trcolor = '';
            if (element.ShipingAgentId.trim() == "0") {
                shipagent = "";
            }
            else { shipagent = "$" + element.ShipingAgentId }

            if (element.OrderStatusId == "6")
            { trcolor = 'style="background-color:#007f00 !important;"'; }
            else if (element.OrderStatusId == "5" && element.DepAmountUSD =="0.00")
            {
                trcolor = 'style="background-color:#90EE90 !important;"';
            }
            else if ( parseInt(element.FreeDays) < 11 && element.DepAmountUSD != "0.00") {
                trcolor = 'style="background-color:#FFFF00 !important;"';
            } else
            { trcolor = ''; }

            content += '<tr ' + trcolor + '>' +
                '<td style="display:none">' + element.PONumber + '</td>' +
                '<td >' + element.PINumber + '</td>' +
                '<td >' + element.ContainerNumber + '</td>' +
                '<td >' + shipagent + '</td>' +
                '<td >' + element.ManufacturerName + '</td>' +
                '<td >' + element.ManufacturerId + '</td>' +
                '<td >' + element.Description + '</td>' +
                '<td >' + element.PortOfLoading + '</td>' +
                '<td >' + element.TransitTimeETD + ' </td>' +
                '<td >' + element.TransitTimeETA + ' </td>' +
                '<td >' + element.TotalAmount + ' </td>' +
                '<td >' + element.ProdPicId + ' </td>' +
                '<td>' + element.DocumentId + '</td>' +
                '<td >' + element.BillofLading + '</td>' +
                '<td >' + element.ETAWarehouse + '</td>' +
        '</tr>';
        });
    }
    return content;
}

$("#btnExportToExcel").click(function () {
    exportToExcel(this, '#demo-dtable-04');
});

function exportToExcel() {

    var tab_text = "<tr>";
    var tdhead = '<th>Item Code</th>' +
    '<th>Item Description</th>' +
    '<th>Total Stock</th>' +
    '<th>CheckOut</th>' +
    '<th>Total Warehouse Avail</th> ' +
    '<th>Awating Despatch</th> ' +
    '<th>Warehouse Avail</th>' +
    '<th>Sale Stock</th>' +
    '<th>InComming</th>' +
    '<th>Production</th>' +
    '<th> CBM </th>' +
    '<th> Manufacturer </th>';
    var textRange; rows = '';
    tab = document.getElementById('demo-dtable-04');
    tab_text = tab_text + tdhead + "</tr>";
    var tableData = $('#demo-dtable-04 tr:gt(1)');
    for (var i = 0; i < tableData.length; i++) {
        debugger;
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
            + '<td>' + tableData[i].cells[11].innerText + '</td>'
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
    window.location.href = data_type + base64(format(template, ctx));
}