async function getCreation(id) {
    const response = await fetch(`/creation/get/${id}`);
    if (response.ok) {
        const result = await response.json();
        return result;
    }

    return null;
}

export { getCreation, getLatestCreations };
