'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-material/angular-material.min.css',
        'public/lib/angular-toasty/dist/angular-toasty.min.css',
        'public/lib/angular-ui-select/dist/select.min.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-material/angular-material.min.js',
        'public/lib/angular-aria/angular-aria.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
        'public/lib/angular-toasty/dist/angular-toasty.min.js',
        'public/lib/angular-ui-select/dist/select.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-smart-table/dist/smart-table.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
