
/* JavaScript content from app/app.module.js in folder common */
(function () {
    'use strict';

    angular
        .module('app', [

            /* everyone has access to these */
            'app.core',

            /* Features */
            'app.deposit',
            'app.history',
            'app.layout'
        ])

})();