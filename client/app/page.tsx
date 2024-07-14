"use client";
import React, {FormEvent, useEffect, useRef, useState } from 'react'
import Card from './components/Card';
import Header from './components/Header';
import './page.css'
import CatModal from './components/CardModal';
import * as api from "./api";
import { ICat } from './types';

type Tabs = "search" | "favourites";

function Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cats, setCats] = React.useState<ICat[]>([])
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteCats, setFavouriteCats] = React.useState<ICat[]>([])
  const [selectedCat, setSelectedCat] = useState<ICat | undefined>(undefined);
  const pageNumber = useRef(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const addFavouriteCat = async (cat: ICat) => {
    try {
      await api.addFavouriteCat(cat);
      const index = cats.findIndex(_cat => cat.id === _cat.id)
      cats[index].favourite = true;
      setCats(cats)
      setFavouriteCats([...favouriteCats, cat]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavouriteCat = async (cat: ICat) => {
    try {
      await api.removeFavouriteCat(cat);
      const updatedCats = favouriteCats.filter(
        (favCat) => favCat.id !== cat.id
      );
      const index = cats.findIndex(_cat => cat.id === _cat.id)
      cats[index].favourite = false;
      setCats(cats)
      setFavouriteCats(updatedCats);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCatData = async (updatedCat: ICat) => {
    await api.modifyCatDetails(updatedCat)
    const updatedCats = cats.slice()
    const index = updatedCats.findIndex(_cat => updatedCat.id === _cat.id)
    updatedCats[index] = updatedCat;
    setCats(updatedCats)
    if(updatedCat.favourite){
      const index = favouriteCats.findIndex(_cat => updatedCat.id === _cat.id)
      favouriteCats[index] = updatedCat;
      setFavouriteCats(favouriteCats);
    }
    
}

  useEffect(() => {
    const fetchPaginatedCats = async () => {
      try {
        const cats = await api.searchCats(searchTerm, 1);
        setCats(cats);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPaginatedCats();
  }, []);

  useEffect(() => {
    const fetchFavouriteCats = async () => {
      try {
        const cats = await api.extractFavouriteRecipes();
        setFavouriteCats(cats);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavouriteCats();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const cats = await api.searchCats(searchTerm, 1);
      setCats(cats);
      pageNumber.current = 1;
      setIsLastPage(false)
    } catch (e) {
      console.log(e);
    }
  };

  const handleviewMoreCat = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextCats = await api.searchCats(searchTerm, nextPage);
      setCats([...cats, ...nextCats]);
      pageNumber.current = nextPage;
      setIsLastPage(nextCats.length === 0)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <Header/>
      <div className="tabs">
        <h1 data-cy='home-tab'
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Cat Search
        </h1>
        <h1 data-cy='favourite-tab'
          className={selectedTab === "favourites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favourites")}
        >
          My Favourites ({favouriteCats.length})
        </h1>
      </div>
      {selectedTab === "search" && (
        <>
        <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              placeholder="Enter a cat name ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            ></input>
            <button data-cy="submit-search-button" type="submit">
              Submit
            </button>
          </form>
          <div className="recipe-grid">
            <div className="main-content">
              {cats.map((cat, index) => {
                return (<Card key={index} cat={cat}
                  onOpenModal={(cat:ICat) => setSelectedCat(cat)}
                  onFavouriteButtonClick= { cat.favourite ? removeFavouriteCat : addFavouriteCat}
                />)
              })}
            </div>
          </div>
          {isLastPage ? <></> : <button data-cy="view-more-button" className="view-more-button" onClick={handleviewMoreCat}>View more</button>}
        </>
      )}
      {selectedTab === "favourites" && (
        <div className="recipe-grid">
          <div className="main-content">
          {favouriteCats.map((cat,index) => (
            <Card key={index}
              cat={cat}
              onOpenModal={(cat) => setSelectedCat(cat)}
              onFavouriteButtonClick= { removeFavouriteCat}
            />
          ))}
          </div>
        </div>
      )}

{selectedCat ? (
        <CatModal
          cat={selectedCat}
          onClose={() => setSelectedCat(undefined)}
          handleUpdateCat = {updateCatData}
        />
      ) : null}
    </div>
  )
}

export default Page