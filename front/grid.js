import { getLatestCreations } from '/static/creation.js';

function load() {
    const gridContainer = document.getElementById('creations');
    
    getLatestCreations().then(creations => {
        creations.forEach(creation => {
            const creationBlock = document.createElement('div');
            creationBlock.classList.add('creation');
            creationBlock.onclick = function() { window.open(`/creation?id=${creation['id']}`, '_blank'); };
            creationBlock.style.cursor = 'pointer';

            if (creation['tags']) {
                const gridTag = creation['tags'].find(tag => /^[1-3]x[1-3]$/.test(tag['name']));
                if (gridTag) {
                    creationBlock.classList.add(`block-${gridTag['name']}`);
                }
            }

            if (creation['title']) {
                const titleBlock = document.createElement('div');
                titleBlock.classList.add('title');
                titleBlock.innerHTML = creation['title'].replace(/\n/g, '<br>');
                creationBlock.appendChild(titleBlock);
            }
            
            const contentBlock = document.createElement('div');
            const splitContent = creation['content'].toString().split('<cut/>');
            contentBlock.classList.add('content');
            contentBlock.innerHTML = splitContent[0].replace(/\n/g, '<br>');
            Array.from(contentBlock.getElementsByTagName('a')).forEach(a => a.addEventListener('click', stopPropagation));
            creationBlock.appendChild(contentBlock);
            
            if (splitContent.length > 1) {
                const footerBlock = document.createElement('div');
                footerBlock.classList.add('footer');
                const footerLink = document.createElement('a');
                footerLink.href = `/creation?id=${creation['id']}`
                footerLink.addEventListener('click', stopPropagation);
                footerLink.textContent = 'see full >';
                footerBlock.appendChild(footerLink);
                creationBlock.appendChild(footerBlock);
            }

            gridContainer.appendChild(creationBlock);
        });
    });
}

function stopPropagation(event) {
    event.stopPropagation();
}

window.onload = load;
