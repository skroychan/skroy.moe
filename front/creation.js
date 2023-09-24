import { getCreation } from '/static/creation.js';

function load() {
    const urlParams = new URLSearchParams(window.location.search);
    const creation_id = urlParams.get('id');

    const creationBlock = document.getElementById('creation');
    const contentBlock = document.getElementById('content');
    
    getCreation(creation_id).then(creation => {
        if (!creation || !creation['is_public']) {
            document.title = '立入禁止';
            contentBlock.textContent = 'you requested in the wrong neighborhood';
            return;
        }
        
        if (creation['title']) {
            const titleBlock = document.createElement('div');
            titleBlock.id = 'title';
            titleBlock.innerHTML = creation['title'].replace(/\n/g, '<br>');
            creationBlock.prepend(titleBlock);

            document.title = creation['title'];
        }
        
        contentBlock.innerHTML = creation['content'].replace(/\n/g, '<br>');
    });
}

window.onload = load;
