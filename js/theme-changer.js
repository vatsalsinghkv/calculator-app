$('.theme-btns').click(function() {
    let oldBodyClass = $('body').attr('class');
    let newBodyClass = $(this).attr('name');

    // hide theme btns
    $(`.theme-btn-${getBtnNum(oldBodyClass)}`).removeClass('show');
    $(`.theme-btn-${getBtnNum(newBodyClass)}`).addClass('show');

    // change theme of the page
    $('body').removeClass(oldBodyClass);
    $('body').addClass(newBodyClass);
});

function getBtnNum(str) {
    return str.slice(str.length-1);
}