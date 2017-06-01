'use strict';

/**
 * @ngdoc function
 * @name newsubwayApp.controller:UnlockCtrl
 * @description
 * # UnlockCtrl
 * Controller of the newsubwayApp
 */
angular.module('newsubwayApp')
    .controller('UnlockCtrl', ['$scope','$cookies','unlockService','$window',function ($scope,$cookies, unlockService,$window) {
    $scope.user=$cookies.getObject("user");
    $scope.companyId=12;
    $scope.equipNumber='';
    $scope.certificate='';
    getGoodsList();
    $scope.getQrCode   = getQrCode;
    $scope.setGoodsId  = setGoodsId;
    $scope.scanQrCode  = scanQrCode;
    $scope.chooseImage = chooseImage;

    function setEquipNumber(value) {
        $scope.$apply(function () {
            $scope.equipNumber=value;
        });
    }

    function scanQrCode() {
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                console.log(res);
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                alert(result)
                setEquipNumber(result.split('_')[2])
            }
        })
    }

    function setCertificateImage(value) {
        $scope.$apply(function () {
            $scope.certificate= value;
        })
    }

    function chooseImage() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds[0].toString(); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                setCertificateImage(localIds)
                // uploadImage(localIds)

            }

        });
    }
    function uploadImage(localIds) {
        wx.uploadImage({
            localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res){
                var serverId = res.serverId; // 返回图片的服务器端ID
            }

        });
    }
    function setQrCodeImage(data) {
        $scope.QrCodeImage =data;
    }

    function unlockComplete(response) {
        console.log(response)
        response = response.data;
        var status = response.status || 0;
        var msg = Constants.error_unknown;

        if (status == 0) {
            msg = response.msg || msg;
            console.log("status:" + status);
            showError(msg);
            return;
        }

        setQrCodeImage(response.data)
    }
    function setGoodsId(value) {
        $scope.goodsId = value;
    }
    function Failed(error) {
        showError(error.statusText);
    }
    function showError(msg) {
        $scope.showError = true;
        $scope.errorMessage = msg;
    }

    function getQrCode() {
        console.log($scope.equipNumber+'///'+$scope.goodsId+'///'+$scope.companyId+'///'+$scope.certificate)
        if (angular.isNull($scope.equipNumber) || angular.isNull($scope.goodsId)|| angular.isNull($scope.companyId)|| angular.isNull($scope.certificate)) {
            showError('参数为空');
            return;
        }
        unlockService.getQrCode($scope.equipNumber,$scope.goodsId,$scope.user.id,$scope.companyId,$scope.certificate)
        .then(unlockComplete)
        .catch(Failed);
    }

    function goodsComplete(response) {
        response = response.data;
        var status = response.status || 0;
        var msg = Constants.error_unknown;
        if (status == 0) {
            msg = response.msg || msg;
            console.log("status:" + status);
            showError(msg);
            return;
        }
        setGoodsId(response.data[0].id)
        console.log(response.data[0].id)
        setGoodsList( response.data);
        console.log(response);
    }

    function getGoodsList() {
        unlockService.getGoodsList($scope.user.channel_id)
            .then(goodsComplete)
            .catch(Failed);
    }
    function setGoodsList(value) {
       $scope.goodsList = value
    }
    function obj2string(o){
        var r=[];
        if(typeof o=="string"){
            return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
        }
        if(typeof o=="object"){
            if(!o.sort){
                for(var i in o){
                    r.push(i+":"+obj2string(o[i]));
                }
                if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
                    r.push("toString:"+o.toString.toString());
                }
                r="{"+r.join()+"}";
            }else{
                for(var i=0;i<o.length;i++){
                    r.push(obj2string(o[i]))
                }
                r="["+r.join()+"]";
            }
            return r;
        }
        return o.toString();
    }

    }]);
