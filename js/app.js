// https://api.nasa.gov/api.html#MarsPhotos

// https://images-api.nasa.gov
// https://images-api.nasa.gov/search?q=apollo
// https://images-api.nasa.gov/search?q=searchterm&media_type=image

let searchForm = document.querySelector('#searchForm');
let outputContainer = document.querySelector('#outputContainer');
let outputLoadProgress = document.querySelector('#outputLoadProgressContainer');
let messageContainer = document.querySelector('#messageContainer');

let DetailsModalTitle = document.querySelector('#DetailsModalTitle');
let DetailsModalDescription = document.querySelector('#DetailsModalDescription');
let DetailsModalImage = document.querySelector('#DetailsModalImage');
let DetailsModalKeywords = document.querySelector('#DetailsModalKeywords');

searchForm.addEventListener('submit', (e) => FetchData(e));

function FetchData (e) {
    e.preventDefault();
    const input = e.target.elements['input'].value;

    if (input) {
        fetch(`https://images-api.nasa.gov/search?q=${input}&media_type=image`)
            .then(response => response.json())
            .then(result => {
                let resultsData = result.collection.items;
                outputContainer.innerHTML = '';
                messageContainer.innerHTML = '';

                // outputContainer.style.display = 'none';
                // outputLoadProgress.style.display = 'block';
          
                if (resultsData.length <= 0) {
                    showMessage('No results found.', 'alert-danger');
                } else {
                    resultsData.forEach((result, index, object) => {
                        let image = {
                            'title': result.data[0].title,
                            'description': result.data[0].description,
                            'date_created': result.data[0].date_created,
                            'keywords': result.data[0].keywords,
                            'media_type': result.data[0].media_type,
                            'image_link': result.links[0].href
                        }
                        // console.log(image);
    
                        let card = document.createElement('a');
                        card.setAttribute('class', 'card');
                        card.setAttribute('data-toggle', 'modal');
                        card.setAttribute('data-target', '#DetailsModal');
                        card.href = '#';
                        card.addEventListener('click', () => {
                            DetailsModalTitle.innerHTML = '';
                            DetailsModalDescription.innerHTML = '';
                            DetailsModalKeywords.innerHTML = '';
                            DetailsModalImage.setAttribute('src', '');
    
                            DetailsModalTitle.innerText = image.title;
                            DetailsModalDescription.innerText = image.description;
                            image.keywords.forEach(keyword => {
                                let badge = document.createElement('h5');
                                badge.classList = 'badge badge-dark';
                                // badge.setAttribute('data-dismiss', 'modal');
                                badge.innerText = keyword;
                                // badge.addEventListener('click', () => {
                                //     searchForm.elements['input'].value = keyword;
                                //     searchForm.submit();
                                // });
                                DetailsModalKeywords.appendChild(badge);
                            });
                            DetailsModalImage.setAttribute('src', image.image_link);
                        });
    
                        card.innerHTML = `
                        <img class="card-img-top" src="${image.image_link}" alt="${image.title}">
                        <div class="card-body">
                            <h5 class="card-title text-dark">${image.title}</h5>
                        </div>
                        `;
                        outputContainer.appendChild(card); 
    
                        // if (index + 1 == object.length) {
                        //     console.log('Ende erreicht');
                        //     outputContainer.style.display = 'block';
                        //     outputLoadProgress.style.display = 'none';
                        // }
                    });
                }
            })
            .catch(error => {
                console.clear();
                console.log(`Es ist ein Fehler aufgetreten: ${error}}`);
            });
    }
}

function showMessage (message, alertclass) {
    messageContainer.innerHTML = '';
    messageContainer.innerHTML = `
    <div class="alert ${alertclass}" role="alert">
        <i class="fas fa-exclamation-circle"></i>
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}