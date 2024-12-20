$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined && this.attr(name) !== false;
};

$(document).ready(function () {
    InitInputs();
    InitTooltips();
});

//Method used to initialize input fields behaviour
function InitInputs() {

    $(".email_validator").css("text-transform", "");

    $("input").attr("autocomplete", "off"); //Set autocomplete=off to all inputs

    $("input").focus(function () { $(this).select(); });
    $("input").click(function () { $(this).select(); });
    $(".required_quote").remove();
    $('[required]').prev("label").append("<span class='required_quote' data-position='right' title='" + (current_locale == "en" ? "Required field": "Campo Requerido") +"'>&nbsp;*</span>"); //Add '*' to label where input is required

    // Basic Select2 select
    $('.select2').each(function () { //Fit height by input content
        $(this).select2({
            dropdownAutoWidth: true,
            width: '100%',
            minimumResultsForSearch: Infinity, //Remove search input
            tags: $(this).data("tag"), //Get this value (bool) from DOM 
            closeOnSelect: $(this).hasAttr('multiple')
        });
    });

    //Update inputs files as dropify.js
    if (current_locale == "en") {
        $("form input[type='file']")
            .attr("data-allowed-file-extensions", $(this).attr("accept"))
            .dropify({
                messages: {
                    'default': 'Drag and drop a file here or click',
                    'replace': 'Drag and drop or click to replace',
                    'remove': 'Remove',
                    'error': 'Ooops, something wrong happended.'
                },
                error: {
                    'fileSize': 'The file size is too big ({{ value }} max).',
                    'minWidth': 'The image width is too small ({{ value }}}px min).',
                    'maxWidth': 'The image width is too big ({{ value }}}px max).',
                    'minHeight': 'The image height is too small ({{ value }}}px min).',
                    'maxHeight': 'The image height is too big ({{ value }}px max).',
                    'imageFormat': 'The image format is not allowed ({{ value }} only).',
                    'fileExtension': 'The file is not allowed ({{ value }} only).'
                },
            });
    } else {
        $("form input[type='file']")
            .attr("data-allowed-file-extensions", $(this).attr("accept"))
            .dropify();
    }
    try {
        $('.collapsible').collapsible({
            accordion: true
        });
    } catch { }

    $("input[type='email']").addClass("lower"); //Set all email inputs as only lower characters

    //$("input.phone_input").inputmask({
    //    "mask": "(999) 999-9999",
    //    "oncomplete": function () { $(this).addClass("valid") },
    //    "onincomplete": function () { $(this).addClass("invalid") },
    //    "autoUnmask": true,
    //    "removeMaskOnSubmit": true,
    //    "clearMaskOnLostFocus": true
    //});
    try {
        function initializeDatepicker(element) {
            $(element).datepicker({
                format: 'dd/mm/yyyy',
                onCloseEnd: function () {
                    initializeDatepicker(this.el);
                }
            });
        }
        $('.datepicker').each(function () {
            initializeDatepicker(this);
        });
    } catch { }
    try {
    function initializeTimepicker(element) {
            $(element).timepicker({
                twelveHour: false,
                onCloseEnd: function () {
                    initializeTimepicker(this.el);
                }
            });
        }

        $('.timepicker').each(function () {
            initializeTimepicker(this);
        });
    } catch { }

    InitInputEvents();
    try { //This method only works for materialize layout
        M.updateTextFields();//Update materialized inputs to let JS know that input has values
    } catch { }
}
//Method used to set Input events (onChange, onBlur, onFocus, etc)
function InitInputEvents() {
    $("button").on("click", function (e) {
        $(this).blur();
    });

    //Turn off submit on "Enter" key
    $("form").bind("keypress", function (e) {
        if (e.keyCode == 13) { //Prevent enter key
            return false;
        }
    });
    $("input[type='text']").on("keypress", function (e) {
        /* ENTER PRESSED*/
        if (e.keyCode == 13) {
            /* FOCUS ELEMENT */
            var inputs = $(this).parents("form").eq(0).find(":input[type='text']:visible");
            var idx = inputs.index(this); //Get current input index

            if (idx == inputs.length - 1) { //If current input is the last one
                inputs[0].select() //Select the first input field
            } else {
                inputs[idx + 1].focus(); //Focus on next input field
                inputs[idx + 1].select(); //Select it
            }
            return false; //Prevent default action
        }
    });

    //This function allows only numeric values and decimal dot in input fields
    $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^0-9\.]/g, '')); //Replace anything other than digits or decimal dot with empty string
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) { //If key is not '.' or digit
            event.preventDefault(); //Prevent default action
        }
    });

    //This function allows only numeric values in input fields
    $(".allownumeric").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^0-9]/g, '')); //Replace anything other than digits with empty string
        let max_lenght = $(this).data("lenght") || 99;
        if ($(this).val().length < max_lenght) { //If phone number is less than 10 digits
            if ((event.which != 46) && (event.which < 48 || event.which > 57)) { //If key is not a digit
                event.preventDefault(); //Prevent default action
            }
        } else
            return false;
        
    });

    //This function validates phone number input field using regex
    $(".phone_input").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^0-9]/g, '')); //Replace anything other than digits with empty string
        if ($(this).val().length < 10) { //If phone number is less than 10 digits
            if ((event.which != 46) && (event.which < 48 || event.which > 57)) { //If key is not '.' or digit
                event.preventDefault(); //Prevent default action
            }
        } else
            return false;
    });

    //This function adds postal code regex validation
    $("form").validate(); //Validate the form
    jQuery.validator.addClassRules("postal_code", {
        minlength: 5
    }); //Add rule to postal code input fields to have minimum length of 5
    $(".postal_code").attr("minlength", "5"); //Set minimum length of postal code input fields to 5
    $(".postal_code").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^0-9]/g, '')); //Replace anything other than digits with empty string
        if ($(this).val().length < 5) {
            if ((event.which != 46) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        } else {
            return false;
        }
    });
    //This function prevent input white spaces on input field
    $(".non_spaces, input[type='email'], .rfc_validator").on("keypress keyup blur", function (event) {
        if (event.keyCode == 32) {
            return false;
        }
    });
    //This function set input text as upper format
    $(".upper").on("keypress keyup blur", function (event) {
        if (isNaN($(this).val()))
            $(this).val($(this).val().toUpperCase());
    });
    $(".upper").css("text-transform", "uppercase");

    $(".lower").on("keypress keyup blur", function (event) {
        if (isNaN($(this).val()))
            $(this).val($(this).val().toLowerCase());
    });
    //This function set input text to a lower format
    $(".lower_format").each(function (index, element) {
        var text = "";
        element.innerText.split(' ').forEach(function (i, el) {
            text += i.substring(0, 1).toUpperCase() + i.substring(1).toLowerCase() + " ";
        });
        element.innerText = text;
    });
    //This function add email regex validation
    $(".email_validator, input[type='email']").on("blur", function (event) {
        if ($(this).val().trim() != '' && $(this).val() != undefined) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $('#error_valid_email').remove();
            if (!re.test(String($(this).val()).toLowerCase())) {
                $(this).addClass("invalid").after("<span class='danger input_error_msg' id='error_valid_email'> "+ (current_locale == "en"? 'Invalid E-mail format':'Formato de Correo Electrónico invalido')+": (example@domain.com) </span>");
            }
        }
    });
    //This function add email regex validation
    $(".rfc_validator").on("blur", function (event) {
        if ($(this).val().trim() != '' && $(this).val() != undefined) {
            var re = /^(((?!(([CcKk][Aa][CcKkGg][AaOo])|([Bb][Uu][Ee][YyIi])|([Kk][Oo](([Gg][Ee])|([Jj][Oo])))|([Cc][Oo](([Gg][Ee])|([Jj][AaEeIiOo])))|([QqCcKk][Uu][Ll][Oo])|((([Ff][Ee])|([Jj][Oo])|([Pp][Uu]))[Tt][Oo])|([Rr][Uu][Ii][Nn])|([Gg][Uu][Ee][Yy])|((([Pp][Uu])|([Rr][Aa]))[Tt][Aa])|([Pp][Ee](([Dd][Oo])|([Dd][Aa])|([Nn][Ee])))|([Mm](([Aa][Mm][OoEe])|([Ee][Aa][SsRr])|([Ii][Oo][Nn])|([Uu][Ll][Aa])|([Ee][Oo][Nn])|([Oo][Cc][Oo])))))[A-Za-zñÑ&][aeiouAEIOUxX]?[A-Za-zñÑ&]{2}(((([02468][048])|([13579][26]))0229)|(\d{2})((02((0[1-9])|1\d|2[0-8]))|((((0[13456789])|1[012]))((0[1-9])|((1|2)\d)|30))|(((0[13578])|(1[02]))31)))[a-zA-Z1-9]{2}[\dAa])|([Xx][AaEe][Xx]{2}010101000))$/;
            $('#error_valid_rfc').remove();
            if (!re.test(String($(this).val()).toLowerCase())) {
                $(this).addClass("invalid").after("<span class='danger input_error_msg' id='error_valid_rfc'> " + (current_locale == "en" ? 'Invalid RCF Format' : 'RFC invalido')+": ( XXXX000000XX0 / XXX000000XX0 ) </span>");
            }
        }
    });
    $(".rfc_validator").attr("minlength", "12").attr("maxlength", "13"); //Set minimum length of rfc input to 12
    $(".rfc_validator").on("keypress keyup blur", function (event) {
        if ($(this).val().length > 13) {
            return false;
        }
    });
    //uncomment this if you want to use a default image
    //$(".img-user").on("error", function (event) {
    //    if (this.src != '../../Content/Img/Avatar_Error.png') this.src = '../../Content/Img/Avatar_Error.png';
    //});

    $('#main .container button').dblclick(function (e) { //This is used to prevent user make double click on buttons
        e.preventDefault();
    });

    $('textarea').on('input', function () { //Fit height where user type
        $(this).css("height", "");
        this.style.height = this.scrollHeight + 3 + "px";
    });
    $('textarea').each(function () { //Fit height by input content
        $(this).css("height", "");
        this.style.height = this.scrollHeight + 3 + "px";
    });

    $("input[type='checkbox']").change(function () {//Update materialized checkbox
        $(this).val(this.checked); //Set value input checkbox
    });
    $("input[type='checkbox']").each(function (index, item) {//initialize materialized checkbox value
        $(this).val(this.checked); //Set value input checkbox
    });

    //Method used to format input as currency
    $("input[data-type='currency']")
        .attr("data_currency","$").on({
            keyup: function () {
                formatCurrency($(this));
            },
            blur: function () {
                formatCurrency($(this), "blur");
            }
        });
    // Select all input elements with the data-type attribute set to "currency"
    $("input[data-type='currency']").each(function () {
        // Get the value of the data-currency attribute, or default to "$" if it's undefined
        const currency = $(this).data("currency") || "$";
        // Set the placeholder attribute to a string containing the currency symbol and a default value of "1,000,000.00"
        $(this).attr("placeholder", currency + "1,000,000.00");
    });

    $(".wrapper-alert .icon-times").on('click', function (event) {
        $(this).closest(".wrapper-alert").toggleClass("collapsed");
        event.stopImmediatePropagation();
    });
    // Attach click event handler to all 'legend' elements: make all fieldsets collapsables
    // The follow code provides a collapsible behavior for sections with legends.
    $("legend").append("<span class='fas fa-minus'></span>").click(function () {
        var $this = $(this);
        var parent = $this.parent();
        var contents = parent.contents().not(this);
        $this.parent().find("span").remove(); // Remove any existing spans within the parent element
        if (contents.is(':visible')) {
            contents.hide(); // Hide the contents if they are currently visible
            $this.append("<span class='fas fa-plus'></span>"); // Add a plus icon to the legend indicating the contents are hidden
        } else {
            contents.show(); // Show the contents if they are currently hidden
            $this.append("<span class='fas fa-minus'></span>"); // Add a minus icon to the legend indicating the contents are shown
        }

        return false; // Prevent the default behavior of legend click (e.g., navigating to a URL)
    });

    $("legend").css("cursor", "pointer"); // Set the cursor style to pointer for all legends and trigger a click event on them to initialize the state
}
//Method used to initialize tooltip behaviour
function InitTooltips() {
    $('[title]').each(function (index, element) {
        const $el = $(element);
        const title = $el.attr("title");
        // Agrega un atributo "data-tooltip" con el mismo valor del atributo "title"
        $el.attr("data-tooltip", title);
        // Inicializa el tooltip en el elemento
        $el.tooltip();
        // Remueve el atributo "title"
        $el.removeAttr("title");
        // Establece el cursor en "pointer" cuando se coloca el mouse sobre el tooltip
        $el.css("cursor", "pointer");
    });
}
//This function reset jquery datatables
function ReloadDataTables() {
    try {
        if ($('table').length != 0) {
            $('table').each(function () {
                var searchable = true, ordering = true, paging = true, bInfo = true;
                if (!$.fn.DataTable.isDataTable($(this))) {
                    if ($(this).hasClass("non-searching"))
                        searchable = false;
                    if ($(this).hasClass("non-ordering"))
                        ordering = false;
                    if ($(this).hasClass("non-paging")) {
                        paging = false;
                        bInfo = false;
                    }
                    $(this).dataTable({
                        "searching": searchable,
                        "paging": paging,
                        "ordering": ordering,
                        "bInfo": bInfo,
                        "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]]
                    });
                }
            });
        }
    }
    catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }

}

//#region Methods used to format input as currency
function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function formatCurrency(input, blur) {

    // get input value
    var input_val = input.val();
    // don't validate empty input
    if (input_val === "") {
        $(input).addClass("invalid");
        $(input).removeClass("valid");
        return;
    } else {
        $(input).addClass("valid");
        $(input).removeClass("invalid");
    }

    // appends data_currency ('$') to value, validates decimal side
    // and puts cursor back in right position.
    var currency = $(input).data("currency");
    currency = currency == undefined ?  "$" : currency;

    // original length
    var original_len = input_val.length;

    // initial caret position 
    var caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = currency + left_side + "." + right_side;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val =  currency + input_val;

        // final formatting
        if (blur === "blur") {
            input_val += ".00";
        }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}
//#endregion

//#region Dropify
//function resetPreviewDropify(input, src) {
//    src = !src ? $(input).file.name : src;
//    let wrapper = $(input).closest('.dropify-wrapper');
//    let preview = wrapper.find('.dropify-preview');
//    let filename = wrapper.find('.dropify-filename-inner');
//    let render = wrapper.find('.dropify-render').html('');

//    wrapper.removeClass('has-error').addClass('has-preview');
//    filename.html(src);
//    const pdf_extensions = [".pdf"];
//    const image_extensions = [".jpg", ".jpeg", ".png"];
//        src = pdf_extensions.some(v => src.includes(v))
//            ? "/Content/app-assets/images/pdf_file.gif"
//            : image_extensions.some(v => src.includes(v)) ?
//                "/Content/app-assets/images/image_file.gif"
//                : "/Content/app-assets/images/image_file.gif";
//    render.append($('<img />').attr('src', src).css('max-height', $(input).data('height') || ''));
//    preview.fadeIn();
//};
//#endregion Dropify

function Base64ToBytes(base64) {
    var s = window.atob(base64);
    var bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) {
        bytes[i] = s.charCodeAt(i);
    }
    return bytes;
};