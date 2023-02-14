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
makeCardInDOM: async function(carteObjet)
{
  //Recuperation du template
  const template = document.querySelector('#cardColumn')
  //Clone du template
  const copieCard = document.importNode(template.content,true)
  //Modification du titre du clone
  copieCard.querySelector('#titleCard').innerText = carteObjet.description

  //Modification du titre du clone
  copieCard.querySelector('.inputColor').value = carteObjet.color

  //Modification de l'id du clone
  copieCard.querySelector('.box').dataset.cardId = carteObjet.id
  //Recuperation de la liste
  const liste = document.querySelector(`[data-list-id="${carteObjet.listId}"]`)

  //copieListe.querySelector('input[name="list-id"]').value = listeObjet.id
  copieCard.querySelector('form [type=hidden]').value = carteObjet.id;

  copieCard.querySelector('.edit-card ').addEventListener('click',cardModule.afficherModificationCarte)

  copieCard.querySelector('.form-card ').addEventListener('submit',cardModule.validerEditionFormulaire)

  copieCard.querySelector('.delete-card ').addEventListener('click',cardModule.supprimerCarte)
  
  //GESTION DES TAGS
  const reponse = await fetch(app.base_url + "/cards/" + carteObjet.id)
  
  const laCarteAvecTags = await reponse.json()

  const conteneurDeTags = copieCard.querySelector('.tags')

  for(const tag of laCarteAvecTags.Tags)
  {
    const divTag = document.createElement('div')
    divTag.classList.add('column')
    
    divTag.innerText = tag.name
    divTag.dataset.tagId = tag.id

    divTag.addEventListener('dblclick',cardModule.supprimerTag)

    conteneurDeTags.append(divTag)
  }

  const tagsReponse = await fetch(app.base_url + "/tags")

  const tags = await tagsReponse.json()

  const select = copieCard.querySelector('[name="select-tags"]')

  for(const tag of tags)
  {
    const divTag = document.createElement('option')
    divTag.value = tag.id
    divTag.innerText = tag.name
    select.append(divTag)
  }

  const btnAjoutTag = copieCard.querySelector(".add-tag")

  btnAjoutTag.addEventListener("click",cardModule.ajoutTag)



  //Conteneurs des cartes
  const conteneurDesCartes = liste.querySelector('.panel-block')
  //Ajouts de la carte dans le conteneur de cartes
  console.log("conteneurDesCartes ---------- " + conteneurDesCartes)
  conteneurDesCartes.append(copieCard)
},
ajoutTag : async function(event) 
{
  const cardId = event.target.closest('.box').dataset.cardId

  const tagId = event.target.closest('.box').querySelector('[name="select-tags"]').value

  console.log("cardId" + cardId)
  console.log("tagId" + tagId)

  const formData = new FormData()
  formData.set("tagId",tagId)

  await fetch(app.base_url + "/cards/" + cardId + "/tags", 
        {
            method:"POST",
            body:formData
        });

  //Reconstruction de l'IHM
  listModule.getListsFromApi()
},
supprimerTag : async function(event) 
{
  const tagId = event.target.dataset.tagId
  const cardId = event.target.closest('.box').dataset.cardId

  await fetch(app.base_url + "/cards/"+cardId+"/tags/"+ tagId, 
        {
            method:"DELETE"
        });

  //Reconstruction de l'IHM
  listModule.getListsFromApi()
},
afficherModificationCarte:  function(event) {

  //Cache la carte
  const box = event.target.closest(".box")
  box.querySelector(".is-narrow").classList.add("is-hidden")
  box.querySelector(".classTitre").classList.add("is-hidden")
  

  //Afficher le formulaire 
  box.querySelector(".form-card").classList.remove("is-hidden")
},
validerEditionFormulaire: async function(event)
{
  //stopper rechargement de la page
  event.preventDefault()
  
  //Recuperation des données
  const formData = new FormData(event.target)

  console.log("Yaaa" + formData.get("id"))
  console.log(formData.get("description"))

  //Envoi de la requete de demande de modification
  //Dans l'entete de la requete se trouve l'id de la liste a modifier
  //Dans le corps de la requete se trouve lees nouvelles données de la liste
  await fetch(app.base_url + "/cards/" +  formData.get("id"), 
  {
    method:"PUT",
    body:formData
  })

  //Reconstruction de l'IHM
  listModule.getListsFromApi()
},

supprimerCarte : async function (event) {
  const box = event.target.closest(".box")
  const form = box.querySelector(".form-card")
  const formData = new FormData(form)
  const idCard = formData.get("id")

  console.log("Je supprimer lID : " + idCard)

  await fetch(app.base_url + "/cards/" +  idCard, {
    method:"DELETE"
  })

  //Reconstruction de l'IHM
  listModule.getListsFromApi()
}

}