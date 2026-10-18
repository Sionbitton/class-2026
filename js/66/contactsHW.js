function getElement(selector) {
  return document.querySelector(selector);
}

function setCss(element, property, value) {
  // element.style.property = value;
  element.style[property] = value;
}

function on(element, eventType, callback) {
  element.addEventListener(eventType, callback);
}

function click(element, callback) {
  on(element, 'click', callback);
}

const contactsTable = getElement('#contactsTable tbody');
const addContactForm = getElement('#addContact');
const idInput = getElement('#id');
const nameInput = getElement('#name');
const phoneInput = getElement('#phone');
const addressInput = getElement('#address');
const emailInput = getElement('#email');
const addContactButton = getElement('#add');
let contacts = [];

function hideAddContactForm() {
  setCss(addContactForm, 'display', 'none');
  addContactForm.reset();
  setCss(addContactButton, 'visibility', 'visible');
}

on(addContactForm, 'submit', e => {
  e.preventDefault();

  const newContact = {
    id: Number(idInput.value),
    name: nameInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    email: emailInput.value
  };

  addContact(newContact);
  hideAddContactForm();
});

click(addContactButton, () => {
  setCss(addContactForm, 'display', 'block');
  setCss(addContactButton, 'visibility', 'hidden');
});

click(getElement('#cancel'), hideAddContactForm);

click(getElement('#load'), async () => {
  try {
    const response = await fetch('peopleHW.json');

    if (!response.ok) {
      throw new Error(`Could not load contacts: ${response.status}`);
    }

    const people = await response.json();
    people.forEach(addContact);
  } catch (error) {
    console.error(error);
  }
});
function addContact(newContact) {
  {
    if (!contacts.length) {
      contactsTable.innerHTML = '';
    }

    contacts.push(newContact);

    const row = contactsTable.insertRow();

    // <td><button>delete</button></td>
    row.innerHTML = `
    <td>${newContact.id}</td>
    <td>${newContact.name}</td>
    <td>${newContact.phone}</td>
    <td>${newContact.address}</td>
    <td>${newContact.email}</td>
    <td><button>delete</button></td>
  `;
    row.querySelector('button').addEventListener('click', () => {
      row.remove();

      contacts = contacts.filter(c => c !== newContact);

      if (!contacts.length) {
        contactsTable.innerHTML = `<tr>
          <td colspan="6">no contacts loaded</td>
        </tr>`;
      }

    });
  }
};