"use strict";
var app = angular.module("ElaxIconFinder", ['ngMaterial', 'ngMessages']);

app.controller('AppCtrl', ['$scope', '$http','$mdToast',
    function($scope, $http, $mdToast) {
        $scope.searchTerm = '';

        $scope.init = function () {
            $scope.parseURLParams();
            $scope.selectMode = false;
            $scope.selectedIcons = {};
        };

        
        $scope.parseURLParams = function () {
            let params = new URLSearchParams(document.location.search);
            $scope.searchTerm = params.get('search')
                ? params.get('search')
                : '';
                $scope.importFromScript();
            
        };

        $scope.copyDirectLink = function () {
            let url = new URL(window.location.toString()),
                params = new URLSearchParams(url.search);
                params.append('search', $scope.searchTerm);
            

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

        $scope.openMenu = function ($mdMenu, ev) {
            $mdMenu.open(ev);
        };

        // Selection helpers
        $scope.isSelected = function(name){
            return !!$scope.selectedIcons[name];
        }

        $scope.getIconPath = function(name){
            if(window.icons && window.icons[name]){ return window.icons[name][4]; }
            return '';
        }

        $scope.toggleSelection = function(name, $event){
            if($event){
                // Prevent card clicks or other parent handlers
                $event && $event.stopPropagation();
            }
            if($scope.isSelected(name)){
                delete $scope.selectedIcons[name];
            } else {
                // Allow unlimited selections (user requested no fixed limit)
                // let currentCount = Object.keys($scope.selectedIcons).length;
                $scope.selectedIcons[name] = true;
            }
        }

        $scope.selectedCount = function(){
            return Object.keys($scope.selectedIcons).length;
        }


        $scope.clearSelection = function(){
            $scope.selectedIcons = {};
            $scope.showToast('Selezione cancellata');
        }

        $scope.buildReducedScript = function(){
            let selected = {};
            Object.keys($scope.selectedIcons).forEach(function(name){
                if(name in window.icons){
                    selected[name] = window.icons[name];
                }
            });

            // Build the reduced JS similar to custom-brand-icons.js, minimally including icons var and helper functions
                // helper to format array elements
                let escapeArrayItem = function(item){
                    if (typeof item === 'number'){
                        if (Number.isInteger(item)) return item.toFixed(1); // 32 -> 32.0
                        return item.toString();
                    }
                    return JSON.stringify(item);
                };

                // Build single-line per icon entries
                let lines = [];
                lines.push('var icons = {');
                let keys = Object.keys(selected);
                keys.forEach(function(k, idx){
                    let arr = selected[k];
                    let arrStr = '[' + arr.map(escapeArrayItem).join(',') + ']';
                    lines.push('  ' + JSON.stringify(k) + ':' + arrStr + (idx < keys.length - 1 ? ',' : ''));
                });
                lines.push('};\n\n');

                let content = lines.join('\n');
          content += `async function getIcon(name) {\n`;
content += `  if (!(name in icons)) {\n`;
content += `    console.log(` + "`Icon \"${name}\" not available`" + `);\n`;
content += `    return '';\n`;
content += `  }\n\n`;

content += `  var svgDef = icons[name];\n`;
content += `  var primaryPath = svgDef[4];\n`;
content += `  return {\n`;
content += `    path: primaryPath,\n`;
content += `    viewBox: svgDef[0] + " " + svgDef[1] + " " + svgDef[2] + " " + svgDef[3]\n`;
content += `  };\n`;
content += `}\n\n`;

content += `async function getIconList() {\n`;
content += `  return Object.entries(icons).map(([icon]) => ({\n`;
content += `    name: icon\n`;
content += `  }));\n`;
content += `}\n\n`;

content += `window.customIconsets = window.customIconsets || {};\n`;
content += `window.customIconsets["phu"] = getIcon;\n\n`;

content += `window.customIcons = window.customIcons || {};\n`;
content += `window.customIcons["phu"] = { getIcon, getIconList };\n`;
  

            return content;
        }

        $scope.downloadSelected = function(){
            let js = $scope.buildReducedScript();
            let blob = new Blob([js], { type: 'text/javascript' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'custom-brand-icons.reduced.js';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            $scope.showToast('File scaricato: custom-brand-icons.reduced.js');
        }

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


