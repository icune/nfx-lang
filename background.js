function changeBackgroundColor() {
    // document.body.style.backgroundColor = 'red';
    console.log("Hello");
    let el = document.querySelector('[data-uia="player"]');
    const config = { attributes: true};
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.attributeName === "class") {
                if (mutation.target.className.indexOf("active") !== -1) {
                    let el = document.querySelector('[data-uia="control-audio-subtitle"]');
                    if (el) {
                        el.click();
                    }
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(el, config);

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
                func: changeBackgroundColor
            },
            () => {
                console.log("Executed");
            });
    }
)