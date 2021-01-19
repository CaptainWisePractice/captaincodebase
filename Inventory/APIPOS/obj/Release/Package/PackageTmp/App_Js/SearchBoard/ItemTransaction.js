var Controller = 'ItemTransHistory';
$("span#sidebar-toggle").trigger('click');
$('#ddlHead').select2();
$('#ddlItemName').select2();

$('#txtFromDate').datepicker({
    dateFormat: 'dd-M-yy',
    maxDate: new Date(),
    onSelect: function (dateText) {
        $("#txtToDate").val('');
        $("#txtToDate").datepicker("destroy");
        $('#txtToDate').datepicker({
            dateFormat: 'dd-M-yy',
            minDate: new Date(dateText)
        });
    }
});

loadItemHead();

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

$(document).off('change', '#ddlHead').on('change', '#ddlHead', function () {
    if ($(this).val() !== '-1') {
       
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: base + "Common/loadItemByIHeadId",
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "IHeadId": $(this).val() }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                    return false;
                }
                if (result.Error != null) {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                   
                    LoadDropdown(result, $('#ddlItemName'));
                }
            },
            error: function (a, b, c) {
                $.pnotify({ text: 'Something Wrong', type: 'error' });
            }
        });
    }
});

//// Dropdown load
function LoadDropdown(result, id) {

    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    id.append(content);
    id.val('-1').trigger('change');
}


$('#btnSearch').on('click', function () {
    LoadItem();
});
//$('#demo-dtable-04').DataTable({
//    "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]]
//});
function LoadItem() {

    let obj = {
        "IHeadId": $('#ddlHead').val() == '-1' ? '0' : $('#ddlHead').val(),
        "ItemId": $('#ddlItemName').val() == '-1' ? '0' : $('#ddlItemName').val(),
        "FromDate": $('#txtFromDate').val(),
        "ToDate": $('#txtToDate').val()
    }
    var urlpath = base + Controller + "/GetAllItemTransaction";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
      //  async: false,
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
  //  new FixedHeader(tbl);
    //  $('#demo-dtable-04').dataTable();
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Trans Date</th>' +
              '<th>Transection Type</th>' +
              '<th>GateWay</th>' +
              '<th>Item Number</th>' +
              '<th>Item Description</th>' +
              '<th>Quantity</th>' +
             // '<th>Entry Date</th> ' +
              '<th>Site</th> ' +
              '<th>Location</th>' +
              '<th>From Location</th>' +
              '<th>Invoice No</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableRow(result) {
    let content = '';
    if (result != null) {

        $(result).each(function (index, element) {

            content += '<tr>' +
                '<td >' + element.AddDate + '</td>' +
                '<td >' + element.TransectionType + '</td>' +
                '<td >' + element.TransectionName + '</td>' +
                '<td >' + element.ItemCode + '</td>' +
                '<td >' + element.ItemName + '</td>' +
                '<td >' + element.TStock + '</td>' +
               // '<td >' + element.AddDate + '</td>' +
                '<td >' + element.SiteName + '</td>' +
                '<td >' + element.LocName + '</td>' +
                '<td >' + element.FromLoc + '</td>' +
                '<td >' + element.Manufacturer + '</td>' +
                '<td >' + element.Notes + '</td>' +
        '</tr>';
        });
    }
    return content;
}
