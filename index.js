document.addEventListener('DOMContentLoaded', async () => {
    let url = new URLSearchParams(location.search)
    let page = url.get("page") || 'home';
    navigateTo(page);

    document.querySelector("#home").onclick = () => {
        navigateTo('home');
    }
});

