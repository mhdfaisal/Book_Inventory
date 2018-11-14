//Book constructor
function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

//Local Storage Constructor
function LocalStorage(){}

//Static method to get books from the local storage
LocalStorage.getBooks = function(){
    let books;
    if(localStorage.getItem("books")===null){
        books = [];
    }
    else{
        books = JSON.parse(localStorage.getItem("books"));
    }
   return books;  
}

//Static method to add books to the local storage
LocalStorage.addBook = function(book){
   const books =  LocalStorage.getBooks();
    books.push(book);
    localStorage.setItem("books",JSON.stringify(books));
}

//Static method to display books from the localStorage
LocalStorage.displayBooks = function(){
    const books  = LocalStorage.getBooks();
    books.forEach((val, index)=>{
        let ui = new UI();
        ui.addBooks(val);
    });
}

//Static method to remove books from the localStorage
LocalStorage.removeBook = function(e){
    const books = LocalStorage.getBooks();
    const isbn = e.target.parentElement.parentElement.previousElementSibling.textContent;
    books.forEach(function(value,index){
        if(value.isbn === isbn){
           books.splice(index,1);
        }
    });
    
    localStorage.setItem("books", JSON.stringify(books));
   
}


//UI constructor
function UI(){}

UI.prototype.addBooks= function(bookDets){
    const tbody = document.querySelector("#tbody");
    //create tr 
    const row = document.createElement('tr');
    for(x in bookDets){
         const td = document.createElement('td');
         td.textContent = bookDets[x];
         row.appendChild(td);
    }
    //close button
    const td = document.createElement('td');
    const a = document.createElement('a');
    a.setAttribute("href","#");
    a.className= "delete";
    a.innerHTML = "<i class='fa fa-close'></i>";
    td.appendChild(a);
    row.appendChild(td);
    tbody.appendChild(row);

    //Alternative & best way
    // row.innerHTML = `<td>${bookDets.title}</td>
    //                 <td>${bookDets.author}</td>
    //                 <td>${bookDets.isbn}</td>
    //                 <a href="#" class="delete"><i class="fa fa-close"></i></a>`;
    // tbody.appendChild(row);
}

//Clear fields function
UI.prototype.clearFields = function(title,author,isbn){
    title.value="";
    author.value="";
    isbn.value="";
}

//Show alert function

UI.prototype.showAlert = function(message,className){
    //Get the parent container
    const container = document.querySelector(".container");
    //Get the reference child
    const form = document.querySelector("#add-book");
    //Creating the alert
    const alertParent = document.createElement('div');
    alertParent.className = className;
    const alertChild = document.createElement('div');
    alertChild.textContent = message;
    alertChild.className = "alert-text";
    alertParent.appendChild(alertChild);
    // Inserting the alert message before reference child
    container.insertBefore(alertParent,form);

    //Time out alert message after 3 seconds
    setTimeout(function(){
        document.querySelector(".alert").remove();
    }, 3000);

};

//Remove books function
UI.prototype.removeBooks = function(e){
   if(e.target.parentElement.classList.contains("delete"))
   {
       e.target.parentElement.parentElement.parentElement.remove();
       //Remove from local storage also
       LocalStorage.removeBook(e);
   }
    e.preventDefault();
};

const form = document.querySelector("#add-book");
const tbody = document.querySelector("#tbody");

//Document Load Event Listener
document.addEventListener('DOMContentLoaded', function(){
   LocalStorage.displayBooks();
});


//Form submit event listener
form.addEventListener('submit', function(e){
    //Get form values
   const title = document.querySelector("#book-title");
   const author = document.querySelector("#author");
   const isbn = document.querySelector("#isbn");
   //Instantiate Book
   const book = new Book(title.value, author.value, isbn.value);
   //Instantiate UI
   const ui = new UI();
   //console.log(ui);
   if(title.value==="" || author.value==="" || isbn===""){
       ui.showAlert("All fields are required","alert alert-danger");
   }
   else{
     // Add book details
        ui.addBooks(book);
        //Add to book to the localStorage
        LocalStorage.addBook(book);
        //Clear fields after adding books
        ui.clearFields(title,author,isbn);
        // Show Success alert
        ui.showAlert("Book added successfully", "alert alert-success");
   }

    e.preventDefault();
});

//Delete event delegation
tbody.addEventListener('click',function(e){
    let ui = new UI();
    ui.removeBooks(e);
});