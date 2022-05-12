const request = require("supertest");
const app = require("./app");
const db = require("./db");
const Book = require("./models/book");

describe("Books Routes Test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM books");
        let book1 = await Book.create({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
    }); 

    // GET /books => {books: [...]}
    test("can get list of books", async function() {
        let res = await request(app).get("/books");

        expect(res.body).toEqual({
            books: [
                {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lane",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
            ]
        });
    });
});

// GET /books/:isbn => {book: {}}
describe("GET /books/:isbn", function() {
    test("can get book by isbn", async function() {
        let res = await request(app).get("/books/0691161518");
    
        expect(res.body).toEqual({
            book: 
                {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lane",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
        });
    });

    test("404 on missing isbn", async function() {
        let res = await request(app).get("/books/0");
        expect(res.statusCode).toEqual(404);
    });
});

// POST /books => {book: {}}
describe("POST /books", function() {
    test("can create a book", async function() {
        let res = await request(app).post("/books").send({
            "isbn": "1534493794",
            "amazon_url": "https://www.amazon.com/She-Gets-Girl-Rachael-Lippincott/dp/1534493794/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1652393397&sr=8-1",
            "author": "Rachael Lippincott and Alyson Derrick",
            "language": "english",
            "pages": 384,
            "publisher": "Simon & Schuster",
            "title": "She Gets the Girl",
            "year": 2022
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            book: {
                "isbn": "1534493794",
                "amazon_url": "https://www.amazon.com/She-Gets-Girl-Rachael-Lippincott/dp/1534493794/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1652393397&sr=8-1",
                "author": "Rachael Lippincott and Alyson Derrick",
                "language": "english",
                "pages": 384,
                "publisher": "Simon & Schuster",
                "title": "She Gets the Girl",
                "year": 2022
            }
        });
    });

    test("Invalid page format", async function() {
        let res = await request(app).post("/books").send({
            "isbn": "1534493794",
            "amazon_url": "https://www.amazon.com/She-Gets-Girl-Rachael-Lippincott/dp/1534493794/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1652393397&sr=8-1",
            "author": "Rachael Lippincott and Alyson Derrick",
            "language": "english",
            "pages": "384",
            "publisher": "Simon & Schuster",
            "title": "She Gets the Girl",
            "year": 2022
        });
        expect(res.statusCode).toEqual(400);
    });
    test("No title provided", async function() {
        let res = await request(app).post("/books").send({
            "isbn": "1534493794",
            "amazon_url": "https://www.amazon.com/She-Gets-Girl-Rachael-Lippincott/dp/1534493794/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1652393397&sr=8-1",
            "author": "Rachael Lippincott and Alyson Derrick",
            "language": "english",
            "pages": 384,
            "publisher": "Simon & Schuster",
            "year": 2022
        });
        expect(res.statusCode).toEqual(400);
    });
    test("Invalid year", async function() {
        let res = await request(app).post("/books").send({
            "isbn": "1534493794",
            "amazon_url": "https://www.amazon.com/She-Gets-Girl-Rachael-Lippincott/dp/1534493794/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1652393397&sr=8-1",
            "author": "Rachael Lippincott and Alyson Derrick",
            "language": "english",
            "pages": 384,
            "publisher": "Simon & Schuster",
            "title": "She Gets the Girl",
            "year": 2050
        });
        expect(res.statusCode).toEqual(400);      
    });
});

// PUT /books => {book: {}}
describe("PUT /books/:isbn", function() {
    test("can update a book", async function() {
        let res = await request(app).put("/books/0691161518").send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 265,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
        expect(res.body).toEqual({
            book: {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 265,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        });
    });
    test("Invalid page format", async function() {
        let res = await request(app).put("/books/0691161518").send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": "265",
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
        expect(res.statusCode).toEqual(400);
    });
    test("No title provided", async function() {
        let res = await request(app).put("/books/0691161518").send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 265,
            "publisher": "Princeton University Press",
            "year": 2017
        });
        expect(res.statusCode).toEqual(400);
    });
    test("Invalid year", async function() {
        let res = await request(app).put("/books/0691161518").send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 265,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2050
        });
        expect(res.statusCode).toEqual(400);      
    });
    test("404 on missing isbn", async function() {
        let res = await request(app).put("/books/0").send({
            "isbn": "0",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 265,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });        
        expect(res.statusCode).toEqual(404);
    });
});



// DELETE /books/:isbn => { message: "Book deleted" }
describe("DELETE books/:isbn", function() {
    test("can delete a book by isbn", async function() {
        let res = await request(app).delete("/books/0691161518");
    
        expect(res.body).toEqual({
             message: "Book deleted" 
        });
    });

    test("404 on missing isbn", async function() {
        let res = await request(app).delete("/books/0");
        expect(res.statusCode).toEqual(404);
    });
});


afterAll(async function() {
    await db.end();
})