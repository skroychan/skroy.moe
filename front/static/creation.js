async function getCreation(id) {
    const response = await fetch(`/creation/get/${id}`);
    if (response.ok) {
        const result = await response.json();
        return result;
    }

    return null;
}

async function getLatestCreations() {
    const response = await fetch('/creation/latest');
    if (response.ok) {
        const result = await response.json();
        return result;
    }

    return [];
}

export { getCreation, getLatestCreations };
