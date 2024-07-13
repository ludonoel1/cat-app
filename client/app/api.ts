import { ICat } from "./page";

export const searchCats = async (searchTerm: string, page: number) => {
  const baseUrl = new URL("http://localhost:8080/api/cats");
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", String(page));
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const addFavouriteCat = async (cat: ICat) => {
  const url = new URL("http://localhost:8080/api/cats");
  const body = {
    ...cat
  };
console.log(body)
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};

export const removeFavouriteCat = async (cat: ICat) => {
  const url = new URL(`http://localhost:8080/api/cats/${cat.id}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}; 

export const extractFavouriteRecipes = async () => {
  const url = new URL("http://localhost:8080/api/favouritecats");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const modifyCatDetails = async (cat: ICat) => {
  const url = new URL(`http://localhost:8080/api/cats/${cat.id}`);
  const body = {
    ...cat
  };
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};
