function ref(){
    var handleInfo = document.getElementById('handleInfo');
    browser.storage.local.get(['userHandle']).then((result) => {
        var userHandle = result.userHandle;
        if (userHandle) {
            handleInfo.innerHTML = `Your friend's CF Handle is set to ${userHandle}`;
        } else {
            handleInfo.innerHTML = `Your friend's CF Handle isn't set yet!`;
        }
    }).catch((error) => {
        console.error(error);
        handleInfo.innerHTML = `Your friend's CF Handle isn't set yet!`;
    });
}
ref();

document.getElementById('submit').addEventListener('click', function () {
    var userHandle = document.getElementById('userHandle').value;
    if (!userHandle) {
        alert("Please enter a user handle");
        return;
    }
    browser.storage.local.set({ userHandle: userHandle }).then(() => {
        ref();
    }).catch((error) => {
        console.error(error);
        alert("Error: Unable to save user handle");
    });
});
