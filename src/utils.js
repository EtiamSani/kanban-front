const utilModule = {

    base_url: "http://localhost:3000",

    hideModals: function(){
        const modals = document.querySelectorAll(".modal");
        for (const modal of modals) {
            modal.classList.remove("is-active");
        }
    },
}

