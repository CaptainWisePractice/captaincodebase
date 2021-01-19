var Controller = 'ItemTransHistory';
 $("span#sidebar-toggle").trigger('click');

 $('#ddlHead').select2();

 LoadItem();
 loadItemHead();
 //$('#demo-dtable-04').DataTable({
 //    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
 //});
 function LoadItem() {

    var urlpath = base + Controller + "/GetAllItemHistory";
    
    let obj = {
        "IHeadId": $('#ddlHead').val() === '-1' ? '0' : $('#ddlHead').val()
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
       // async: false,
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

   
    //if ($('#demo-dtable-04 tr').length > 9) {
    //    new FixedHeader(tbl);
    //}
    //else { $("div").removeClass("FixedHeader_Cloned fixedHeader FixedHeader_Header"); } // FixedHeader_Cloned fixedHeader FixedHeader_Header}

    //  $('#demo-dtable-04').dataTable();
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th style="width:100px;">Item Number</th>' +
              '<th>Item Description</th>' +
              '<th>Stock</th>'+
              //'<th>ChkOut</th>' +
              '<th>Warhouse Stock</th> ' +
              //'<th>Awat. Des.</th> ' +
              '<th>War. Avail</th>' +
              '<th>Min Level </th> '+
              '<th>Max Level</th>' +
              '<th> Length </th> ' +
              '<th> Width</th>' +
              '<th> Height </th> ' +
              '<th> Weight</th>' +
              '<th> CBM </th>' +
              '<th style="width:150px;"> Manufacturer </th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableRow(result) {
    let content = '';
    if (result != null) {
       
        $(result).each(function (index, element) {
            
            content += '<tr>' +
                '<td >' + element.ItemCode + '</td>' +
                '<td >' + element.ItemName + '</td>' +
                '<td >' + element.TStock + '</td>' +
                //'<td >' + element.TCheckOut + '</td>' +
                '<td >' + element.TAvailable + '</td>' +
                //'<td >' + element.SaleQty + '</td>' +
                '<td >' + element.WareStock + '</td>' +
                '<td >' + element.MinStockLevel + '</td>' +
                '<td >' + element.MaxStockLevel + '</td>' +
                '<td >' + element.Length + '</td>' +
                '<td >' + element.Width + '</td>' +
                '<td >' + element.Height + '</td>' +
                '<td >' + element.Weight + '</td>' +
                '<td >' + element.CBM + '</td>' +
                '<td >' + element.Manufacturer + '</td>' +
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
    var tdhead = '<th>Item Number</th>' +
              '<th>Item Description</th>' +
              '<th>Stock</th>'+
              '<th>Total Ware. Avail</th> ' +
              '<th>War. Avail</th>' +
              '<th>Min Level </th> '+
              '<th>Max Level</th>' +
              '<th> Length </th> ' +
              '<th> Width</th>' +
              '<th> Height </th> ' +
              '<th> Weight</th>' +
              '<th> CBM </th>' +
              '<th> Manufacturer </th>';
    var textRange; rows = '';
    tab = document.getElementById('demo-dtable-04');
    tab_text = tab_text + tdhead + "</tr>";
    var tableData = $('#demo-dtable-04 tr:gt(0)');
    for (var i = 0; i < tableData.length; i++) {

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
        worksheet: "Stock List Details" || 'Worksheet',
        table: tab_text
    }
    var a = document.createElement('a');
    // window.location.href = data_type + base64(format(template, ctx));
    a.href = data_type + base64(format(template, ctx));
    //setting the file name
    a.download = 'Stock_List_Details.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
}