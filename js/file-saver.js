const firstNameInput = document.getElementById('firstName');
const middleNameInput = document.getElementById('middleName');
const lastNameInput = document.getElementById('lastName');
const osisNumberInput = document.getElementById('osisNumber');
const schoolCheckboxes = document.querySelectorAll('#schoolCheckboxes input[type="checkbox"]'); // Get all checkboxes
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
    submittedNames.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}: ${entry}`; // Display entry

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
middleNameInput.addEventListener('input', updateDisplayName);
lastNameInput.addEventListener('input', updateDisplayName);
osisNumberInput.addEventListener('input', updateDisplayName);

function updateDisplayName() {
    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const osisNumber = osisNumberInput.value.trim();
    const selectedSchools = Array.from(schoolCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value); // Get selected schools

    displayNameDiv.textContent = `${firstName} ${middleName} ${lastName} (OSIS: ${osisNumber})${selectedSchools.length ? ` - ${selectedSchools.join(', ')}` : ''}`.trim();
}

// Submit name functionality
submitButton.addEventListener('click', function() {
    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const osisNumber = osisNumberInput.value.trim();
    const selectedSchools = Array.from(schoolCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value); // Get selected schools

    // Check for empty fields and OSIS number length
    if (firstName === '' || lastName === '' || osisNumber === '' || selectedSchools.length === 0) {
        alert('Please enter your first name, last name, OSIS number, and select at least one school to submit.');
        return;
    }

    if (osisNumber.length !== 9 || isNaN(osisNumber)) {
        alert('OSIS number must be a 9-digit number.');
        return;
    }

    // Check for uniqueness of OSIS number
    const osisExists = submittedNames.some(entry => entry.includes(`(OSIS: ${osisNumber})`));
    if (osisExists) {
        alert('This OSIS number has already been submitted. Please enter a unique OSIS number.');
        return;
    }

    // Add name to the array in the format "firstName, lastName (OSIS: osisNumber) - schools"
    submittedNames.push(`${firstName},${middleName}, ${lastName} (OSIS: ${osisNumber}) - ${selectedSchools.join(', ')}`);
    localStorage.setItem('submittedNames', JSON.stringify(submittedNames)); // Save to localStorage

    // Clear the inputs and display area after submitting
    firstNameInput.value = '';
    middleNameInput.value = '';
    lastNameInput.value = '';
    osisNumberInput.value = '';
    schoolCheckboxes.forEach(checkbox => checkbox.checked = false); // Reset checkboxes
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
