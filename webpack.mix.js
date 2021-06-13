// webpack.mix.js

let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'assets/js/app.js').sass('resources/scss/app.scss', 'assets/css/app.css');