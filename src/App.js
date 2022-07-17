import React, {useEffect, useState} from 'react';
import './App.css';
function App() {
  const [pokeData, setpokeData] = useState([]);
  const [proximo, setproximo] = useState('');
  const [anterior, setanterior] = useState('');
  const [carregando, setcarregar] = useState(true);
  const UrlInicial = 'http://localhost:8090';
  async function getPokemon(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
          .then(res => res.json())
          .then(data => {
              resolve(data);
          })
  })
}
const Pokemon = async (data) => {
  let _pokemonData = await Promise.all(
    data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon.url);
      return pokemonRecord;
    })
  );

  setpokeData(_pokemonData);
};

async function getAllPokes(url) {
  return new Promise((resolve, reject) => {
      fetch(url)
          .then(res => res.json())
          .then(data => {
              resolve(data);
          })
  })
}

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokes(UrlInicial); 
      setproximo(response.next); 
      setanterior(response.previous); 
      let pokemon = await Pokemon(response.results); 
      setcarregar(false);
    }
    fetchData();
  }, []);
  const next = async () => {
    setcarregar(true);
    let data = await getAllPokes(proximo);
    await Pokemon(data.results);
    setproximo(data.next);
    setanterior(data.previous);
    setcarregar(false);
  }
  
  const prev = async () => {
    if (!anterior) return;
    setcarregar(true);
    let data = await getAllPokes(anterior);
    await Pokemon(data.results);
    setproximo(data.next);
    setanterior(data.previous);
    setcarregar(false);
  }
  
    return (
      <>
      <nav>
        <div class='Author'>
          Jhonatas Santos
        </div>
        <div>
          <a class ='icon'href="https://www.linkedin.com/in/jhonatas-santos-29b24a163/">
            <img src="https://cdn-icons.flaticon.com/png/128/3669/premium/3669739.png?token=exp=1658085787~hmac=ce54ca35640be35af7390907001f9b36" width="50" height="50"/>
          </a>
        </div>
        </nav>
      
        { carregando ? <h1>Estamos carregando...</h1> : (
          <div>
            <div  class="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
              <br />
            </div>
            <div className="grid-container">
              
              {pokeData.map((pokemon, i) => {
                
                return (
                  
                  <div class="container" >
                      <div class="center">
                          <img src={pokemon.sprites.front_default} alt="" />
                      </div>
                      <div >
                          <strong>Nome:</strong>{pokemon.name}
                      </div>
                      <div >
                          <strong>Tipos:</strong>
                          {
                              pokemon.types.map(type => {
                                  return (
                                      <div className="Card__type">
                                          {type.type.name}
                                      </div>
                                  )
                              })
                          }
                      </div>
                      <div>
                          <div>
                              <strong>Largura:</strong>{pokemon.weight}
                          </div>
                          <div>
                            <strong>Altura:</strong>{pokemon.height}
                          </div>
                      </div>
                  </div>
              );
              })}
            </div>
            <div class="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
          </div>
        )}
      </>
    );
  }


export default App
