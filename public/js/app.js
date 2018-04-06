$(document).ready(function() {
    $('.modal').modal();

    $('.buyBTC form').on('change', '[name=amount]', function(event) {
        var $form = $(event.currentTarget).parents('form');
        var count = $(event.currentTarget).val();
        var rate = $form.find('[name=rate]').val();
        $form.find('[name=cost]').val(rate * count);
    });
    $('.buyBTC').on('click', '.agree', function(event) {
        event.preventDefault();
        $.ajax({
            url: "/api/buy",
            type: "POST",
            data: {
                amount: $('.modal.open .buyFormBTC [name=amount]').val(),
                type: $('.modal.open .buyFormBTC [name=type]').val()
            },
            success: function(data, statusText, jqXHR) {
                document.location.reload();
            },
            error: function() {
                //ignoring for happy path
            }
        });
    });



    $('.sellBTC form').on('change', '[name=amount]', function(event) {
        var $form = $(event.currentTarget).parents('form');
        var count = $(event.currentTarget).val();
        var rate = $form.find('[name=rate]').val();
        $form.find('[name=receive]').val(count * rate);
    });

    $('.sellBTC').on('click', '.agree', function(event) {
        event.preventDefault();
        $.ajax({
            url: "/api/sell",
            type: "POST",
            data: {
                amount: $('.modal.open .sellFormBTC [name=amount]').val(),
                type: $('.modal.open .sellFormBTC [name=type]').val()
            },
            success: function(data, statusText, jqXHR) {
                document.location.reload();
            },
            error: function() {
                //ignoring for happy path
            }
        });
    });


    $('.buyCRYPTO form').on('change', '[name=amount]', function(event) {
        var $form = $(event.currentTarget).parents('form');
        var count = $(event.currentTarget).val();
        var rate = $form.find('[name=rate]').val();
        $form.find('[name=receive]').val(count / rate);
    });
    $('.buyCRYPTO').on('click', '.agree', function(event) {
        event.preventDefault();
        $.ajax({
            url: "/api/buy",
            type: "POST",
            data: {
                amount: $('.modal.open .buyFormCrypto [name=amount]').val(),
                type: $('.modal.open .buyFormCrypto [name=type]').val()
            },
            success: function(data, statusText, jqXHR) {
                document.location.reload();
            },
            error: function() {
                //ignoring for happy path
            }
        });
    });






    $('.sellCRYPTO form').on('change', '[name=amount]', function(event) {
        var $form = $(event.currentTarget).parents('form');
        var $modal = $form.parents('.modal');
        $modal.find('.agree').attr('disabled', true);
        var count = $(event.currentTarget).val();
        var rate = $form.find('[name=rate]').val();
        $form.find('[name=receive]').val(count * rate);
        $modal.find('.agree').attr('disabled', false);
    });

    $('.sellCRYPTO').on('click', '.agree', function(event) {
        event.preventDefault();
        //do ajax to api
        $.ajax({
            url: "/api/sell",
            type: "POST",
            data: {
                amount: $('.modal.open .sellFormCrypto [name=amount]').val(),
                type: $('.modal.open .sellFormCrypto [name=type]').val()
            },
            success: function(data, statusText, jqXHR) {
                document.location.reload();

            },
            error: function() {
                //ignoring for happy path
            }
        });
    });


    $('.modal').on('click', '.cancel', function() {
    	$('.modal.open').modal('close');
    });


});