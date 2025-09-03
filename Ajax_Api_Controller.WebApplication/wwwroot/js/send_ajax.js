// 🎯 اعتبارسنجی فرم با آرایه داینامیک فیلدها / Form validation with dynamic fields array
function validateFormDynamic(fields = []) {
    if (!Array.isArray(fields)) fields = []; // تضمین اینکه fields آرایه است / Ensure fields is an array

    const errors = [];

    fields.forEach(field => {
        const { selector, type = "required", label = selector, custom } = field;
        const $el = $(selector);

        switch (type) {
            case "required":
                if (!$el.val()?.trim()) errors.push(`«${label}» نباید خالی باشد / must not be empty`);
                break;
            case "file":
                if (!$el[0]?.files?.length) errors.push(`«${label}» نباید خالی باشد / must not be empty`);
                break;
            case "radio":
                if (!$(`input[name='${$el.attr('name')}']:checked`).val()) errors.push(`«${label}» باید انتخاب شود / must be selected`);
                break;
            case "custom":
                if (typeof custom === "function") {
                    const result = custom($el);
                    if (result) errors.push(result);
                }
                break;
        }
    });

    if (errors.length) {
        Swal.fire({
            icon: "error",
            title: "Validation Error / خطای اعتبارسنجی",
            html: errors.join("<br>"),
            width: 600
        });
        return false;
    }

    return true;
}

// 🔗 AJAX با callback و ولیدیشن آرایه فیلدها / AJAX with callback and field validation
function sendAjax(button, options, fieldsToValidate = [], callback = null) {
    if (!Array.isArray(fieldsToValidate)) fieldsToValidate = []; // تضمین آرایه بودن / Ensure array

    if (!validateFormDynamic(fieldsToValidate)) return;

    $(button).prop("disabled", true);

    $.ajax({
        ...options,
        contentType: options.type === "GET" ? undefined : options.contentType,
        processData: options.type === "GET" ? undefined : options.processData,
        beforeSend: function () {
            Swal.fire({
                title: "Sending data... / ارسال داده...",
                icon: "info",
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
                width: 500
            });
        },
        complete: function () {
            $(button).prop("disabled", false);
        },
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Success / موفقیت",
                html: "Data sent successfully!<br><pre>" + JSON.stringify(response, null, 2) + "</pre>",
                width: 600
            });
            if (typeof callback === "function") callback(null, response);
        },
        error: function (xhr) {
            const message = xhr.responseJSON?.message || xhr.statusText || "Unknown error";
            Swal.fire({
                icon: "error",
                title: "Error / خطا",
                html: "Sending data failed<br><pre>" + message + "</pre>",
                width: 600
            });
            if (typeof callback === "function") callback(message, null);
        }
    });
}

// 📦 ارسال JSON با callback / Send JSON with callback
$("#btnJson").click(function () {
    const fields = [
        { selector: "#input_string", type: "required", label: "Input Text / متن" },
        { selector: "#input_number", type: "required", label: "Input Number / عدد" },
        { selector: "input[name='gender']", type: "radio", label: "Gender / جنسیت" }
    ];

    const data = {
        input_string: $("#input_string").val(),
        input_number: $("#input_number").val(),
        gender: $("input[name='gender']:checked").val()
    };

    sendAjax(this, {
        url: "/api/demo/json",
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(data)
    }, fields, function (err, res) {
        if (!err) console.log("موفقیت / Success:", res);
        else console.error("خطا / Error:", err);
    });
});

// 📂 ارسال FormData با callback / Send FormData with callback
$("#btnFormData").click(function () {
    const fields = [
        { selector: "#input_string", type: "required", label: "Input Text / متن" },
        { selector: "#input_number", type: "required", label: "Input Number / عدد" },
        { selector: "input[name='gender']", type: "radio", label: "Gender / جنسیت" },
        { selector: "#input_file", type: "file", label: "File Upload / فایل" }
    ];

    const formData = new FormData($("#registerForm")[0]);

    sendAjax(this, {
        url: "/api/demo/form",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false
    }, fields, function (err, res) {
        if (!err) console.log("موفقیت / Success:", res);
    });
});

// 🔑 ارسال x-www-form-urlencoded با callback / Send x-www-form-urlencoded with callback
$("#btnUrlEncoded").click(function () {
    const fields = [
        { selector: "#input_string", type: "required", label: "Input Text / متن" },
        { selector: "#input_number", type: "required", label: "Input Number / عدد" },
        { selector: "input[name='gender']", type: "radio", label: "Gender / جنسیت" }
    ];

    const data = {
        input_string: $("#input_string").val(),
        input_number: $("#input_number").val(),
        gender: $("input[name='gender']:checked").val()
    };

    sendAjax(this, {
        url: "/api/demo/simple",
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: data
    }, fields, function (err, res) {
        if (!err) console.log("موفقیت / Success:", res);
    });
});

// 🔍 ارسال GET با QueryString و callback / Send GET with QueryString and callback
$("#btnQuery").click(function () {
    const fields = [
        { selector: "#input_number", type: "required", label: "Input Number / عدد" },
        { selector: "#input_string", type: "required", label: "Input Text / متن" }
    ];

    const id = $("#input_number").val();
    const name = $("#input_string").val();

    const url = `/api/demo/query?input_number=${encodeURIComponent(id)}&input_string=${encodeURIComponent(name)}`;

    console.log("GET URL being sent:", url);

    sendAjax(
        this,
        { url: url, type: "GET" },
        fields,  // آرایه فیلدها
        function (err, res) {
            if (!err) console.log("موفقیت / Success:", res);
            else console.error("خطا / Error:", err);
        }
    );
});