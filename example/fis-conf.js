fis.match('*.html', {
    preprocessor: require('../index')
});

fis.match('layout/*.html', {
    release: false
});
