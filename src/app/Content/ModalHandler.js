$(function () {
    $('.modal').modal();
    $(".modal").on("hide", function () {
        $.each($(".modal-content"), function (key, obj) {
            $(obj.firstElementChild).html(loading_msg);
        });
        $.each($(".modal-footer"), function (key, obj) {
            $(obj.firstElementChild).html("");
        });
    });
    $(".modal").on("show", function () {
        $('[data-toggle="tooltip"]').tooltip('close');
        // Basic Select2 select
        $(".select2").select2({
            dropdownAutoWidth: true,
            width: '100%',
            minimumResultsForSearch: Infinity
        });
    });
});
function InitModal(modal) {
    InitTooltips();
    $(modal).find(".modal-footer").prepend($(modal).find("input[type='submit']").css("display","inline"));
}
function DestroyModal(modal) {
    $(modal).find(".modal-footer").find("input[type='submit']").remove();
    $($(modal).find(".modal-content")[0].children[1]).html(loading_msg);
}
function CloseFormsModal() {
    $(".modal").modal('close');
}

//The prevent forms in modal submit actions
function preventSubmitForm(container, form) {
    Loading_Mostrar(processing_msg, please_wait_msg);
    var form = $(form);
    var actionUrl = form.attr('action');
    var formData = new FormData($(form)[0]);
    $.ajax({
        type: "POST",
        url: actionUrl,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.success != undefined) {
                if (data.success == true) {
                    CloseFormsModal();
                    Swal.fire(data.message, data.message_details || "", data.icon || "success")
                    try {
                        $("table").DataTable().ajax.reload();
                    } catch{
                        location.reload();
                    }
                } else {
                    CloseFormsModal();
                    Swal.fire(data.message, data.message_details || "", data.icon || "error")
                }
            }
            else {
                $(container).html(data);
                InitTooltips();
                InitInputs();
            }
        }
    });
}

function PopupForm_Add(url) {
    Loading_Mostrar(processing_msg, please_wait_msg);
    $("#ModalCreateContent").load(url, function(responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            Loading_Close();
            $("#ModalCreate").modal('open');
        }
        if (statusTxt == "error")
            showDialog_swal(error_occurred_msg,'','error')
    });
}

function PopupForm_Edit(url) {
    Loading_Mostrar(processing_msg, please_wait_msg);
    $("#ModalEditContent").load(url, function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            Loading_Close();
            $("#ModalEdit").modal('open');
        }
        if (statusTxt == "error")
            showDialog_swal(error_occurred_msg, '', 'error')
    });
}

function PopupForm_Permission(url) {
    Loading_Mostrar(processing_msg, please_wait_msg);
    $("#ModalPermissionsContent").load(url, function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") { 
            Loading_Close();
            $("#ModalPermissions").modal('open');

    }
        if (statusTxt == "error")
            showDialog_swal(error_occurred_msg, '', 'error')
    }); 
}

function PopupForm_Details(url) {
    Loading_Mostrar(processing_msg, please_wait_msg);
    $("#ModalDetailsContent").load(url, function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            Loading_Close(); 
            $("#ModalDetails").modal('open');
        }
        if (statusTxt == "error")
            showDialog_swal(error_occurred_msg, '', 'error')
    });
}
