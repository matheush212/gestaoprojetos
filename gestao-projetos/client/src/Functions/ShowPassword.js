const Log = require("./GeraLog");

const View = (idPasswordField, idVisibleIconOn, idVisibleIconOff) => {
    try{
        let passwordField = document.getElementById(idPasswordField);
        let visibleIcon = document.getElementById(idVisibleIconOn);
        let visibleIconOff = document.getElementById(idVisibleIconOff);
        
        if (passwordField.type === "password") {
            passwordField.type = "text";
            visibleIcon.style.setProperty('display', 'none', 'important');
            visibleIconOff.style.setProperty('display', 'initial', 'important');

        } else {
            passwordField.type = "password";
            visibleIconOff.style.setProperty('display', 'none', 'important');
            visibleIcon.style.setProperty('display', 'initial', 'important');
        }
    }
    catch(err){
        Log.LogError("ShowPassword", "View", err.message);
    }
}
exports.View = View;