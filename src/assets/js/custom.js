app.run(function($rootScope) {
    $rootScope.$on("$includeContentLoaded", function(event, templateName) {
        //...
    });
});