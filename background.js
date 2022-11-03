function changeBackgroundColor() {
    document.body.style.backgroundColor = 'red';
    console.log("Hello");
    alert("XXX");
}


chrome.tabs.onActivated.addListener(
    async (a) => {
        async function getCurrentTab() {
            let queryOptions = {active: true, lastFocusedWindow: true};
            let [tab] = await chrome.tabs.query(queryOptions);
            return tab;
        }

        let tab = await getCurrentTab();
        console.log(tab);
        chrome.scripting.executeScript(
            {
                target: {tabId: tab.id},
                files: ['script.js']
            },
            () => {
                console.log("Executed");
            });
    }
)