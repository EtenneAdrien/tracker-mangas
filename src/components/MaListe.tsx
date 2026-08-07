import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Titre = {
  id: string
  mal_id: number
  titre: string
  image_url: string | null
  type: string
  statut: string
  avancement: number
  note: number | null
}

function libelleStatut(statut: string) {
  if (statut === 'a_voir') return 'À voir'
  if (statut === 'en_cours') return 'En cours'
  if (statut === 'termine') return 'Terminé'
  return statut
}

export default function MaListe({ rafraichir }: { rafraichir: number }) {
  const [titres, setTitres] = useState<Titre[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  async function chargerTitres() {
    setChargement(true)

    const { data, error } = await supabase
      .from('titres')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErreur("Impossible de charger ta liste : " + error.message)
    } else {
      setTitres(data)
    }

    setChargement(false)
  }

  useEffect(() => {
    chargerTitres()
  }, [rafraichir])

  if (chargement) {
    return <p>Chargement de ta liste...</p>
  }

  if (erreur) {
    return <p>{erreur}</p>
  }

  if (titres.length === 0) {
    return <p>Ta liste est vide. Cherche un titre pour commencer.</p>
  }

  return (
    <div>
      <h2>Ma liste ({titres.length})</h2>
      <ul className="grille">
        {titres.map((t) => (
          <li key={t.id} className="carte">
            {t.image_url && <img src={t.image_url} alt={t.titre} />}
            <span className="carte-titre">{t.titre}</span>
            <span className="carte-infos">
              <span className="etiquette">{t.type}</span>{' '}
              <span className="etiquette">{libelleStatut(t.statut)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}