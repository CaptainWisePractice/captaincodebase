var count = 0, Controller = "PurchaseOrder"; CurController = "PurchaseOrderEdit";

$("span#sidebar-toggle").trigger('click');

$('.date').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtFrom').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
$('#txtTo').datepicker({ dateFormat: 'dd-M-yy'});
$('#txtTo').datepicker('setDate', new Date());


Loaddatatable("In");

$('#demo-dtable-04').DataTable({
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
});


function Loaddatatable(type) {
    var urlpath = base + Controller + "/GetPurchaseOrderEditData";

    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate, "type": type }),
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
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1
    });
    //$('#demo-dtable-04').dataTable();
}
function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
              '<tr>' +
             ' <th width="15%">Supplier Name</th>' +
               '<th width="8%">PI No</th>' +
              '<th width="8%">Order Value</th>' +
               '<th width="8%">Order Date</th>' +
               '<th width="8%">Dep. Amount</th>' +
               '<th width="8%">Dep. Date</th>' +
                '<th width="6%">CBM</th>' +
                '<th width="10%">Prod. Finish Date</th>' +
                '<th width="8%">Balance Due</th>' +
                '<th width="8%">Date Of Loading</th>' +
                '<th width="10%">Order Status</th>' +
                '<th>Edit</th>' +
                '<th></th>' +
              '</thead>';
    return content;
}


function TableRow(result) {
    let content = '';
    if (result.length > 0) {
        var olist = result;
        var color = '', btn = '', btnval = '';  //background-color: #7aff00 !important;
        $(olist).each(function (index, element) {
         
            if (element.Description == "Delivered") {
                //success
                color = 'btn-inverse', btn = 'disabled'; btnval = 'Delivered';
            } else {
                if (element.Description == "Complete") {
                    color = 'btn-success'; btn = ''; btnval = 'PO Complete';
                }
                else { color = 'btn-primary'; btn = ''; btnval = 'PO Edit'; }
            }

            content += '<tr>' +
                '<td>' + element.ManufacturerName + '<input type="hidden" value="' + element.ManufacturerId + '" /></td>' +
                '<td>' + element.PINumber + '</td>' +
                '<td> $' + element.TotalAmount + '</td>' +
                '<td>' + element.PODate + '</td>' +
                '<td> $' + element.DepAmountUSD + '</td>' +
                '<td>' + element.DepositDate + '</td>' +
                '<td>' + element.PONumber + '</td>' +
                '<td>' + element.ProductionEndDate + '</td>' +
                '<td> $' + element.DepAmountAUD + '</td>' +
                '<td>' + element.DateOfLoading + '</td>' +
                '<td>' + element.Description + '</td>' +
                '<td><input type="button" class="btn ' + color + '  POEdit"  id="' + element.POMasterId + '" style="width: 85px;" value="' + btnval + '" /></td>' +
                '<td><input type="button" ' + btn + ' class="btn btn-danger Delete" id="' + element.POMasterId + '" style="width: 15px;" value="X" /></td>' +

        '</tr>';
        });
    }
    return content;

}

$('#btnSearch').on('click', function () {
    if ($("#txtFrom").val() !== '') {

        Loaddatatable("Ser");
    }
    else {
        $("#txtFrom").focus();
        $.pnotify({ text: "Pls Input From Date..!", type: 'error' });
    }
});

$(document).off('click', '.POEdit').on('click', '.POEdit', function () {
   
    let status = $(this).val();
    var POMasterId = $(this)[0].id;
    var row = $(this).parents('tr')[0];
    var ManufacturerId = row.cells[0].childNodes[1].value;//row.cells[2].textContent;
    var baseUrl = base + 'PurchaseOrder/PurchaseOrder?POMasterId=' + POMasterId + ' &ManufacturerId=' + ManufacturerId + ' &Status=' + status;
    window.location.href = baseUrl;
});

$(document).off('click', '.Delete').on('click', '.Delete', function () {
    var POMasterId = $(this)[0].id;
   // if ($("#hfUserName").val() == "Admin") {
        $.msgbox("Are you sure that you want to permanently delete ?", {
            type: "confirm",
            buttons: [
                { type: "submit", value: "Yes" },
                { type: "submit", value: "No" }
            ]
        }, function (result) {
            if (result == "Yes") {
                let obj = {
                    "POMasterId": POMasterId
                }
                var urlpath = base + CurController + "/Delete";
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
                            Loaddatatable("In");
                        }
                    }
                });
            }
            else if (result == "No") {
                $.pnotify({ text: "Cancel Delete Operation", type: 'info' });
            }
        });
   // } else { $.pnotify({ text: "Don't access for you..?", type: 'info' }); }
});


