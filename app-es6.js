class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class Store{

    static getBookFromLS(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBookToLS(book){
        const books = Store.getBookFromLS();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }

   
    static displayBooksFromLS(){
        const books = Store.getBookFromLS();
        books.forEach(function(value,index){
           const ui = new UI(value.title, value.author,value.isbn);
           ui.addBooks();
        });
    }

    static removeBooksFromLS(e){
        const books = Store.getBookFromLS();
        const isbn = parseInt(e.target.parentElement.previousElementSibling.textContent);
        books.forEach(function(value, index){
            if(parseInt(value.isbn) === isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem("books",JSON.stringify(books));
    }
}

class UI extends Book{
    constructor(title,author,isbn){
        super(title,author,isbn);
    }

    addBooks(){
        const tbody = document.querySelector('#tbody');
        //Creating a row
        const row = document.createElement('tr');
        row.innerHTML=`<td> ${this.title} </td>
                       <td> ${this.author} </td>
                       <td> ${this.isbn} </td>
                       <td><a href="#" class="delete">X</a></td>
        `;
        //Appending the row 
        tbody.appendChild(row);
    }

    removeBooks(e){
       if(e.target.classList.contains('delete')){
          e.target.parentElement.parentElement.remove();
          //Remove from LS
          Store.removeBooksFromLS(e);
       }
    }


    //Clear fields after adding books
    clearFields(title,author,isbn){
        title.value= author.value = isbn.value = '';
    }

}

//Event listener to display books from LS on page load
document.addEventListener("DOMContentLoaded", function(){
    Store.displayBooksFromLS();
});

//Event Listener to Add Books
document.querySelector('#add-book').addEventListener('submit', function(e){
    const title = document.querySelector("#book-title");
    const author = document.querySelector("#author");
    const isbn = document.querySelector("#isbn");

    const ui = new UI(title.value, author.value, isbn.value);
    //Adding books to the DOM
    ui.addBooks();
    //adding book to LS
    Store.addBookToLS(ui);
    //Clearing text fields
    ui.clearFields(title,author,isbn);
    e.preventDefault();
});

//Event Listener to remove a book
document.querySelector("#tbody").addEventListener("click", function(e){
    const ui = new UI();
    ui.removeBooks(e);
    // Removing books from the LS
   
    e.preventDefault();
});