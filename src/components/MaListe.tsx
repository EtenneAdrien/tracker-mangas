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

export default function MaListe() {
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
  }, [])

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
      <ul>
        {titres.map((t) => (
          <li key={t.id}>
            {t.image_url && <img src={t.image_url} alt={t.titre} width="60" />}
            <span>{t.titre}</span>
            <span> — {t.type}</span>
            <span> — {t.statut}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 