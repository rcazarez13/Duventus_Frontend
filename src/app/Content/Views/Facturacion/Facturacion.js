$(document).ready(function () {

    let btnInvoice = $("#btnInvoice");
    let frmInvoice = $("#frmInvoice");

    let txtInvoice = $("#txtInvoice");
    let txtDate = $("#txtDate");
    let txtTotal = $("#txtTotal");
    let chkRemember = $("#chkRemember");
    let txtRFC = $("#txtRFC");
    let txtUsoCfdi = $("#txtUsoCfdi");
    let txtDomicilioFiscal = $("#txtDomicilioFiscal");
    let txtRegimenFiscal = $("#txtRegimenFiscal");
    let txtNames = $("#txtNames");
    let txtEmail = $("#txtEmail");

    function Init() {
        GetLocalStorage();
        AddClassFormInvoice();
        ButtonInvoiceClick();
    }
    function AddClassFormInvoice() {
        txtRFC.addClass("active");
        txtUsoCfdi.addClass("active");
        txtDomicilioFiscal.addClass("active");
        txtRegimenFiscal.addClass("active");
        txtNames.addClass("active");
        txtEmail.addClass("active");
        txtInvoice.addClass("active");
        txtDate.addClass("active");
        txtTotal.addClass("active");
    }
    function GetLocalStorage() {
        const invoice = JSON.parse(localStorage.getItem("clientData"));
        if (invoice) {
            SetFormInvoice(invoice);
        }
    }
    function SaveLocalStorage() {
        const invoice = GetFormInvoice();
        if (invoice) {
            delete invoice.factura;
            delete invoice.fecha;
            delete invoice.total;
            localStorage.setItem("clientData", JSON.stringify(invoice));
        }
    }
    function GetFormInvoice() {
        const invoice = {
            "factura": txtInvoice.val(),
            "fecha": txtDate.val(),
            "total": txtTotal.val(),
            "rfc": txtRFC.val(),
            "usoCfdi": txtUsoCfdi.val(),
            "domicilioFiscal": txtDomicilioFiscal.val(),
            "regimenFiscal": txtRegimenFiscal.val(),
            "nombre": txtNames.val(),
            "email": txtEmail.val(),
        };
        return invoice;
    }
    function SetFormInvoice(invoice) {
        txtRFC.val(invoice.rfc);
        txtUsoCfdi.val(invoice.usoCfdi);
        txtDomicilioFiscal.val(invoice.domicilioFiscal);
        txtRegimenFiscal.val(invoice.regimenFiscal);
        txtNames.val(invoice.nombre);
        txtEmail.val(invoice.email);
        chkRemember.prop("checked", true);
    }
    function ButtonInvoiceClick() {
        btnInvoice.click(function () {
            if (frmInvoice.valid()) {
                Swal.fire({
                    title: '¿Deseas realizar la factura?',
                    showCancelButton: true,
                    confirmButtonText: 'Si, facturar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        ToGoInvoice();
                    }
                })
            }
        });
    }
    function ToGoInvoice() {
        const invoice = GetFormInvoice();
        const apiUrl = "facturacion/timbrar";
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ factura: invoice }),
        }).then(response => {
            if (response.status === 409) {
                return response.json().then(data => {
                    Swal.fire(data.mensaje)
                    CleanScreen();
                });
            }
            if (response.status === 200) {
                return response.json().then(data => {
                    Swal.fire(data.mensaje)
                    if (chkRemember.is(":checked")) {
                        SaveLocalStorage();
                        CleanScreen();
                        GetLocalStorage();
                        AddClassFormInvoice();
                    }
                });
            }
            if (response.status === 500) {
                return response.json().then(data => {
                    Swal.fire(data.error)
                });
            }
        })
    }
    function CleanScreen() {
        frmInvoice.validate().resetForm();
        frmInvoice[0].reset();
        var errores = document.getElementsByClassName("error");
        for (var i = 0; i < errores.length; i++) {
            errores[i].classList.remove("error");
        }
    }

    Init();
});