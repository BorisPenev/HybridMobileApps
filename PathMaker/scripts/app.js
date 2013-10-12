(function (global) {
    var mobileSkin = "",
        app = global.app = global.app || {};

    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout" });
        
        
    }, false);

    app.changeSkin = function (e) {
       /* if (e.sender.element.text() === "Flat") {
            e.sender.element.text("Native");
            mobileSkin = "flat";
        }
        else {
            e.sender.element.text("Flat");
            mobileSkin = "";
        }

        app.application.skin(mobileSkin);*/
    };
    app.startPathMaker = function(){
        //here i should stop the path maker
        
        
        function onPrompt(results) {
            
            // if we press 'Save' we write to the file
            if (results.buttonIndex == 1) {
                // save to file with name: results.input1
                
                // When the file is created 
                navigator.notification.vibrate(2000);
            }
            
        }
        navigator.notification.prompt(
            'Write a name for the file:',  // message
            onPrompt,                  // callback to invoke
            'Would you like to save the current path ?',            // title
            ['Save','Cancel'],             // buttonLabels
            'PathMakerFile'                 // defaultText
        );
    };
    app.stopPathMaker = function(){
        //here i should stop the path maker
        
        
        function onPrompt(results) {
            
            // if we press 'Save' we write to the file
            if (results.buttonIndex === 1){
                // save to file with name: results.input1
            }
            
        }
        navigator.notification.prompt(
            'Write a name for the file:',  // message
            onPrompt,                  // callback to invoke
            'Would you like to save the current path ?',            // title
            ['Save','Cancel'],             // buttonLabels
            'PathMakerFile'                 // defaultText
        );
    };
})(window);