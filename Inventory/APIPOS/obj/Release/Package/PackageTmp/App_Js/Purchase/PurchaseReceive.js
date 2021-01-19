var Controller = "PurchaseReceive";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    $('.select2').select2();    
    $("#txtFromDate").datepicker({
        dateFormat: 'dd-M-yy',
        onSelect: function (dateText, inst) {
            var selectedDate = new Date(dateText);
            $('#txtToDate').datepicker('option', 'minDate', selectedDate);
        }
    });
    $('.date').datepicker({ dateFormat: 'dd-M-yy' });
    $('#txtFromDate').datepicker('setDate', new Date());
    $('#txtToDate').datepicker('setDate', new Date());
    getDate();
    InialLoad();
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
    let prevDt = todaydate.setDate(todaydate.getDate() - 30);
    //console.log(prevDt.toString('dd-MMM-yyyy'));
    let d = new Date(prevDt);
    var date = day + "-" + monthsArr[month] + "-" + year;
    var fdate = d.getDate() + "-" + monthsArr[d.getMonth()] + "-" + d.getFullYear();
    document.getElementById("txtFromDate").value = fdate;
    document.getElementById("txtToDate").value = date;
}

$('#btnShowOrder').on('click', function () {
    InialLoad();
});

function InialLoad()
{
    let obj = {
        "FromDate": $('#txtFromDate').val(),
        "ToDate": $('#txtToDate').val(),
    }
    var urlpath = base + Controller + "/ShowOrder";
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
                if (result.list != null) {
                    if (result.list.length > 0) {
                        BindTable(result.list);
                    }
                }
            }
        }
    });
}

$(document).off('click', '.Receive').on('click', '.Receive', function () {   
    var url = base + Controller + "/PurchaseReceiveInformation?Id=" + $(this).attr('data-POMasterId');
    window.open(url, '_self');

});
function BindTable(result) {
    let content = '', status ='';
    $('#tbl tbody').empty();
    $(result).each(function (index, element) {
        if (element.PORecvStatus == 'Full') {
            status = 'Received';
            }else{status =element.OrderStatusId;}
        content += '<tr>' +
                       '<td class="PONo">' + element.PONumber + '</td>' +
                       '<td class="PINo">' + element.PINumber + '</td>' +
                       '<td class="PODate">' + element.PODate + '</td>' +
                       '<td class="Manufacture">' + element.ManufacturerName + '</td>' +
                       '<td class="Status">' + status + '</td>'+
                       '<td class="date">' + element.POReceiveDate + '</td>';
        if (element.PORecvStatus == 'Full') {
            content += '<td><input type="button" class="btn btn-inverse" style="width:100px;" disabled value="Received"  /></td>';
        }
        else {
            content += '<td><input type="button" class="btn btn-info Receive" style="width:100px;" data-POMasterId="' + element.POMasterId + '" value="Receive Order" id="btnReceive" /></td>';
        }
                        
        '</tr>';
    });
    $('#tbl tbody').append(content);
}