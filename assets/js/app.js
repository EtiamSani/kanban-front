
// on objet qui contient des fonctions
const app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.addListenerToActions()
  },

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

    //Capter la soumission du formulaire des liste
    const addListForm = document.querySelector('#addListModal form')
    addListForm.addEventListener('submit',app.handleAddListForm)

    //Capter la soumission du formulaire des cartes
    const addCardForm = document.querySelector('#formSaveCard')
    addCardForm.addEventListener('submit',app.handleAddCardForm)
  },

  //Fonction qui affiche la modal pour ajouter yne liste
  showAddListModal: function() {
    const modal = document.querySelector('#addListModal')
    modal.classList.add('is-active')
  },
  //Fonction qui affiche la modal pour ajouter une carte
  showAddCarteModal: function(event) {
    const modal = document.querySelector('#addCardModal')

    //Recueration du champ hidden
    const champHidden = modal.querySelector('input[name=list-id]')

    //On stocke dans le champ hidden l'id de la liste
    champHidden.value = event.target.closest('.panel').dataset.listId

    modal.classList.add('is-active')
  },

  hideModals: function() {
    const modals = document.querySelectorAll('.modal')

    for(const modal of modals)
    {
      modal.classList.remove('is-active')
    }
  },

  handleAddListForm: function(event){
    //On coupe l'evenement par default du submit
    event.preventDefault()
    //Création d'un formData ) partir du form
    const formData = new FormData(event.target)
    //Appelle de la fonction makeListInDOM avec le formData pour modifier l'IHM
    app.makeListInDOM(formData)
    //On cache ensuite la modal
    app.hideModals();
  },

  //Fonction executée lors de la validation du formulaire de nouvelle carte
  handleAddCardForm: function(event)
  {
    //On coupe l'evenement par default du submit
    event.preventDefault()
    
    console.log('handleAddCardForm')

    //Création d'un formData ) partir du form
    const formData = new FormData(event.target)
    
    //Appelle de la fonction makeCardInDOM avec le formData pour modifier l'IHM
    app.makeCardInDOM(formData)

        //On cache ensuite la modal
        app.hideModals();
  },

  makeListInDOM: function(formData)
  {
    //Recuperation du template
    const template = document.querySelector('#listColumn')
    //Clone du template
    const copieListe = document.importNode(template.content,true)

    //Modification du titre du clone
    copieListe.querySelector('#listTitle').innerText = formData.get('name')

    //Modification de l'id du clone
    copieListe.querySelector('.panel').dataset.listId = 'list-' + Date.now() 

    //Modification du bouton + pour qu'il affiche la modal des cards
    copieListe.querySelector(".is-pulled-right").addEventListener('click',app.showAddCarteModal)

    //Recuperation du container de listes
    const listsContainer = document.querySelector('.card-lists')

    //Ajout du clone dans le conteneurs de listes
    listsContainer.prepend(copieListe)
  },

  //Fonction de création de la nouvelle carte
  makeCardInDOM: function(formData)
  {
    //Logs pour etre sur de bien recuperer les infos du formulaires
    console.log('makeCardInDOM')
    console.log(formData.get('name'))
    console.log(formData.get('list-id'))

    //Recuperation du template
    const template = document.querySelector('#cardColumn')
    //Clone du template
    const copieCard = document.importNode(template.content,true)

    //Modification du titre du clone
    copieCard.querySelector('#titleCard').innerText = formData.get('name')

    //Recuperation de la liste
    const liste = document.querySelector(`[data-list-id=${formData.get('list-id')}]`)

    //Conteneurs des cartes
    const conteneurDesCartes = liste.querySelector('.panel-block')

    //Ajouts de la carte dans le conteneur de cartes
    conteneurDesCartes.append(copieCard)
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );