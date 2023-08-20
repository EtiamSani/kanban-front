

const tagModule = {

    makeTagInDOM: function(tag){
        const tagDOM = document.createElement('span');

        // On veut lui donner un tagId (qui sera l'id du tag dans la db)
        tagDOM.dataset.tagId = tag.id;
        // On veut lui insérer du contenu (son nom)
        tagDOM.textContent = tag.name;
        // On veut lui donner une couleur
        tagDOM.style.backgroundColor = tag.color;
        // On veut lui donner la classe "tag" de Bulma
        tagDOM.classList.add("tag");

        // On veut brancher un écouteur sur notre tag
        tagDOM.addEventListener("dblclick", tagModule.dissociateTagFromCard);
        console.log(tagDOM)

        // On veut récupérer la carte où ce tag sera inséré
        const cardDOM = document.querySelector(`.box[data-card-id="${tag.CardTag.CardId}"]`);
        // On veut insérer ce tag dans sa carte
        cardDOM.querySelector(".tags").appendChild(tagDOM);
    },

    dissociateTagFromCard: async function(event) {
        // On veut récupérer l'id de la carte en question
        const cardId = event.target.closest('.box').dataset.cardId;
        
        const tagId = event.target.dataset.tagId;

        // /cards/:idCard/tags/:idTag

        try {
            const response = await fetch(`${utilModule.base_url}/cards/${cardId}/tags/${tagId}`, {
                method: "DELETE"
            })
            const jsonData = await response.json();

            if(!response.ok) { throw jsonData }

            event.target.remove();

        } catch (error) {
            console.log(jsonData);
            alert("Impossible de dissocier le tag de cette carte !")
        }
    },

    showAssociateTagModal: async function(event) {
        // On veut récupérer l'id de la carte sur laquelle on a cliqué
        const cardDOM = event.target.closest(".box");
        const cardId = cardDOM.dataset.cardId;
        console.log(cardId);
        // On va modifier l'id de la carte dans le input caché du formulaire
        const modal = document.querySelector("#associateTagModal");
        modal.querySelector('input[name="card_id"]').value = cardId;
        const select = modal.querySelector('select[name="tag_id"]');
        select.textContent = "";
        try {
            const response = await fetch(`${utilModule.base_url}/tags`);
            const jsonData = await response.json();

            if(!response.ok){ throw jsonData}

            for (const tag of jsonData){
                // On va ajouter chaque tag à notre DOM
                // Pour cela on commence par créer une option pour chaque tag
                const option = document.createElement("option");

                // On va vouloir la remplir avec le nom du tag
                option.textContent = tag.name;
                // On va vouloir greffer le tagId sur cette option
                option.value = tag.id;
                select.appendChild(option);
            }

        } catch (error) {
            console.log(error);
            alert("Impossible d'ajouter ce tag");
        }
        modal.classList.add("is-active");
    },

    associateTagToCard: async function(event) {
        // On empeche le rechargement de la page
        event.preventDefault();

        // On va instancie les données du formulaire avec formData
        const formData = new FormData(event.target);

        try {
            // La route à laquelle on va accéder : /cards/:id/tags
            const response = await fetch(`${utilModule.base_url}/cards/${formData.get("card_id")}/tags`, {
                method: "POST",
                body: formData
            })

            const jsonData = await response.json();
            console.log(jsonData);

            if(!response.ok) { throw jsonData }

            const tag = jsonData.tags.find(tag => tag.id == formData.get("tag_id"));

            tagModule.makeTagInDOM(tag);
        } catch (error) {
            console.log(error);
        }

        utilModule.hideModals();
    }
}

