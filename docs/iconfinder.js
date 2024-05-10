"use strict";
var app = angular.module("aaIconFinder", ['ngMaterial', 'ngMessages']);

app.controller('AppCtrl', ['$scope', '$http','$mdToast',
    function($scope, $http, $mdToast) {
        $scope.searchTerm = '';
        $scope.activeExternalLibrary = false;

        $scope.init = function () {
            $scope.parseURLParams();
        };

        
        $scope.parseURLParams = function () {
            let params = new URLSearchParams(document.location.search);
            $scope.searchTerm = params.get('search')
                ? params.get('search')
                : '';
                console.log('using default library');
                $scope.externalLibrary = false;
                $scope.importFromScript();
            
        };

        $scope.copyDirectLink = function () {
            let url = new URL(window.location.toString()),
                params = new URLSearchParams(url.search);
            if (params.get('search')) {
                params.set('search', $scope.searchTerm)
            } else {
                params.append('search', $scope.searchTerm);
            }

            $scope.copyToClipboard(url.origin + url.pathname + '?' + params.toString(), 'Link copied to clipboard')
        };

        $scope.copyToClipboard = function (content, msg) {
            let copyElement = document.createElement("textarea");
            copyElement.style.position = 'fixed';
            copyElement.style.opacity = '0';
            copyElement.textContent = (content);

            let body = document.getElementsByTagName('body')[0];
            body.appendChild(copyElement);
            copyElement.select();
            document.execCommand('copy');
            body.removeChild(copyElement);

            $scope.showToast(typeof (msg) === "undefined" ? 'Copied to clipboard' : msg);
        };

        $scope.showToast = function (message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .hideDelay(3000))
                .then(function () {
                }).catch(function () {
            });
        };

        $scope.updateSearchTerm = function (text) {
            $scope.searchTerm = text;
        };

        $scope.importFromScript = function () {
            $scope.icons = [];
            let icon_list = getIconList();
            icon_list.then(function(my_list){
                for(const icon in my_list){
                    let this_icon = getIcon(my_list[icon].name);
                    this_icon.then(function(my_icon){
                        let keywords = my_list[icon].keywords,
                            aliases = keywords
                                ? keywords.join(', ')
                                : '';

                        $scope.icons.push({
                            name:my_list[icon].name,
                            path: my_icon.path,
                            keywords:keywords,
                            aliases: aliases,
                            value: ('phu:' + my_list[icon].name + ' ' + aliases).toLowerCase()
                        });
                        $scope.$applyAsync();
                    })
                }
            });
        };

        $scope.matchesSearchTerm = function (icon) {
            if (!$scope.searchTerm) {
                return true;
            } else {
                let searchTerms = $scope.searchTerm.toLowerCase().split(' ');

                for (let i = 0; i < searchTerms.length; i++) {
                    if (icon.value.indexOf(searchTerms[i]) !== -1) return true;
                }
            }
        };

        $scope.newWindow = function (library) {
            if (typeof library === "undefined"){
                window.open('index.html');
            }else{
            window.open('index.html?library=' + library.url);
            }
        }

        $scope.init();
    }
]);


