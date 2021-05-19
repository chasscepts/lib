(function iife() {
  const booksKey = 'BOOKS-KEY';
  let books = [];

  let info = { message: null, error: null };

  const saveBooks = () => localStorage.setItem(booksKey, JSON.stringify(books));

  const addToDom = (book) => {
    const wrap = document.createElement('div');
    wrap.classList.add('book');
    const div = document.createElement('div');
    wrap.append(div);
    ['Title', 'Author', 'Pages'].forEach((item) => {
      const row = document.createElement('div');
      row.classList.add('attribute-row');
      div.append(row);

      const label = document.createElement('span');
      label.classList.add('label');
      label.textContent = item;
      row.append(label);

      const value = document.createElement('span');
      value.classList.add('value');
      value.textContent = book[item.toLowerCase()];
      row.append(value);
    });

    const controls = document.createElement('div');
    controls.classList.add('controls');
    wrap.append(controls);

    const markBtn = document.createElement('button');
    markBtn.textContent = book.read ? 'Mark as unread' : 'Mark as read';
    controls.append(markBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remove Book';
    controls.append(deleteBtn);

    markBtn.addEventListener('click', () => {
      book.read = !book.read;
      saveBooks();
      markBtn.textContent = book.read ? 'Mark as unread' : 'Mark as read';
    });

    deleteBtn.addEventListener('click', () => {
      for (let i = 0; i < books.length; i += 1) {
        if (books[i].id === book.id) {
          books.splice(i, 1);
          break;
        }
      }
      saveBooks();
      document.querySelector('main').removeChild(wrap);
    });

    document.querySelector('main').append(wrap);
  };

  const loadBooks = () => {
    const raw = localStorage.getItem(booksKey);
    if (raw) {
      books = JSON.parse(raw);
      books.forEach((book) => addToDom(book));
    }
  };

  const setupAddNewBook = () => {
    const root = document.querySelector('#add-book-form-root');
    const titleInput = document.querySelector('#book-form-title');
    const authorInput = document.querySelector('#book-form-author');
    const pagesInput = document.querySelector('#book-form-pages');
    const addBtn = document.querySelector('#book-form-add-btn');
    const cancelBtn = document.querySelector('#book-form-cancel-btn');
    const showFormMenuItem = document.querySelector('#add-book-menu-item');

    showFormMenuItem.addEventListener('click', () => root.classList.add('open'));
    cancelBtn.addEventListener('click', () => root.classList.remove('open'));

    let id = 1;
    if (books.length > 0) {
      id = books[books.length - 1].id + 1;
    }

    function Book(title, author, pages, id) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.id = id;
      this.read = false;
    }

    Book.prototype.toggleReadStatus = () => {
      this.read = !this.read;
    };

    const addBookToLibrary = (title, author, pages) => {
      const book = new Book(title, author, pages, id);
      id += 1;
      books.push(book);
      saveBooks();
      addToDom(book);
    };

    addBtn.addEventListener('click', () => {
      const title = titleInput.value;
      if (!title) {
        info.error('Please enter book title!');
        return;
      }
      const author = authorInput.value;
      if (!author) {
        info.error("Please enter the author's name");
        return;
      }
      const pages = parseInt(pagesInput.value, 10);
      if (!pages) {
        info.error('Please enter the number of pages');
        return;
      }

      addBookToLibrary(title, author, pages);

      root.classList.remove('open');
    });
  };

  const setupInfo = () => {
    const root = document.querySelector('#info-cover');
    const title = document.querySelector('#info-title');
    const body = document.querySelector('#info-text');
    const closeBtn = document.querySelector('#info-close-btn');

    const open = () => root.classList.add('open');

    const message = (msg) => {
      title.classList.remove('alert');
      title.textContent = 'Info';
      body.textContent = msg;
      open();
    };

    const error = (err) => {
      title.classList.add('alert');
      title.textContent = 'Alert';
      body.textContent = err;
      open();
    };

    closeBtn.addEventListener('click', () => root.classList.remove('open'));

    info = { message, error };
  };

  const main = () => {
    loadBooks();
    setupInfo();
    setupAddNewBook();
  };

  window.addEventListener('load', main);
}());
