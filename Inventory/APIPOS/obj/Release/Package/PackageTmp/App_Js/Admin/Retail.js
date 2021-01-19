var Controller = "SellingPriceSetup", ItemController = "ItemEntry";
$("span#sidebar-toggle").trigger('click'); var fdata;

$(document).ready(function () {
    // $("#SellPriceModal").css("display", "none");
    loadModal();
    $('#ddlHead').select2();
    getSellingPrice();
   // loadItemHead();

    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });


});


// Initial Load//

function loadItemHead() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadItemHead",
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
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" data-itype="' + obj.label + '" >' + obj.DisplayName + '</option>';
        });
    }
    id.append(content);
    id.val('-1').trigger('change');
}


function getSellingPrice() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetAllData",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        //  data: JSON.stringify({ "headId": headId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Session Out Please login again', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.list);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

$(document).off('keyup', '.number').on("keyup", ".number", function (event) {
    let w = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(w);
});


$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        let save = $('#btnSave').val();
        if (save == 'Save') {
            DuplicateCheck();
        }
        else { SaveandUpdate(); }
    }
});
$('#btnRefresh').on('click', function () {
    ClearData();
});
$('#btnCancel').on('click', function () {
    window.history.back();
    //var baseUrl = base + "Home/Index";
    //window.location.href = baseUrl;
});

function SaveValidation() {
    let valid = true;
    if ($('#ddlHead').val() == '-1') {
        $('#s2id_ddlHead').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Item Code Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlHead').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    return valid;
}

function SaveandUpdate() {
    var obj = GetSaveObject();
    var urlpath = base + Controller + "/Save";
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
                let save = $('#btnSave').val();
                if (save == 'Save') {
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                }
                else {
                    $.pnotify({ text: 'Update Successfully', type: 'success' });
                }
                ClearData();
                BindTable(result.list);
            }
        }
    });
}

function GetSaveObject() {

    let obj = {
        "SellingPriceId": $('#hfId').val(),
        "IHeadId": $('#ddlHead').val(),
        "Itemtype": $("#ddlHead").find('option:selected').attr("data-itype"),
        "Wholesale": $('#txtWholesale').val(),
        "Offer1": $('#txtWholesale1').val(),
        "Offer2": $('#txtWholesale2').val(),
        "Offer3": $('#txtWholesale3').val(),
        "Retail": $('#txtRetail').val(),
        "Special": $('#txtSpecial').val()
    }
    return obj;
}

function DuplicateCheck() {
    var obj = GetSaveObject();
    var urlpath = base + Controller + "/DuplicateCheck";
    $.ajax({
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (data) {

            if (data.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }

            if (data.Save_error === "True") {
                $.pnotify({ text: 'Already Exits. You Can Update Only.!', type: 'error' });
                return false;
            }
            else { SaveandUpdate(); }
            return false;
        },
        error: function (a, b, c) {
            window.ShowCustomDialog(a, c, "Error in saving Data");
        }
    });

}

function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableInitialRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#tbl').dataTable({
        "iDisplayLength": -1
    });
}
function TableHeader() {
    let content = '';


   
        content = '<table class="table table-striped" id="tbl">' +
            '<thead>' +
            '<tr>' +
          /*  '<th>SL#</th>' +*/
            '<th>Item Code</th>' +
            '<th>Item Name</th>' +
            /*'<th>Offer 2(Ex)</th>' +
            '<th>Offer 3(Inc)</th>' +
            <th>Whole Sale(Ex)</th>' +*/
            '<th>Retail 2020-1</th>' +
            '<th>Special 2020-1</th>' +
            /*'<th> Action </th>' +*/
            '</tr>' +
            '</thead>';
        return content;
    
   
       
}
function TableInitialRow(result) {
    let content = '';
    result.sort(function (a, b) {
        var nameA = a.ItemName.toLowerCase(), nameB = b.ItemName.toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    });
    if (result != undefined) {
       
            $(result).each(function (index, element) {
                content += '<tr>' +
                 /*   '<td>' + (index + 1) + '</td>' +*/
                    '<td class="head"><input type="hidden" class="IHeadId" value="' + element.IHeadId + '"/>' + element.IHeadCode + '</td>' +
                    /* '<td class="price1"><input type="hidden" class="SellingPriceId" value="' + element.SellingPriceId + '"/>' + element.Offer1 + '</td>' +
                     '<td class="price2">' + element.Offer2 + '</td>' +
                     '<td class="price3">' + element.Offer3 + '</td>' +
                     '<td class="price">' + element.Wholesale + '</td>' +*/
                    '<td class="special">' + element.ItemName + '</td>' +
                    '<td class="retail">$' + element.Retail + '</td>' +
                    '<td class="special">$' + element.Special + '</td>' +
                    /*'<td><span data-id="' + element.SellingPriceId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                    '<span data-id="' + element.SellingPriceId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
                    '</td>' +*/
                    '</tr>';
            });

            return content;


        
       

           

        


    }
}

function ClearData() {
    $('#ddlHead').val('-1').trigger('change');
    $('#txtWholesale').val('');
    $('#txtWholesale1').val('');
    $('#txtWholesale2').val('');
    $('#txtWholesale3').val('');
    $('#txtRetail').val('');
    $('#txtSpecial').val('');
    $('#hfId').val('0');
    $('#btnSave').val('Save');
}

$(document).off('click', '.edit').on('click', '.edit', function () {
    let tblRow = $(this).closest('tr');

    let id = $(this).attr('data-id');
    let IHeadId = $(tblRow).find('.IHeadId').val();
    let price = $(tblRow).find('.price').text();
    let price1 = $(tblRow).find('.price1').text();
    let price2 = $(tblRow).find('.price2').text();
    let price3 = $(tblRow).find('.price3').text();
    let retail = $(tblRow).find('.retail').text();
    let special = $(tblRow).find('.special').text();
    $('#hfId').val(id);
    $('#ddlHead').val(IHeadId).trigger('change');
    $('#txtWholesale').val(price);
    $('#txtWholesale1').val(price1);
    $('#txtWholesale2').val(price2);
    $('#txtWholesale3').val(price3);
    $('#txtRetail').val(retail);
    $('#txtSpecial').val(special);
    window.scrollTo(0, 0);
    $('#btnSave').val('Update');
});
$(document).off('click', '.delete').on('click', '.delete', function () {
    let id = $(this).attr('data-id');
    $.msgbox("Are you sure that you want to permanently delete ?", {
        type: "confirm",
        buttons: [
            { type: "submit", value: "Yes" },
            { type: "submit", value: "No" }
        ]
    }, function (result) {
        if (result == "Yes") {
            $("#divTable").empty();

            let obj = {
                "SellingPriceId": id
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
                        $.pnotify({ text: 'Delete Successfully', type: 'success' });
                        BindTable(result.list);
                    }
                }
            });
        }
        else if (result == "No") {
            $.pnotify({ text: "Cancel Delete Operation", type: 'info' });
        }

    }
    );
});

$("#btnExportToExcel").click(function () {
    exportToExcel(this, '#tbl');
});

function exportToExcel() {

    var tab_text = "<tr>";
    var tdhead = '<th>SL</th>' +
        '<th>ItemCode</th>' +
        '<th>Offer1(Ex)</th>' +
        '<th>Offer2(Ex)</th>' +
        '<th>Offer3(Inc)</th>' +
        '<th>WholeSale(Ex) </th>' +
        '<th>Retail(Inc)</th> ' +
        '<th>Special(Inc)</th> ' +
        '<th>SellingPriceId</th>';

    var textRange; rows = '';
    tab = document.getElementById('tbl');
    tab_text = tab_text + tdhead + "</tr>";
    var tableData = $('#tbl tr:gt(0)');
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
            + '<td>' + tableData[i].cells[2].firstElementChild.value + '</td>'
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
        worksheet: "Selling Price List" || 'Worksheet',
        table: tab_text
    }
    var a = document.createElement('a');
    // window.location.href = data_type + base64(format(template, ctx));
    a.href = data_type + base64(format(template, ctx));
    //setting the file name
    a.download = 'Selling_Price_List.xls';
    //triggering the function
    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();
}

//$331('#btnPopUpload').on('click', function () {
//    var data = new FormData();
//    var $file = document.getElementById('file');

//    Papa.parse(file, {
//        header: true,
//        dynamicTyping: true,
//        complete: function (results) {
//            data = results;
//        }
//    });
//    debugger;
//    if ($file.files.length > 0) {
//        $("#SellPriceModal").css("display", "none");
//        for (var i = 0; i < $file.files.length; i++) {
//            data.append('Excelfile', $file.files[i]);
//        }
//        var ff = $file.files[0].name.split(/\.(?=[^\.]+$)/);
//        let extension = ff[1];
//        if (extension == "xlsx" || extension == "xls") {
//            var urlpath = base + Controller + "/ExcelUpload";
//            $331.ajax({
//                beforeSend: function () { $.blockUI(); },
//                complete: function () { $.unblockUI(); },
//                type: "POST",
//                url: urlpath,
//                contentType: false,
//                processData: false,
//                data: data,
//                success: function (result) {
//                    if (result.IsSessionOut != null) {
//                        $.pnotify({ text: result.IsSessionOut, type: 'info' });
//                        document.getElementById('file').value = "";
//                        return false;
//                    } else if (result.Error != null && result.Error != "") {
//                        $.pnotify({ text: result.Error, type: 'error' });
//                        document.getElementById('file').value = "";
//                        return false;
//                    } else {
//                        $.pnotify({ text: 'File Upload Successfully', type: 'success' });
//                        document.getElementById('file').value = "";
//                        getSellingPrice();
//                    }
//                }
//            });
//        } else {
//            $.pnotify({ text: 'Please Choose Excel file !.', type: 'error' });
//            document.getElementById('file').value = "";
//        }
//    } else { $.pnotify({ text: 'Please Choose File !.', type: 'error' }); }
//});


$331('#btnPopUpload').on('click', function () {
    var objLst = '';
    var $file = document.getElementById('file');
    if ($file.files.length > 0) {
        var ff = $file.files[0].name.split(/\.(?=[^\.]+$)/);
        let extension = ff[1];
        if (extension == "csv") {
            Papa.parse($file.files[0], {
                header: true,
                complete: function (results) {
                    objLst = results.data;
                    $("#SellPriceModal").css("display", "none");
                    uploadcsv(objLst);
                }
            });
        } else {
            $.pnotify({ text: 'Please Choose CSV file !.', type: 'error' });
            document.getElementById('file').value = "";
        }
    } else { $.pnotify({ text: 'Please Choose CSV File !.', type: 'error' }); }
});

function uploadcsv(objLst) {
    var urlpath = base + Controller + "/ExcelUpload";
    $331.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "objLst": objLst }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                document.getElementById('file').value = "";
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                document.getElementById('file').value = "";
                return false;
            } else {
                $.pnotify({ text: 'CSV File Upload Successfully', type: 'success' });
                document.getElementById('file').value = "";
                $('#divImgPreview').empty();
                getSellingPrice();
            }
        }
    });
}

// File Show for Upload ///

function fileSelected() {
    let prevImg = '';
    let src = $($('#divImgPreview').children()).attr('src');
    if (src != undefined) {
        if ($($('#divImgPreview').children()).attr('src').split('/')[1] == 'Uploads') {
            prevImg = src;
        }
        else {
            prevImg = $($('#divImgPreview').children()).attr('data-previmg');
        }
    }

    var file = document.getElementById('file').files[0];
    if (file) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    document.getElementById('divImgPreview').innerHTML = ['<img src="', e.target.result, '" data-prevImg="' + prevImg + '" class="clsMyImage" alt="', theFile.name, '" title="', theFile.name, '" style="width:100px; height:100px;"/>'].join('');
                };
            })(file);
            reader.readAsDataURL(file);
        } else {
            alert('Pls upgrade your browser,HTML5 is not supported');
        };
    }
}

function loadModal(parameters) {

    // When the user clicks the button, open the modal 
    $("#btnImport").click(function (parameters) {
        $("#SellPriceModal").css("display", "block");

    });


    // When the user clicks on <span> (x), close the modal
    $(document).on('click', '#btnPopCancel', function (parameters) {
        document.getElementById('file').value = "";
        $('#divImgPreview').empty();
        $("#SellPriceModal").css("display", "none");
    });
}