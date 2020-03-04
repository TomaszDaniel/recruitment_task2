const input = document.querySelector("input")
const main = document.querySelector("main")
const body = document.querySelector("body")
const button = document.querySelector("button")
let counter = 0
let prevSearchValue
let result = []

const show = (myJson) => {

    if (typeof myJson.items === "object") {
        myJson.items.forEach(item => {
            let title = item.volumeInfo.title
            let image
            let description = ""
            if (typeof item.volumeInfo.imageLinks === "object") {
                image = item.volumeInfo.imageLinks.thumbnail
            } else {
                image = "https://www.freeiconspng.com/uploads/no-image-icon-6.png"
            }
            if (typeof item.volumeInfo.description === "string") {
                const text = item.volumeInfo.description.split(" ")
                for (let i = 0; i < 15; i++) {
                    description += `${text[i]} `
                }
                description += "..."
            } else {
                description = `'Wkrótce pojawi się tu opis książki'`;
            }
            const book = {
                title,
                image,
                description
            }
            result.push(book)
        })
        main.textContent = ""
        result.forEach(element => {
            let article = document.createElement('article')
            let heading = document.createElement('h2')
            let img = document.createElement('img')
            let paragraph = document.createElement('p')
            heading.textContent = element.title
            img.src = element.image
            paragraph.textContent = element.description
            article.appendChild(heading)
            article.appendChild(img)
            article.appendChild(paragraph)
            main.appendChild(article)
        })
    }

    if (myJson.error) {
        alert(myJson.error.message)
    }
}
const fetchData = () => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${input.value}&startIndex=${counter}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            show(myJson);
        })
}

const loadBooks = () => {
    if (input.value !== "") {
        if (input.value !== prevSearchValue) {
            prevSearchValue = input.value
            main.textContent = ""
            result.length = 0
            counter = 0;
            fetchData()
        } else {
            fetchData()
        }
    } else {
        result.length = 0
        main.textContent = ""
    }
}

const scrollFunction = () => {
    if (document.body.offsetHeight + 50 === window.innerHeight + window.scrollY) {
        scrollTo(0, document.body.offsetHeight)
        counter += 10
        loadBooks()
    }
}
let timeout = null;

input.addEventListener("keyup", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        loadBooks();
    }, 200);
})

window.addEventListener("scroll", scrollFunction)
window.addEventListener("touchmove", scrollFunction)


