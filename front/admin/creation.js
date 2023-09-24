import { getCreation } from '../static/creation.js';

function load() {
    const previewButton = document.getElementById('preview-button');
    previewButton.onclick = preview;

    const urlParams = new URLSearchParams(window.location.search);
    const creation_id = urlParams.get('id');

    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const tagInput = document.getElementById('tags');

    getCreation(creation_id).then(creation => {
        if (!creation) {
            alert('Load failed');
            return;
        }

        if (creation['title']) {
            document.title = creation['title'];
        }
        
        titleInput.value = creation['title'];
        contentInput.value = creation['content'];
        tagInput.value = creation['tags'].map(tag => tag['name']).join(' ');

        const saveButton = document.getElementById('save');
        saveButton.onclick = function() { save(creation_id); };

        const publishButton = document.getElementById('publish');
        publishButton.onclick = function() { publish(creation_id); };

        const unpublishButton = document.getElementById('unpublish');
        unpublishButton.onclick = function() { unpublish(creation_id); };

        if (creation['is_public']) {
            unpublishButton.style.display = 'block';
        } else {
            publishButton.style.display = 'block';
        }
    });
}

function save(id) {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const tagInput = document.getElementById('tags');

    const creation = {
        title: titleInput.value,
        content: contentInput.value,
        tags: tagInput.value.split(' ').filter(tag => tag !== '')
    };

    fetch(`/save/${id}`, {
        method: 'post',
        body: JSON.stringify(creation),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        alert(response.ok ? 'Saved' : 'Save failed');
    });
}

function publish(id) {
    fetch(`/publish/${id}`, {
        method: 'post'
    }).then(response => {
        alert(response.ok ? 'Published' : 'Publish failed');

        if (!response.ok) {
            return;
        }

        const publishButton = document.getElementById('publish');
        publishButton.style.display = 'none';

        const unpublishButton = document.getElementById('unpublish');
        unpublishButton.style.display = 'block';
    });
}

function unpublish(id) {
    fetch(`/unpublish/${id}`, {
        method: 'post'
    }).then(response => {
        alert(response.ok ? 'Unpublished' : 'Unpublish failed');
        
        if (!response.ok) {
            return;
        }

        const publishButton = document.getElementById('publish');
        publishButton.style.display = 'block';

        const unpublishButton = document.getElementById('unpublish');
        unpublishButton.style.display = 'none';
    });
}

function preview() {
    const preview = document.getElementById('preview');
    const content = document.getElementById('content');
    const previewButton = document.getElementById('preview-button');

    if (preview.style.display == 'none') {
        previewButton.value = 'edit';
        preview.innerHTML = content.value.replace(/\n/g, '<br>');
        content.style.display = 'none';
        preview.style.display = 'block';
    } else {
        previewButton.value = 'preview';
        content.style.display = 'block';
        preview.style.display = 'none';
    }
}

window.onload = load;
