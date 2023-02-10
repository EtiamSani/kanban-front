const cardModule = {

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
  listModule.getListsFromApi()
  //On cache ensuite la modal
  app.hideModals();
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

}