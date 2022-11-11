function hookNetflix() {
    console.log("Registered");
    if (document.netflixSubsHooked)
        return;
    document.netflixSubsHooked = true;

    let controlIsDown = false;
    const qi = (sl) => document.querySelector(sl);

    function toggleSubs() {
        let el = qi('[data-uia="control-audio-subtitle"]');
        if (!el)
            return;
        el.click();
        setTimeout(() => {
            let elems = [
                qi('[data-uia="subtitle-item-Russian"]'),
                qi('[data-uia*="subtitle-item-English"]')
            ].filter(e => e);
            elems[0].click();
            qi('[data-uia="selector-audio-subtitle"]').style.display = 'none';
        }, 100);
    }

    function observeEl(el) {
        const config = {attributes: true};
        const callback = (mutationList, observer) => {
            if (!controlIsDown)
                return;
            for (const mutation of mutationList) {
                if (mutation.attributeName === "class") {
                    if (mutation.target.className.indexOf("active") !== -1) {
                        toggleSubs();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(el, config);
    }

    function listenToKeys() {
        document.addEventListener('keydown', (e) => {
            if (e.key === "Control") {
                controlIsDown = true;
                toggleSubs();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === "Control")
                controlIsDown = false;
        });
    }

    let ival = setInterval(() => {
        let el = qi('[data-uia="player"]');
        if (!el)
            return;
        else
            clearInterval(ival);
        alert("Hooked");
        observeEl(el);
        listenToKeys();
    }, 300);


}

async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function pluginEntrypoint() {
    chrome.tabs.onActivated.addListener(
        async (a) => {


            let tab = await getCurrentTab();
            console.log(tab);
            chrome.scripting.executeScript(
                {
                    target: {tabId: tab.id},
                    func: hookNetflix
                },
                () => {
                    console.log("Executed");
                });
        }
    )


    chrome.tabs.onUpdated.addListener(
        async (a, chinfo) => {
            console.log(a, chinfo);
            let tab = await getCurrentTab();
            console.log(tab);
        }
    )
}

pluginEntrypoint();