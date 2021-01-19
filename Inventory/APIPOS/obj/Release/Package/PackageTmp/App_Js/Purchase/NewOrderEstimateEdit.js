var count = 0, Controller = "POConsumption";

$("span#sidebar-toggle").trigger('click');
$('.date').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtFrom').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
$('#txtTo').datepicker({ dateFormat: 'dd-M-yy', minDate: new Date() });
$('#txtTo').datepicker('setDate', new Date());
$('#demo-dtable-04').DataTable({
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
});
Loaddatatable();



function Loaddatatable() {
    var urlpath = base + Controller + "/GetNewOrderEstimateData";

    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $('#divTable').empty();
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $('#divTable').empty();
                $.pnotify({ text: result.Error, type: 'error' });
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
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1
    });
   // $('#demo-dtable-04').dataTable();
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th width="7%">#SL</th>' +
              '<th width="45%">Menufacturar</th>' +
              '<th width="15%">PO Number</th>' +
              '<th width="10%">Date</th>' +
              '<th width="10%">Edit</th>' +
              '<th width="10%">Remove</th>' +
              '</thead>';
    return content;
}



function TableRow(result) {
    let content = '';
    if (result.length > 0) {
        var olist = result;
        var color = '', btn = '', btnval = '';  //background-color: #7aff00 !important;
        $(olist).each(function (index, element) {

            //if (element.PORecvStatus == "Received") {
            //    color = 'btn-success', btn = 'disabled'; btnval = 'Delivered';
            //} else { color = 'btn-primary'; btn = ''; btnval = 'PO Edit'; }
            content += '<tr>' +
                '<td> ' + (index + 1) + '</td>' +
                '<td>' + element.Manufacturer + '<input type="hidden" value="' + element.ManufacturerId + '" /></td>' +
                '<td>' + element.Description + '</td>' +
                '<td>' + element.Category + '<input type="hidden" value="' + element.FileName + '" /></td>' +
                '<td><input type="button" class="btn btn-primary Edit" id="' + element.IHeadId + '" style="width: 80px;" value="Edit" /></td>' +
                '<td><input type="button" class="btn btn-danger Delete" id="' + element.IHeadId + '" style="width: 80px;" value="Remove" /></td>' +

        '</tr>';
        });
    }
    return content;

}


$('#btnSearch').on('click', function () {
    if ($("#txtFrom").val() !== '') {

        Loaddatatable();
    }
    else {
        $("#txtFrom").focus();
        $.pnotify({ text: "Pls Input From Date..!", type: 'error' });
    }
});

$(document).off('click', '.Edit').on('click', '.Edit', function () {
    var Id = $(this)[0].id;
    var row = $(this).parents('tr')[0];
    var ManufacturerId = row.cells[1].childNodes[1].value;//row.cells[2].textContent;
    var poNo = row.cells[2].textContent;
    var pDate = row.cells[3].textContent;
    var notes = row.cells[3].childNodes[1].value;
    var baseUrl = base + 'POConsumption/POConsumption?Id=' + Id + ' &ManufacturerId=' + ManufacturerId + '&pDate=' + pDate + '&poNo=' + poNo +'&notes='+notes;
    window.location.href = baseUrl;
});

$(document).off('click', '.Delete').on('click', '.Delete', function () {
    var Id = $(this)[0].id;
    if ($("#hfUserName").val() == "Admin") {
        $.msgbox("Are you sure that you want to permanently delete ?", {
            type: "confirm",
            buttons: [
                { type: "submit", value: "Yes" },
                { type: "submit", value: "No" }
            ]
        }, function (result) {
            if (result == "Yes") {
                let obj = {
                    "ManufacturerId": Id
                }
                var urlpath = base + Controller + "/Delete";
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
                            $("#divTable").empty();
                            $.pnotify({ text: 'Delete Successfully', type: 'success' });
                            Loaddatatable();
                        }
                    }
                });
            }
            else if (result == "No") {
                $.pnotify({ text: "Cancel Delete Operation", type: 'info' });
            }
        });
    } else { $.pnotify({ text: "Don't access for you..?", type: 'info' }); }
});


