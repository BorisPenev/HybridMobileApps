var FileModel = kendo.Class.extend({
        fileLocation: '',
        title: '',
        geoPoints: []
    });

(function(){
    window.fileModel = new FileModel();
})();