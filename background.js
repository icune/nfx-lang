

function hookNetflix() {
    if (document.netflixSubsHooked)
        return;
    document.netflixSubsHooked = true;

    let controlIsDown = false;

    function toggleSubs() {
        let el = document.querySelector('[data-uia="control-audio-subtitle"]');
        if (!el)
            return;
        el.click();
        setTimeout(() => {
            let elems = [
                document.querySelector('[data-uia="subtitle-item-Russian"]'),
                document.querySelector('[data-uia*="subtitle-item-English"]')
            ].filter(e => e);
            elems[0].click();
            document.querySelector('[data-uia="selector-audio-subtitle"]').style.display = 'none';
        }, 100);
    }

    function observeEl(el) {
        const config = { attributes: true};
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
        let el = document.querySelector('[data-uia="player"]');
        if (!el)
            return;
        else
            clearInterval(ival);
        alert("Hooked");
        observeEl(el);
        listenToKeys();
    }, 300);




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
                func: hookNetflix
            },
            () => {
                console.log("Executed");
            });
    }
)