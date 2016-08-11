'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin', 'ui.select', 'ngSanitize']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);
