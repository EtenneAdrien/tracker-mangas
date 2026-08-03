import { useState } from 'react'
import { rechercherTitres } from '../lib/jikan'
import type { ResultatJikan } from '../lib/jikan'
import { supabase } from '../lib/supabase'

export default function Recherche({ onAjout }: { onAjout: () => void }) {
  const [recherche, setRecherche] = useState('')
  const [type, setType] = useState<'anime' | 'manga'>('anime')
  const [resultats, setResultats] = useState<ResultatJikan[]>([])
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [rechercheEffectuee, setRechercheEffectuee] = useState(false)
  const [ajoutes, setAjoutes] = useState<number[]>([])

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

  async function ajouterTitre(resultat: ResultatJikan) {
    const { data: utilisateur } = await supabase.auth.getUser()

    if (!utilisateur.user) {
      setErreur("Tu dois être connecté pour ajouter un titre.")
      return
    }

    const { error } = await supabase.from('titres').insert({
      user_id: utilisateur.user.id,
      mal_id: resultat.mal_id,
      titre: resultat.titre,
      image_url: resultat.image_url,
      type: resultat.type,
    })

    if (error) {
      setErreur("Impossible d'ajouter ce titre : " + error.message)
      return
    }

    setAjoutes([...ajoutes, resultat.mal_id])
    onAjout()
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
            {ajoutes.includes(r.mal_id) ? (
              <span>Ajouté</span>
            ) : (
              <button onClick={() => ajouterTitre(r)}>Ajouter à ma liste</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}