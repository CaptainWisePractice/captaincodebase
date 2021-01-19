var Controller = "Employee";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    $wzd_form = $('#wizard-demo-2').validate({ onsubmit: false });
    $('#wizard-demo-2').wizard({
        onStepLeave: function (wizard, step) {
            return $wzd_form.form();
        },
        onBeforeSubmit: function () {
            return $wzd_form.form();
        }
    });
    loadCountry();
    loadDesignation();
    GetEmployeedata();
    GetEmployeeNo();
    $('#wizard-demo-2 .btn-toolbar').remove();
    $('#tbl').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });

});
///// Initial Load Method Start////
function loadCountry() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadCountry",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlCountry'));

            $('#ddlCountry').val('9').trigger('change');
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function loadDesignation() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadDesignation",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlDesignation'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function GetEmployeeNo() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetEmployeeNo",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                $('#txtEmployeeCode').val(result.list[0].EmployeeCode);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function GetEmployeedata() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetEmployeedata",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
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
///// Initial Load Method End////
//// Dropdown load
function LoadDropdown(result, id) {
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    $(id).append(content);
    //$(id).val('').trigger('change');
    $(id).select2();
}
///// Start Table ////
function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableInitialRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#tbl').dataTable({
        "iDisplayLength": -1,
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });
}
function TableHeader() {
    let content = '';
    content = '<table class="table table-striped" id="tbl">' +
       '<thead>' +
              '<tr>' +
              '<th>SL#</th>' +
              '<th>Emp. No</th>' +
              '<th>Name</th>' +
              '<th>Designation</th>' +
              '<th>Address</th>' +
              '<th>Phone No.</th>' +
               '<th>Email</th>' +
              '<th>City</th>' +
              '<th>P.Code</th>' +
              '<th>Status</th>' +
              '<th> Action </th>' +
              '</tr>' +
              '</thead>';
    return content;
}
function TableInitialRow(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            let status = '';
            if (element.IsActive == true) {
                status = 'Active';
            } else { status = 'Inactive';}
            content += '<tr>' +
                '<td><input type="hidden" data-Salutation="' + element.Salutation + '"  data-CardId="' + element.CardId +
                    '" data-CountryID="' + element.CountryID + '" class="hd" data-FilePath="' + element.FilePath +
                    '" data-FileUserName="' + element.FileUserName + '"/>' + (index + 1) +
                '</td>' +
                '<td class="EmployeeCode">' + element.EmployeeCode + '</td>' +
                '<td class="FullName"><input type="hidden" class="FirstName" value="' + element.FirstName +
                    '"/><input type="hidden" class="LastName" value="' + element.LastName + '"/>' + element.FullName + '</td>' +
                '<td class="DesignationName"><input type="hidden" class="DesignationId" value="' + element.DesignationId + '"/>' + element.DesignationName + '</td>' +
                '<td class="Address">' + element.Address + '</td>' +
                '<td class="Phone1"><input type="hidden" class="Phone2" value="' + element.Phone2 +
                        '"/><input type="hidden" class="Phone3" value="' + element.Phone3 + '"/>' + element.Phone1 + '</td>' +
                '<td class="Email"><input type="hidden" class="Fax" value="' + element.Fax +
                    '"/><input type="hidden" class="Website" value="' + element.Website + '"/>' + element.Email + '</td>' +
                //'<td class="Country"><input type="hidden" class="CountryID" value="' + element.CountryID + '"/>' + element.CountryName + '</td>' +
                '<td class="City">' + element.City + '</td>' +
                '<td class="PostalCode"><input type="hidden" class="State" value="' + element.State + '"/>' + element.PostalCode + '</td>' +
                '<td class="isActive">' + status + '</td>' +
                '<td><span data-id="' + element.EmployeeId + '" class="btn btn-small edit"><i class="icon-pencil"></i></span>' +
                    '<span data-id="' + element.EmployeeId + '" class="btn btn-small delete"><i class="icon-trash"></i></span>' +
                '</td>' +
        '</tr>';
        });

    }
    return content;
}
///// End Table ////
///// Start Button Click ////
$331('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        var obj = GetSaveObject();
        var data = new FormData();
        data.append('data', JSON.stringify(obj));
        var $file = document.getElementById('file');

        if ($file.files.length > 0) {
            for (var i = 0; i < $file.files.length; i++) {
                data.append('files', $file.files[i]);
            }
        }
        //var obj = JSON.stringify({ "data": data });
        var urlpath = base + Controller + "/Save";
        $331.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: false,
            processData: false,
            data: data,
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
                    GetEmployeeNo();
                    GetEmployeedata();
                    //BindTable(result.list);
                    ClearData();

                }
            }
        });
    }
});
$('#btnRefresh').on('click', function () {
    window.location.reload();
});
$('#btnCancel').on('click', function () {
    window.history.back();
    //var baseUrl = base + "Home/Index";
    //window.location.href = baseUrl;
});
$(document).off('click', '.edit').on('click', '.edit', function () {
    let tblRow = $(this).closest('tr');
    let id = $(this).attr('data-id');
    setEditData(tblRow, id);

    $('#btnSave').val('Update');
    window.scrollTo(0, 0);
});
$(document).off('click', '.delete').on('click', '.delete', function () {   
    let id = $(this).attr('data-id');
    let obj = {
        "EmployeeId": id
    }
    $.msgbox("Are you sure that you want to permanently delete the selected element?", {
        type: "confirm",
        buttons: [
            { type: "submit", value: "Yes" },
            { type: "submit", value: "No" }
        ]
    }, function (result) {
        if (result == "Yes") {
            $("#divTable").empty();
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
                        GetEmployeedata();
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
    });
});
///// End Button Click ////
function fileSelected() {    
    var file = document.getElementById('file').files[0];
    if (file) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    document.getElementById('divImgPreview').innerHTML = ['<img src="', e.target.result, '" class="clsMyImage" alt="', theFile.name, '" title="', theFile.name, '" style="width:100px; height:100px;"/>'].join('');
                };
            })(file);
            reader.readAsDataURL(file);
        } else {
            alert('Pls upgrade your browser,HTML5 is not supported');
        };
    }
}
///// Random Method Start ////
function setEditData(tblRow, id) {

    let EmployeeCode = $(tblRow).find('.EmployeeCode').text();
    let FirstName = $(tblRow).find('.FirstName').val();
    let LastName = $(tblRow).find('.LastName').val();
    let Salutation = $(tblRow).find('.hd').attr('data-Salutation');
    let CountryID = $(tblRow).find('.hd').attr('data-CountryID');
    let Email = $(tblRow).find('.Email').text();
    let CardId = $(tblRow).find('.hd').attr('data-CardId');
    let Address = $(tblRow).find('.Address').text();
    let DesignationId = $(tblRow).find('.DesignationId').val();
    let Phone1 = $(tblRow).find('.Phone1').text();
    let Phone2 = $(tblRow).find('.Phone2').val();
    let Phone3 = $(tblRow).find('.Phone3').val();
    let Fax = $(tblRow).find('.Fax').val();
    let Website = $(tblRow).find('.Website').val();
    let City = $(tblRow).find('.City').text();
    let PostalCode = $(tblRow).find('.PostalCode').text();
    let State = $(tblRow).find('.State').val();
    let isActive = ($(tblRow).find('.isActive').text().trim() == "Active") ? true : false;
  //  let IsActive = ($(tblRow).find('.IsActive').text() === 'true');
    let FilePath = $(tblRow).find('.hd').attr('data-FilePath');
    let FileUserName = $(tblRow).find('.hd').attr('data-FileUserName');    
    let image = '<img longdesc="" src="' + FilePath + '" class="clsMyImage" alt="' + FileUserName + '" title="' + FileUserName + '" style="width:100px; height:100px;"/>';
    $('#divImgPreview').empty();
    $('#divImgPreview').append(image);
    $('#txtEmployeeCode').val(EmployeeCode);
    $('#txtEmployeeId').val(id);
    $('#txtFirstName').val(FirstName);
    $('#txtSalutation').val(Salutation);
    $('#txtEmail').val(Email);
    $('#txtCardId').val(CardId);
    $('#txtLastName').val(LastName);
    $('#txtAddress').val(Address);
    $('#txtPhone1').val(Phone1);
    $('#txtPhone2').val(Phone2);
    $('#txtPhone3').val(Phone3);
    $('#txtCity').val(City);
    $('#txtState').val(State);
    $('#txtPostalCode').val(PostalCode);
    $('#ddlDesignation').val(DesignationId).trigger('change');
    $('#ddlCountry').val(CountryID).trigger('change');
    $('#txtFax').val(Fax);
    $('#txtWebsite').val(Website);
    $.uniform.update(
          $('#chkIsActive').attr("checked", isActive)
      );
}
///// Random Method End ////
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#txtLastName').val() == '') {
        $('#txtLastName').css({ 'border': '1px solid red' });
        $('#txtLastName').focus();
        $.pnotify({ text: 'Last Name Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#txtLastName').css({ 'border': '1px solid #aaa' }); }
    if ($('#ddlCountry').val() == '-1') {
        $('#s2id_ddlCountry').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Country Requried', type: 'error' });
        // $('#ddlcategory').focus();
        valid = false;
        return valid;
    } else { $('#s2id_ddlCountry').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }

    //$("#tbl tbody tr").each(function () {
    //    let rowId = $(this).find('.delete').attr('data-id');
    //    let hdId = $('#txtEmployeeId').val();
    //    if (rowId != hdId) {
    //        let CustCode = $(this).find('.EmployeeCode').text().trim();
    //        let txtCustCode = $('#txtCustCode').val().trim();
    //        if (CustCode == txtCustCode) {
    //            $.pnotify({ text: 'Customer No Already Exist', type: 'error' });
    //            valid = false;
    //            return valid;
    //        }
    //    }
    //});
    return valid;
}
///// Validation End ////
///// Create Object ////
function GetSaveObject() {
    let obj = {
        "EmployeeCode": $('#txtEmployeeCode').val(),
        "EmployeeId": $('#txtEmployeeId').val(),
        "FirstName": $('#txtFirstName').val(),
        "Salutation": $('#txtSalutation').val(),
        "LastName": $('#txtLastName').val(),
        "CardId": $('#txtCardId').val(),
        "Address": $('#txtAddress').val(),
        "DesignationId": $('#ddlDesignation').val(),
        "Phone1": $('#txtPhone1').val(),
        "Phone2": $('#txtPhone2').val(),
        "Phone3": $('#txtPhone3').val(),
        "City": $('#txtCity').val(),
        "State": $('#txtState').val(),
        "PostalCode": $('#txtPostalCode').val(),
        "CountryID": $('#ddlCountry').val(),
        "Fax": $('#txtFax').val(),
        "Email": $('#txtEmail').val(),
        "Website": $('#txtWebsite').val(),
        "IsActive": $('#chkIsActive').is(":checked")
    }
    return obj;
}
///// End Object ////
///// Clear Data Start ////
function ClearData() {
    //$('#txtEmployeeCode').val('');
    $('#txtEmployeeId').val('');
    $('#txtCardId').val('');
    $('#txtSalutation').val('');
    $('#txtLastName').val('');
    $('#txtEmail').val('');
    $('#txtCardId').val('');
    $('#txtFirstName').val('');
    $('#txtAddress').val('');
    $('#txtPhone1').val('');
    $('#txtPhone2').val('');
    $('#txtPhone3').val('');
    $('#txtCity').val('');
    $('#txtState').val('');
    $('#txtPostalCode').val('');
    $('#txtFax').val('');
    $('#txtWebsite').val('');
    $('#ddlDesignation').val('-1').trigger('change');
    $('#ddlCountry').val('-1').trigger('change');
    document.getElementById('file').value = "";
    $.uniform.update(
           $('#chkIsActive').attr("checked", true)
       );
    $('#divImgPreview').empty();
    $('#btnSave').val('Save');
}
///// Clear Data End ////

$(document).off('change', '#txtEmail').on('change', '#txtEmail', function () {
    if ($(this).val() !== '') {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if ($(this).val().match(mailformat)) {
            return true;
        }
        else {
            alert("You have entered an invalid Email address.!");
            $(this).val('');
            return false;
        }
    }
});
