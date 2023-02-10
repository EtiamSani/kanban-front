
// on objet qui contient des fonctions
const app = {

  base_url: 'http://localhost:1337',

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    //Définition des evenments de l'application
    app.addListenerToActions()
    app.getListsFromApi()
  },

  //Définition des evenments de l'application
  addListenerToActions: function () {
    //Bouton ajouter une liste
    const addListButton = document.querySelector('#addListButton')
    addListButton.addEventListener('click',app.showAddListModal)

    //Bouton fermer
    const closeButtons = document.querySelectorAll('.close')
    for(const button of closeButtons)
    {
      button.addEventListener('click',app.hideModals)
    }

    //Capter la soumission du formulaire des listes
    const addListForm = document.querySelector('#addListModal form')
    addListForm.addEventListener('submit',app.handleAddListForm)

    //Capter la soumission du formulaire des cartes
    const addCardForm = document.querySelector('#formSaveCard')
    addCardForm.addEventListener('submit',app.handleAddCardForm)
  },

  //Fonction qui affiche la modal pour ajouter une liste
  showAddListModal: function() {
    const modal = document.querySelector('#addListModal')
    modal.classList.add('is-active')
  },
  //Fonction qui affiche la modal pour ajouter une carte
  showAddCarteModal: function(event) {
    const modal = document.querySelector('#addCardModal')

    //Recueration du champ hidden
    //Ca me permettra de stocker le numero de la liste pour laquelle je veux ajouter une carte
    const champHidden = modal.querySelector('input[name=listId]')

    //On stocke dans le champ hidden l'id de la liste
    champHidden.value = event.target.closest('.panel').dataset.listId

    //Je cache la modal
    modal.classList.add('is-active')
  },

  //Fonction qui ferme les modals
  hideModals: function() {
    const modals = document.querySelectorAll('.modal')

    for(const modal of modals)
    {
      modal.classList.remove('is-active')
    }
  },

  //Fonction executée lors de la validation du formulaire de nouvelle liste
  handleAddListForm: async function(event){
    //On coupe l'evenement par default du submit
    event.preventDefault()
    //Création d'un formData ) partir du form
    //Recupere les infos du formulaire
    const formData = new FormData(event.target)
    //Enregistrer la liste via l'API
    await fetch(app.base_url + "/lists", {
      method:'POST',
      body:formData
    })
    //Reconstruction de l'IHM
    app.getListsFromApi()
    //On cache ensuite la modal
    app.hideModals();
  },

  //Fonction executée lors de la validation du formulaire de nouvelle carte
  handleAddCardForm: async function(event)
  {
    //On coupe l'evenement par default du submit
    event.preventDefault()
    //Création d'un formData ) partir du form
    //Recupere les infos du formulaire
    const formData = new FormData(event.target)
    //Enregistrer la carte via l'API
    await fetch(app.base_url + "/cards", {
      method:'POST',
      body:formData
    })

    //Reconstruction de l'IHM
    app.getListsFromApi()
    //On cache ensuite la modal
    app.hideModals();
  },

  //Fabrique une liste dans l'ihm
  makeListInDOM: function(listeObjet)
  {
    //Recuperation du template
    const template = document.querySelector('#listColumn')
    //Clone du template
    const copieListe = document.importNode(template.content,true)

    //Modification du titre du clone
    copieListe.querySelector('#listTitle').innerText = listeObjet.name

    

    //Modification de l'id du clone
    copieListe.querySelector('.panel').dataset.listId = listeObjet.id

    //Modification du bouton + pour qu'il affiche la modal des cards
    copieListe.querySelector(".is-pulled-right").addEventListener('click',app.showAddCarteModal)

    //Recuperation du container de listes
    const listsContainer = document.querySelector('.card-lists')

    //Ajout du clone dans le conteneurs de listes
    listsContainer.prepend(copieListe)
  },

  //Fonction de création de la nouvelle carte dans l'ihm
  makeCardInDOM: function(carteObjet)
  {
    //Recuperation du template
    const template = document.querySelector('#cardColumn')
    //Clone du template
    const copieCard = document.importNode(template.content,true)
    //Modification du titre du clone
    copieCard.querySelector('#titleCard').innerText = carteObjet.description
    //Modification de l'id du clone
    copieCard.querySelector('.box').dataset.listId = carteObjet.id
    //Recuperation de la liste
    const liste = document.querySelector(`[data-list-id="${carteObjet.listId}"]`)

    //Conteneurs des cartes
    const conteneurDesCartes = liste.querySelector('.panel-block')
    //Ajouts de la carte dans le conteneur de cartes
    console.log("conteneurDesCartes ---------- " + conteneurDesCartes)
    conteneurDesCartes.append(copieCard)
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
      app.makeListInDOM(liste)
      //Envoi d'une requete et recuperation de la reponse (les cartes de la liste)
      const response = await fetch(app.base_url + "/lists/" +  liste.id)
      //Transformation de la reponse en JSON
      const laListeEnJson = await response.json()
      for(const carte of laListeEnJson.Cards)
      {
        app.makeCardInDOM(carte)
      }
    }
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );