"use client";
import React, {useEffect, useState } from 'react'
import Card from './components/Card';
import Header from './components/Header';
import './page.css'
import CatModal from './components/CardModal';

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

export interface ICatData {
  id: string,
  name: string,
  description: string
}

type Tabs = "search" | "favourites";

function Page() {
  const [cats, setCats] = React.useState<ICat[]>([])
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteCats, setFavouriteCats] = React.useState<ICat[]>([])
  const [selectedCat, setSelectedCat] = useState<ICat | undefined>(undefined);

  const addFavouriteCat = async (cat: ICat) => {
    try {
      //await api.addFavouriteRecipe(cat);
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
      //await api.removeFavouriteRecipe(recipe);
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

  const updateCatData = async (plop: ICatData) => {
    console.log(plop)
    const cats = await api.updateCatData(plop)  
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
    fetch("http://localhost:8080/api/cats").then(
      response => response.json()
    ).then(data => setCats(data))
  }, [])
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
        </>
      )}
      {selectedTab === "favourites" && (
        <div className="cat-grid">
          {favouriteCats.map((cat) => (
            <Card
              cat={cat}
              //onClick={() => setSelectedCat(cat)}
              onFavouriteButtonClick= { removeFavouriteCat}
              onDelete = { deleteCat}
            />
          ))}
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
<form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              required
              placeholder="Enter a search term ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            ></input>
            <button type="submit">
              <AiOutlineSearch size={40} />
            </button>
          </form>


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