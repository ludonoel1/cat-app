"use client";
import React, {FormEvent, useEffect, useRef, useState } from 'react'
import Card from './components/Card';
import Header from './components/Header';
import './page.css'
import CatModal from './components/CardModal';
import * as api from "./api";

export interface ICat {
id: string,
url: string,
width: number,
height: number,
breeds: any,
favourite: any,
name: string,
description: string
}

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
      console.log(cat)
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
    console.log(updatedCat)
    await api.modifyCatDetails(updatedCat)
    if(updatedCat.favourite){
      const index = favouriteCats.findIndex(_cat => updatedCat.id === _cat.id)
      favouriteCats[index] = updatedCat;
      setFavouriteCats(favouriteCats);
    }
    // api delete cat
    const index = cats.findIndex(_cat => updatedCat.id === _cat.id)
    cats[index] = updatedCat;
    setCats(cats)
    // mettre a jour favoriteCats
    //mettre à jour setCats(cats)
}
  const deleteCat = (cat) => {
    console.log(cat)
    if(cat.favourite){
      const updatedCats = favouriteCats.filter(
        (favCat) => favCat.id !== cat.id
      );
      setFavouriteCats(updatedCats);
    }
    // api delete cat
    const updatedCats = cats.filter(
      (_cat) => _cat.id !== cat.id
    );
    setCats(updatedCats);
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
      console.log(pageNumber)
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
        <h1
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Cat Search
        </h1>
        <h1
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
            <button type="submit">
              Submit
            </button>
          </form>
          <div className="recipe-grid">
            <div className="main-content">
              {cats.map((cat, index) => {
                return (<Card cat={cat}
                  onClick={() => setSelectedCat(cat)}
                  onFavouriteButtonClick= { cat.favourite ? removeFavouriteCat : addFavouriteCat}
                  onDelete = { deleteCat}
                />)
              })}
            </div>
          </div>
          {isLastPage ? <></> : <button className="view-more-button" onClick={handleviewMoreCat}>View more</button>}
        </>
      )}
      {selectedTab === "favourites" && (
        <div className="recipe-grid">
          <div className="main-content">
          {favouriteCats.map((cat) => (
            <Card
              cat={cat}
              //onClick={() => setSelectedCat(cat)}
              onFavouriteButtonClick= { removeFavouriteCat}
              onDelete = { deleteCat}
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

/* 

      {selectedTab === "favourites" && (
        <div className="cat-grid">
          {favouriteCats.map((cat) => (
            <Card
              cat={cat}
              onClick={() => setSelectedCat(cat)}
              onFavouriteButtonClick={removeFavouriteCat}
              isFavourite={true}
            />
          ))}
        </div>
      )}

      {selectedCat ? (
        <Card
          catId={selectedCat.id.toString()}
          onClose={() => setSelectedCat(undefined)}
        />
      ) : null}*/ 