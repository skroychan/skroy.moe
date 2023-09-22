function load() {
    const urlParams = new URLSearchParams(window.location.search);
    const creation_id = urlParams.get('id');

    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const fileInput = document.getElementById('file');

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
        fileInput.value = creation['file_path'];

        const saveButton = document.getElementById('save');
        saveButton.onclick = function() { save(creation_id); };

        const publishForm = document.getElementById('publish');
        publishForm.action = `/admin/publish/${creation_id}`;

        const unpublishButton = document.getElementById('unpublish');
        unpublishButton.onclick = function() { unpublish(creation_id); };

        if (creation['is_public']) {
            unpublishButton.style.display = 'block';
        } else {
            publishForm.style.display = 'block';
        }
    });
}

function save(id) {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const fileInput = document.getElementById('file');

    const creation = {
        title: titleInput.value,
        content: contentInput.value,
        file_path: fileInput.value
    };

    fetch(`/admin/save/${id}`, {
        method: 'post',
        body: JSON.stringify(creation),
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        alert(response.ok ? 'Saved' : 'Save failed');
    });
}

function unpublish(id) {
    fetch(`/admin/unpublish/${id}`, {
        method: 'post'
    }).then(response => {
        if (!response.ok) {
            alert('Unpublish failed');
            return;
        }

        const publishForm = document.getElementById('publish');
        publishForm.style.display = 'block';

        const unpublishButton = document.getElementById('unpublish');
        unpublishButton.style.display = 'none';
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
