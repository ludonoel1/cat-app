import React from 'react'
import './card.css'
import { ICat } from '../types';

interface Props {
    cat: ICat
    onOpenModal: (cat: ICat) => void;
    onFavouriteButtonClick: (cat: ICat) => void;
}

function Card(props: Props) {
  return (
    <div data-cy="cat-card" className="card max-w-sm rounded overflow-hidden shadow-lg">
        <span data-cy="card-cat-name" className="font-bold text-xl mb-2">{props.cat.name || 'Unknown'}</span>
        <img src={props.cat.url}/>
        <div className="cat-information">
        <p data-cy="card-cat-description" className="description">{props.cat.description || 'N/A'}</p>
        </div>
        <div className="sub-card">
            <button data-cy="favourite-button" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" 
                onClick={(event) => {
                event.stopPropagation();
                props.onFavouriteButtonClick(props.cat);
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" fill={props.cat.favourite ? 'red' : 'none'} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </button>
            <button data-cy="update-button" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" 
                onClick={(event) => {
                event.stopPropagation();
                props.onOpenModal(props.cat);
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>
        </div>
    </div>
  )
}

export default Card