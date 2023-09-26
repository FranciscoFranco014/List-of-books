'use client'

import { useEffect, useMemo, useState } from 'react';
import data from '../books.json'
import type { Book } from '@/types';

// command palette --> pasteJson as type, y nos crea el interface
// Book con la data necesaria del json.



export default function IndexClientPage({books, genres}: {books: Book[], genres: Book["genre"][]}) {
  const [genre, setGenre] = useState<Book["genre"]>("")
  const [readList, setReadList] = useState<Book["ISBN"][]>([])
  const matches = useMemo(() => {
     if (!genre) return books

     return books.filter((book) => {
      if ( book.genre != genre) return false
      return true
  }) 
  }, [books, genre]) 

  function handleAddFav(book: Book["ISBN"]){
    const draft = readList.includes(book)
      ? readList.filter((readBook) => readBook != book)
      : [...readList, book]
    
    setReadList(draft)
    localStorage.setItem("readList", JSON.stringify(draft))
  }

  // funcion que recibe un callback, una funcion como parametro, q va a ser llamada 
  // cada vez que haya un cambio en localStorage, y va a recibir como parametro
  // una readList con el listado de books que tenemos

  // dentro, vamos a tener una funcion que obtiene los elementos del localStorage,
  // y los parsea a stringify para poder trabajar  con ellos
  // cuando nos suscribamos o llamemos esta funcion, ejecutamos el metodo getReadList()
  // posterior a eso debemos llamar al callback.
  function onReadListChange(callback: (readList: Book["ISBN"][]) => void){
    function getReadList() {
      const readList = JSON.stringify(localStorage.getItem("readList") ?? "[]")
      callback(readList);
    }
    // nos suscribimos al ev storage y cada vez que hay un cambio en el storage
    // llama a "getReadList" y le pasa los datos
    window.addEventListener("storage", getReadList)
    // lo llamamos aca para que cuando cambien los datos se los pase al callback
    getReadList()
    // function que usamos para desuscribirnos del ev
    return () => window.removeEventListener("storage", getReadList)
  }
  //vamos a guardar los valores en el localStorage
  useEffect(() => {
    //setReadList(JSON.parse(localStorage.getItem("readList") ?? "[]") as Book["ISBN"][])
    const unsuscribe = onReadListChange(setReadList)
    return () => unsuscribe()
  }, [])
  return (
    <article className='grid gap-4 '>
      <nav >
        <select value={genre}  onChange={(event) => setGenre(event.target.value)} className='rounded-md'>
          <option value="">Todos</option>
          {genres.map(genre=>(
          <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </nav>
      <ul className='grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4'>
        {matches.map(book => (
          <li key={book.ISBN} className='grid gap-2' onClick={() => handleAddFav(book.ISBN)}>
            <img className='aspect-[9/14] object-cover transition-all hover:scale-90 duration-300' src={book.cover} alt={book.title} />
            <p className='font-semibold'>{readList.includes(book.ISBN) && <span>❤️ </span>}{book.title}</p>
          </li>
        ))}
      </ul>
    </article>
  )
}
