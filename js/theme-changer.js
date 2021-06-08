let themes = {
    '!': 'theme-1',
    '@': 'theme-2',
    '#': 'theme-3'
};

$(document).keypress((e) => {
    if(e.key in themes) {
        changeTheme(themes[e.key]);
    }
});

$('.theme-btns').click(function(){
    changeTheme($(this).attr('id'));
});

function changeTheme(newClass) {
    let oldClass = $('body').attr('class');

    // hide theme btns
    $(`.theme-btn-${getBtnNum(oldClass)}`).removeClass('show');
    $(`.theme-btn-${getBtnNum(newClass)}`).addClass('show');

    // change theme of the page
    $('body').removeClass(oldClass);
    $('body').addClass(newClass);
}

function getBtnNum(str) {
    return str.slice(-1);
}