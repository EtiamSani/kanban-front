const listModule = {

    //Fonction qui affiche la modal pour ajouter une liste
    showAddListModal: function () {
        //Selectionne la modal a afficher
        const modal = document.querySelector('#addListModal')
        //On lui donne la classe css pour etre visible
        modal.classList.add('is-active')
    },
    //Fonction executée lors de la validation du formulaire de nouvelle liste
    handleAddListForm: async function (event) {
        //On coupe l'evenement par default du submit
        event.preventDefault()
        //Création d'un formData ) partir du form
        //Recupere les infos du formulaire
        const formData = new FormData(event.target)
        //Enregistrer la liste via l'API
        await fetch(app.base_url + "/lists", {
            method: 'POST',
            body: formData
        })
        //Reconstruction de l'IHM
        listModule.getListsFromApi()
        //On cache ensuite la modal
        app.hideModals();
    },
    //Fabrique une liste dans l'ihm
    makeListInDOM: function (listeObjet) {
        //Recuperation du template
        const template = document.querySelector('#listColumn')
        //Clone du template
        const copieListe = document.importNode(template.content, true)

        //Modification du titre du clone
        copieListe.querySelector('#listTitle').innerText = listeObjet.name

        //Modification de l'id du clone
        copieListe.querySelector('.panel').dataset.listId = listeObjet.id

        //Modification du bouton + pour qu'il affiche la modal des cards
        copieListe.querySelector(".is-pulled-right").addEventListener('click', cardModule.showAddCarteModal)

        //Recuperation du container de listes
        const listsContainer = document.querySelector('.card-lists')

        //Ajout du clone dans le conteneurs de listes
        listsContainer.prepend(copieListe)
    },
      //On va aller chercher les listes dans l'API
  //L'api va chercher les listes dans une bdd
  getListsFromApi: async function() {

    //Recuperation du container de listes
    const listsContainer = document.querySelector('.card-lists')

    listsContainer.innerHTML = "";

    //Envoi d'une requete et recuperation de la reponse (les listes)
    const response = await fetch(app.base_url + "/lists")
    //Transformation de la reponse en JSON
    const reponseListesEnJson = await response.json()
    //Création des listes dans l'ihm
    for(const liste of reponseListesEnJson)
    {
      //Création d'une liste dans l'ihm
      listModule.makeListInDOM(liste)
      //Envoi d'une requete et recuperation de la reponse (les cartes de la liste)
      const response = await fetch(app.base_url + "/lists/" +  liste.id)
      //Transformation de la reponse en JSON
      const laListeEnJson = await response.json()
      for(const carte of laListeEnJson.Cards)
      {
        cardModule.makeCardInDOM(carte)
      }
    }
  }
}