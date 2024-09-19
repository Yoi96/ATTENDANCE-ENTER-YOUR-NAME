const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const displayNameDiv = document.getElementById('displayName');
const submitButton = document.getElementById('submitButton');
const saveButton = document.getElementById('saveButton');
const emailButton = document.getElementById('emailButton');
const submittedNamesList = document.getElementById('submittedNamesList');

// Load submitted names from localStorage
let submittedNames = JSON.parse(localStorage.getItem('submittedNames')) || [];

// Function to render names
function renderNames() {
    submittedNamesList.innerHTML = ''; // Clear current list
    submittedNames.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}: ${name}`; // Add index number before the name

        // Create a remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeName(index);

        li.appendChild(removeButton);
        submittedNamesList.appendChild(li);
    });
}

// Initial render of names
renderNames();

// Update displayed name as the user types
firstNameInput.addEventListener('input', updateDisplayName);
lastNameInput.addEventListener('input', updateDisplayName);

function updateDisplayName() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    displayNameDiv.textContent = `${firstName} ${lastName}`.trim(); // Updated format
}

// Submit name functionality
submitButton.addEventListener('click', function() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    if (firstName === '' || lastName === '') {
        alert('Please enter both your first and last name to submit.');
        return;
    }

    // Add name to the array in the format "firstName, lastName"
    submittedNames.push(`${firstName}, ${lastName}`);
    localStorage.setItem('submittedNames', JSON.stringify(submittedNames)); // Save to localStorage

    // Clear the inputs and display area after submitting
    firstNameInput.value = '';
    lastNameInput.value = '';
    displayNameDiv.textContent = '';

    // Re-render names
    renderNames();
});

// Function to remove a name
function removeName(index) {
    submittedNames.splice(index, 1); // Remove the name from the array
    localStorage.setItem('submittedNames', JSON.stringify(submittedNames)); // Update localStorage
    renderNames(); // Re-render names
}

// Save submitted names as a text file
saveButton.addEventListener('click', function() {
    if (submittedNames.length === 0) {
        alert('No names to save.');
        return;
    }

    // Join submitted names into a single string with line breaks
    const namesToSave = submittedNames.join('\n');

    // Create a Blob from the names
    const blob = new Blob([namesToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submitted_names.txt'; // Name of the downloaded file
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Save submitted names as an email
emailButton.addEventListener('click', function() {
    if (submittedNames.length === 0) {
        alert('No names to email.');
        return;
    }

    // Join submitted names into a single string with line breaks
    const namesToEmail = submittedNames.join('\n');

    // Create a mailto link
    const subject = encodeURIComponent('Submitted Names');
    const body = encodeURIComponent(namesToEmail);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    // Open the user's email client
    window.location.href = mailtoLink;
});
