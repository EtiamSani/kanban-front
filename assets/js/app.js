
// on objet qui contient des fonctions
const app = {

  base_url: 'http://localhost:1337',

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    //Définition des evenments de l'application
    app.addListenerToActions()
    listModule.getListsFromApi()
  },

  //Définition des evenments de l'application
  addListenerToActions: function () {
    //Bouton ajouter une liste
    const addListButton = document.querySelector('#addListButton')
    addListButton.addEventListener('click',listModule.showAddListModal)

    //Bouton fermer
    const closeButtons = document.querySelectorAll('.close')
    for(const button of closeButtons)
    {
      button.addEventListener('click',app.hideModals)
    }

    //Capter la soumission du formulaire des listes
    const addListForm = document.querySelector('#addListModal form')
    addListForm.addEventListener('submit',listModule.handleAddListForm)

    //Capter la soumission du formulaire des cartes
    const addCardForm = document.querySelector('#formSaveCard')
    addCardForm.addEventListener('submit',cardModule.handleAddCardForm)
  },

  //Fonction qui ferme les modals
  hideModals: function() {
    const modals = document.querySelectorAll('.modal')

    for(const modal of modals)
    {
      modal.classList.remove('is-active')
    }
  },

};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );