'use strict';

/**
 * @author: phuongds
 */
let app = angular.module('app', ['ui.grid','ui.grid.selection', 'ui.grid.cellNav','ui.grid.exporter','ui.grid.pagination']);
app.filter('mapGender', function () {
    let hash = {
        '1': "male",
        '2': "female",
        '3': "other",
    };

    return function (input) {
        return hash[input];
    };
});



let ListController = function ($log, $scope, $q, $http, $filter, $timeout, i18nService, $controller, uiGridConstants) {
    let gender = [ { value: '1', label: 'male' }, { value: '2', label: 'female' }, { value: '3', label: 'other'} ];
    $scope.bunchEditAble = 0;
    $scope.paginationPageSizes = [10, 20, 30, 50, 100];
    $scope.paginationPageSize = 100;
    $scope.getActionLink = function(link, grid,row){
        let editLink = "/server/edit";
        let cloneLink = "/server/clone";
        let deleteLink = "/server/delete";
        if(link===1) return editLink;
        if(link===2) return deleteLink;
        if(link===3) return cloneLink;
    };
    $scope.getCellTemplate = function(col){
        let template = '';
        switch(col){
            case 'address':
                template = '<div class="ui-grid-cell-contents">' +
                                '<div class="dropdown">' +
                                '  <div class="tag-cell">{{row.entity.tag}}</div>' +
                                '  <div class="dropdown-content">{{row.entity.tag}}</div>' +
                                '</div>' +
                            '</div>';
                break;
            case 'website':
                template = '<div class="ui-grid-cell-contents"><a href="{{row.entity.website}}">{{row.entity.website}}</a></div>';
                break;
            case 'action':
                template = '<div class="ui-grid-cell-contents">' +
                                '<span>' +
                                    '<a href="{{grid.appScope.getActionLink(1, grid, row)}}"><span class="glyphicon glyphicon-edit"></span></a>&nbsp;&nbsp;|&nbsp;&nbsp;' +
                                    '<a href="{{grid.appScope.getActionLink(2, grid, row)}}"><span class="glyphicon glyphicon-trash"></span></a>&nbsp;&nbsp;|&nbsp;&nbsp;' +
                                    '<a href="{{grid.appScope.getActionLink(3, grid, row)}}"><span class="glyphicon glyphicon-duplicate"></span></a>' +
                                '</span>' +
                            '</div>';
                break;
            default:
                break;
        }
        return template;
    };
    const columnDefs = [{
        position: 0,
        displayName: 'ID',
        field: 'id',
        minWidth: 50,
        enableSorting: true,
        enableFiltering: false,
        enableColumnMenu: false,
    }, {
        position: 1,
        displayName: 'Username',
        field: 'username',
        minWidth: 100,
        enableSorting: true,
        enableFiltering: true,
        enableColumnMenu: false
    }, {
        position: 2,
        displayName: 'Email',
        field: 'email',
        minWidth: 100,
        enableSorting: true,
        enableFiltering: true,
        enableColumnMenu: false
    }, {
        position: 2,
        displayName: 'Name',
        field: 'name',
        minWidth: 150,
        enableSorting: true,
        enableFiltering: true,
        enableColumnMenu: false
    }, {
        position: 2,
        displayName: 'J Name',
        field: 'jp_name',
        minWidth: 100,
        enableSorting: true,
        enableFiltering: true,
        enableColumnMenu: false
    }, {
        position: 3,
        displayName: 'Gender',
        field: 'gender',
        minWidth: 100,
        enableSorting: false,
        cellFilter: 'mapGender',
        enableFiltering: true,
        filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: gender
        },
        enableColumnMenu: false
    }, {
        position: 4,
        displayName: 'Website',
        field: 'website',
        minWidth: 200,
        enableSorting: false,
        enableFiltering: true,
        enableColumnMenu: false,
        cellTemplate: $scope.getCellTemplate('website')
    }, {
        position: 5,
        displayName: 'Age',
        field: 'age',
        minWidth: 50,
        enableSorting: true,
        enableFiltering: true,
        enableColumnMenu: false
    }, {
        position: 6,
        name: "Action",
        minWidth: 100,
        enableSorting: false,
        enableFiltering: false,
        enableColumnMenu: false,
        exporterEnableExporting: false,
        cellTemplate: $scope.getCellTemplate('action')
    }];

    /**
     * set default language to japanese for grid when init
     */
    $scope.initGrid = function () {
        i18nService.setCurrentLang('ja');
    };

    $scope.gridOptions = {
        init: $scope.initGrid(),
        i18n: 'ja',
        columnDefs: columnDefs,
        rowHeight:40,
        enableGridMenu: false,
        enableSelectAll: true,
        enableColumnResizing: true,
        enableFiltering: true,
        enableRowSelection:true,
        enableRowHeaderSelection: true,
        paginationPageSizes: $scope.paginationPageSizes,
        paginationPageSize: $scope.paginationPageSize,
        enablePaginationControls: true,
        multiSelect: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.isClickable = $scope.isClickable();
            });
        }
    };

    /**
     * check if button is clickable
     */
    $scope.isClickable = function(){
        let rows = $scope.gridApi.selection.getSelectedRows();
        let noRows = rows.length;
        let clickable = 0;
        if(noRows>0){
            clickable = 1;
        }
        return clickable;
    };

    /**
     *
     */
    $scope.doSt = function(){
        if($scope.isClickable()){
            alert("do something");
        }

    };


    /**
     *
     */
    $scope.getData = function () {
        let url = "/data/10000_complex.json";
        $http.get(url).then(rp =>{
            let gridData = rp.data;
            gridData.forEach(function (gdata, key) {
                // /console.log(gdata);
            });
            $scope.gridOptions.data = gridData;
        });

    };

//======================================================================================================================
    $scope.articles = $scope.getData();

};
ListController.$inject = ['$log', '$scope', '$q', '$http', '$filter','$timeout', 'i18nService', '$controller', 'uiGridConstants'];
app.controller('ListController', ListController);
