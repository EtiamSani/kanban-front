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



        //copieListe.querySelector('input[name="list-id"]').value = listeObjet.id
        copieListe.querySelector('form [type=hidden]').value = listeObjet.id;

        //console.log("listeObjet.id : " + listeObjet.id)
        //console.log("Hidden : " + copieListe.querySelector('form [type=hidden]').value)

        //Modification du bouton + pour qu'il affiche la modal des cards
        copieListe.querySelector(".is-pulled-right").addEventListener('click', cardModule.showAddCarteModal)

        //Lie la poubelle a une fonction
        copieListe.querySelector(".delete-liste").addEventListener('click', listModule.supprimerListe)

        //Recuperation du container de listes
        const listsContainer = document.querySelector('.card-lists')

        //Ajout d'un evenment sur le double clique sur le titre de la liste
        copieListe.querySelector("h2").addEventListener('dblclick', listModule.afficherModificationList)

        //Ajout d'un evenment sur la validation du formulaire de modification
        copieListe.querySelector("form").addEventListener('submit',listModule.validerEditionFormulaire)

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
  },
  afficherModificationList:  function(event) {
    //Cache le titre de la liste sur lequel on va cliquer.
    event.target.classList.add("is-hidden")
    //Afficher le formulaire juste après le titre.
    event.target.nextElementSibling.classList.remove("is-hidden")
  },
  validerEditionFormulaire: async function(event)
  {
    //stopper rechargement de la page
    event.preventDefault()
    
    //Recuperation des données
    const formData = new FormData(event.target)

    console.log("Yaaa" + formData.get("id"))
    console.log(formData.get("name"))

    //Envoi de la requete de demande de modification
    //Dans l'entete de la requete se trouve l'id de la liste a modifier
    //Dans le corps de la requete se trouve lees nouvelles données de la liste
    await fetch(app.base_url + "/lists/" +  formData.get("888"), 
    {
      method:"PUT",
      body:formData
    })

    //Reconstruction de l'IHM
    listModule.getListsFromApi()
  },

  supprimerListe : async function (event) {

    if(!confirm("Voulez vous supprimer ?")) 
      return

    const liste = event.target.closest(".panel")
    const idListe = liste.dataset.listId
  
    await fetch(app.base_url + "/lists/" +  idListe, {
      method:"DELETE"
    })
  
    //Reconstruction de l'IHM
    listModule.getListsFromApi()
  }
}