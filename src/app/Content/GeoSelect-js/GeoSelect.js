// Initialize variables
if (typeof cities_list != 'undefined' || typeof states_list != 'undefined' || typeof countries_list != 'undefined') {
} else {
    let states_list = [];
    let cities_list = [];
    let countries_list = [];
}

// Set settings for geoselect
settings = {
    en: {
        title_message: "Loading form",
        loading_data: "Loading data",
        waiting_message: "Please, wait",
        placeholder_country: "Select a Country",
        placeholder_state: "Select a State",
        placeholder_city: "Select a City/Province"
    },
    es: {
        title_message: "Cargando formulario",
        loading_info: "Cargando información",
        waiting_message: "Por favor, espere",
        placeholder_country: "Seleccione un País",
        placeholder_state: "Seleccione un Estado",
        placeholder_city: "Seleccione un Municipio/Provincia"
    }
};

// Define geoselect function
function initializeGeoSelect() {
    // Iterate through each geoselect_country input element
    $(".geoselect_country").each(function () {
        // Get the corresponding select element for the country input
        select_country = $("#" + $(this).data("country"));
        // Get the selected value for the corresponding country select element
        country_value = select_country.val();
        // Normalize the country name for comparison
        normalized_country_value = country_value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // Find the country object that matches the normalized country name
        country_item = countries_list.find(country => country.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized_country_value);
        try {
            // Set the selected value for the geoselect_country input element
            $(`.geoselect_country[data-country="${$(this).data("country")}"]`).val(country_item.id).trigger("change");
        } catch { }
        // Get the corresponding select element for the state input
        select_state = $("#" + $(this).data("state"));
        // Get the selected value for the corresponding state select element
        state_value = select_state.val();
        try {
            // Find the state object that matches the selected state value and country_id
            state_item = states_list.find(state => state.country_id == country_item.id && state.name == state_value);
            // Set the selected value for the geoselect_state input element
            $(`.geoselect_state[data-input="${$(this).data("state")}"]`).val(state_item.id).trigger("change");
        } catch { }

        // Get the corresponding select element for the city input
        select_city = $("#" + $(this).data("city"));
        // Get the selected value for the corresponding city select element
        city_value = select_city.val();
        try {
            // Find the city object that matches the selected city value and state_id
            city_item = cities_list.find(city => city.state_id == state_item.id && city.name == city_value);
            // Set the selected value for the geoselect_city input element

            $(`.geoselect_city[data-input="${$(this).data("city")}"]`).val(city_item.id).trigger("change");
        } catch { }
    });
    $("#geoselect_Bank_Guarantee_1_country").each(function () {
        // Get the corresponding select element for the country input
        select_country = $("#" + $(this).data("country"));
        // Get the selected value for the corresponding country select element
        country_value = select_country.val();
        // Normalize the country name for comparison
        normalized_country_value = country_value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // Find the country object that matches the normalized country name
        country_item = countries_list.find(country => country.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized_country_value);
        try {
            // Set the selected value for the geoselect_country input element
            $(`#geoselect_Bank_Guarantee_1_country[data-country="${$(this).data("country")}"]`).val(country_item.id).trigger("change");
        } catch { }
        // Get the corresponding select element for the state input
        select_state = $("#" + $(this).data("state"));
        // Get the selected value for the corresponding state select element
        state_value = select_state.val();
        try {
            // Find the state object that matches the selected state value and country_id
            state_item = states_list.find(state => state.country_id == country_item.id && state.name == state_value);
            // Set the selected value for the geoselect_state input element
            $(`.geoselect_Guarantee_1_state[data-input="${$(this).data("state")}"]`).val(state_item.id).trigger("change");
        } catch { }

        // Get the corresponding select element for the city input
        select_city = $("#" + $(this).data("city"));
        // Get the selected value for the corresponding city select element
        city_value = select_city.val();
        try {
            // Find the city object that matches the selected city value and state_id
            city_item = cities_list.find(city => city.state_id == state_item.id && city.name == city_value);
            // Set the selected value for the geoselect_city input element

            $(`.geoselect_Guarantee_1_city[data-input="${$(this).data("city")}"]`).val(city_item.id).trigger("change");
        } catch { }
    });
}




// Document ready function
$(function () {
    // Get current locale and set settings
    const { title_message, waiting_message, loading_info, placeholder_country, placeholder_state, placeholder_city } = settings[current_locale];
    // Get select elements for country, state and city
    var $selectCountry = $("#geoselect_country");
    var $selectState = $("#geoselect_state");
    var $selectCity = $("#geoselect_city");
    var $selectGuarantee1Country = $("#geoselect_Bank_Guarantee_1_country");
    var $selectGuarantee1State = $("#geoselect_Bank_Guarantee_1_state");
    var $selectGuarantee1City = $("#geoselect_Bank_Guarantee_1_city");
    var $selectGuarantee2Country = $("#geoselect_Bank_Guarantee_2_country");
    var $selectGuarantee2State = $("#geoselect_Bank_Guarantee_2_state");
    var $selectGuarantee2City = $("#geoselect_Bank_Guarantee_2_city");

    // Disable select elements and add loading message as options
    $(".geoselect_country, .geoselect_state, .geoselect_city").prop('disabled', 'disabled')
        .html(`<option value="-1">${loading_info}</option>`)
        .addClass(function () {
            return $(this).prop('required') ? "invalid" : "";
        });

    $("#geoselect_Bank_Guarantee_1_country, #geoselect_Bank_Guarantee_1_state, #geoselect_Bank_Guarantee_1_city").prop('disabled', 'disabled')
        .html(`<option value="-1">${loading_info}</option>`)
        .addClass(function () {
            return $(this).prop('required') ? "invalid" : "";
        });
    $("#geoselect_Bank_Guarantee_2_country, #geoselect_Bank_Guarantee_2_state, #geoselect_Bank_Guarantee_2_city").prop('disabled', 'disabled')
        .html(`<option value="-1">${loading_info}</option>`)
        .addClass(function () {
            return $(this).prop('required') ? "invalid" : "";
        });

    // Function to show loading dialog box
    var showLoadingDialog = () => {
        Swal.fire({
            title: title_message,
            html: waiting_message,
            didOpen: () => {
                Swal.showLoading();
                Swal.stopTimer();
            },
            showConfirmButton: false,
            allowOutsideClick: false
        });
    };

    // Function to load states data from states.json file
    var loadStates = () => {
        if (typeof states_list == 'undefined') {
            return $.getJSON("/Content/GeoSelect-js/data/states.json").then(data => {
                states_list = data;
                $selectState.prop('disabled', false).html(`<option value="-1">${placeholder_state}</option>`);
                $selectGuarantee1State.prop('disabled', false).html(`<option value="-1">${placeholder_state}</option>`);
                $selectGuarantee2State.prop('disabled', false).html(`<option value="-1">${placeholder_state}</option>`);
            });
        } else {
            $selectState.prop('disabled', false).html(`<option value="-1">${placeholder_state}</option>`);
            $selectGuarantee1State.prop('disabled', false).html(`<option value="-1">${placeholder_state}</option>`);
            $selectGuarantee2State.prop('disabled', false).html(`<option value="-1">${placeholder_state}</option>`);
            return Promise.resolve();
        }
    };

    // Function to load cities data from cities.csv file
    var loadCities = () => {
        if (typeof cities_list == 'undefined') {
            return $.get("/Content/GeoSelect-js/data/cities.csv").then(data => {
                cities_list = $.csv.toObjects(data);
                $selectCity.prop('disabled', false).html(`<option value="-1">${placeholder_city}</option>`);
                $selectGuarantee1City.prop('disabled', false).html(`<option value="-1">${placeholder_city}</option>`);
                $selectGuarantee2City.prop('disabled', false).html(`<option value="-1">${placeholder_city}</option>`);
            });
        } else {
            $selectCity.prop('disabled', false).html(`<option value="-1">${placeholder_city}</option>`);
            $selectGuarantee1City.prop('disabled', false).html(`<option value="-1">${placeholder_city}</option>`);
            $selectGuarantee2City.prop('disabled', false).html(`<option value="-1">${placeholder_city}</option>`);
            return Promise.resolve();
        }
    };

    // Function to load countries data from countries.json file
    const loadCountries = () => {
        if (typeof countries_list == 'undefined') {
            return $.getJSON("/Content/GeoSelect-js/data/countries.json").then(data => {
                countries_list = data;
                country_options = $.map(countries_list, ({ id, name }) => `<option value="${id}">${name}</option>`);

                $selectCountry.prop('disabled', false).html(`<option value="-1">${placeholder_country}</option>${country_options}`);
                $selectGuarantee1Country.prop('disabled', false).html(`<option value="-1">${placeholder_country}</option>${country_options}`);
                $selectGuarantee2Country.prop('disabled', false).html(`<option value="-1">${placeholder_country}</option>${country_options}`);
            });
        } else {
            country_options = $.map(countries_list, ({ id, name }) => `<option value="${id}">${name}</option>`);
            $selectCountry.prop('disabled', false).html(`<option value="-1">${placeholder_country}</option>${country_options}`);
            $selectGuarantee1Country.prop('disabled', false).html(`<option value="-1">${placeholder_country}</option>${country_options}`);
            $selectGuarantee2Country.prop('disabled', false).html(`<option value="-1">${placeholder_country}</option>${country_options}`);
            return Promise.resolve();
        }
    };

    // Show loading dialog box before loading states, cities and countries data
    showLoadingDialog();
    // Load states, cities and countries data and initialize GeoSelect plugin after all data is loaded
    $.when(loadStates(), loadCities(), loadCountries()).then(() => {
        Swal.close();
        initializeGeoSelect();
    });

    // Event listener for country select element
    $("#geoselect_country").on("change", function () {
        // Filter states based on selected country and create options for state select element
        var states = states_list.filter(element => element.country_id == $(this).val());
        var options = $.map(states, function (value, index) {
            return '<option value="' + value.id + '">' + value.name + '</option>';
        });
        // Replace options in state select element and set value of country input element
        $("#geoselect_state[data-input='" + $(this).data("state") + "']").html('<option value="-1">' + placeholder_state + '</option>' + options);
        $("#" + $(this).data("country")).val($(this).find("option:selected").text());
        // Add or remove invalid/valid class based on whether the country is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });

    // Event listener for state select element
    $("#geoselect_state").on("change", function () {
        // Filter cities based on selected state and create options for city select element
        var cities = cities_list.filter(element => element.state_id == $(this).val());
        var options = $.map(cities, function (value, index) {
            return `<option value="${value.id}">${value.name}</option>`;
        });
        // Replace options in city select element and set value of state input element
        $("#geoselect_city[data-input='" + $(this).data("city") + "']").html(`<option value="-1">${placeholder_city}</option>` + options);
        $("#" + $(this).data("state")).val($(this).find("option:selected").text());
        // Add or remove invalid/valid class based on whether the state is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });
    // Event listener for city select element
    $("#geoselect_city").on("change", function () {
        // Set value of city input element
        $("#" + $(this).data("city")).val($(this).find("option:selected").text());
        // Add or remove invalid/valid class based on whether the state is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });

    $("#geoselect_Bank_Guarantee_1_country").on("change", function () {
        // Filter states based on selected country and create options for state select element
        var states = states_list.filter(element => element.country_id == $(this).val());
        var options = $.map(states, function (value, index) {
            return '<option value="' + value.id + '">' + value.name + '</option>';
        });
        // Replace options in state select element and set value of country input element
        $("#geoselect_Bank_Guarantee_1_state[data-input='" + $(this).data("state") + "']").html('<option value="-1">' + placeholder_state + '</option>' + options);
        $("#" + $(this).data("country")).val($(this).find("option:selected").text());

        // Add or remove invalid/valid class based on whether the country is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });

    // Event listener for state select element
    $("#geoselect_Bank_Guarantee_1_state").on("change", function () {
        // Filter cities based on selected state and create options for city select element
        var cities = cities_list.filter(element => element.state_id == $(this).val());
        var options = $.map(cities, function (value, index) {
            return `<option value="${value.id}">${value.name}</option>`;
        });
        // Replace options in city select element and set value of state input element
        $("#geoselect_Bank_Guarantee_1_city[data-input='" + $(this).data("city") + "']").html(`<option value="-1">${placeholder_city}</option>` + options);
        $("#" + $(this).data("state")).val($(this).find("option:selected").text());
        // Add or remove invalid/valid class based on whether the state is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });
    // Event listener for city select element
    $("#geoselect_Bank_Guarantee_1_city").on("change", function () {
        // Set value of city input element
        $("#" + $(this).data("city")).val($(this).find("option:selected").text());
        // Add or remove invalid/valid class based on whether the state is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });
    $("#geoselect_Bank_Guarantee_2_country").on("change", function () {
        // Filter states based on selected country and create options for state select element
        var states = states_list.filter(element => element.country_id == $(this).val());
        var options = $.map(states, function (value, index) {
            return '<option value="' + value.id + '">' + value.name + '</option>';
        });
        // Replace options in state select element and set value of country input element
        $("#geoselect_Bank_Guarantee_2_state[data-input='" + $(this).data("state") + "']").html('<option value="-1">' + placeholder_state + '</option>' + options);
        $("#" + $(this).data("country")).val($(this).find("option:selected").text());

        // Add or remove invalid/valid class based on whether the country is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });

    // Event listener for state select element
    $("#geoselect_Bank_Guarantee_2_state").on("change", function () {
        // Filter cities based on selected state and create options for city select element
        var cities = cities_list.filter(element => element.state_id == $(this).val());
        var options = $.map(cities, function (value, index) {
            return `<option value="${value.id}">${value.name}</option>`;
        });
        // Replace options in city select element and set value of state input element
        $("#geoselect_Bank_Guarantee_2_city[data-input='" + $(this).data("city") + "']").html(`<option value="-1">${placeholder_city}</option>` + options);
        $("#" + $(this).data("state")).val($(this).find("option:selected").text());
        // Add or remove invalid/valid class based on whether the state is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });
    // Event listener for city select element
    $("#geoselect_Bank_Guarantee_2_city").on("change", function () {
        // Set value of city input element
        $("#" + $(this).data("city")).val($(this).find("option:selected").text());
        // Add or remove invalid/valid class based on whether the state is required and has a value
        $(this).toggleClass("invalid", $(this).prop('required') && $(this).val() == "-1")
            .toggleClass("valid", !($(this).prop('required') && $(this).val() == "-1"));
    });
});