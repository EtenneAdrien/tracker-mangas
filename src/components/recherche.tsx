import { useState } from 'react'
import { rechercherTitres } from '../lib/jikan'
import type { ResultatJikan } from '../lib/jikan'

export default function Recherche() {
  const [recherche, setRecherche] = useState('')
  const [type, setType] = useState<'anime' | 'manga'>('anime')
  const [resultats, setResultats] = useState<ResultatJikan[]>([])
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [rechercheEffectuee, setRechercheEffectuee] = useState(false)

  async function lancerRecherche() {
    if (recherche.trim() === '') return

    setChargement(true)
    setErreur('')
    setResultats([])

    try {
      const trouves = await rechercherTitres(recherche, type)
      setResultats(trouves)
    } catch (e) {
      setErreur("Le service de recherche est momentanément indisponible. Réessaie dans un instant.")
    }

    setChargement(false)
    setRechercheEffectuee(true)
  }

  return (
    <div>
      <h2>Rechercher un titre</h2>

      <select value={type} onChange={(e) => setType(e.target.value as 'anime' | 'manga')}>
        <option value="anime">Anime</option>
        <option value="manga">Manga</option>
      </select>

      <input
        type="text"
        placeholder="Nom du titre"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      <button onClick={lancerRecherche} disabled={chargement}>
        Rechercher
      </button>

      {chargement && <p>Recherche en cours...</p>}

      {erreur && <p>{erreur}</p>}

      {rechercheEffectuee && !chargement && !erreur && resultats.length === 0 && (
        <p>Aucun résultat pour cette recherche.</p>
      )}

      <ul>
        {resultats.map((r) => (
          <li key={r.mal_id}>
            {r.image_url && <img src={r.image_url} alt={r.titre} width="60" />}
            <span>{r.titre}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}