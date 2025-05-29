$(function () {
    $('input[name="iva"]')
        .TouchSpin({
            min: 1,
            max: 1000000,
            step: 1,
            decimals: 0,
            boostat: 5,
            maxboostedstep: 10,
            prefix: '%'
        })
        .on('keypress', function (e) {
            return validate_text_box({'event': e, 'type': 'decimals'});
        });

    $('input[name="ruc"]')
        .on('keypress', function (e) {
            return validate_text_box({'event': e, 'type': 'numbers'});
        });

    $('input[name="mobile"]')
        .on('keypress', function (e) {
            return validate_text_box({'event': e, 'type': 'numbers'});
        });

    $('input[name="phone"]')
        .on('keypress', function (e) {
            return validate_text_box({'event': e, 'type': 'numbers'});
        });
});