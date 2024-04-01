(function () {
    'use strict';
    angular
        .module('MyApp', ['ngMaterial', 'ngMessages'])
        .controller('DemoCtrl', DemoCtrl);

    function DemoCtrl ($scope, $q, $log) {

        var self = this;

        self.icons = importFromScript();
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;

        
        let params = new URLSearchParams(document.location.search);
        $scope.selectedIcon = params.get('search')
           ? self.icons.filter(createFilterFor(params.get('search')))[0]
           : false;


        function querySearch (query) {
            let results = query ? self.icons.filter(createFilterFor(query)) : self.icons;
            return results;
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
            $scope.selectedIcon = item;
        }
        function importFromScript() {
            let icons = [];
            for (const icon in icons){

                let keywords = icons[icon].keywords,
                    aliases = keywords.join(', ');

                icons.push({
                    name: icon,
                    path:icons[icon].path,
                    keywords:keywords,
                    aliases:aliases,
                    value:'phu:' + icon + ' ' + aliases.toLowerCase()
                });
            }
            return icons;
        }

        function createFilterFor(query) {
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) != -1);
            };

        }
    }
})();


