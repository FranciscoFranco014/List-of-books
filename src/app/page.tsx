import type { Book } from "@/types"

import data from "../books.json"
import IndexClientPage from "./client"


//me traigo los libros del json a traves del interface Book//

const books: Book[] = data.library.map((data) => data.book)
// necesitamos evaluar los generos para no hardcodearlos
const genres: Book["genre"][] = Array.from(new Set(books.map(book => book.genre)))
export default function IndexPage(props: {}){
    return (
        <div>
            <IndexClientPage books={books} genres={genres} />
        </div>
    )
}