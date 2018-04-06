'use strict';

const STORE = {
  displayChecked: true,
  data: [{
      name: "apples",
      checked: false,
      editable: false
    },
    {
      name: "oranges",
      checked: false,
      editable: false
    },
    {
      name: "milk",
      checked: true,
      editable: false
    },
    {
      name: "bread",
      checked: false,
      editable: false
    }
  ]
};


function generateItemElement(item, itemIndex) {
  let itemText;`<span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>`;
  if (item.editable) {
    itemText = `<form id="js-edit-name-form"><input type="text" name="new-name" class="shopping-item" value="${item.name}" /></form>`;
  } else {
    itemText = `<span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>`;
  }
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
    ${itemText}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
          <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList, searchTerm) {
  console.log("Generating shopping list element");
  let items = shoppingList
                .filter(item => !item.checked || STORE.displayChecked)
                .map((item, index) => generateItemElement(item, index));
  items = typeof searchTerm === 'string' ? items.filter(item => item.name === searchTerm.toLowerCase()) : items;
  return items.join("");
}


function renderShoppingList(searchTerm) {
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.data, searchTerm);
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.data.push({
    name: itemName,
    checked: false
  });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log(`Toggling checked property for ${STORE.data[itemIndex].name}`);
  STORE.data[itemIndex].checked = !STORE.data[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteItemFromStore(itemIndex) {
  console.log(`Removing ${STORE.data[itemIndex].name} from shopping list`);
  delete STORE.data[itemIndex];
}

function handleDeleteItemClicked() {
  $(".js-shopping-list").on("click", ".js-item-delete", function (event) {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItemFromStore(itemIndex);
    renderShoppingList();
  });
}

function toggleItemEditableInStore(itemIndex) {
  console.log(`Toggling editable property for ${STORE.data[itemIndex].name}`);
  STORE.data[itemIndex].editable = !STORE.data[itemIndex].editable;
}

function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', function(event) {
    console.log('`handleEditItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleItemEditableInStore(itemIndex);
    renderShoppingList();
  });
}

function renameItemInStore(itemIndex, newItemName) {
  console.log(`Renaming ${STORE.data[itemIndex].name} to ${newItemName}`);
  STORE.data[itemIndex].name = newItemName;
}

function handleNewNameSubmit() {
  $('.js-shopping-list').on('submit', '#js-edit-name-form', function(event) {
    event.preventDefault();
    console.log('`handleNewNameSubmit` ran');
    const newName = $(this['new-name']).val();
    const itemIndex = getItemIndexFromElement(this);
    renameItemInStore(itemIndex, newName);
    toggleItemEditableInStore(itemIndex);
    renderShoppingList();
  });
}

function toggleDisplayChecked() {
  console.log(`Toggling STORE.displayChecked to ${!STORE.displayChecked}`);
  STORE.displayChecked = !STORE.displayChecked;
}

function handleToggleChecked() {
  $('.js-toggle-list-checked').on('click', function(event) {
    console.log('`handleToggleChecked` ran');
    this.value = this.value === 'Unlist Checked' ? 'List Checked' : 'Unlist Checked';
    toggleDisplayChecked();
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleEditItemClicked();
  handleNewNameSubmit();
  handleToggleChecked();
}

$(handleShoppingList);