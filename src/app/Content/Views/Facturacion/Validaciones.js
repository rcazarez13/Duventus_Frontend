$(document).ready(function () {

    function Init() {
        Validations();
    }

    function RFCRegex() {
        $.validator.addMethod("rfcRegex", function (value, element) {
            // Expresión regular para validar RFC
            var regex = /^(?:[A-Z&Ñ&]{3,4})(?:\d{2})(?:(?:0[1-9])|(?:1[0-2]))(?:(?:0[1-9]|[12]\d|3[01]))[A-Z0-9&\d]{3}$/i;
            return this.optional(element) || regex.test(value);
        }, "Ingresa un RFC válido");
    }
    function TotalRegex() {
        $.validator.addMethod("totalRegex", function (value, element) {
            // Expresión regular para validar montos
            var regex = /^\d+(\.\d{2})?$/;
            return this.optional(element) || regex.test(value);
        }, "Ingresa un total válido Ejemplo: 100.10");
    }
    function EmailRegex() {
        $.validator.addMethod(
            "emailRegex",
            function (value, element) {
                // Define aquí tu expresión regular para validar correos electrónicos
                var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                return this.optional(element) || regex.test(value);
            },
            "Ingresa un correo electrónico válido."
        );
    }
    function Validations() {
        TotalRegex();
        RFCRegex();
        EmailRegex();
        $("#frmInvoice").validate({
            rules: {
                txtInvoice: {
                    required: true
                },
                txtDate: {
                    required: true
                },
                txtTotal: {
                    required: true,
                    totalRegex: true
                },
                txtRFC: {
                    required: true,
                    rfcRegex: true
                },
                txtUsoCfdi: {
                    required: true
                },
                txtDomicilioFiscal: {
                    required: true
                },
                txtRegimenFiscal: {
                    required: true
                },
                txtNames: {
                    required: true
                },
                txtEmail: {
                    required: true,
                    email: true,
                    emailRegex: true
                }
            },
            messages: {
                txtInvoice: {
                    required: "El número de la factura es requerido"
                },
                txtDate: {
                    required: "La fecha es requerida",
                },
                txtTotal: {
                    required: "El total de venta es requerido",
                },
                txtUsoCfdi: {
                    required: "El uso de cfdi es requerido",
                },
                txtDomicilioFiscal: {
                    required: "El domicilio fiscal es requerido",
                },
                txtRegimenFiscal: {
                    required: "El regimen fiscal es requerido",
                },
                txtNames: {
                    required: "El nombre completo requerido",
                },
                txtEmail: {
                    required: "El correo electrónico es requerido",
                    email: "Ingrese un correo electrónico válido"
                }
            }
        });
    }

    Init();
});