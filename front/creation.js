function load() {
    const urlParams = new URLSearchParams(window.location.search);
    const creation_id = urlParams.get('id');

    const titleBlock = document.getElementById('title');
    const contentBlock = document.getElementById('content');

    getCreation(creation_id).then(creation => {
        if (!creation || !creation['is_public']) {
            document.title = '立入禁止';
            titleBlock.style.display = 'none';
            contentBlock.textContent = 'you requested in the wrong neighborhood';
            return;
        }

        if (creation['title']) {
            document.title = creation['title'];
            titleBlock.innerHTML = creation['title'].replace(/\n/g, '<br>');;
        } else {
            titleBlock.style.display = 'none';
        }
        
        contentBlock.innerHTML = creation['content'].replace(/\n/g, '<br>');
    });
}

async function getCreation(id) {
    const response = await fetch(`/creation/get/${id}`);
    if (response.ok) {
        const result = await response.json();
        return result;
    }

    return null;
}

window.onload = load;
